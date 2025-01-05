import React from "react";
import { Container, TextField, MenuItem, InputLabel ,Button } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
export default function AddCourse(){
    const [category, setCategory] = React.useState('');

    const handleChange = (event) => {
        setCategory(event.target.value);
    };
    
    return(
        <Container lg = "12">
            <TextField variant="outlined" label = "Course Name" fullWidth/>
            <InputLabel id="category-select-label" fullWidth>Category</InputLabel>
            <Select
                value={category}
                labelId = "category-select-label"
                id="category-select"
                label="Category"
                onChange={handleChange}
                fullWidth
            >
                <MenuItem value={10}>HUMANITIES</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <Button variant="contained" fullWidth>Submit</Button>
        </Container>
    )
}