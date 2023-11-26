# [CS50W Capstone](https://cs50.harvard.edu/web/2020/projects/final/capstone/)
Hello, world! Allow me to introduce my CS50W Capstone project: "Jobseeker." Jobseeker is a comprehensive full-stack web application designed to facilitate meaningful connections between users, whether they're seeking job opportunities or looking to hire talent.

With Jobseeker, users have the option to register and log in as either a 'seeker' or an 'employer'. This flexibility empowers users to expand their professional network and access many career opportunities.

Within the platform, users can engage with a wide array of features. Seekers can follow other users, building valuable connections and gaining insights into potential opportunities. Employers, on the other hand, hold the authority to create job postings visible to the entire Jobseeker community.

One of the standout features of Jobseeker is its robust job application system. Seekers can effortlessly apply to multiple job postings simultaneously. Employers, in turn, have the privilege of reviewing applicants by exploring their detailed profiles, ultimately making informed decisions about accepting or declining applications.

Jobseeker simplifies the job search process with its user-friendly search filter feature. This functionality empowers seekers to pinpoint the perfect job opportunity, enhancing their overall experience on the platform.  
<hr>

# [CS50W Capstone Core Requirements](https://cs50.harvard.edu/web/2020/projects/final/capstone/#requirements)
1. Distinct from past CS50W projects: <b>Yes</b>
2. Web application must utilize Django (including at least one model) on the back-end and JavaScript on the front-end: <b>Yes</b>
3. Web application must be mobile-responsive: <b>Yes</b>
<hr/>

# Distinctiveness and Complexity
This the required distinctiveness and complexity section per capstone submission instructions. Please read below.

### Distinctiveness
This project draws significant inspiration from the methodologies and principles commonly employed in the development of E-commerce and Network projects. It comprises two central components: a Next.js application and a Django application. However, what truly sets this application apart is its distinct theme and functionality.

The core concept revolves around the differentiation of users into two distinct categories: 'seekers' and 'employers.' Each category enjoys unique privileges not accessible to the other. To safeguard the application's integrity and user data, I implemented robust security measures through JWT (JSON Web Token) authentication. This ensures that only users with the necessary tokens can access private endpoints, elevating the platform's security standards.

In contrast to previous projects, where much of the user authorization occurred behind the scenes thanks to Django's inherent capabilities, I adopted a different approach. I leveraged Django Ninja's API endpoints to retrieve and manage user data, allowing for a seamless integration into the Next.js application's global state.

One of the project's standout features is the sophisticated search filter functionality. This feature empowers users to precisely tailor their job search by filtering and searching for specific job postings. In an environment where thousands of job listings may be available, this feature significantly enhances the user experience, delivering a more focused and personalized job search.

In summary, this project amalgamates the best practices from E-commerce and Network projects while introducing a unique user-centric approach. The implementation of JWT authentication, coupled with the innovative use of API endpoints, underscores the commitment to security and functionality. The crowning achievement, however, is the intuitive search filter, which elevates the user experience to new heights by simplifying the job search process.

### Complexity
Jobseeker utilizes many frameworks for both frontend and backend development. Please read below.

#### Frontend
1. [Next.js (Pages Router)](https://nextjs.org/)
2. [Material-UI](https://mui.com/)

The frontend of the application harnesses the Next.js page router method, a powerful tool enabling the effortless creation of static and dynamic routes through folder structures. Complementing this, Material UI, a robust React component framework, seamlessly integrates pre-styled components into the application.

The choice to employ Next.js stemmed from its remarkable ease of use in routing and its robust capabilities in server-side rendering and static site generation. This not only streamlined development but also ensures optimal performance and user experience. Furthermore, Material UI offered a vast array of built-in components and provided an excellent opportunity to hone my CSS skils to render the components in the way I desired.

Next.js, a framework built within the realm of React, served as an invaluable platform for honing my React coding skills while also unlocking the added benefits that Next.js brings to the table. The frontend development primarily revolved around storing data within user and content states. JWT authentication was also employed for additional means of authorization when a user attempts to send a request to a private endpoint. 

JWT Authentication emerged as a pivotal means of identifying and validating user requests, relying on JWT tokens and cookies for seamless functionality. In this architecture, each user is furnished with both an 'access' token and a 'refresh' token. These tokens play a crucial role in enhancing security and user experience.

I chose to store the 'refresh' token as an HTTP-only cookie, rendering it inaccessible to JavaScript. Meanwhile, the 'access' token is securely retained within React state, ensuring its accessibility through the React component tree.
When a user would try to access a private endpoint, the frontend will fetch the 'access' token and send it to the backend for authorization. If authorized, the appropriate content will be rendered on the page. This was especially important
when managing and mutating user state.

#### Backend
1. [Django](https://www.djangoproject.com/)
2. [Django Ninja REST Framework](https://django-ninja.rest-framework.com/)
3. [Django Ninja JWT](https://eadwincode.github.io/django-ninja-jwt/)

The backend utilized the Django Ninja REST Framework to handle the api endpoints being called upon via user request. Django Ninja is an intuitive framework to integrate Django models with RESTful API. Throughout the course, we used various files within our django project directory. However, Django Ninja only relies on one file `api.py`. Inside `api.py`, consist of Schemas which is widely used within the defined functions. The defined functions are a way to create API endpoints within our django application. 
* Note: I still had to use the `models.py` file to create the Django models and `urls.py` to route and bundle the API endpoints. 

Much of the payloads being sent from the frontend will be recieved by these API endpoints. When the appropriate payload is sent to an endpoint, the respective function will run Django logic to update the backend database.
If the request is successful, it will return a 200 status code and a JSON response back to the frontend to then be parsed and used to update state within the frontend.

As the application grew larger, it became more complex tying everything together in a succint way. 

###### Problems Encountered
* Managing state throughout the application was a massive struggle because some of the application required mutation of states. For my next project, I should probably utilize a state management framework.
* NextJs and Material UI had a huge learning curve because I went into it not being too comfortable with React. However, as the project got closer to completion, I felt a lot more comfortable.
* There was an issue with pinging the backend API due to CORS errors, therefore, installing Django CORS is imperative.
* I found the frontend to be much harder to implement than the backend due to the familiarty of the technologies used.
* Many of the Schemas shared a lot of the same properties with other decalred Schemas and the JSON response returned would involve a object with many more objects nested inside of it.

### How to use the app yourself
* There should be two main folders: `jobseeker-frontend` and `jobseeker-backend`.
  * `cd jobseeker-frontend` and `npm install`.
    * This should install all the dependencies for the nextjs appliation.
    * `npm run dev`
  * `cd ..` -> `cd jobseeker-backend` -> `pip install -r requirements.txt`.
  * `python manage.py runserver`
    * To see the all the API end points and Schemas go to route: `http://127.0.0.1:8000/api/docs`

# Final Statement
This project took roughly ~3 months to finish. There were a lot of headaches along the journey of completing this project, but I've learned a lot along the way including how to debug a web application using Chrome dev tools and breakpoints. This project was a way for me to extend my learning to extents beyond this class by leveraging many different frameworks to accomplish specific tasks. 
