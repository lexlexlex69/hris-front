import React, { useEffect,useState } from 'react'
import './Preview.css';
import moment from 'moment';
import { Grid, Typography,Box, IconButton, Tooltip} from '@mui/material';
import Logo from '../../../.././assets/img/bl.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import {red} from '@mui/material/colors';
import { autoCapitalizeFirstLetter, formatLeavePosition } from '../../customstring/CustomString';

export const PreviewLeaveApplication = React.forwardRef((props,ref)=>{
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const date = moment(new Date()).format('MMMM DD, YYYY')
    useEffect(()=>{
        console.log(props.applied_days)
        // console.log(props)
        // console.log(autoCapitalizeFirstLetter(props.info.officeassign))
    },[])
    const formatCreditAvailableDecimal = (leaveBalance,appliedDays) => {
        let tens = [10,100,1000,10000,100000];
        let b1 = leaveBalance.toString().split('.');
        let b1_max = 0;
        if(b1.length===2){
            b1_max=b1[1].length
        }
        let tens_mult = tens[b1_max-1];
        let b1_fin = Math.floor(leaveBalance*tens_mult);
        let b2 = appliedDays*tens_mult;
        if(appliedDays>leaveBalance){
            let b1_fin2 = Math.floor(leaveBalance) * tens_mult;
            let comp = (b1_fin - b1_fin2 ) / tens_mult
            return comp;
        }else{
            let comp = (b1_fin - b2 ) / tens_mult
            return comp;
        }
    }
    const formatDayWithPay = ()=>{
        if(props.leaveType === 10){
            if(props.applied_days>=30){
                return 30;
            }else{
                return props.applied_days;
            }
        }else{
            return props.applied_days;
        }
    }
    const formatDayWithOutPay = ()=>{
        if(props.leaveType === 10){
            if(props.applied_days>=30){
                if(props.applied_days-30 === 0){
                    return null
                }else{
                    return props.applied_days-30;
                }
            }else{
                return null;
            }
        }else{
            return props.applied_days;
        }
    }
    const [scale, setScale] = useState(1);

    const handleDecrease = (e) => {
        e.preventDefault();
        const newScale = Math.max(scale-0.1, Math.min(scale* 0.01, 10));
        console.log(newScale)
        if(newScale>=.3){
            setScale(newScale);
        }
    };
    const handleIncrease = (e)=>{
        e.preventDefault();
        const newScale = Math.max(scale+0.1, Math.min(scale * 0.01, 10));
        console.log(newScale)
        if(newScale<=1){
            setScale(newScale);
        }
    }
    const formatPos = (val)=>{
        if(val){
            if(val.includes('(')){
                var t_arr = val.split('(');
                return <span>{t_arr[0]} <br/> ({t_arr[1]}</span>;
            }else{
                return val;
            }
        }else{
            return val;
        }
        
    }
    const formatExtName = (val)=>{
        var ext_names = ['JR.','JR','SR','SR.','I','II','III','IV','V','VI','VII','VIII'];
        if(val){
            if(ext_names.includes(val.toUpperCase())){
                return ', '+val;
            }else{
                return null
            }
        }
        return null
        
    }
    const formatExtName2 = (val)=>{
        var ext_names = ['JR.','JR','SR','SR.','I','II','III','IV','V','VI','VII','VIII'];
        if(val){
            if(ext_names.includes(val.toUpperCase())){
                return ' '+val;
            }else{
                return null
            }
        }
        return null
        
    }
    return(
        <div ref={ref} id="preview">
            {
                props.previewType === 'applicant'
                ?
                matches
                ?
                <div>
                    <div style={{position:'fixed',zIndex:10,width:'300px',top:47}}>
                        <Box sx={{position:'sticky',top:0,left:0,zIndex:10,display:'flex',justifyContent:'flex-end'}}>
                            <Tooltip title='Zoom In'><IconButton onClick={handleIncrease} color='primary'><ZoomInIcon/></IconButton></Tooltip>
                            <Tooltip title='Zoom Out'><IconButton onClick={handleDecrease} color='primary'><ZoomOutIcon/></IconButton></Tooltip>
                        </Box>
                    </div>

                    <Box sx={{width:'900px',transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                    <div className='center'>
                        <h3 style = {{fontSize:'19px',fontWeight:'bold'}}>APPLICATION FOR LEAVE</h3>
                    </div>
                    <div className='print'>
                    <Grid container sx={{border:'solid 1px'}}>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px'}}>
                            <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                <h5 style={{fontSize:'12px'}}>
                                    1. OFFICE/DEPARTMENT  <br/>
                                    <span style={{fontWeight:'bold'}}>{autoCapitalizeFirstLetter(props.info.officeassign)}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    2. NAME :
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (LAST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.lname}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (FIRST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.fname}{formatExtName(props.info.extname)}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    (MIDDLE) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                                </h5>
                                
                                
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px',borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Box sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    3. DATE OF FILING &nbsp;
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{date}</span>
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    4. POSITION &nbsp;
                                    {formatLeavePosition(props.info.designation)}
                                    {/* <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{props.info.designation}</span> */}
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    5. SALARY &nbsp;
                                    {props.info.monthly_salary
                                    ?
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>&#8369; {(props.info.monthly_salary/12).toLocaleString()}.00</span>
                                    :
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>N/A</span>
                                        
                                    }
                                    
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                6. DETAILS OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={7} md={7} lg ={7}  sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx = {{fontSize:'12px'}}>
                                6.A TYPE OF LEAVE TO BE AVAILED OF
                            </Typography>
                            {props.data.map((data,key)=>
                                <div  key = {key}>
                                    {data.leave_type_id === 15 || data.leave_type_id === 14
                                    ?
                                    ''
                                    :
                                    <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === data.leave_type_id  ? true:false} readOnly/>&nbsp;{data.leave_type_name} <small className='label-desc'>{data.leave_desc}</small>
                                    </label>
                                    }
                                    
                                </div>
                                )}
                                <br/>
                            <Grid item xs={10}>
                                <Typography sx = {{fontSize:'12px'}}>
                                    <em>Others:</em>
                                </Typography>
                                <Typography sx = {{paddingLeft:'10px',fontWeight:'bold',fontSize:'12px',borderBottom:'solid 1px',marginBottom:'10px',paddingBottom:'5px'}}>
                                    {
                                    props.leaveType === 15
                                    ?
                                    props.specifyDetails
                                    :
                                    ''
                                    }
                                </Typography>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={5} md={5} lg ={5} sx ={{borderTop:'solid 1px',padding:'0 10px 0 10px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.B DETAILS OF LEAVE </Typography>
                                <em className='info-header'>In case of Vacation/Special Privilege Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11 || props.leaveDetails === 17?true:false :false} readOnly/> &nbsp;Within the Philippines &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11 || props.leaveDetails === 17
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>____________________</span>
                                        :
                                        <span>____________________</span>
                                    :
                                    <span>____________________</span>
                                    }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12 || props.leaveDetails === 18?true:false :false} readOnly/> &nbsp;Abroad (Specify) &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12 || props.leaveDetails === 18
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>_________________________</span>
                                        :
                                        <span>_________________________</span>
                                    :
                                    <span>_________________________</span>


                                }
                                </label>
                                <br/>
                                
                                <em className='info-header'>In case of Sick Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 5?true:false :false} readOnly/> &nbsp;In Hospital (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 5
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>________________</span>
                                        :
                                        <span>________________</span>
                                    :
                                    <span>________________</span>


                                }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 6?true:false :false} readOnly/> &nbsp;Out Patient (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 6
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                        <span>________________<br/>___________________________________________</span>
                                        :
                                        <span>________________<br/>___________________________________________</span>
                                    :
                                    <span>________________<br/>___________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Special Leave Benefits for Women:</em><br/>
                                <label className='label'>
                                    (Specify Illness) {
                                    props.leaveType === 11
                                    ?
                                        props.specifyDetails !== ''
                                        ?
                                        <u>_{props.specifyDetails}_</u>
                                        :
                                        <span>_________________________________________</span>
                                    :
                                    <span>_________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Study Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 8 ? props.leaveDetails === 7?true:false :false} readOnly/> &nbsp;Completion of Master's Degree
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox"  checked = {props.leaveType === 8 ? props.leaveDetails === 8?true:false :false} readOnly/> &nbsp;BAR/Board Examination Review
                                </label>
                                <br/>

                                <em className='info-header'>Other purpose:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 9?true:false :false} readOnly/> &nbsp;Monetization of Leave Credits
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 10?true:false :false} readOnly/> &nbsp;Terminal Leave
                                </label>
                        </Grid>
                        <Grid item xs = {7}  md={7} lg ={7} sx={{borderTop:'solid 1px',borderRight:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    6.C NUMBER OF WORKING DAYS APPLIED FOR
                                </Typography>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.leaveType === 4 ? props.maternity_days : props.applied_days} {props.applied_days>1?' days':' day'}</strong>
                                    </Typography>
                                </Grid>
                                
                                <br/>
                                <h5 className='info-header'>INCLUSIVE DATES</h5>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.inclusiveDates}</strong>
                                    </Typography>
                                </Grid>
                                
                        </Grid>
                        <Grid item xs = {5}  md={5} lg ={5} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.D COMMUTATION</Typography>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Not Requested'?true:false} readOnly/> &nbsp;Not Requested
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Requested'?true:false} readOnly/> &nbsp;Requested
                                </label>
                                <br/>
                                <div className='center'>
                                    <span style={{fontSize:'9px'}}>_________________________________</span>
                                    {/* <span style={{fontSize:'11px'}}><u>&nbsp;&nbsp;&nbsp;<strong>{props.info.fname} {props.info.mname?props.info.mname.charAt(0)+'. ':' '} {props.info.lname} {formatExtName2(props.info.extname)}</strong>&nbsp;&nbsp;&nbsp;</u></span> */}
                                    <br/>
                                    <span className='info-header'>Signature of Applicant</span>
                                </div>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                7. DETAILS OF ACTION OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={7}  md={7} lg ={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.A CERTIFICATION OF LEAVE CREDITS
                            </Typography>
                            <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                                As of <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{moment().subtract(1,'months').format('MMMM YYYY')}</span>
                            </Typography>
                            <table style={{border: '1px solid',width:'100%',fontSize:'9px'}}>
                                    <thead>
                                        <tr >
                                        <th>
                                        
                                        </th>
                                        <th style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Vacation Leave
                                        </th>
                                        <th  style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Sick Leave
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Total Earned</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                                {
                                                props.leaveType === 15
                                                ?
                                                (props.availableVL).toFixed(3)
                                                :
                                                props.leaveType ===1 || props.leaveType ===2
                                                ?
                                                (parseFloat(props.balance)).toFixed(3)
                                                :
                                                (props.availableVL).toFixed(3)
                                                }
                                                </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                (props.availableSL).toFixed(3)
                                                :
                                                props.leaveType === 3
                                                ?
                                                    (parseFloat(props.balance)).toFixed(3)
                                                :
                                                (props.availableSL).toFixed(3)
                                                }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Less this Application</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?   
                                                    props.leaveDetails === 9
                                                    ?
                                                    (props.totalVL).toFixed(3)
                                                    :
                                                    (props.availableVL).toFixed(3)
                                                :
                                                props.leaveType === 1 || props.leaveType === 2
                                                ?   
                                                    props.applied_days>Math.floor(props.balance) ?props.balance >=.5?props.vlWpay:(Math.floor(props.balance)).toFixed(3):(props.applied_days).toFixed(3)
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.borrowedVLCredits>(0).toFixed(3)?props.borrowedVLCredits&&(props.borrowedVLCredits).toFixed(3):''
                                                :
                                                ''
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.leaveType === 15
                                            ?
                                                props.leaveDetails === 9
                                                ?
                                                (props.totalSL).toFixed(3)
                                                :
                                                (props.availableSL).toFixed(3)
                                            :
                                            props.leaveType === 3
                                            ?
                                                props.balance <=0
                                                ?
                                                ''
                                                :
                                                props.applied_days-props.slAutoWithoutPay>props.balance
                                                ?
                                                (props.balance).toFixed(3)
                                                :
                                                (props.applied_days-props.slAutoWithoutPay).toFixed(3)
                                            :
                                            ''
                                            }

                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Balance</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                    props.leaveDetails === 9
                                                    ?
                                                    (props.availableVL-props.totalVL).toFixed(3)
                                                    :
                                                    (props.availableVL-props.availableVL).toFixed(3)
                                                :
                                                props.leaveType === 1 || props.leaveType === 2
                                                ?
                                                    props.applied_days>props.balance
                                                    ?
                                                        props.balance>=.5
                                                        ?
                                                        (formatCreditAvailableDecimal(props.balance,props.vlWpay)).toFixed(3)
                                                        :
                                                        (formatCreditAvailableDecimal(props.balance,Math.floor(props.balance))).toFixed(3)
                                                    :
                                                    formatCreditAvailableDecimal(props.balance,props.applied_days)
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.borrowedVLCredits>0?(props.availableVL-props.borrowedVLCredits).toFixed(3):''
                                                :
                                                ''
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                    props.leaveDetails === 9
                                                    ?
                                                    (formatCreditAvailableDecimal(props.availableSL,Math.floor(props.totalSL))).toFixed(3)
                                                    :
                                                    (props.availableSL-props.availableSL).toFixed(3)
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.balance <=0
                                                    ?
                                                    ''
                                                    :
                                                    props.applied_days-props.slAutoWithoutPay>props.balance
                                                    ?
                                                        props.borrowedVLCredits>0
                                                        ?
                                                          (props.balance-props.usedSL).toFixed(3) 
                                                        :
                                                        (formatCreditAvailableDecimal(props.balance,Math.floor(props.balance))).toFixed(3)
                                                    :
                                                    (formatCreditAvailableDecimal(props.balance,(props.applied_days-props.slAutoWithoutPay))).toFixed(3)
                                                :
                                                ''
                                            }
                                            </td>
                                        </tr>
                                    </tbody>
                                    
                                </table>
                                <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_ao.office_ao?props.office_ao.office_ao.toUpperCase():''}</u></h5>
                                <h5 className='center' style ={{fontSize:'9px'}}>{formatPos(props.office_ao.office_ao_assign)} <br/>
                                ____________________________________________________ <br/>
                                <strong>(Authorized Officer)</strong>
                                </h5>
                        </Grid>
                        <Grid item xs={5}  md={5} lg ={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.B RECOMMENDATION
                            </Typography>
                            <label className='label'>
                                    <input type = "checkbox" checked = {props.info.status === 'FOR APPROVAL'? true:false} readOnly/> &nbsp;For Approval
                            </label>
                            <br/>
                            <label className='label'>
                                <input type = "checkbox" checked = {props.info.status === 'DISAPPROVED' ? true:false} readOnly/> &nbsp;For Disapproval due to <br/>
                                <u>{props.disapproval}</u>
                            
                            </label>
                            <p style = {{paddingLeft:'15px',lineHeight:'15px'}}>
                                ____________________________<br/>
                                ____________________________<br/>
                                ____________________________<br/>
                            </p>
                            <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_head.office_head?props.office_head.office_head.toUpperCase():''}</u></h5>
                            <h5 className='center' style ={{fontSize:'9px'}}>{formatPos(props.office_head.office_head_pos)} <br/>
                            _______________________________________________________<br/>
                            <strong>(Authorized Officer)</strong>
                            </h5>

                        </Grid>

                        <Grid item xs={7}  md={7} lg ={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.C APPROVED FOR:
                                </Typography>
                                <Grid item xs = {12}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                
                                {
                                    props.leaveType === 4
                                    ?
                                    <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                :'center'}}>{props.maternity_days}</p>
                                    :
                                        props.leaveType === 1 || props.leaveType === 2
                                        ?
                                            props.applied_days > props.balance
                                            ?   
                                                props.balance>=.5
                                                ?
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{parseFloat(props.vlWpay).toFixed(2)}</p>
                                                :
                                                props.balance === 0
                                                ?
                                                <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                :'center'}}></p>
                                                :
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{Math.floor(props.balance).toFixed(2)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                            :'center'}}>{props.applied_days}</p>
                                        :
                                            props.leaveType === 3
                                            ?
                                                props.applied_days > props.balance
                                                ?
                                                    props.balance === 0
                                                    ?
                                                        props.vlWpay>0
                                                        ?
                                                        <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                    :'center'}}>{parseFloat(props.vlWpay).toFixed(2)}</p>
                                                        :
                                                        <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                    :'center'}}></p>
                                                    :
                                                    props.borrowedVLCredits>0
                                                    ?
                                                        <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                        :'center'}}>{parseFloat(props.applied_days-props.slAutoWithoutPay).toFixed(2)}</p>
                                                    :
                                                    <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                    :'center'}}>{Math.floor(props.balance).toFixed(2)}</p>
                                                :
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{parseFloat(props.applied_days-props.slAutoWithoutPay).toFixed(2)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                        :'center'}}>
                                        {formatDayWithPay()}
                                        </p>
                                    }
                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;days with pay</p>
                                </Grid>
                                </Box>

                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                {
                                    props.leaveType === 1 || props.leaveType === 2
                                    ?
                                    props.applied_days > props.balance
                                        ?
                                        props.balance>=.5
                                        ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{props.applied_days-props.vlWpay}</p>
                                        :
                                        <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{props.applied_days-Math.floor(props.balance)}</p>
                                        :
                                        <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                    :
                                        props.leaveType === 3
                                        ?
                                            props.slTotalWithoutPay !== 0
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                    :'center'}}>{props.slTotalWithoutPay}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                        :
                                        props.leaveType === 10
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}>{formatDayWithOutPay()}</p>
                                        :
                                        <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                }

                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;days without pay</p>
                                </Grid>
                                </Box>
                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'5px',textAlign:'center'}}></p>

                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;others (Specify)</p>
                                </Grid>
                                </Box>

                                </Grid>

                        </Grid>
                        <Grid item xs={5} md={5} lg ={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.D DISAPPROVED DUE TO: <br/>
                                </Typography>
                                <p style={{lineHeight:'15px',paddingLeft:'15px'}}>_____________________________<br/>
                                _____________________________<br/>
                                _____________________________</p>
                        </Grid>
                        <Grid item xs={12}>
                                <Typography sx={{textAlign:'center',fontSize:'12px',fontWeight:'600'}}>
                                    <u>{props.auth_info[0].auth_name.toUpperCase()}</u><br/>
                                    {props.auth_info[0].auth_pos}

                                </Typography>
                        </Grid>
                    </Grid>
                    </div>
                    </Box>  
                </div>
                :
                <>
                    <div className='center'>
                        <h3 style = {{fontSize:'19px',fontWeight:'bold'}}>APPLICATION FOR LEAVE</h3>
                    </div>
                    <div className='print'>
                    <Grid container sx={{border:'solid 1px'}}>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px'}}>
                            <Box sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                                <h5 style={{fontSize:'12px'}}>
                                    1. OFFICE/DEPARTMENT  <br/>
                                    <span style={{fontWeight:'bold'}}>{autoCapitalizeFirstLetter(props.info.officeassign)}</span>
                                </h5>
                                {
                                    matches
                                    ?
                                    <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                    <h5 style={{fontSize:'12px'}}>
                                        2. NAME :
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (LAST) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.lname}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (FIRST) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.fname}{formatExtName(props.info.extname)}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (MIDDLE) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                                    </h5>
                                </Box>
                                    
                                    :
                                    <>
                                    <h5 style={{fontSize:'12px'}}>
                                        2. NAME :
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (LAST) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.lname}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (FIRST) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.fname}{formatExtName(props.info.extname)}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (MIDDLE) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                                    </h5>
                                    </>

                                }
                                
                                
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px',borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Box sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    3. DATE OF FILING &nbsp;
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{date}</span>
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    4. POSITION &nbsp;
                                    {formatLeavePosition(props.info.designation)}
                                    {/* <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{props.info.designation}</span> */}
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    5. SALARY &nbsp;
                                    {props.info.monthly_salary
                                    ?
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>&#8369; {(props.info.monthly_salary/12).toLocaleString()}.00</span>
                                    :
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>N/A</span>
                                        
                                    }
                                    
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                6. DETAILS OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={7} lg ={7}  sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx = {{fontSize:'12px'}}>
                                6.A TYPE OF LEAVE TO BE AVAILED OF
                            </Typography>
                            {props.data.map((data,key)=>
                                <div  key = {key}>
                                    {data.leave_type_id === 15 || data.leave_type_id === 14
                                    ?
                                    ''
                                    :
                                    <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === data.leave_type_id  ? true:false} readOnly/>&nbsp;{data.leave_type_name} <small className='label-desc'>{data.leave_desc}</small>
                                    </label>
                                    }
                                    
                                </div>
                                )}
                                <br/>
                            <Grid item xs={10}>
                                <Typography sx = {{fontSize:'12px'}}>
                                    <em>Others:</em>
                                </Typography>
                                <Typography sx = {{paddingLeft:'10px',fontWeight:'bold',fontSize:'12px',borderBottom:'solid 1px',marginBottom:'10px',paddingBottom:'5px'}}>
                                    {
                                    props.leaveType === 15
                                    ?
                                    props.specifyDetails
                                    :
                                    ''
                                    }
                                </Typography>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={12} md={5} lg ={5} sx ={{borderTop:'solid 1px',padding:'0 10px 0 10px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.B DETAILS OF LEAVE </Typography>
                                <em className='info-header'>In case of Vacation/Special Privilege Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11 || props.leaveDetails === 17?true:false :false} readOnly/> &nbsp;Within the Philippines &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 11 || props.leaveDetails === 17
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>____________________</span>
                                        :
                                        <span>____________________</span>
                                    :
                                    <span>____________________</span>
                                    }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12 || props.leaveDetails === 18?true:false :false} readOnly/> &nbsp;Abroad (Specify) &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12 || props.leaveDetails === 18
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>_________________________</span>
                                        :
                                        <span>_________________________</span>
                                    :
                                    <span>_________________________</span>


                                }
                                </label>
                                <br/>
                                
                                <em className='info-header'>In case of Sick Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 5?true:false :false} readOnly/> &nbsp;In Hospital (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 5
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>________________</span>
                                        :
                                        <span>________________</span>
                                    :
                                    <span>________________</span>


                                }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 6?true:false :false} readOnly/> &nbsp;Out Patient (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 6
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                        <span>________________<br/>___________________________________________</span>
                                        :
                                        <span>________________<br/>___________________________________________</span>
                                    :
                                    <span>________________<br/>___________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Special Leave Benefits for Women:</em><br/>
                                <label className='label'>
                                    (Specify Illness) {
                                    props.leaveType === 11
                                    ?
                                        props.specifyDetails !== ''
                                        ?
                                        <u>_{props.specifyDetails}_</u>
                                        :
                                        <span>_________________________________________</span>
                                    :
                                    <span>_________________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Study Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 8 ? props.leaveDetails === 7?true:false :false} readOnly/> &nbsp;Completion of Master's Degree
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox"  checked = {props.leaveType === 8 ? props.leaveDetails === 8?true:false :false} readOnly/> &nbsp;BAR/Board Examination Review
                                </label>
                                <br/>

                                <em className='info-header'>Other purpose:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 9?true:false :false} readOnly/> &nbsp;Monetization of Leave Credits
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 10?true:false :false} readOnly/> &nbsp;Terminal Leave
                                </label>
                        </Grid>
                        <Grid item xs = {12}  md={7} lg ={7} sx={{borderTop:'solid 1px',borderRight:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    6.C NUMBER OF WORKING DAYS APPLIED FOR
                                </Typography>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.leaveType === 4 ? props.maternity_days : props.applied_days} {props.applied_days>1?' days':' day'}</strong>
                                    </Typography>
                                </Grid>
                                
                                <br/>
                                <h5 className='info-header'>INCLUSIVE DATES</h5>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.inclusiveDates}</strong>
                                    </Typography>
                                </Grid>
                                
                        </Grid>
                        <Grid item xs = {12}  md={5} lg ={5} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.D COMMUTATION</Typography>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Not Requested'?true:false} readOnly/> &nbsp;Not Requested
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Requested'?true:false} readOnly/> &nbsp;Requested
                                </label>
                                <br/>
                                <div className='center'>
                                    <span style={{fontSize:'9px'}}>_________________________________</span>
                                    {/* <span style={{fontSize:'11px'}}><u>&nbsp;&nbsp;&nbsp;<strong>{props.info.fname} {props.info.mname?props.info.mname.charAt(0)+'. ':' '} {props.info.lname} {formatExtName2(props.info.extname)}</strong>&nbsp;&nbsp;&nbsp;</u></span> */}

                                    <br/>
                                    <span className='info-header'>Signature of Applicant</span>
                                </div>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                7. DETAILS OF ACTION OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={12}  md={7} lg ={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                {/* Preview application on applying */}
                                7.A CERTIFICATION OF LEAVE CREDITS
                            </Typography>
                            <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                                As of <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{moment().subtract(1,'months').format('MMMM YYYY')}</span>
                            </Typography>
                            <Box sx={{display:'flex',justifyContentL:'space-between'}}>
                            <table style={{border: '1px solid',width:'90%',fontSize:'9px'}}>
                                    <thead>
                                        <tr >
                                        <th>
                                        
                                        </th>
                                        <th style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Vacation Leave
                                        </th>
                                        <th  style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Sick Leave
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Total Earned</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                                {
                                                props.leaveType === 15
                                                ?
                                                props.availableVL&&(props.availableVL).toFixed(3)
                                                :
                                                props.leaveType ===1 || props.leaveType ===2
                                                ?
                                                props.balance&&parseFloat(props.balance).toFixed(3)
                                                :
                                                props.availableVL&&(props.availableVL).toFixed(3)
                                                }
                                                </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                (props.availableSL.toFixed(3))
                                                :
                                                props.leaveType === 3
                                                ?
                                                    (parseFloat(props.balance)).toFixed(3)
                                                :
                                                (props.availableSL).toFixed(3)
                                                }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Less this Application</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?   
                                                    props.leaveDetails === 9
                                                    ?
                                                    props.totalVL&&(props.totalVL).toFixed(3)
                                                    :
                                                    props.availableVL&&(props.availableVL).toFixed(3)
                                                :
                                                props.leaveType === 1 || props.leaveType === 2
                                                ?   
                                                    // props.applied_days>Math.floor(props.balance)
                                                    // ?
                                                    //     props.balance >=.5
                                                    //     ?
                                                    //     props.vlWpay&&(props.vlWpay).toFixed(3)
                                                    //     :
                                                    //     props.vlWpay&&(Math.floor(props.balance)).toFixed(3)
                                                    // :(props.vlCreditsWpay).toFixed(3)
                                                    (props.vlCreditsWpay).toFixed(3)
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.borrowedVLCredits>0?parseFloat(props.borrowedVLCredits).toFixed(3):0
                                                :
                                                0
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.leaveType === 15
                                            ?
                                                props.leaveDetails === 9
                                                ?
                                                props.totalSL&&(props.totalSL).toFixed(3)
                                                :
                                                props.availableSL&&(props.availableSL).toFixed(3)
                                            :
                                            props.leaveType === 3
                                            ?
                                                props.balance <=0
                                                ?
                                                0
                                                :
                                                props.usedSL>props.balance
                                                ?
                                                    props.borrowedVLCredits>0
                                                    ?
                                                    parseFloat(props.balance).toFixed(3)
                                                    :
                                                    0
                                                :
                                                (props.slCreditsWpay).toFixed(3)
                                            :
                                            0
                                            }

                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Balance</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                    props.leaveDetails === 9
                                                    ?
                                                    (props.availableVL-props.totalVL).toFixed(3)
                                                    :
                                                    (props.availableVL-props.availableVL).toFixed(3)
                                                :
                                                props.leaveType === 1 || props.leaveType === 2
                                                ?
                                                    (props.balance-props.vlCreditsWpay).toFixed(3)
                                                    // (formatCreditAvailableDecimal(props.balance,props.vlCreditsWpay)).toFixed(3)
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.borrowedVLCredits>0?props.borrowedVLCredits&&(props.availableVL-props.borrowedVLCredits).toFixed(3)
                                                    :
                                                    parseFloat(props.availableVL).toFixed(3)
                                                :
                                                parseFloat(props.availableVL).toFixed(3)
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.leaveType === 15
                                                ?
                                                    props.leaveDetails === 9
                                                    ?
                                                    props.availableSL-props.totalSL
                                                    :
                                                    props.availableSL-props.availableSL
                                                :
                                                props.leaveType === 3
                                                ?
                                                    props.usedSL>props.balance
                                                    ?
                                                        props.borrowedVLCredits>0
                                                        ?
                                                        0
                                                        :
                                                        props.balance.toFixed(3)
                                                    :
                                                    (props.balance-props.slCreditsWpay).toFixed(3)
                                                :
                                                props.availableSL.toFixed(3)
                                            }
                                            </td>
                                        </tr>
                                    </tbody>
                                    
                                </table>
                                {
                                    props.leaveType === 6
                                    ?
                                    <table style={{borderStyle: 'none',fontSize:'9px',marginLeft:'5px',textAlign:'right'}}>
                                        <thead>
                                        <tr>
                                            <td>
                                                SLP
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>
                                                {props.applicableDays}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                {props.applied_days}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                {props.applicableDays-props.applied_days}
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    props.leaveType === 7
                                    ?
                                    <table style={{borderStyle: 'none',fontSize:'9px',marginLeft:'5px',textAlign:'right'}}>
                                        <thead>
                                        <tr>
                                            <td>
                                                Solo Parent
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>
                                                {props.applicableDays}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                {props.applied_days}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                {props.applicableDays-props.applied_days}
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    null

                                }
                                {
                                    props.leaveType === 5
                                    ?
                                   
                                    <table style={{borderStyle: 'none',fontSize:'9px',marginLeft:'5px',textAlign:'right',fontWeight:'bold'}}>
                                        <thead>
                                        <tr>
                                            <td>
                                                Paternity
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>
                                                {props.applicableDays}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                {props.applied_days}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                {props.applicableDays-props.applied_days}
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    null

                                }

                                </Box>
                                <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_ao.office_ao?props.office_ao.office_ao.toUpperCase():''}</u></h5>
                                <h5 className='center' style ={{fontSize:'9px'}}>{formatPos(props.office_ao.office_ao_assign)}
                                <br/>
                                ____________________________________________________ <br/>
                                <strong>(Authorized Officer)</strong>
                                </h5>
                        </Grid>
                        <Grid item xs={12}  md={5} lg ={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.B RECOMMENDATION
                            </Typography>
                            <label className='label'>
                                    <input type = "checkbox" checked = {props.info.status === 'FOR APPROVAL'? true:false} readOnly/> &nbsp;For Approval
                            </label>
                            <br/>
                            <label className='label'>
                                <input type = "checkbox" checked = {props.info.status === 'DISAPPROVED' ? true:false} readOnly/> &nbsp;For Disapproval due to <br/>
                                <u>{props.disapproval}</u>
                            
                            </label>
                            <p style = {{paddingLeft:'15px',lineHeight:'15px'}}>
                                ____________________________<br/>
                                ____________________________<br/>
                                ____________________________<br/>
                            </p>
                            <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_head.office_head?props.office_head.office_head.toUpperCase():''}</u></h5>
                            <h5 className='center' style ={{fontSize:'9px'}}>{formatPos(props.office_head.office_head_pos)} <br/>
                            _______________________________________________________<br/>
                            <strong>(Authorized Officer)</strong>
                            </h5>

                        </Grid>

                        <Grid item xs={12}  md={7} lg ={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.C APPROVED FOR:
                                </Typography>
                                <Grid item xs = {12}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                
                                {
                                    props.leaveType === 4
                                    ?
                                    <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                :'center'}}>{props.maternity_days}</p>
                                    :
                                        props.leaveType === 1 || props.leaveType === 2
                                        ?
                                            props.applied_days > props.balance
                                            ?   
                                                props.balance>0
                                                ?
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{parseFloat(props.vlWpay).toFixed(2)}</p>
                                                :
                                                props.balance === 0
                                                ?
                                                <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                :'center'}}></p>
                                                :
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{Math.floor(props.balance)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                            :'center'}}>{(props.applied_days).toFixed(2)}</p>
                                        :
                                            props.leaveType === 3
                                            ?
                                                // props.applied_days > props.balance
                                                // ?
                                                //     props.balance === 0
                                                //     ?
                                                //         props.vlWpay>0
                                                //         ?
                                                //         <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                //     :'center'}}>{parseFloat(props.vlWpay).toFixed(2)}</p>
                                                //         :
                                                //         <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign
                                                //     :'center'}}></p>
                                                //     :
                                                //     props.borrowedVLCredits>0
                                                //     ?
                                                //         <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                //         :'center'}}>{(props.applied_days-props.slAutoWithoutPay).toFixed(2)}</p>
                                                //     :
                                                //     <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                //     :'center'}}>{Math.floor(props.balance).toFixed(2)}</p>
                                                // :
                                                // <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                // // :'center'}}>{(props.applied_days-props.slAutoWithoutPay).toFixed(2)}</p>
                                                // :'center'}}>{props.usedSL>0?(props.usedSL).toFixed(2):<>&nbsp;</>}</p>
                                                <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                    :'center'}}>{(props.usedSL+props.borrowedVLCredits).toFixed(2)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                        :'center'}}>
                                        {formatDayWithPay()}
                                        </p>
                                    }
                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;days with pay</p>
                                </Grid>
                                </Box>

                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                {
                                    props.leaveType === 1 || props.leaveType === 2
                                    ?
                                    props.applied_days > props.balance
                                        ?
                                        props.balance>0
                                        ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{(props.applied_days-props.vlWpay).toFixed(2)}</p>
                                        :
                                        <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                :'center'}}>{props.applied_days-Math.floor(props.balance)}</p>
                                        :
                                        <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                    :
                                        props.leaveType === 3
                                        ?
                                            props.slTotalWithoutPay !== 0
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                                    :'center'}}>{parseFloat(props.slTotalWithoutPay).toFixed(2)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                        :
                                        props.leaveType === 10
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}>{formatDayWithOutPay()}</p>
                                        :
                                        <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                }

                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;days without pay</p>
                                </Grid>
                                </Box>
                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                <Box sx={{display:'flex',flexDirection:'row'}}>
                                <Grid item xs = {3}>
                                <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'5px',textAlign:'center'}}></p>

                                </Grid>

                                <Grid item xs = {9}>
                                <p className='info-header'>&nbsp;others (Specify)</p>
                                </Grid>
                                </Box>

                                </Grid>

                        </Grid>
                        <Grid item xs={12} md={5} lg ={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.D DISAPPROVED DUE TO: <br/>
                                </Typography>
                                <p style={{lineHeight:'15px',paddingLeft:'15px'}}>_____________________________<br/>
                                _____________________________<br/>
                                _____________________________</p>
                        </Grid>
                        <Grid item xs={12} sx={{position:'relative'}}>
                                
                                <Typography sx={{textAlign:'center',fontSize:'12px',fontWeight:'600'}}>
                                    <u>{props.auth_info[0].auth_name.toUpperCase()}</u><br/>
                                    {props.auth_info[0].auth_pos}
                                </Typography>
                                
                                
                                {
                                    props.isLateFiling
                                    ?
                                    <Box className='stamp-style-div'>
                                        <Typography sx={{color:red[800]}} className='stamp-style'>LATE FILING</Typography>
                                        <Typography sx={{color:red[800],marginTop:'-15px'}} className='stamp-style2'>Date:</Typography>
                                        <Typography sx={{color:red[800],marginTop:'-9px'}} className='stamp-style2'>Received:</Typography>
                                    </Box>
                                    :
                                    null
                                }
                        </Grid>
                        
                    </Grid>
                    </div>   
                </>
                :
                <>
                    <div className='center'>
                        <h3 style = {{fontSize:'19px',fontWeight:'bold'}}>APPLICATION FOR LEAVE</h3>
                    </div>
                    <div className='print'>
                    <Grid container sx={{border:'solid 1px'}}>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px'}}>
                            <Box sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                                <h5 style={{fontSize:'12px'}}>
                                    1. OFFICE/DEPARTMENT  <br/>
                                    <span style={{fontWeight:'bold'}}>{autoCapitalizeFirstLetter(props.info.officeassign)}</span>
                                </h5>
                                <h5 style={{fontSize:'12px'}}>
                                    2. NAME :
                                </h5>
                                {
                                    matches
                                    ?
                                    <Box sx = {{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                        <h5 style={{fontSize:'12px'}}>
                                    (LAST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.lname}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (FIRST) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.fname}{formatExtName(props.info.extname)}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (MIDDLE) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                                    </h5>
                                    </Box>
                                    :
                                    <>
                                    <h5 style={{fontSize:'12px'}}>
                                    (LAST) <br/>
                                    <span style={{fontWeight:'bold'}}>{props.info.lname}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (FIRST) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.fname}{formatExtName(props.info.extname)}</span>
                                    </h5>
                                    <h5 style={{fontSize:'12px'}}>
                                        (MIDDLE) <br/>
                                        <span style={{fontWeight:'bold'}}>{props.info.mname}</span>
                                    </h5>
                                    </>
                                }
                                
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{padding:'5px 10px 5px 10px',borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Box sx = {{display:'flex',flexDirection:matches?'column':'row',justifyContent:'space-between'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    3. DATE OF FILING &nbsp;
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{moment(props.pendinginfo.date_of_filing).format('MMMM DD, YYYY')}</span>
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    4. POSITION &nbsp;
                                    {formatLeavePosition(props.info.designation)}
                                    {/* <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{props.info.designation}</span> */}
                                </Typography>
                                <Typography sx={{fontSize:'12px'}}>
                                    5. SALARY &nbsp;
                                    {props.info.monthly_salary
                                    ?
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>&#8369; {(props.info.monthly_salary/12).toLocaleString()}.00</span>
                                    :
                                    <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>N/A</span>
                                        
                                    }
                                    
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                6. DETAILS OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={7} lg={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx = {{fontSize:'12px'}}>
                                6.A TYPE OF LEAVE TO BE AVAILED OF
                            </Typography>
                            {props.data.map((data,key)=>
                                <div  key = {key}>
                                    {data.leave_type_id === 15 || data.leave_type_id === 14
                                    ?
                                    ''
                                    :
                                    <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === data.leave_type_id  ? true:false} readOnly/>&nbsp;{data.leave_type_name} <small className='label-desc'>{data.leave_desc}</small>
                                    </label>
                                    }
                                    
                                </div>
                                )}
                                <br/>
                            <Grid item xs={10}>
                                <Typography sx = {{fontSize:'12px'}}>
                                    <em>Others:</em>
                                </Typography>
                                <Typography sx = {{paddingLeft:'10px',fontWeight:'bold',fontSize:'12px',borderBottom:'solid 1px',marginBottom:'10px'}}>
                                    {
                                    props.leaveType === 15
                                    ?
                                    props.specifyDetails
                                    :
                                    ''
                                    }
                                </Typography>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} sx ={{borderTop:'solid 1px',padding:'0 10px 0 10px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.B DETAILS OF LEAVE </Typography>
                                <em className='info-header'>In case of Vacation/Special Privilege Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                    props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 17
                                    ?
                                    true
                                    :false
                                    :false}
                                     readOnly/> &nbsp;Within the Philippines &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 1 || props.leaveDetails === 3 || props.leaveDetails === 17
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>_____________________</span>
                                        :
                                        <span>_____________________</span>
                                    :
                                    <span>_____________________</span>
                                    }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12?true:false :false} readOnly/> &nbsp;Abroad (Specify) &nbsp;{
                                    props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.leaveDetails === 2 || props.leaveDetails === 4 || props.leaveDetails === 12
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>_________________________</span>
                                        :
                                        <span>_________________________</span>
                                    :
                                    <span>_________________________</span>


                                }
                                </label>
                                <br/>
                                
                                <em className='info-header'>In case of Sick Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 5?true:false :false} readOnly/> &nbsp;In Hospital (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 5
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                            <span>_________________</span>
                                        :
                                        <span>_________________</span>
                                    :
                                    <span>_________________</span>


                                }
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 6?true:false :false} readOnly/> &nbsp;Out Patient (Specify Illness) {
                                    props.leaveType === 3
                                    ?
                                        props.leaveDetails === 6
                                        ?
                                            props.specifyDetails !== ''
                                            ?
                                            <u>_{props.specifyDetails}_</u>
                                            :
                                        <span>________________<br/>____________________________________</span>
                                        :
                                        <span>________________<br/>____________________________________</span>
                                    :
                                    <span>________________<br/>____________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Special Leave Benefits for Women:</em><br/>
                                <label className='label'>
                                    (Specify Illness) {
                                    props.leaveType === 11
                                    ?
                                        props.specifyDetails !== ''
                                        ?
                                        <u>_{props.specifyDetails}_</u>
                                        :
                                        <span>____________________________________</span>
                                    :
                                    <span>____________________________________</span>


                                }
                                </label>
                                <br/>

                                <em className='info-header'>In case of Study Leave:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 8 ? props.leaveDetails === 7?true:false :false} readOnly/> &nbsp;Completion of Master's Degree
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox"  checked = {props.leaveType === 8 ? props.leaveDetails === 8?true:false :false} readOnly/> &nbsp;BAR/Board Examination Review
                                </label>
                                <br/>

                                <em className='info-header'>Other purpose:</em><br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 9?true:false :false} readOnly/> &nbsp;Monetization of Leave Credits
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 10?true:false :false} readOnly/> &nbsp;Terminal Leave
                                </label>
                        </Grid>
                        <Grid item xs = {12} md={7} lg={7} sx={{borderTop:'solid 1px',borderRight:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    6.C NUMBER OF WORKING DAYS APPLIED FOR
                                </Typography>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.leaveType === 4 ? props.maternity_days : props.applied_days} {props.applied_days>1?' days':' day'}</strong>
                                    </Typography>
                                </Grid>
                                
                                <br/>
                                <h5 className='info-header'>INCLUSIVE DATES</h5>
                                <Grid item xs = {10} sm = {10} >
                                    <Typography sx = {{fontSize:'9px',borderBottom:'solid 1px',fontWeight:'bold'}}>
                                    <strong style={{paddingLeft:'30%'}}>{props.inclusiveDates}</strong>
                                    </Typography>
                                </Grid>
                                
                        </Grid>
                        <Grid item xs = {12} md={5} lg={5} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',padding:'0 10px 0 10px',marginBottom:'2px'}}>
                                <Typography sx={{fontSize:'12px'}}>6.D COMMUTATION</Typography>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Not Requested'?true:false} readOnly/> &nbsp;Not Requested
                                </label>
                                <br/>
                                <label className='label'>
                                    <input type = "checkbox" checked = {props.commutation === 'Requested'?true:false} readOnly/> &nbsp;Requested
                                </label>
                                <br/>
                                <div className='center'>
                                    <span style={{fontSize:'9px'}}>_____________________________</span>
                                    {/* <span style={{fontSize:'11px'}}><u>&nbsp;&nbsp;&nbsp;<strong>{props.info.fname} {props.info.mname?props.info.mname.charAt(0)+'. ':' '} {props.info.lname} {formatExtName2(props.info.extname)}</strong>&nbsp;&nbsp;&nbsp;</u></span> */}

                                    <br/>
                                    <span className='info-header'>Signature of Applicant</span>
                                </div>
                        </Grid>
                        <Grid item xs={12} sx={{borderTop:'solid 1px',borderBottom:'solid 1px',marginBottom:'2px'}}>
                            <Typography sx={{textAlign:'center',fontSize:'13px',fontWeight:'bold'}}>
                                7. DETAILS OF ACTION OF APPLICATION
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={7} lg={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px',borderRight:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.A CERTIFICATION OF LEAVE CREDITS
                            </Typography>
                            <Typography sx={{textAlign:'center',fontSize:'12px'}}>
                                As of <span style={{borderBottom:'solid 1px',fontWeight:'bold'}}>{props.pendinginfo.bal_as_of}</span>
                            </Typography>
                            <Box sx={{display:'flex',justifyContentL:'space-between'}}>
                            
                            <table style={{border: '1px solid',width:'90%',fontSize:'9px'}}>
                                    <thead>
                                        <tr >
                                        <th>
                                        
                                        </th>
                                        <th style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Vacation Leave
                                        </th>
                                        <th  style={{borderLeft:'solid 1px',textAlign:'center'}}>
                                            Sick Leave
                                        </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Total Earned</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                                {
                                                props.pendinginfo.leave_type_id === 15
                                                ?
                                                parseFloat(props.pendinginfo.vl_before_review).toFixed(3)
                                                :
                                                props.leaveType ===1 || props.leaveType ===2
                                                ?
                                                    parseFloat(props.pendinginfo.bal_before_process).toFixed(3)
                                                :
                                                    props.leaveType === 3
                                                    ?
                                                        props.pendinginfo.vl_before_review
                                                        ?
                                                        parseFloat(props.pendinginfo.vl_before_review).toFixed(3)
                                                        :
                                                        0
                                                    :
                                                    // (props.vl).toFixed(3)
                                                    parseFloat(props.pendinginfo.vl_before_review).toFixed(3)
                                                }
                                                </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                                props.pendinginfo.leave_type_id === 15
                                                ?
                                                parseFloat(props.pendinginfo.sl_before_review).toFixed(3)
                                                :
                                                props.leaveType === 3
                                                ?
                                                    parseFloat(props.pendinginfo.bal_before_process).toFixed(3)
                                                :
                                                    props.leaveType === 1 || props.leaveType === 2
                                                    ?
                                                    parseFloat(props.pendinginfo.sl_before_review).toFixed(3)
                                                    :
                                                    // (props.sl).toFixed(3)
                                                    parseFloat(props.pendinginfo.sl_before_review).toFixed(3)
                                                }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Less this Application</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            parseFloat(props.pendinginfo.others_vl).toFixed(3)
                                            :
                                            props.leaveType === 1 || props.leaveType === 2
                                            ?   
                                                parseFloat(props.pendinginfo.credits_vl_val).toFixed(3)
                                            :
                                                props.leaveType === 3
                                                ?
                                                parseFloat(props.pendinginfo.borrowed_vl).toFixed(3)
                                                :
                                                0
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            parseFloat(props.pendinginfo.others_sl).toFixed(3)
                                            :
                                            props.leaveType === 3
                                            ?
                                                parseFloat(props.pendinginfo.used_sl).toFixed(3)
                                            :
                                            0
                                            }
                                            </td>
                                        </tr>

                                        <tr style={{border:'solid 1px',textAlign:'center'}}>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}><em>Balance</em></td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            parseFloat(props.pendinginfo.vl_after_review).toFixed(3)
                                            :
                                            props.leaveType === 1 || props.leaveType === 2
                                            ?
                                                parseFloat(props.pendinginfo.bal_after_process).toFixed(3)
                                            :
                                            props.leaveType === 3
                                                ?
                                                    props.pendinginfo.vl_after_review
                                                    ?
                                                    parseFloat(props.pendinginfo.vl_after_review).toFixed(3)
                                                    :
                                                    0
                                                :
                                            parseFloat(props.pendinginfo.vl_after_review).toFixed(3)
                                            }
                                            </td>
                                            <td style={{borderRight:'solid 1px',fontWeight:600}}>
                                            {
                                            props.pendinginfo.leave_type_id === 15
                                            ?
                                            parseFloat(props.pendinginfo.sl_after_review).toFixed(3)
                                            :
                                            props.leaveType === 3
                                            ?
                                                parseFloat(props.pendinginfo.bal_after_process).toFixed(3)
                                            :
                                            parseFloat(props.pendinginfo.sl_after_review).toFixed(3)
                                            }
                                            </td>
                                        </tr>
                                    </tbody>
                                    
                                </table>
                                {
                                    props.pendinginfo.leave_type_id === 5
                                    ?
                                    <table style={{borderStyle: 'none',fontSize:'9px',marginLeft:'5px',textAlign:'right'}}>
                                        <thead>
                                        <tr>
                                            <td>
                                                <strong>Paternity</strong>
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>
                                                <strong>{props.pendinginfo.bal_before_process}</strong>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                <strong>{props.pendinginfo.days_with_pay}</strong>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                <strong>{parseFloat(props.pendinginfo.bal_after_process).toFixed(0)}</strong>
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    // <Box sx={{pl:1,textAlign:'right'}}>
                                    // <Typography sx={{fontSize:'10px',fontWeight:'bold'}}>SLP</Typography>
                                    // <Typography sx={{fontSize:'10px',pt:1}}>{props.pendinginfo.bal_before_process}</Typography>
                                    // <Typography sx={{fontSize:'10px'}}>-{props.pendinginfo.days_with_pay}</Typography>
                                    // <Typography sx={{fontSize:'10px'}}>{props.pendinginfo.bal_after_process}</Typography>
                                    // </Box>
                                    :
                                    null

                                }
                                {
                                    props.pendinginfo.leave_type_id === 6
                                    ?
                                    <table style={{borderStyle: 'none',fontSize:'9px',marginLeft:'5px',textAlign:'right'}}>
                                        <thead>
                                        <tr>
                                            <td>
                                                <strong>SLP</strong>
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>
                                                <strong>{props.pendinginfo.bal_before_process}</strong>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                <strong>{props.pendinginfo.days_with_pay}</strong>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                <strong>{parseFloat(props.pendinginfo.bal_after_process).toFixed(0)}</strong>
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    // <Box sx={{pl:1,textAlign:'right'}}>
                                    // <Typography sx={{fontSize:'10px',fontWeight:'bold'}}>SLP</Typography>
                                    // <Typography sx={{fontSize:'10px',pt:1}}>{props.pendinginfo.bal_before_process}</Typography>
                                    // <Typography sx={{fontSize:'10px'}}>-{props.pendinginfo.days_with_pay}</Typography>
                                    // <Typography sx={{fontSize:'10px'}}>{props.pendinginfo.bal_after_process}</Typography>
                                    // </Box>
                                    :
                                    null

                                }
                                {
                                    props.pendinginfo.leave_type_id === 7
                                    ?
                                    <table style={{borderStyle: 'none',fontSize:'9px',marginLeft:'5px',textAlign:'right'}}>
                                        <thead>
                                        <tr>
                                            <td>
                                                <strong>Solo Parent</strong>
                                            </td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td>
                                                <strong>{props.pendinginfo.bal_before_process}</strong>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                <strong>{props.pendinginfo.days_with_pay}</strong>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>
                                                <strong>{parseFloat(props.pendinginfo.bal_after_process).toFixed(0)}</strong>
                                            </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    null

                                }
                                </Box>
                                {/* {props.signatory.map((data,key)=>
                                    data.location === '7.A'
                                    ?
                                    <div key = {key}>
                                    <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{data.assign_name}</u></h5>
                                    <h5 className='center' style ={{fontSize:'9px'}}>{data.assign_position} <br/>
                                    _________________________________________________________________________________________________ <br/>
                                    <strong>(Authorized Officer)</strong>
                                    </h5>
                                    </div>
                                    :
                                    ''
                                )} */}
                                <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_ao.office_ao?props.office_ao.office_ao.toUpperCase():''}</u></h5>
                                <h5 className='center' style ={{fontSize:'9px'}}>{formatPos(props.office_ao.office_ao_assign)} <br/>
                                ________________________________________________ <br/>
                                <strong>(Authorized Officer)</strong>
                                </h5>
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                            <Typography sx={{fontSize:'12px'}}>
                                7.B RECOMMENDATION
                            </Typography>
                            <label className='label'>
                                    <input type = "checkbox" checked = {props.pendinginfo.status === 'FOR APPROVAL' || props.pendinginfo.status === 'APPROVED' ? true:false} readOnly/> &nbsp;For Approval
                            </label>
                            <br/>
                            <label className='label'>
                                <input type = "checkbox" checked = {props.pendinginfo.status === 'DISAPPROVED' ? true:false} readOnly/> &nbsp;For Disapproval due to <br/>
                            </label><br/>
                            {
                                props.pendinginfo.status === 'DISAPPROVED'
                                ?
                                <Typography sx={{fontSize:'10px',borderBottom:'solid 1px'}}>{props.pendinginfo.disapproved_type === 'OFFICE HEAD'?props.pendinginfo.remarks:''}</Typography>
                                :
                                <>
                                <p style = {{paddingLeft:'15px',lineHeight:'15px'}}>
                                _________________________<br/>
                                _________________________<br/>
                                _________________________<br/>
                                </p>
                                </>
                            }
                            
                            {/* {props.signatory.map((data,key)=>
                                data.location === '7.B'
                                ?
                                <div key = {key}>
                                <h5 className='info-text center' style ={{margin:'23px 0 0 0'}}><u>{data.assign_name}</u></h5>
                                <h5 className='center' style ={{fontSize:'9px'}}>{data.assign_position} <br/>
                                _______________________________________________________ <br/>
                                    <strong>(Authorized Officer)</strong>
                                </h5>
                                </div>
                                :
                                ''
                            )} */}
                            <h5 className='info-text center' style ={{margin:'30px 0 0 0'}}><u>{props.office_head.office_head?props.office_head.office_head.toUpperCase():''}</u></h5>
                            <h5 className='center' style ={{fontSize:'9px'}}>{formatPos(props.office_head.office_head_pos)} <br/>
                            _________________________________________________<br/>
                            <strong>(Authorized Officer)</strong>
                            </h5>

                        </Grid>

                        <Grid item xs={12} md={7} lg={7} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.C APPROVED FOR:
                                </Typography>
                                <Grid item xs = {12}>
                                    <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <Grid item xs = {3}>
                                        {
                                            props.pendinginfo.days_with_pay
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                        :'center'}}>{(props.pendinginfo.days_with_pay).toFixed(2)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                        }
                                        </Grid>
                                        <Grid item xs = {9}>
                                        <p className='info-header'>&nbsp;days with pay</p>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                    <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <Grid item xs = {3}>
                                        {
                                            props.pendinginfo.days_without_pay
                                            ?
                                            <p className='info-header' style = {{borderBottom:'solid 1px',textAlign
                                        :'center'}}>{(props.pendinginfo.days_without_pay).toFixed(2)}</p>
                                            :
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'10px',textAlign:'center'}}></p>
                                        }
                                        </Grid>
                                        <Grid item xs = {9}>
                                        <p className='info-header'>&nbsp;days without pay</p>
                                        </Grid>
                                    </Box>
                                </Grid>

                                <Grid item xs = {12} sx={{marginTop:'-10px'}}>
                                    <Box sx={{display:'flex',flexDirection:'row'}}>
                                        <Grid item xs = {3}>
                                            <p className='info-header' style = {{borderBottom:'solid 1px',marginTop:'5px',textAlign:'center'}}></p>
                                        </Grid>
                                        <Grid item xs = {9}>
                                        <p className='info-header'>&nbsp;others (Specify)</p>
                                        </Grid>
                                    </Box>
                                </Grid>

                                {/* <p style={{lineHeight:'15px'}}>
                                <span className='info-header' >______<u>
                                    {
                                    props.pendinginfo.days_with_pay
                                    ?
                                    props.pendinginfo.days_with_pay
                                    :
                                    ''
                                    }</u>________ days with pay</span><br/>
                                <span className='info-header'>______<u>
                                    {
                                    props.pendinginfo.days_without_pay
                                    ?
                                    props.pendinginfo.days_without_pay
                                    :
                                    ''
                                    }</u>________ days without pay</span><br/>
                                <span className='info-header'>________________ others (Specify)</span>
                                </p> */}
                        </Grid>
                        <Grid item xs={12} md={5} lg={5} sx={{padding:'0 10px 0 10px',borderTop:'solid 1px'}}>
                                <Typography sx={{fontSize:'12px'}}>
                                    7.D DISAPPROVED DUE TO: <br/>
                                </Typography>
                                <p style={{lineHeight:'15px',paddingLeft:'15px'}}>________________________<br/>
                                ________________________<br/>
                                ________________________</p>
                        </Grid>
                        <Grid item xs={12} sx={{position:'relative'}}>
                                <Typography sx={{textAlign:'center',fontSize:'12px',fontWeight:'600'}}>
                                <u>{props.auth_info[0].auth_name.toUpperCase()}</u><br/>
                                    {props.auth_info[0].auth_pos}
                                </Typography>
                                {
                                    props.pendinginfo.is_late_filing
                                    ?
                                    <Box className='stamp-style-div'>
                                        <Typography sx={{color:red[800]}} className='stamp-style'>LATE FILING</Typography>
                                        <Typography sx={{color:red[800],marginTop:'-15px'}} className='stamp-style2'>Date:</Typography>
                                        <Typography sx={{color:red[800],marginTop:'-9px'}} className='stamp-style2'>Received:</Typography>
                                    </Box>                                    :
                                    null
                                }
                        </Grid>
                    </Grid>
                    </div>   
                </>
            }
        </div>
    )
})
export default PreviewLeaveApplication