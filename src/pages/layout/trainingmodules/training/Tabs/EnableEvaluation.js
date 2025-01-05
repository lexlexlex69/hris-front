import React,{useState} from 'react';
import {Box,Paper,TableContainer,Table,TableHead,TableRow,TableBody,Fade,Grid,Switch,FormControlLabel,Button} from '@mui/material';
import { styled } from '@mui/material/styles';
import {blue,red,orange} from '@mui/material/colors'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableLoading from '../../../loader/TableLoading';
import moment from 'moment';
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function EnableEvaluation(props){

    return(
        <React.Fragment>
        {
            props.loadingEnableEvaluation
            ?
            <TableLoading/>
            :
            <Fade in>
                <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            Assign Schedule Date
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Trainer Name
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Period
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Topic
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            Enable
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.trainerData.length === 0
                                        ?
                                        <TableRow >
                                            <StyledTableCell colSpan={2} align='center'>No Data</StyledTableCell>
                                        </TableRow>
                                        :
                                        props.trainerData.map((row,key)=>
                                        <TableRow key={key} hover>
                                            <StyledTableCell>
                                                {moment(row.training_date).format('MMMM DD,YYYY')}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.fname} {row.mname === null ? '':row.mname.charAt(0)+'.'} {row.lname}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.period}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {row.topic}
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                            <Switch checked = {props.enabledIds.includes(row.trainer_schedule_id)} onChange = {()=>props.handleSetEnabled(row.trainer_schedule_id)}/>
                                            </StyledTableCell>
                                        </TableRow>
                                        )
                                    }
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>                    
                </Grid>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                <FormControlLabel control={<Switch checked={props.lastDayEvaluation} onChange = {()=>props.setLastDayEvaluation(!props.lastDayEvaluation)} />} label="Last Day Evaluation" />
                </Grid>
                <Grid item xs={12}>
                    <Button variant='contained' sx={{float:'right'}} onClick={props.handleSaveEnabled} color='success' className='custom-roundbutton'>Save</Button>
                </Grid>
            </Grid>
            </Fade>
        }
        </React.Fragment>
    )
}