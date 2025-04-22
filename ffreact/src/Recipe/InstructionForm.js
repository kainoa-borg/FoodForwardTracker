import { useState } from 'react';
import { Grid, Typography, Card, Input, InputLabel, Button, TextField, Box } from '@mui/material';

const InstructionForm = (props) => {
    const { addEntry, handleClose, type } = props;
    
    const [instruction, setInstruction] = useState({
        step_num: '',
        description: '',
        time_minutes: '',
        notes: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        addEntry(instruction);
        handleClose();
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setInstruction(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card sx={{marginTop: '1em', padding: '1em'}}>
                <Typography variant='h5'>Add {type} Instruction</Typography>
                <Typography component='h6' variant='h6'>Required * </Typography>

                <Grid container direction='row' spacing={4}>
                    <Grid item>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <div>
                                <InputLabel>Step Number*: </InputLabel>
                                <Input 
                                    name="step_num" 
                                    type="number" 
                                    value={instruction.step_num}
                                    required
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div>
                                <InputLabel>Description*: </InputLabel>
                                <TextField
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={instruction.description}
                                    required
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div>
                                <InputLabel>Time (minutes): </InputLabel>
                                <Input
                                    name="time_minutes"
                                    type="number"
                                    value={instruction.time_minutes}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div>
                                <InputLabel>Notes: </InputLabel>
                                <TextField
                                    name="notes"
                                    multiline
                                    rows={2}
                                    value={instruction.notes}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Button color="lightBlue" variant='contained' type='Submit'>Add</Button>
                    </Grid>
                </Grid>
            </Card>
        </form>
    );
}

export default InstructionForm;