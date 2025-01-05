import React,{useState} from 'react';
import {Grid,Box,TableContainer,Table,TableHead,TableRow,TableBody,Typography,TextField,Paper,Button} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {green,orange,grey,blue} from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { postLastDayEvaluation, postMyEvaluation } from '../TraineeDashboardRequest';
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
export default function LastDayEvaluate(props){
    const [rate,setRate] = useState({
        'PARTICIPANTS':{
            'item1':0,
            'item2':0,
            'item3':0,
        },
        'MANAGEMENT':{
            'item1':0,
            'item2':0,
            'item3':0,
        },
        'OVERALL':0
    })
    const [comments1,setComments1] = useState('')
    const [comments2,setComments2] = useState('')
    const [comments3,setComments3] = useState('')
    const [comments4,setComments4] = useState('')
    const [commentsSuggestions,setCommentsSuggestions] = useState('')
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
                rate:rate,
                comments_suggestions:commentsSuggestions,
                comments1:comments1,
                comments2:comments2,
                comments3:comments3,
                comments4:comments4,
            }
            // console.log(data2)
            // Swal.close()
            postLastDayEvaluation(data2)
            .then(res=>{
                console.log(res.data)
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
    const handleChangeOverall =(value)=>{
        var temp = {...rate};

        temp.OVERALL = value.target.value;
        setRate(temp)
    }
    return(
        <Paper sx={{m:1,p:2}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField label = 'Training Name' defaultValue={props.data.training_name} fullWidth/>
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
                                        <StyledTableCell>PARTICIPANTS</StyledTableCell>
                                        <StyledTableCell align='center'>5</StyledTableCell>
                                        <StyledTableCell align='center'>4</StyledTableCell>
                                        <StyledTableCell align='center'>3</StyledTableCell>
                                        <StyledTableCell align='center'>2</StyledTableCell>
                                        <StyledTableCell align='center'>1</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                <TableRow hover >
                                        <StyledTableCell align='center'>1</StyledTableCell>
                                        <StyledTableCell>Attentiveness & Participation</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item1 === '5'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item1',value)}
                                            value={5}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '5' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item1 === '4'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item1',value)}
                                            value={4}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '4' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item1 === '3'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item1',value)}
                                            value={3}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '3' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item1 === '2'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item1',value)}
                                            value={2}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '2' }}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item1 === '1'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item1',value)}
                                            value={1}
                                            name="radio-buttons1"
                                            inputProps={{ 'aria-label': '1' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>2</StyledTableCell>
                                        <StyledTableCell>Enhanced understanding</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item2 === '5'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item2',value)}
                                            value={5}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '5' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item2 === '4'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item2',value)}
                                            value={4}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '4' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item2 === '3'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item2',value)}
                                            value={3}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '3' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item2 === '2'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item2',value)}
                                            value={2}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '2' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item2 === '1'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item2',value)}
                                            value={1}
                                            name="radio-buttons2"
                                            inputProps={{ 'aria-label': '1' }}
                                            required
                                            />
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>3</StyledTableCell>
                                        <StyledTableCell>Satisfaction on the Clarification given</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item3 === '5'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item3',value)}
                                            value={5}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item3 === '4'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item3',value)}
                                            value={4}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item3 === '3'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item3',value)}
                                            value={3}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item3 === '2'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item3',value)}
                                            value={2}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.PARTICIPANTS.item3 === '1'}
                                            onChange={(value)=>handleChange('PARTICIPANTS','item3',value)}
                                            value={1}
                                            name="radio-buttons3"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                </TableBody>
                                <TableHead >
                                    <TableRow>
                                        <StyledTableCell/>
                                        <StyledTableCell>MANAGEMENT</StyledTableCell>
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
                                        <StyledTableCell>Conduciveness & convenience of the venue & facilities</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item1 === '5'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item1',value)}
                                            value={5}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item1 === '4'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item1',value)}
                                            value={4}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item1 === '3'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item1',value)}
                                            value={3}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item1 === '2'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item1',value)}
                                            value={2}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item1 === '1'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item1',value)}
                                            value={1}
                                            name="radio-buttons5"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>2</StyledTableCell>
                                        <StyledTableCell>Preparedness on the seminar</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item2 === '5'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item2',value)}
                                            value={5}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item2 === '4'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item2',value)}
                                            value={4}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item2 === '3'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item2',value)}
                                            value={3}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item2 === '2'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item2',value)}
                                            value={2}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item2 === '1'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item2',value)}
                                            value={1}
                                            name="radio-buttons6"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                    <TableRow hover >
                                        <StyledTableCell align='center'>3</StyledTableCell>
                                        <StyledTableCell>Time management</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item3 === '5'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item3',value)}
                                            value={5}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item3 === '4'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item3',value)}
                                            value={4}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item3 === '3'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item3',value)}
                                            value={3}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item3 === '2'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item3',value)}
                                            value={2}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.MANAGEMENT.item3 === '1'}
                                            onChange={(value)=>handleChange('MANAGEMENT','item3',value)}
                                            value={1}
                                            name="radio-buttons7"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                        
                                    </TableRow>
                                </TableBody>
                                <TableHead >
                                    <TableRow>
                                        <StyledTableCell/>
                                        <StyledTableCell>OVERALL IMPRESSION</StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.OVERALL === '5'}
                                            onChange={(value)=>handleChangeOverall(value)}
                                            value={5}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '5' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.OVERALL === '4'}
                                            onChange={(value)=>handleChangeOverall(value)}
                                            value={4}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '4' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.OVERALL === '3'}
                                            onChange={(value)=>handleChangeOverall(value)}
                                            value={3}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '3' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.OVERALL === '2'}
                                            onChange={(value)=>handleChangeOverall(value)}
                                            value={2}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '2' }}
                                            required/>
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            <Radio
                                            checked={rate.OVERALL === '1'}
                                            onChange={(value)=>handleChangeOverall(value)}
                                            value={1}
                                            name="radio-buttons8"
                                            inputProps={{ 'aria-label': '1' }}
                                            required/>
                                        </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Typography sx={{fontWeight:'bold',mt:1}}>INSTRUCTION:</Typography>
                    {/* <Typography>Kindly indicate below your comments and reactions if you have any. We would love to hear from you. Thanks.</Typography> */}
                    <Typography sx={{textIndent:'60px',textAlign:'justify',mt:2}}>Kindly indicate below your comments and reactions if you have any. We would love to hear from you Thanks.</Typography>

                    <Typography sx={{fontWeight:'bold' ,fontSize:14}}>1. What are the new learning/s you get from the training?</Typography>
                    <TextField label = 'Answer' multiline fullWidth variant='filled' value = {comments1} onChange={(value)=>setComments1(value.target.value)} required/>

                    <Typography sx={{fontWeight:'bold',fontSize:14,mt:2}}>2. What are the important ideas that you consider helpful and applicable to your current function?</Typography>
                    <TextField label = 'Answer' multiline fullWidth variant='filled' value = {comments2} onChange={(value)=>setComments2(value.target.value)} required/>

                    <Typography sx={{fontWeight:'bold',fontSize:14,mt:2}}>3. What are the facilitating factors that contributed to your learning experience?</Typography>
                    <TextField label = 'Answer' multiline fullWidth variant='filled' value = {comments3} onChange={(value)=>setComments3(value.target.value)} required/>

                    <Typography sx={{fontWeight:'bold',fontSize:14,mt:2}}>4. What are the hindering factors affecting the conduct of this activity?</Typography>
                    <TextField label = 'Answer' multiline fullWidth variant='filled' value = {comments4} onChange={(value)=>setComments4(value.target.value)} required/>
                    
                    <Typography sx={{fontWeight:'bold',fontSize:14,mt:2}}>5. Other comments, if any.</Typography>
                    <TextField label = 'Answer' multiline fullWidth variant='filled' value = {commentsSuggestions} onChange={(value)=>setCommentsSuggestions(value.target.value)} required/>

                    <Button sx={{float:'right',mt:2}} variant='contained' type='submit'>Submit</Button>
                </form>

                </Grid>

            </Grid>
        </Paper>
    )
}