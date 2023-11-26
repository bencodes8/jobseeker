import * as React from "react";
import axios from "axios";
import { 
    Box,
    Button,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography 
} from "@mui/material";
import AuthContext from "@/context/AuthContext";
import { BACKEND_URL } from "@/constants/constants";

function EditProfileModal(props) {
     const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: {xs: '90%', md: '60%'},
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

      const { isModalOpen, handleCloseModal, profileData } = props;
      const { user, handleEditProfile } = React.useContext(AuthContext);
      const [interests, setInterests] = React.useState(null);
      const [selection, setSelection] = React.useState('');
      const [editProfileFields, setEditProfileFields] = React.useState({
        aboutMe: '',
        interest: ''
    });
    
      React.useEffect(() => {
        async function getInterests() {
            const { data } = await axios.get(`${BACKEND_URL}/api/user/filter-interests/?username=${user?.username}`);
            setInterests(data);  
        }
        
        if (user)
            getInterests();
      }, []);

      const handleSelect = (e) => {
        setSelection(e.target.value);
        setEditProfileFields(prev => {
            const newState = {...prev};
            newState.interest = e.target.value
            return newState;
        });
      }
      
      const handleSubmit = (e) => {
        e.preventDefault();
        if (!editProfileFields.interest) editProfileFields.interest = null;
        if (!editProfileFields.aboutMe) editProfileFields.aboutMe = profileData.about_me;

        const payload = {
            about_me: editProfileFields.aboutMe,
            interest: editProfileFields.interest
        }
        
        handleEditProfile(payload);
        handleCloseModal();
      }

    return (
        <>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
                <Box sx={style}>
                    <Typography variant="h6" padding={1}>Edit Profile</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="About Me"
                            multiline
                            fullWidth
                            minRows={4}
                            sx= {{ marginY: 4 }}
                            onChange={(e) => setEditProfileFields({ ...editProfileFields, aboutMe: e.target.value })}
                        />
                        <InputLabel>Interests</InputLabel>
                        <Select
                            fullWidth
                            value={selection}
                            onChange={handleSelect}
                        >
                            {interests && interests.map((interest) => (
                                <MenuItem key={interest.id} value={interest.id}>{interest.title}</MenuItem>
                            ))}
                        </Select>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                            <Button color="inherit" onClick={handleCloseModal}>Cancel</Button>
                            <Button key="submit" type="submit">Submit</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
}

export default EditProfileModal;