import React,{useState} from 'react';
import {Grid,Box,TableContainer,Table,TableHead,TableRow,TableBody,Typography,TextField,Paper,Button} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue} from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { postMyEvaluation } from '../TraineeDashboardRequest';
import Swal from 'sweetalert2';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: grey[800],
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
export default function Evaluate(props){
    const [rate,setRate] = useState({
        'TOPIC':{
            'item1':0,
            'item2':0,
            'item3':0,
            'item4':0,
        },
        'RESOURCEPERSON':{
            'item1':0,
            'item2':0,
            'item3':0,
            'item4':0,
        }
    })
    const handleChange = (name,itemno,value) => {
       
    var temp = {...rate};

    temp[name][itemno] = value.target.value;
    setRate(temp)
    };
    const handleSubmit = (event)=>{
        event.preventDefault();
        Swal.fire({
            icon:'info',
            title: 'Confirm submit evaluation?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText:'No'
        }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            // console.log(props.data)
            Swal.fire({
                icon:'info',
                title:'Submitting evaluation',
                html:'Please wait...',
                allowOutsideClick:false,
                allowEscapeKey:false
            })
            Swal.showLoading()
            var data2={
                data:props.data,
                rate:rate
            }
            // Swal.close();
            // console.log(data2)
            postMyEvaluation(data2)
            .then(res=>{
                if(res.data.status === 200){
                    props.handleUpdateData(res.data.data)
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close()
                console.log(err)
            })
        } 
        })
        
    }
    return(
        <Paper sx={{m:1,p:2}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField label = 'Speaker Name' defaultValue={props.data.fname+' '+props.data.lname} fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{fontWeight:'bold',mt:2}}>EVALUATION FORM</Typography>
                    <Typography sx={{textIndent:'60px',textAlign:'justify',fontSize:'.9rem',mt:2}}>Please share with us an honest evaluation of the following key areas by checking the appropriate column which best approximate your assessment. The result of your responses will guide and help the Human Resource Development Division of the City Human Resource Management Office to further improve on the various areas enlisted below. Rest assured your answers will be utmost confidentiality.</Typography>
                    <Typography sx={{textIndent:'60px',fontSize:'.9rem',mt:1}}>Kindly respond to the following items using the scale below:</Typography>
                </Grid>
                
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Typography sx={{textIndent:'60px',fontSize:'.9rem',mt:1,fontWeight:'bold'}}>5 Excellent</Typography>
                    <Typography sx={{textIndent:'60px',fontSize:'.9rem',mt:1,fontWeight:'bold'}}>4 Very Good</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Typography sx={{textIndent:'60px',fontSize:'.9rem',mt:1,fontWeight:'bold'}}>3 Good</Typography>
                    <Typography sx={{textIndent:'60px',fontSize:'.9rem',mt:1,fontWeight:'bold'}}>2 Fair</Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Typography sx={{textIndent:'60px',fontSize:'.9rem',mt:1,fontWeight:'bold'}}>1 Poor</Typography>
                </Grid>
                <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell/>
                                        <StyledTableCell>TOPIC</StyledTableCell>
                                        <StyledTableCell align='center'>5</StyledTableCell>
                                        <StyledTableCell align='center'>4</StyledTableCell>
                                        <StyledTableCell align='center'>3</StyledTableCell>
                                        <StyledTableCell align='center'>2</StyledTableCell>
                                        <StyledTableCell align='center'>1</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                <TableRow >
                                        <StyledTableCell align='center'>1</StyledTableCell>
                                        <StyledTableCell>Comprehensiveness of the topic</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item1 === '5'}
                                            onChange={(value)=>handleChange('TOPIC','item1',value)}
                                            value={5}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '5' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item1 === '4'}
                                            onChange={(value)=>handleChange('TOPIC','item1',value)}
                                            value={4}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '4' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item1 === '3'}
                                            onChange={(value)=>handleChange('TOPIC','item1',value)}
                                            value={3}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '3' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item1 === '2'}
                                            onChange={(value)=>handleChange('TOPIC','item1',value)}
                                            value={2}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '2' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item1 === '1'}
                                            onChange={(value)=>handleChange('TOPIC','item1',value)}
                                            value={1}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '1' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>2</StyledTableCell>
                                        <StyledTableCell>Relevance  of the topic towards work</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item2 === '5'}
                                            onChange={(value)=>handleChange('TOPIC','item2',value)}
                                            value={5}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '5' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item2 === '4'}
                                            onChange={(value)=>handleChange('TOPIC','item2',value)}
                                            value={4}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '4' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item2 === '3'}
                                            onChange={(value)=>handleChange('TOPIC','item2',value)}
                                            value={3}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '3' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item2 === '2'}
                                            onChange={(value)=>handleChange('TOPIC','item2',value)}
                                            value={2}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '2' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item2 === '1'}
                                            onChange={(value)=>handleChange('TOPIC','item2',value)}
                                            value={1}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '1' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>3</StyledTableCell>
                                        <StyledTableCell>Significance of the topic on your personal level</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item3 === '5'}
                                            onChange={(value)=>handleChange('TOPIC','item3',value)}
                                            value={5}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item3 === '4'}
                                            onChange={(value)=>handleChange('TOPIC','item3',value)}
                                            value={4}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item3 === '3'}
                                            onChange={(value)=>handleChange('TOPIC','item3',value)}
                                            value={3}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item3 === '2'}
                                            onChange={(value)=>handleChange('TOPIC','item3',value)}
                                            value={2}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item3 === '1'}
                                            onChange={(value)=>handleChange('TOPIC','item3',value)}
                                            value={1}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>4</StyledTableCell>
                                        <StyledTableCell>Usefulness in general</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item4 === '5'}
                                            onChange={(value)=>handleChange('TOPIC','item4',value)}
                                            value={5}
                                            name="radio-buttons4"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item4 === '4'}
                                            onChange={(value)=>handleChange('TOPIC','item4',value)}
                                            value={4}
                                            name="radio-buttons4"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item4 === '3'}
                                            onChange={(value)=>handleChange('TOPIC','item4',value)}
                                            value={3}
                                            name="radio-buttons4"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item4 === '2'}
                                            onChange={(value)=>handleChange('TOPIC','item4',value)}
                                            value={2}
                                            name="radio-buttons4"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.TOPIC.item4 === '1'}
                                            onChange={(value)=>handleChange('TOPIC','item4',value)}
                                            value={1}
                                            name="radio-buttons4"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                    </TableRow>
                                </TableBody>
                                <TableHead >
                                    <TableRow>
                                        <StyledTableCell/>
                                        <StyledTableCell>RESOURCE PERSON/S</StyledTableCell>
                                        <StyledTableCell/>
                                        <StyledTableCell/>
                                        <StyledTableCell/>
                                        <StyledTableCell/>
                                        <StyledTableCell/>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                <TableRow hover >
                                        <StyledTableCell align='center'>1</StyledTableCell>
                                        <StyledTableCell>Understanding & mastery of the topic</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item1 === '5'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item1',value)}
                                            value={5}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item1 === '4'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item1',value)}
                                            value={4}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item1 === '3'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item1',value)}
                                            value={3}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item1 === '2'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item1',value)}
                                            value={2}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item1 === '1'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item1',value)}
                                            value={1}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>2</StyledTableCell>
                                        <StyledTableCell>Appropriate & effective use of examples & practices</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item2 === '5'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item2',value)}
                                            value={5}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item2 === '4'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item2',value)}
                                            value={4}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item2 === '3'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item2',value)}
                                            value={3}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item2 === '2'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item2',value)}
                                            value={2}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item2 === '1'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item2',value)}
                                            value={1}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>3</StyledTableCell>
                                        <StyledTableCell>Ability to communicate ideas & clarify concerns</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item3 === '5'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item3',value)}
                                            value={5}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item3 === '4'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item3',value)}
                                            value={4}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item3 === '3'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item3',value)}
                                            value={3}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item3 === '2'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item3',value)}
                                            value={2}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item3 === '1'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item3',value)}
                                            value={1}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>4</StyledTableCell>
                                        <StyledTableCell>Ability to draw attention & encourage active participation</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item4 === '5'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item4',value)}
                                            value={5}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item4 === '4'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item4',value)}
                                            value={4}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item4 === '3'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item4',value)}
                                            value={3}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item4 === '2'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item4',value)}
                                            value={2}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.RESOURCEPERSON.item4 === '1'}
                                            onChange={(value)=>handleChange('RESOURCEPERSON','item4',value)}
                                            value={1}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Button sx={{float:'right',mt:2}} variant='contained' type='submit' className='custom-roundbutton'>Submit</Button>
                </form>

                </Grid>

            </Grid>
        </Paper>
    )
}