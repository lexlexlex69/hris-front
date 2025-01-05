import { useState } from "react";
import { searchEmployee } from "../../searchemployee/CustomSearchEmployeeRequest";
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { Search as SearchIcon } from "@mui/icons-material";



export default function CustomSearchEmployee(props) {
    const [searchVal, setSearchVal] = useState('');
    const [searchData, setSearchData] = useState([]);

    const handleSearchEmployee = (e) => {
        e.preventDefault();
        var t_data = {
            data: searchVal
        }

        searchEmployee(t_data)
            .then(res => {
                console.log(res.data)
                setSearchData(res.data)
            }).catch(err => {
                Swal.fire({
                    icon: 'errpr',
                    title: err
                })
            })
    }

    const handleSelected = (row) => {
        props.handleSelect(row)
    }

    return (
        <form onSubmit={handleSearchEmployee}>
            <Grid container spacing={1}>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
                    <TextField type='text' fullWidth label='Search Employee' placeholder='Employee firstname | lastname' required value={searchVal} onChange={(val) => setSearchVal(val.target.value)} />
                    <Button variant='outlined' type='submit'><SearchIcon /></Button>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer sx={{ maxHeight: 300, height: 300, overflowY: 'scroll' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Position
                                    </TableCell>
                                    <TableCell>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    searchData.map((row, key) =>
                                        <TableRow hover key={key}>
                                            <TableCell>
                                                {row.lname}, {row.fname} {row.mname ? row.mname.charAt(0) + '. ' : ''}
                                            </TableCell>
                                            <TableCell>
                                                {row.position_name}
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleSelected(row)} variant='contained' size='small'>Select</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </form>
    )
}
