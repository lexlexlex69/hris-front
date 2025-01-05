import React from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Box } from '@mui/material';
import { PreviewCTOApplicationForm } from '../PreviewCTOApplicationForm';
import PreviewCTOApplicationForm2 from '../PreviewCTOApplicationForm2';
import moment from 'moment';
export const ReviewCTO = ({employeeInfo,recommendation,handleRecommendation,showFileAttachment,authInfo,disapproval,ctoInfo,officeHead}) => {
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    return (
    <>
        {
        matches || matchesMD
        ?
        <>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'10px':'auto'}}>
        <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
            <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                Available COC Balance: {employeeInfo.bal_before_process}.00 HOURS
            </Typography>
        </Grid>
            <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                <Grid item container spacing={1}>
                <Grid item lg = {2} sm = {12} xs = {12}>
                    <TextField label='Date Filed' defaultValue={moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY')} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                </Grid>
                <br/>

                <Grid item lg = {2} sm = {12} xs = {12}>
                    <TextField label='Employee Name' defaultValue={employeeInfo.fullname} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                </Grid>
                <br/>
                <Grid item lg = {2} sm = {12} xs = {12}>
                    <TextField label='Office/Department' defaultValue={employeeInfo.officedepartment} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                </Grid>
                <br/>

                <Grid item lg = {2} sm = {12} xs = {12}>
                    <TextField label='Leave Application Type' defaultValue='CTO' InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                </Grid>
                <br/>

                <Grid item lg = {2} sm = {12} xs = {12}>
                    <TextField label="No. of Hours Applied" defaultValue={employeeInfo.days_hours_applied} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                </Grid>
                <br/>

                <Grid item lg = {2} sm = {12} xs = {12}>
                    <TextField label="Inclusive Dates" defaultValue={employeeInfo.inclusive_dates_text} InputLabelProps={{shrink:true}} inputProps={{readOnly:true}} fullWidth/>
                </Grid>
                </Grid>

            </Box>
            {showFileAttachment()}
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Action</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={recommendation}
                label="Action"
                onChange={handleRecommendation}
                required
            >
                <MenuItem value={'Certified Correct'}>Certified Correct</MenuItem>
                <MenuItem value={'For Updating'}>For Updating</MenuItem>
            </Select>
            </FormControl>
        </Grid>
        </Grid>
        </>
        :
        <>
        <Grid item xs={12} sm={12} md={12} lg={12}>
            {
                employeeInfo.emp_status === 'RE' || employeeInfo.emp_status === 'CS'
                ?
                <PreviewCTOApplicationForm info={employeeInfo} auth_info = {authInfo} pendinginfo={employeeInfo} coc = {employeeInfo.coc_bal} CTOHours = {employeeInfo.days_hours_applied} cto_dates = {employeeInfo.inclusive_dates_text} approval = {recommendation} disapproval = {disapproval} date_of_filing ={employeeInfo.date_of_filing} status = {employeeInfo.status} cto_info = {ctoInfo} office_head={officeHead}/>
                :
                <PreviewCTOApplicationForm2 type = 'verification' info = {employeeInfo} authInfo = {authInfo} aoInfo ={{office_ao:employeeInfo.incharge_name,office_ao_assign:employeeInfo.incharge_pos}} deptHead = {officeHead} hours={employeeInfo.days_hours_applied} dates={employeeInfo.inclusive_dates_text} availableCOC  = {employeeInfo.bal_before_process}/>
            }
            
            
        </Grid>
        {showFileAttachment()}

        <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px'}}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Action</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={recommendation}
                label="Action"
                onChange={handleRecommendation}
                required
            >
                <MenuItem value={'Certified Correct'}>Certified Correct</MenuItem>
                <MenuItem value={'For Updating'}>For Updating</MenuItem>
            </Select>
            </FormControl>
    </Grid>
    </>
    }
    </>
    )
}