from .models import *
from django.contrib.auth.models import Group
from django.db import IntegrityError
from django.db.models import Q
from ninja import Schema, ModelSchema, Query
from ninja.pagination import paginate, PageNumberPagination
from typing import List, Optional, ForwardRef
from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_jwt.authentication import JWTAuth
from ninja_extra import NinjaExtraAPI
from pydantic import BaseModel


from django.shortcuts import get_object_or_404

api = NinjaExtraAPI()
api.register_controllers(NinjaJWTDefaultController)

class GroupSchema(ModelSchema):
    class Config:
        model = Group
        model_fields = ['name']

class ConnectedUserSchema(ModelSchema):
    groups: list[GroupSchema]

    class Config:
        model = User
        model_fields = ['id', 'username', 'email', 'first_name', 'last_name', 'groups']

class JobSchema(ModelSchema):
    class Config:
        model = Job
        model_fields = '__all__'

class SimpleUserSchema(ModelSchema):
    class Config:
        model = User
        model_fields = ['username']
    

class UserSchema(ModelSchema): 
    connections: list[ConnectedUserSchema]
    groups: list[GroupSchema]
    interests: list[JobSchema]

    class Config:
        model = User
        model_fields = ['id', 'username', 'email', 'first_name', 'last_name', 'connections', 'groups', 'about_me', 'interests', 'bookmarks']

class JobPostingSchema(ModelSchema):
    creator: UserSchema
    type_of_job: list[JobSchema]
    applicants: list[SimpleUserSchema]

    class Config:
        model = JobPosting
        model_fields = '__all__'

class ApplicationSchema(ModelSchema):
    job_posting: JobPostingSchema = None
    applicant: UserSchema = None

    class Config:
        model = Application
        model_fields = '__all__'

class RegisterForm(Schema):
    username: str
    email: str
    password: str
    confirm: str
    first_name: str
    last_name: str
    group: str

class EditProfileForm(Schema):
    about_me: str 
    interest: Optional[int]

class ConnectSchema(Schema):
    target_username: str
    connect: bool

class ConnectResponse(Schema):
    user: UserSchema
    target: UserSchema

class JobPostingForm(Schema):
    title: str
    description: str
    type_of_job: list[str]


@api.get('index', response=List[JobSchema], tags=['index'])
def index(request):
    queryset = Job.objects.all().order_by('title')
    return queryset

@api.post('register', tags=['register'])
def register(request, form: RegisterForm):
    if form.password != form.confirm:
        return {'message': 'Passwords do not match.', 'cause': 'password', 'success': False}
    
    try:
        user = User.objects.create(
            username=form.username,
            email=form.email,
            first_name=form.first_name.title(),
            last_name=form.last_name.title()
        )
        user.set_password(form.password)
        user.save()

        group = Group.objects.get(name=form.group)
        user.groups.add(group)
        return {'message': 'Successfully registered an account!', 'cause': None, 'success': True}
    except IntegrityError as e:
        if 'UNIQUE constraint failed' in str(e) and 'username' in str(e):
            return {'message': 'Username already exists.', 
                    'cause': 'username', 
                    'success': False }
        elif 'UNIQUE constraint failed' in str(e) and 'email' in str(e):
            return {'message': 'Email already exists.', 
                    'cause': 'email', 
                    'success': False }

@api.get('user/all', response=List[UserSchema], tags=['users'])
def all_users(request):
    users = User.objects.all()
    return users

@api.get('user/{username}', response=UserSchema, tags=['users'])
def get_user(request, username: str):
    user = get_object_or_404(User, username=username)
    return user

@api.get('user/{username}/connections', response=List[UserSchema])
def get_user_connections(request, username: str):
    user = User.objects.get(username=username)
    return user.connections.all()

@api.get('auth/user', response=UserSchema, auth=JWTAuth(), tags=['users'] )
def auth_user(request):
    return request.user
    
@api.put('auth/user', auth=JWTAuth(), response=ConnectResponse, tags=['connect'])
def connect_user(request, connection: ConnectSchema):
    target = User.objects.get(username=connection.target_username)
    if connection.connect:
        request.user.connections.add(target)
    else:
        request.user.connections.remove(target)
    return {'user': request.user, 'target': target}

@api.get('connect/users', response=List[UserSchema], tags=['connect'])
@paginate(PageNumberPagination, page_size=5)
def connect_page(request, username: str = None):
    queryset = User.objects.all().order_by('-date_joined').exclude(username=username)
    return queryset 

@api.get('/interests/all', response=List[JobSchema], tags=['interests'])
def get_interests(request):
    return Job.objects.all()

@api.get('user/filter-interests/', response=List[JobSchema], tags=['users', 'interests'])
def filter_user_interests(request, username: str):
    user = User.objects.get(username=username)
    current_interests = user.interests.all()
    jobs = Job.objects.all().exclude(id__in=current_interests.values_list('id', flat=True))
    return jobs

@api.put('auth/profile/edit', auth=JWTAuth(), response=UserSchema, tags=['users', 'profile'])
def edit_profile(request, edit_profile_form: EditProfileForm):
    if edit_profile_form.interest:
        interest = Job.objects.get(id=edit_profile_form.interest)
        request.user.interests.add(interest)

    request.user.about_me = edit_profile_form.about_me
    request.user.save()
    return request.user

@api.get('all-jobs', response=List[JobPostingSchema], tags=['jobs'])
def get_all_job_postings(request):
    return JobPosting.objects.all() 

@api.get('get-job', response=JobPostingSchema, tags=['jobs'])
def get_job(request, id: int):
    return JobPosting.objects.get(id=id)

@api.get('jobs', response=List[JobPostingSchema], tags=['jobs'])
def search_filter_job_postings(request, search: Optional[str] = None, filter: List[str] = Query([])):
    search_conditions = Q()

    if search:
        search_conditions = Q(title__contains=search)

    filter_conditions = Q()
    for item in filter:
        job = Job.objects.get(title=item)
        filter_conditions = Q(type_of_job=job.id)
    
    jobs = JobPosting.objects.filter(search_conditions & filter_conditions)

    return jobs

@api.put('jobs', auth=JWTAuth(), response=UserSchema, tags=['users', 'jobs'])
def bookmark_job_posting(request, bookmark_id: int):
    job_posting = JobPosting.objects.get(id=bookmark_id)
    if request.user.bookmarks.filter(id=bookmark_id).exists():
        request.user.bookmarks.remove(job_posting)
    else:
        request.user.bookmarks.add(job_posting)
    return request.user

@api.post('jobs/apply', auth=JWTAuth(), response=JobPostingSchema, tags=['users', 'jobs'])
def apply_to_job(request, job_posting_id: int):
    job_posting = JobPosting.objects.get(id=job_posting_id)
    job_posting.applicants.add(request.user)

    request.user.bookmarks.add(job_posting)
    request.user.save()
    
    application = Application.objects.create(
        job_posting=job_posting,
        applicant=request.user
    )
    application.save()
    return job_posting

@api.post('jobs', auth=JWTAuth(), response=JobPostingSchema, tags=['users', 'jobs'])
def create_job_posting(request, form: JobPostingForm):
    job = JobPosting.objects.create(
        creator=request.user,
        title=form.title,
        description=form.description,
    )
    
    for job_type in form.type_of_job:
        job.type_of_job.add(Job.objects.get(title=job_type))

    job.save()
    return job

@api.get('get-user-bookmarks', response=list[JobPostingSchema], tags=['users', 'jobs'])
def get_user_bookmarks(request, username: str):
    user = User.objects.get(username=username)
    return user.bookmarks.all() 

@api.put('applications/response', auth=JWTAuth(), response=List[ApplicationSchema], tags=['jobs', 'application'])
def application_response(request, job_posting_id: int, applicant_username: str, accept: bool):
    job_posting = JobPosting.objects.get(id=job_posting_id)
    applicant = User.objects.get(username=applicant_username)

    application = Application.objects.get(job_posting=job_posting, applicant=applicant)
    application.accepted = accept
    application.save()

    return Application.objects.filter(job_posting=job_posting)

@api.get('get-job-applicants', response=List[ApplicationSchema], tags=['users', 'jobs', 'application'])
def get_job_applicants(request, job_posting_id):
    job_posting = JobPosting.objects.get(id=job_posting_id)
    applicants = Application.objects.filter(job_posting=job_posting)

    return applicants