import * as React from 'react';
import { 
    Box,
    Button,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Modal,
    TextField,
    Typography 
} from '@mui/material';
import AuthContext from '@/context/AuthContext';


export default function CreateJobPostModal(props) {
    const { handleCreateJobPost } = React.useContext(AuthContext);
    const { isModalOpen, handleCloseModal, interestsFilters } = props;
    const [formFields, setFormFields] = React.useState({
        title: '',
        description: '',
        type_of_job: []
    });

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

      const handleCheckboxChange = (e, interest) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setFormFields(prevFields => ({
                ...prevFields,
                type_of_job: [...prevFields.type_of_job, interest.title]
            }));
        } else {
            setFormFields((prevFields) => ({
                ...prevFields,
                type_of_job: prevFields.type_of_job.filter((filter) => filter !== interest.title),
            }));
        }
    }

      const handleSubmit = async (e) => {   
        const payload = {
            title: formFields.title,
            description: formFields.description,
            type_of_job: formFields.type_of_job
        }

        const { data } = await handleCreateJobPost(payload);
      }

    return (
        <>
        <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
        >
            <Box sx={style}>
                <Typography variant="h6" padding={1}>Create Job Post</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Job Title"
                        fullWidth
                        sx={{ marginY: 1 }}
                        onChange={(e) => setFormFields({...formFields, title: e.target.value})}
                    />
                    <TextField
                        label="Job Description"
                        multiline
                        fullWidth
                        minRows={4}
                        sx={{ marginY: 2 }}
                        onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                    />
                    <FormGroup row>
                        {interestsFilters?.map((interest, index) => (
                            <FormControlLabel 
                                key={index} 
                                control={
                                    <Checkbox onChange={(e) => handleCheckboxChange(e, interest)} />
                            } 
                                label={interest.title} 
                            />
                        ))}
                    </FormGroup>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                        <Button color="inherit" onClick={handleCloseModal}>Cancel</Button>
                        <Button key="submit" type="submit">Submit</Button>
                    </Box>
                </form>
             </Box>
            </Modal>
        </>
    )
}