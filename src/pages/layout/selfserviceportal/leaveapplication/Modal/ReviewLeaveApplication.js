import React from 'react';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Box } from '@mui/material';
import { PreviewCTOApplicationForm } from '../PreviewCTOApplicationForm';
import PreviewCTOApplicationForm2 from '../PreviewCTOApplicationForm2';
import moment from 'moment';
import PreviewLeaveApplicationForm from '../PreviewLeaveApplicationForm';
export const ReviewLeaveApplication = ({employeeInfo,recommendation,handleRecommendation,showFileAttachment,authInfo,officeHead,SPLBal,typeOfLeaveData,aoAssign})=>{
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <>
        {
            matches || matchesMD
            ?
            employeeInfo.length !==0
            ?
            <>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:matches?'20px':'auto'}}>
            {employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 4
                    ?
                        <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                            <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                Available VL Balance: {employeeInfo.vl_bal} DAYS
                            </Typography>
                        </Grid>
                        :
                        employeeInfo.leave_type_id === 3
                        ?
                        <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                        <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                Available SL Balance: {employeeInfo.sl_bal} DAYS
                            </Typography>
                        </Grid>
                        
                        :
                        employeeInfo.leave_type_id === 14 ||  employeeInfo.leave_type_id === 23
                        ?
                        <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                            <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                Available COC Balance: {employeeInfo.coc_bal}.00 HOURS
                            </Typography>
                        </Grid>
                        :
                        employeeInfo.leave_type_id === 6
                        ?
                        <Grid item sm = {12} xs = {12} md = {12} lg = {12}>
                            <Typography sx={{fontSize:matches?'17px':'20px',fontWeight:'lighter',textTransform:'uppercase',textAlign:'center',marginBottom:'20px',color:'#fff', background:'orange',padding:'5px'}}>
                                Available SPL Balance: {SPLBal} DAY/S
                            </Typography>
                        </Grid>
                        :
                        ''
            }
                <Box sx={{display:'flex',flexDirection:matches || matchesMD?'column':'row',justifyContent:'space-around'}}>
                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Date Filed
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {moment(employeeInfo.date_of_filing).format('MMMM DD, YYYY h:mm:ss A')}
                        </Typography>
                    </Grid>
                    <br/>

                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Name
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.fullname}
                        </Typography>
                    </Grid>
                    <br/>
                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Office/Department
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.officedepartment}
                        </Typography>
                    </Grid>
                    <br/>

                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Leave Application Type
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.leave_type_name}
                        </Typography>
                    </Grid>
                    <br/>

                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Leave Details
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.details_name ?employeeInfo.details_name  : ''}
                        </Typography>
                    </Grid>
                    <br/>

                    
                    {employeeInfo.specify_details
                        ?
                        <>
                        <Grid item lg = {2} sm = {12} xs = {12}>
                            <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                Specify Details
                            </Typography>
                            <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                            {employeeInfo.specify_details}
                            </Typography>
                        </Grid>
                        <br/>
                        </>
                        :
                        ''
                    }
                    {
                        employeeInfo.commutation.length !==0
                        ?
                        <>
                        <Grid item lg = {2} sm = {12} xs = {12}>
                            <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                                Commutation
                            </Typography>
                            <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                            {employeeInfo.commutation}
                            </Typography>
                        </Grid>
                        <br/>
                        </>
                        :
                        ''
                    }
                    

                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            No. of {employeeInfo.leave_type_id === 14 || employeeInfo.leave_type_id === 23?'Hours':'Days'} Applied
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.days_hours_applied}
                        </Typography>
                    </Grid>
                    <br/>

                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Inclusive Dates
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.inclusive_dates_text}
                        </Typography>
                    </Grid>
                    <br/>

                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Days with Pay
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.days_with_pay}
                        </Typography>
                    </Grid>
                    <br/>

                    <Grid item lg = {2} sm = {12} xs = {12}>
                        <Typography sx={{fontSize:matches?'14px':'17px',fontWeight:'bold',textTransform:'uppercase'}}>
                            Days without Pay
                        </Typography>
                        <Typography sx = {{fontSize:matches?'12px':'15px',border:'solid 1px #00B2FF',padding:'15px',borderRadius:'5px'}}>
                        {employeeInfo.days_without_pay}
                        </Typography>
                    </Grid>
                </Box>
                {showFileAttachment()}

                <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'15px 0 15px 0'}} id ='request-action'>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Action</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={recommendation}
                        label="Action"
                        onChange={handleRecommendation}
                    >
                        <MenuItem value={'Certified Correct'}>Certified Correct</MenuItem>
                        <MenuItem value={'For Updating'}>For Updating</MenuItem>
                    </Select>
                    </FormControl>
            </Grid>
            </Grid>
            </>
            :
            ''
        :
            <>
            <Grid item xs={12} sm={12} md={12} lg={12}>
            <PreviewLeaveApplicationForm data={typeOfLeaveData} auth_info = {authInfo} leaveType = {employeeInfo.leave_type_id} info={employeeInfo} pendinginfo={employeeInfo} applied_days = {employeeInfo.days_hours_applied} leaveDetails = {employeeInfo.details_of_leave_id} specifyDetails = {employeeInfo.specify_details} inclusiveDates = {employeeInfo.inclusive_dates_text} balance = {
            employeeInfo.leave_type_id === 1 || employeeInfo.leave_type_id === 2 || employeeInfo.leave_type_id === 6
            ?
                employeeInfo.vl_bal
            :
                employeeInfo.leave_type_id === 3
                ?
                employeeInfo.sl_bal
                :
                    employeeInfo.leave_type_id === 14 || employeeInfo.leave_type_id === 23
                    ?
                    employeeInfo.coc_bal
                    :
                    0
            } vl = {employeeInfo.vl_bal} sl = {employeeInfo.sl_bal} coc = {employeeInfo.coc_bal} office_head = {officeHead} office_ao = {aoAssign} commutation = {employeeInfo.commutation} is_preview={true} maternity_days = {employeeInfo.days_hours_applied}/>
            </Grid>
            {showFileAttachment()}

            <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'0 15px 15px 15px'}} id ='request-action'>
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