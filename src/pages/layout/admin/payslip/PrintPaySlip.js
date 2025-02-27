import React,{useState,useEffect} from 'react';
import { Box, Fade,Stack,Skeleton,Grid,Paper,Typography,Alert, Button } from '@mui/material';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import Logo from '../../../.././assets/img/bl.png'
import './PaySlip.css';
import moment from 'moment';
import { numberFormat } from 'highcharts';
import QRCode from "react-qr-code";
import { backend_api_url } from '../../../../request/APIRequestURL';
import { encryptFile } from '../../fileencrypt/FileEncrypt';

export const PrintPaySlip = React.forwardRef((props,ref)=>{
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [amtAccrued,setamtAccrued] = useState(0);
    const [qrValue,setQrValue] = useState('');
    useEffect(()=>{
        console.log(props)
        let {emp_no,year,month} = props;
        let t_data = encryptFile(emp_no+','+year+','+month);
       
        console.log(window.location.protocol + "//" + window.location.host+`/${process.env.REACT_APP_HOST}`+'/verify-payslip/?code='+t_data)

        // setQrValue(backend_api_url+'/verifypayslip/'+t_data)
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
        let total = (parseFloat(data.wtax) + parseFloat(data.gsis) + parseFloat(data.pagibig) + parseFloat(data.philhealth) + parseFloat(data.provident)).toFixed(2)
        return numberFormat(total);
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
            return formatNumber(total.toFixed(2));
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
        return formatNumber(temp_amtAccrued.toFixed(2));

    }
    return(
        <div ref={ref} id='view-payslip'>
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
                <Grid container className={'payslip-div'} key={key} id ={key%2==0?'pagebreak':''}>
                    <ThemeProvider theme={theme2}>
                    <Grid item xs={12}>
                        {/* <Box sx={{display:'flex',flexDirection:'row'}}> */}
                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

                            <img src={Logo} width={60} height={60}/>
                            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',ml:1}}>
                                <Typography >Republic of the Philippines <br/> Butuan City</Typography>
                                <Typography sx={{fontSize:'.8rem',mt:1,fontWeight:'bold'}}>EMPLOYEE PAYSLIP</Typography>
                            </Box>
                            <Box sx={{display:'flex',flexDirection:'column',ml:matches?4:'100px',textAlign:'right'}}>
                                <Typography >Office:</Typography>
                                <Typography >Employee Name:</Typography>
                                <Typography >Designation:</Typography>
                                <Typography >Period Covered:</Typography>
                            </Box>
                            <Box sx={{display:'flex',flexDirection:'column',ml:1,textAlign:'left'}}>
                                <Typography >{props.emp_info.dept_title}</Typography>
                                <Typography sx={{fontSize:'.8rem',fontWeight:'bold'}}>{data.emp_name}</Typography>
                                <Typography >{props.emp_info.position_name?props.emp_info.position_name:'N/A'}</Typography>
                                <Typography sx={{fontSize:'.8rem',fontStyle:'italic'}}>{moment(data.from,'YYYY-MM-DD').format('MMMM DD-')+moment(data.to,'YYYY-MM-DD').format('DD, YYYY')}</Typography>
                            </Box>
                            <Box sx={{ml:1}}>
                                <QRCode
                                    level='L'
                                    value={qrValue}
                                    size={70}
                                />
                            </Box>
                        </Box>
                        
                    </Grid>
                    <Grid item xs={12} >
                        <table>
                            <thead>
                                <tr style={{textAlign:'center',fontSize:'.8rem'}}>
                                    <th style={{padding:0}}>
                                        EARNINGS
                                    </th>
                                    <th style={{padding:0}}>
                                        CONTRIBUTIONS
                                    </th>
                                    <th style={{padding:0}}>
                                        LOANS
                                    </th>
                                    <th style={{padding:0}}>
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
                                        <Typography>{adjustDtl(data)}</Typography></Box>

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
                                    
                                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:'5px'}}>
                                        <Typography sx={{fontWeight:'bold'}}>NET PAY</Typography>
                                        <Typography sx={{fontWeight:'bold'}}>{formatNumber(data.net)}</Typography></Box>

                                    </td>

                                    <td style = {{verticalAlign:'top'}}>
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
                                    <td style = {{verticalAlign:'top'}}>
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
                                    <td style = {{verticalAlign:'top'}}>
                                    {
                                        data.loan.map((data3,key3)=>
                                            data3.type === '3'
                                            ?
                                            <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}key = {key}>
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
                    <Grid item xs={12}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <Grid item xs={6}>
                            <Box sx={{display:'flex',flexDirection:'column'}}>
                                <Typography sx={{fontStyle:'italic',fontSize:'.7rem'}}>I hereby acknowledge receiving the amount/s stated hereof:</Typography>
                                <p><span style={{fontStyle:'italic',fontSize:'.7rem',fontWeight:'bold',fontFamily:'Times New Roman'}}>Control No. {formatCtrlNo(data)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span style={{fontSize:'.7rem',fontStyle:'italic'}}>{formatName(data.emp_name)}</span></p>
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
                        {/* <hr/> */}
                    </Grid>
                    </ThemeProvider>
                </Grid>
                </div>
                )
            }
            
        </div>
    )
})