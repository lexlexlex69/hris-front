import React,{useEffect, useState} from 'react';
import { Box, Fade,Stack,Skeleton,Grid,Paper,Typography,Alert, Button, Tooltip } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import Logo from '../../../.././assets/img/bl.png'
import './PaySlip.css';
import moment from 'moment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QRCode from "react-qr-code";
import { encryptFile } from '../../fileencrypt/FileEncrypt';
import { api_url, backend_api_url } from '../../../../request/APIRequestURL';
import { formatExtName } from '../../customstring/CustomString';
export const ViewPaySlip = React.forwardRef((props,ref)=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [amtAccrued,setamtAccrued] = useState(0);
    const [qrValue,setQrValue] = useState('');
    useEffect(()=>{
        let {emp_no,year,month} = props;
        // var t_data = {
        //     emp_no:emp_no,
        //     year:year,
        //     month:month,
        // }
        let t_data = encryptFile(emp_no+','+year+','+month);
        // let t_emp_no = encryptFile(t_data)
        // let t_year = encryptFile(year)
        // let t_month = encryptFile(month)
        console.log(window.location.protocol + "//" + window.location.host+`/${process.env.REACT_APP_HOST}`+'/verify-payslip/?code='+t_data)
        setQrValue(window.location.protocol + "//" + window.location.host+`/${process.env.REACT_APP_HOST}`+'/verify-payslip/?code='+t_data)
        // setQrValue('http://localhost:8000/api/verifypayslip/'+encryptFile(t_data))
    },[])
    const theme2 = createTheme ({
        typography: {
            fontFamily:'Times New Roman',
            fontSize:11,
            fontWeight:'lighter'

        }
    })
    const tableFont = createTheme ({
        typography: {
            fontSize:10,
            fontFamily:'Times New Roman',
            fontWeight:'lighter'


        }
    })
    const formatNumber = (x) => {
        // return x;
        if(x<=0 || x === null || x === ''){
            return '-';
        }else{
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    const otherDeduction = (data)=>{
        let amount = 0;
        for(var i = 0 ; i<data.length;i++){
            if(data[i].type === '3'){
                amount = amount+Number(data[i].pay_amount);
            }
        }
        return formatNumber(amount.toFixed(2))
    }
    const totalContributions = (data) =>{
        // console.log(parseFloat(data)
        let total = (parseFloat(data.wtax) + parseFloat(data.gsis) + parseFloat(data.pagibig) + parseFloat(data.philhealth) + parseFloat(data.provident) + parseFloat(data.sss)).toFixed(2)
        return formatNumber(total);
    }
    const formatName = (data) => {
        let arr = data.split(' ');
        let name = '';
        arr.forEach(el=>{
            var lower_name = el.toLowerCase();
            var temp_name = lower_name.charAt(0).toUpperCase() + lower_name.slice(1);
            name = name+temp_name+' '
        })
        return name+' '+props.datetime;
        // return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const formatCtrlNo = (data) =>{
        let arr = ['0000','000','00','0'];
        let num = data.payroll_no.length;
        return arr[num]+data.payroll_no;

    }
    const adjustDtl= (data) =>{
        let temp_amtAccrued = parseFloat(data.gross_amount);
        let total = 0;

        data.adjust_dtl.forEach(el=>{
            // if(el.adjust_type === 2 
            //     || el.adjust_type === 3){
            //         temp_amtAccrued = temp_amtAccrued - parseFloat(el.adjust_amt)
            // }else{
            //     temp_amtAccrued = temp_amtAccrued + parseFloat(el.adjust_amt)
            // }
            total +=parseFloat(el.adjust_amt)
        })
        // setamtAccrued(temp_amtAccrued)
        if(total>0){
            return <Box sx={{display:'flex',flexDirectionL:'row'}}><Typography>{formatNumber(total.toFixed(2))}</Typography>&nbsp; <Tooltip sx={{'&:hover':{cursor:'pointer'}}} title ={<Box>{data.adjust_dtl.map((data,key)=><><Typography key={key}>{formatNumber(parseFloat(data.adjust_amt).toFixed(2))} - {data.adjust_desc} ({data.adjust_type==2||data.adjust_type==3 ?'Deduct':'Add'})</Typography></>)}</Box>}><InfoOutlinedIcon color='info'/></Tooltip></Box>
        }else{
            return '-';
        }

    }
    const amountAccrued = (data) =>{
        let temp_amtAccrued = parseFloat(data.gross_amount);
        let total = 0;

        data.adjust_dtl.forEach(el=>{
            if(el.adjust_type == 2 
                || el.adjust_type == 3 ){
                    temp_amtAccrued -= parseFloat(el.adjust_amt)
            }else{
                temp_amtAccrued += parseFloat(el.adjust_amt)
            }
            // total +=parseFloat(el.adjust_amt)
        })
        console.log(data.adjust_dtl)
        temp_amtAccrued = temp_amtAccrued - parseFloat(data.absent)
        return formatNumber(temp_amtAccrued.toFixed(2));

    }
    return(
        <div ref={ref} id='payslip' style={{width:'100%',margin:matches?0:'20px'}}>
            <Box sx={{display:'flex',flexDirection:'column'}}>
            {
                props.data.map((data,key)=>
                <div key = {key}>
                {
                key>0
                ?
                <Box sx={{width:'100%',borderTop:'dotted 4px #c4c4c4',mb:4,mt:3}}>

                </Box>
                :
                ''
                }
                <Box sx={{display:'flex',justifyContent:'center',position:'relative'}}>
                {
                    matches
                    ?
                    null
                    :
                    <img src={Logo} style={{position: 'absolute',opacity: 0.1,top: '95px',height: '190px',width: '190px'}}/>
                }
                <Box sx={{maxWidth:'900px',p:1}} component={Paper}>
                <Grid container>
                                {
                                    matches
                                    ?
                                    // mobile
                                    <ThemeProvider theme={theme2}>
                                    <Grid item xs={12}>
                                        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                                            <Box sx={{display:'flex',gap:1,flexDirection:'column',alignItems:'center'}}>
                                                <img src={Logo} width={60} height={60}/>
                                                <Typography sx={{textAlign:'center',lineHeight:1}}>Republic of the Philippines <br/> Butuan City</Typography>
                                                {/* <QRCode
                                                    level='L'
                                                    value={qrValue}
                                                    size={60}
                                                /> */}
                                            </Box>
                                            <Box>
                                                <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>EMPLOYEE PAYSLIP</Typography>
                                            </Box>
                                            {/* <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                                                <Box sx={{display:'flex',flexDirection:'column',textAlign:'right',width:'88px'}}>
                                                <Typography >Office:</Typography>
                                                <Typography >Employee Name:</Typography>
                                                <Typography >Designation:</Typography>
                                                <Typography >Period Covered:</Typography>
                                                </Box>
                                                <Box sx={{display:'flex',flexDirection:'column',ml:1,textAlign:'left'}}>
                                                    <Typography >{props.emp_info.short_name}</Typography>
                                                    <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>{props.emp_info.fullname}</Typography>
                                                    <Typography >{data.position}</Typography>
                                                    <Typography sx={{fontSize:'.8rem',fontStyle:'italic'}}>{moment(data.from,'YYYY-MM-DD').format('MMMM DD-')+moment(data.to,'YYYY-MM-DD').format('DD, YYYY')}</Typography>
                                                </Box>
                                            </Box> */}
                                            <Grid item container xs={12} sx={{display:'flex',flexDirection:'row',mt:1}}>
                                                <Grid item xs={5} sx={{pr:1}}>
                                                    <Typography sx={{textAlign:'right'}}>Office:</Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography >{props.emp_info.short_name}</Typography>
                                                </Grid>

                                                <Grid item xs={5} sx={{pr:1}}>
                                                    <Typography sx={{textAlign:'right'}}>Employee Name:</Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>
                                                    {`${props.emp_info.lname}, ${props.emp_info.fname} ${formatExtName(props.emp_info.extname)} ${props.emp_info.mname}.`}</Typography>
                                                </Grid>

                                                <Grid item xs={5} sx={{pr:1}}>
                                                    <Typography sx={{textAlign:'right'}}>Designation:</Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography >{data.position}</Typography>
                                                </Grid>

                                                <Grid item xs={5} sx={{pr:1}}>
                                                    <Typography sx={{textAlign:'right'}}>Period Covered:</Typography>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Typography sx={{fontSize:'.8rem',fontStyle:'italic'}}>{moment(data.from,'YYYY-MM-DD').format('MMMM DD-')+moment(data.to,'YYYY-MM-DD').format('DD, YYYY')}</Typography>
                                                </Grid>
                                            
                                            </Grid>
                                            
                                            <Box>
                                                {/* <QRCode
                                                    level='L'
                                                    value={qrValue}
                                                    size={70}
                                                /> */}
                                            </Box>
                                        </Box>
                                        
                                    </Grid>
                                    <Grid item xs={12} sx={{maxWidth:'300px',overflowY:'scroll'}} >
                                        <table className='table table-bordered'>
                                            <thead>
                                                <tr style={{textAlign:'center',fontSize:'.8rem'}}>
                                                    <th style={{padding:0,minWidth:matches?300:'auto'}} >
                                                        EARNINGS
                                                    </th>
                                                    <th style={{padding:0,minWidth:matches?150:'auto'}}>
                                                        CONTRIBUTIONS
                                                    </th>
                                                    <th style={{padding:0,minWidth:matches?150:'auto'}}>
                                                        LOANS
                                                    </th>
                                                    <th style={{padding:0,minWidth:matches?150:'auto'}}>
                                                        OTHER DEDUCTIONS
                                                    </th>
                                                </tr>
                                            </thead>
                                            <ThemeProvider theme={tableFont}>
                                            <tbody>
                                                
                                                <tr>
                                                    <td>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Basic Pay</Typography>
                                                        <Typography >{formatNumber(data.gross_amount)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography>LWOP</Typography>
                                                        <Typography>{formatNumber(data.absent)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Adjustment</Typography>
                                                        {adjustDtl(data)}</Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography sx={{fontWeight:'bold'}}>Amount Accrued</Typography>
                                                        <Typography >{amountAccrued(data)}</Typography></Box>
                                                        
                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        
                                                        <Typography >Add: <span style={{fontSize:'.8rem',position:'relative',left:'10px'}}>PERA</span></Typography>
                                                        {/* <Typography sx={{position:'relative',fontSize:'.8rem',left:matches?0:'90px'}}>PERA</Typography> */}
                                                        <Typography >{formatNumber(data.pera)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Less: <span style={{fontSize:'.8rem',position:'relative',left:'8px'}}>Contributions</span></Typography><br/>
                                                        {/* <Typography sx={{position:matches?'relative':'absolute',fontSize:'.8rem',left:'90px'}}>Contributions</Typography> */}
                                                        <Typography >{totalContributions(data)}</Typography>
                                                        </Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:'-8px'}}>
                                                        <Typography sx={{position:'relative',fontSize:'.8rem',left:'36px'}}>Loans</Typography>
                                                        <Typography >{formatNumber(data.total_loan)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography sx={{position:'relative',fontSize:'.8rem',left:'36px'}}>Other Deductions</Typography>
                                                        {/* <Typography >{otherDeduction(props.data.loan)}</Typography> */}
                                                        <Typography >{formatNumber(data.tot_other_deduct)}</Typography>
                                                        </Box>
                                                    
                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography sx={{fontWeight:'bold'}}>NET PAY</Typography>
                                                        <Typography sx={{fontWeight:'bold'}}>{formatNumber(data.net)}</Typography></Box>

                                                    </td>

                                                    <td>
                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Withholding Tax</Typography>
                                                        <Typography >{formatNumber(data.wtax)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >GSIS</Typography>
                                                        <Typography >{formatNumber(data.gsis)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Pag-Ibig</Typography>
                                                        <Typography >{formatNumber(data.pagibig)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >PhilHealth</Typography>
                                                        <Typography >{formatNumber(data.philhealth)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Provident</Typography>
                                                        <Typography >{formatNumber(data.provident)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >SSS</Typography>
                                                        <Typography >{formatNumber(data.sss)}</Typography></Box>

                                                    </td>
                                                    <td>
                                                        {
                                                            data.loan.map((data2,key2)=>
                                                                data2.type === '2' || data2.type === '1'
                                                                ?
                                                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}key = {key2}>
                                                                <Typography >{data2.abbr_name}</Typography>
                                                                <Typography >{formatNumber(data2.pay_amount)}</Typography>
                                                                </Box>
                                                                :
                                                                ''
                                                            )
                                                        }

                                                        

                                                        {/* <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >EMRGY LN</Typography>
                                                        <Typography >655.56</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >COMP. LOAN</Typography>
                                                        <Typography >983.33</Typography>
                                                        </Box> */}

                                                    </td>
                                                    <td>
                                                    {
                                                        data.loan.map((data3,key3)=>
                                                            data3.type === '3'
                                                            ?
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}key = {key3}>
                                                            <Typography >{data3.abbr_name}</Typography>
                                                            <Typography >{formatNumber(data3.pay_amount)}</Typography>
                                                            </Box>
                                                            :
                                                            ''
                                                        )
                                                    }
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot >
                                                <tr >
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>15th Pay:</Typography>
                                                            <Typography sx={{fontWeight:'bold'}}>P</Typography>
                                                            </Box>
                                                    </td>
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>{formatNumber(data.amount_15)}</Typography>
                                                            </Box>
                                                    </td>
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>30th Pay:</Typography>
                                                            <Typography sx={{fontWeight:'bold'}}>P</Typography>
                                                            </Box>
                                                    </td>
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>{formatNumber(data.amount_30)}</Typography>
                                                            </Box>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                            </ThemeProvider>
                                        </table>
                                    </Grid>
                                    <Grid item xs={12} sx={{maxWidth:'300px',overflowY:'scroll'}} >
                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                            <Grid item xs={6}>
                                            <Box sx={{display:'flex',flexDirection:'column'}}>
                                                <Typography sx={{fontStyle:'italic',fontSize:'.7rem'}}>I hereby acknowledge receiving the amount/s stated hereof:</Typography>
                                                <p><span style={{fontStyle:'italic',fontSize:'.7rem',fontWeight:'bold'}}>Control No. {formatCtrlNo(data)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style={{fontSize:'.7rem',fontStyle:'italic'}}>{formatName(data.emp_name)}</span></p>
                                            </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                            <Box sx={{display:'flex',flexDirection:'column'}}>
                                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                <Typography>___________________________________</Typography>
                                                <Typography sx={{fontStyle:'italic',fontSize:'.7rem'}}>Date:____________</Typography>
                                                </Box>
                                                <Box>
                                                <Typography sx={{fontStyle:'italic',fontSize:'.7rem'}}> This is an electronically generated report, hence does not require a signature.</Typography>
                                                </Box>
                                            </Box>
                                            </Grid>
                                            

                                        </Box>
                                    </Grid>
                                    </ThemeProvider>
                                    :
                                    <ThemeProvider theme={theme2}>
                                    <Grid item xs={12}>
                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                            <Box sx={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                                <img src={Logo} width={60} height={60}/>
                                                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',ml:1}}>
                                                    <Typography >Republic of the Philippines <br/> Butuan City</Typography>
                                                    <Typography sx={{fontSize:'.8rem',mt:1,fontWeight:'bold'}}>EMPLOYEE PAYSLIP</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{display:'flex',flexDirection:'row'}}>
                                                <Box sx={{display:'flex',flexDirection:'column',textAlign:'right'}}>
                                                <Typography >Office:</Typography>
                                                <Typography >Employee Name:</Typography>
                                                <Typography >Designation:</Typography>
                                                <Typography >Period Covered:</Typography>
                                                </Box>
                                                &nbsp;
                                                <Box sx={{display:'flex',flexDirection:'column',textAlign:'left'}}>
                                                    <Typography >{props.emp_info.dept_title}</Typography>
                                                    <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>
                                                    {/* {props.emp_info.fullname} */}
                                                    {`${props.emp_info.lname}, ${props.emp_info.fname} ${formatExtName(props.emp_info.extname)} ${props.emp_info.mname}.`}
                                                    </Typography>
                                                    {/* <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>{data.emp_name}</Typography> */}
                                                    {/* <Typography >{props.emp_info.position_name}</Typography> */}
                                                    <Typography >{data.position?data.position:'N/A'}</Typography>
                                                    <Typography sx={{fontSize:'.8rem',fontStyle:'italic'}}>{moment(data.from,'YYYY-MM-DD').format('MMMM DD-')+moment(data.to,'YYYY-MM-DD').format('DD, YYYY')}</Typography>
                                                </Box>
                                            </Box>
                                            
                                            <Box>
                                                {/* <QRCode
                                                    level='L'
                                                    value={qrValue}
                                                    size={70}
                                                /> */}
                                            </Box>
                                        </Box>
                                        
                                    </Grid>
                                    <Grid item xs={12} >
                                        <table className='table table-bordered'>
                                            <thead>
                                                <tr style={{textAlign:'center',fontSize:'.8rem'}}>
                                                    <th style={{padding:0,minWidth:matches?300:'auto'}} >
                                                        EARNINGS
                                                    </th>
                                                    <th style={{padding:0,minWidth:matches?150:'auto'}}>
                                                        CONTRIBUTIONS
                                                    </th>
                                                    <th style={{padding:0,minWidth:matches?150:'auto'}}>
                                                        LOANS
                                                    </th>
                                                    <th style={{padding:0,minWidth:matches?150:'auto'}}>
                                                        OTHER DEDUCTIONS
                                                    </th>
                                                </tr>
                                            </thead>
                                            <ThemeProvider theme={tableFont}>
                                            <tbody>
                                                
                                                <tr>
                                                    <td>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Basic Pay</Typography>
                                                        <Typography >{formatNumber(data.gross_amount)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography>LWOP</Typography>
                                                        <Typography>{formatNumber(data.absent)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Adjustment</Typography>
                                                        {adjustDtl(data)}</Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography sx={{fontWeight:'bold'}}>Amount Accrued</Typography>
                                                        <Typography >{amountAccrued(data)}</Typography></Box>
                                                        
                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        
                                                        <Typography >Add: <span style={{fontSize:'.8rem',position:'relative',left:'10px'}}>PERA</span></Typography>
                                                        {/* <Typography sx={{position:'relative',fontSize:'.8rem',left:matches?0:'90px'}}>PERA</Typography> */}
                                                        <Typography >{formatNumber(data.pera)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Less: <span style={{fontSize:'.8rem',position:'relative',left:'8px'}}>Contributions</span></Typography><br/>
                                                        {/* <Typography sx={{position:matches?'relative':'absolute',fontSize:'.8rem',left:'90px'}}>Contributions</Typography> */}
                                                        <Typography >{totalContributions(data)}</Typography>
                                                        </Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:'-8px'}}>
                                                        <Typography sx={{position:'relative',fontSize:'.8rem',left:'36px'}}>Loans</Typography>
                                                        <Typography >{formatNumber(data.total_loan)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography sx={{position:'relative',fontSize:'.8rem',left:'36px'}}>Other Deductions</Typography>
                                                        {/* <Typography >{otherDeduction(props.data.loan)}</Typography> */}
                                                        <Typography >{formatNumber(data.tot_other_deduct)}</Typography>
                                                        </Box>
                                                    
                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography sx={{fontWeight:'bold'}}>NET PAY</Typography>
                                                        <Typography sx={{fontWeight:'bold'}}>{formatNumber(data.net)}</Typography></Box>

                                                    </td>

                                                    <td>
                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Withholding Tax</Typography>
                                                        <Typography >{formatNumber(data.wtax)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >GSIS</Typography>
                                                        <Typography >{formatNumber(data.gsis)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Pag-Ibig</Typography>
                                                        <Typography >{formatNumber(data.pagibig)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >PhilHealth</Typography>
                                                        <Typography >{formatNumber(data.philhealth)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >Provident</Typography>
                                                        <Typography >{formatNumber(data.provident)}</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >SSS</Typography>
                                                        <Typography >{formatNumber(data.sss)}</Typography></Box>

                                                    </td>
                                                    <td>
                                                        {
                                                            data.loan.map((data2,key2)=>
                                                                data2.type === '2' || data2.type === '1'
                                                                ?
                                                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}key = {key2}>
                                                                <Typography >{data2.abbr_name}</Typography>
                                                                <Typography >{formatNumber(data2.pay_amount)}</Typography>
                                                                </Box>
                                                                :
                                                                ''
                                                            )
                                                        }

                                                        

                                                        {/* <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >EMRGY LN</Typography>
                                                        <Typography >655.56</Typography></Box>

                                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Typography >COMP. LOAN</Typography>
                                                        <Typography >983.33</Typography>
                                                        </Box> */}

                                                    </td>
                                                    <td>
                                                    {
                                                        data.loan.map((data3,key3)=>
                                                            data3.type === '3'
                                                            ?
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}key = {key3}>
                                                            <Typography >{data3.abbr_name}</Typography>
                                                            <Typography >{formatNumber(data3.pay_amount)}</Typography>
                                                            </Box>
                                                            :
                                                            ''
                                                        )
                                                    }
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tfoot >
                                                <tr >
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>15th Pay:</Typography>
                                                            <Typography sx={{fontWeight:'bold'}}>P</Typography>
                                                            </Box>
                                                    </td>
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>{formatNumber(data.amount_15)}</Typography>
                                                            </Box>
                                                    </td>
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>30th Pay:</Typography>
                                                            <Typography sx={{fontWeight:'bold'}}>P</Typography>
                                                            </Box>
                                                    </td>
                                                    <td style={{padding:0}}>
                                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                                                            <Typography sx={{fontWeight:'bold'}}>{formatNumber(data.amount_30)}</Typography>
                                                            </Box>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                            </ThemeProvider>
                                        </table>
                                    </Grid>
                                    <Grid item xs={12} sx={{marginTop:'-13px'}}>
                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                            <Grid item xs={6}>
                                            <Box sx={{display:'flex',flexDirection:'column'}}>
                                                <Typography sx={{fontStyle:'italic',fontSize:'.7rem'}}>I hereby acknowledge receiving the amount/s stated hereof:</Typography>
                                                <p><span style={{fontStyle:'italic',fontSize:'.7rem',fontWeight:'bold'}}>Control No. {formatCtrlNo(data)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style={{fontSize:'.7rem',fontStyle:'italic'}}>{formatName(data.emp_name)}</span></p>
                                            </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                            <Box sx={{display:'flex',flexDirection:'column'}}>
                                                <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                                <Typography>___________________________________</Typography>
                                                <Typography sx={{fontStyle:'italic',fontSize:'.7rem'}}>Date:____________</Typography>
                                                </Box>
                                                <Box>
                                                <Typography sx={{fontStyle:'italic',fontSize:'.7rem'}}> This is an electronically generated report, hence does not require a signature.</Typography>
                                                </Box>
                                            </Box>
                                            </Grid>
                                            

                                        </Box>
                                    </Grid>
                                    </ThemeProvider>
                                }
                                
                            </Grid>
                    </Box>
                    </Box>

                    </div>
                )
            }
            </Box>
        </div>
    )
})