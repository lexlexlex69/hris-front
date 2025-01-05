import React from 'react';
import Box from '@mui/material/Box'
import {TextField, Button, MenuItem } from '@mui/material';
import ArroFormwardIcon from '@mui/icons-material/ArrowForward';

const AddOrg = ({ inputState, handleSubmitData, dept, div, sec, unit, inputStateChange }) => {
    return (
        <div>
            <form onSubmit={handleSubmitData}>
                <Box sx={{ px: 5 }}>
                    <TextField
                        label="Title / Name"
                        fullWidth
                        size='small'
                        name='title'
                        value={inputState.title}
                        onChange={inputStateChange}
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        label="Short Name"
                        fullWidth
                        size='small'
                        name='shortName'
                        value={inputState.shortName}
                        onChange={inputStateChange}
                        sx={{ mt: 2 }}
                        required
                    />
                    <TextField
                        size='small'
                        label="Type"
                        fullWidth
                        name='type'
                        value={inputState.type}
                        onChange={inputStateChange}
                        sx={{ mt: 2 }}
                        select
                        required

                    >
                        <MenuItem value="div">Division</MenuItem>
                        <MenuItem value="sec"> Section</MenuItem>
                        <MenuItem value="unit">Unit</MenuItem>
                        <MenuItem value="sub-unit">Sub-Unit</MenuItem>
                    </TextField>
                    <TextField
                        size='small'
                        label="Achor Type"
                        name='anchorType'
                        value={inputState.anchorType}
                        onChange={inputStateChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                        select
                    >
                        <MenuItem value="dept">Department / 1st level</MenuItem>
                        <MenuItem value="div">Division / 2nd level</MenuItem>
                        <MenuItem value="sec">Section / 3rd level</MenuItem>
                        <MenuItem value="unit">Unit / 4th level</MenuItem>
                    </TextField>
                    <TextField
                        size='small'
                        label="Achor To"
                        name='anchorId'
                        value={inputState.anchorId}
                        onChange={inputStateChange}
                        fullWidth
                        sx={{ mt: 2 }}
                        required
                        select
                    >
                        {inputState.anchorType === 'dept' && dept && (
                            <MenuItem value={dept?.id}>
                                {dept?.title}
                            </MenuItem>
                        )}
                        {inputState.anchorType === 'div' && Array.isArray(div) && div.length && div.map((item) => (
                            <MenuItem value={item.id}>
                                {item.title}
                            </MenuItem>
                        ))}
                        {inputState.anchorType === 'sec' && Array.isArray(sec) && sec.length && sec.map((item) => (
                            <MenuItem value={item.id}>
                                {item.title}
                            </MenuItem>
                        ))}
                        {inputState.anchorType === 'unit' && Array.isArray(unit) && unit.length && unit.map((item) => (
                            <MenuItem value={item.id}>
                                {item.title}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button variant='contained' type='submit' startIcon={< ArroFormwardIcon/>} sx={{ mt: 2, borderRadius: '1rem' }}>submit</Button>
                </Box>
            </form>
        </div>
    );
};

export default AddOrg;