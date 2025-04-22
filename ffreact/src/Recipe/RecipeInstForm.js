import React, { useState } from 'react';
import { Grid, Typography, Card, Input, InputLabel, Button, TextField, Box, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const RecipeInstForm = (props) => {
    const { addEntry, handleClose, type } = props;
    
    const [instruction, setInstruction] = useState({
        step_num: '',
        description: '',
        notes: '',
        amount_per_serving: '',
        unit: '',
        substeps: []
    });

    const [substep, setSubstep] = useState({
        description: ''
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

    const handleSubstepChange = (event) => {
        const { name, value } = event.target;
        setSubstep(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const addSubstep = () => {
        if (substep.description) {
            setInstruction(prev => ({
                ...prev,
                substeps: [...prev.substeps, {...substep}]
            }));
            setSubstep({
                description: ''
            });
        }
    }

    const removeSubstep = (index) => {
        setInstruction(prev => ({
            ...prev,
            substeps: prev.substeps.filter((_, i) => i !== index)
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

                            <Box sx={{display: 'flex', gap: 1, alignItems: 'flex-start'}}>
                                <TextField
                                    name="amount_per_serving"
                                    label="Amount/Serving"
                                    type="number"
                                    value={instruction.amount_per_serving}
                                    onChange={handleFormChange}
                                    size="small"
                                    sx={{width: 120}}
                                />
                                <TextField
                                    name="unit"
                                    label="Unit"
                                    value={instruction.unit}
                                    onChange={handleFormChange}
                                    size="small"
                                    sx={{width: 100}}
                                />
                            </Box>

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
                                <InputLabel>Notes: </InputLabel>
                                <TextField
                                    name="notes"
                                    multiline
                                    rows={2}
                                    value={instruction.notes}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div>
                                <Typography variant="h6">Substeps</Typography>
                                {instruction.substeps.map((step, index) => (
                                    <Box key={index} sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                                        <Typography>{step.description}</Typography>
                                        <IconButton onClick={() => removeSubstep(index)} size="small">
                                            <RemoveIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                
                                <Box sx={{display: 'flex', gap: 1, alignItems: 'flex-start', mt: 1}}>
                                    <TextField
                                        name="description"
                                        label="Substep Description"
                                        value={substep.description}
                                        onChange={handleSubstepChange}
                                        size="small"
                                    />
                                    <IconButton onClick={addSubstep} color="primary">
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Button color="lightBlue" variant='contained' type='submit'>Add</Button>
                    </Grid>
                </Grid>
            </Card>
        </form>
    );
}

export default RecipeInstForm;