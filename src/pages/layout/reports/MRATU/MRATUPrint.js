import React,{useState} from 'react';
import Logo from '../../../.././assets/img/bl.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography,Box } from '@mui/material';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import moment from 'moment';
import './MRATU.css';
import FormFooter from '../../forms/footer/FormFooter';
export const MRATUPrint = React.forwardRef((props,ref)=>{
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.down('sm'));
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
    return (
        <div ref ={ref} id = "mratu-print">
            <div style={{display:'flex',position:'relative',flexDirection:'row',justifyContent:'center',alignItems:''}}>
                {/* <div style={{paddingRight:'20px'}}>
                    <img src={Logo} alt="" width={70} height={70}/>
                </div> */}
                <div>
                    <img src={props.letterHead} height='100px' width='100%'/>

                <p style={{textAlign:'center',lineHeight:'15px'}}>
                    {/* <span style={{fontSize:'.9rem'}}>Republic of the Philippines</span> <br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>CITY HUMAN RESOURCE MANAGEMENT OFFICE</span><br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Butuan City</span> <br/><br/> */}
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>MONTHLY SUMMARY REPORT ON ABSENCES, TARDINESS AND UNDERTIME</span><br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Month of {props.selectedMonthYear?props.selectedMonthYear.month.name:null} <u>{props.selectedMonthYear?props.selectedMonthYear.year:null}</u>
                    </span><br/>
                </p>
                <p style={{position:'absolute',right:100,top:'50%'}}>CGB.F.037.REV00 <br/>
                    03/03/2022
                </p>
                </div>
                
            </div>
            <div id='table'>
                <table className='mratu-custom-table'>
                <thead >
                <tr className='mratu-custom-header'>
                    <td align='center'>
                        No.
                    </td>
                    <td align='center' style={{textTransform:'uppercase'}}>
                        Name of Employee
                    </td>
                    <td colSpan={5} align='center' style={{textTransform:'uppercase'}}>
                        Tardiness
                    </td>
                    <td colSpan={5} align='center' style={{textTransform:'uppercase'}}>
                        Undertime
                    </td>
                    <td colSpan={4} align='center' style={{textTransform:'uppercase'}}>
                        Leave of Absences
                    </td>
                    <td align='center' style={{textTransform:'uppercase'}}>
                        Remarks
                    </td>
                </tr>
                
                <tr className='mratu-custom-center-tr'>
                        <td/>
                        <td/>
                        <td>
                            Days
                        </td>
                        <td>
                            Hrs.
                        </td>
                        <td>
                            Min.
                        </td>
                        <td>
                            Freq.
                        </td>
                        <td>
                            Total *(day)
                        </td>
                        <td>
                            Days
                        </td>
                        <td>
                            Hrs.
                        </td>
                        <td>
                            Min.
                        </td>
                        <td>
                            Freq.
                        </td>
                        <td>
                            Total *(day)
                        </td>
                        <td>
                            SL
                        </td>
                        <td>
                            VL/FL
                        </td>
                        <td>
                            SLP
                        </td>
                        <td>
                            No. of Days W/O Pay
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                </thead>
                
            <tbody>
                {
                    props.data.map((row,key)=>
                        <tr key={key} hover>
                            <td align='center'>
                                {key+1}
                            </td>
                            <td>
                            <span style={{color:row.lname.toUpperCase() ==='LLAMO' && row.fname.toUpperCase() ==='SHIEVAH CHATES'?'red':'auto'}}>
                            {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                            </span>
                            </td>
                            <td align='center'>
                            {row.late_days>0?row.late_days:null}
                            </td>
                            <td align='center'>
                            {row.late_hours>0?row.late_hours:null}
                            </td>
                            <td align='center'>
                            {row.late_minutes>0?row.late_minutes:null}
                            </td>
                            <td align='center'>
                            {
                                row.late_freq>0
                                ?
                                <span style={{color:row.late_freq>=10?'red':'blue'}}>
                                {row.late_freq}
                                </span>
                                :
                                null
                            }
                            </td>
                            <td align='center'>
                            {parseFloat(row.total_late_deduct)>0?row.total_late_deduct:'-'}
                            </td>
                            <td align='center'>
                            {row.undertime_days>0?row.under_time:null}
                            </td>
                            <td align='center'>
                            {row.undertime_hours>0?row.undertime_hours:null}
                            </td>
                            <td align='center'>
                            {row.undertime_minutes>0?row.undertime_minutes:null}
                            </td>
                            <td align='center'>
                            {
                                row.undertime_freq>0
                                ?
                                <span style={{color:row.undertime_freq>=10?'red':'blue'}}>
                                {row.undertime_freq}
                                </span>
                                :
                                null
                            }
                            
                            </td>
                            <td align='center'>
                            {parseFloat(row.total_undertime_deduct)>0?row.total_undertime_deduct:'-'}
                            </td>
                            {/* Start SL*/}
                            <td align='center'>
                                {row.sl}
                                {/* {
                                    row.sl_wpay_arr.length !==0 || row.sl_wopay_arr.length !==0
                                    ?
                                        <span>
                                        {
                                            row.sl_wpay_arr.map((row2,key2)=>
                                                key2===row.sl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        {
                                            row.sl_wopay_arr.length !==0
                                            ?
                                                row.sl_wpay_arr.length !==0
                                                ?
                                                ','
                                                :null
                                            :null
                                        }
                                        {
                                            row.sl_wopay_arr.map((row2,key2)=>
                                                key2===row.sl_wopay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        </span>

                                    :
                                    null
                                } */}
                            </td>
                            {/* End SL*/}

                            {/* Start VL/FL */}
                            <td align='center'>
                                {
                                    row.fl
                                }
                                {
                                    row.vl
                                }
                                {/* {
                                    row.vl_wpay_arr.length !==0
                                    ?
                                        <span>
                                        {
                                            row.vl_wpay_arr.map((row2,key2)=>
                                                key2===row.vl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        {row.fl_wpay_arr.length !==0 ? ',':null}
                                        </span>

                                    :
                                    null
                                }
                                {
                                    row.fl_wpay_arr.length !==0
                                    ?
                                        <span>

                                        {
                                            row.fl_wpay_arr.map((row2,key2)=>
                                                key2===row.fl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        </span>

                                    :
                                    null
                                } */}
                                
                            </td>
                            {/* End VL/FL */}

                            {/* Start SLP */}
                            <td align='center'>
                                {
                                    row.slp
                                }
                                {/* {
                                    row.slp_arr.length !==0
                                    ?
                                        <span>
                                        {
                                            row.slp_arr.map((row2,key2)=>
                                                key2===row.slp_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        </span>

                                    :
                                    null
                                } */}
                            </td>
                            {/* <td align='center'>
                                {
                                    row.sl_wpay_arr.length !==0 || row.sl_wopay_arr.length !==0
                                    ?
                                        <span>
                                        SL -&nbsp;
                                        {
                                            row.sl_wpay_arr.map((row2,key2)=>
                                                key2===row.sl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        {
                                            row.sl_wopay_arr.length !==0
                                            ?
                                                row.sl_wpay_arr.length !==0
                                                ?
                                                ','
                                                :null
                                            :null}
                                        {
                                            row.sl_wopay_arr.map((row2,key2)=>
                                                key2===row.sl_wopay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                                
                                {
                                    row.vl_wpay_arr.length !==0
                                    ?
                                        <span>
                                        VL -&nbsp;
                                        {
                                            row.vl_wpay_arr.map((row2,key2)=>
                                                key2===row.vl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                                {
                                    row.fl_wpay_arr.length !==0
                                    ?
                                        <span>
                                        FL -&nbsp;
                                        {
                                            row.fl_wpay_arr.map((row2,key2)=>
                                                key2===row.fl_wpay_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}</span>
                                                :
                                                <span>{moment(row2.date).format('D')},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                               
                                {
                                    row.slp_arr.length !==0
                                    ?
                                        <span>
                                        SLP -&nbsp;
                                        {
                                            row.slp_arr.map((row2,key2)=>
                                                key2===row.slp_arr.length-1
                                                ?
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                                
                                {
                                    row.cto_arr.length !==0
                                    ?
                                        <span>
                                        CTO -&nbsp;
                                        {
                                            row.cto_arr.map((row2,key2)=>
                                                key2===row.cto_arr.length-1
                                                ?
                                                <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                :
                                                <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                            )
                                        }
                                        ; &nbsp;
                                        </span>

                                    :
                                    null
                                }
                            </td> */}
                            <td align='center'>
                                {
                                    row.days_with_out_pay>0
                                    ?
                                    <span>{row.days_with_out_pay}</span>
                                    :
                                    null
                                }
                            </td>
                            <td width={150}>
                                {
                                    <Box>
                                    {/* {
                                        row.days_with_out_pay>0
                                        ?
                                            <Box>
                                            <span>{row.days_with_out_pay} day/s w/out pay - </span>
                                            {
                                                row.sl_wopay_arr.length>0
                                                ?
                                                <span>SL(
                                                {
                                                    row.sl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                )
                                                </span>
                                                :
                                                null
                                            }
                                            
                                            {
                                                row.vl_wopay_arr.length>0
                                                ?
                                                <span>VL(
                                                {
                                                    row.vl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                )
                                                </span>
                                                :
                                                null
                                            }
                                            </Box>
                                        :
                                        null
                                    } */}
                                    
                                    {/* {
                                        row.cto_arr.length !==0
                                        ?
                                            <span>
                                            CTO -&nbsp;
                                            {
                                                row.cto_arr.map((row2,key2)=>
                                                    key2===row.cto_arr.length-1
                                                    ?
                                                    <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'}</span>
                                                    :
                                                    <span key={key2}>{moment(row2.date).format('D')}{row2.period === 'NONE'?'':'('+row2.period.toLowerCase()+')'},</span>
                                                )
                                            }
                                            </span>

                                        :
                                        null
                                    }
                                    {
                                        row.days_with_out_pay>0
                                        ?
                                            <Box>
                                            <span>{row.days_with_out_pay} {row.days_with_out_pay>1?'days':'day'} w/out pay </span><br/>
                                            {
                                                row.sl_wopay_arr.length>0
                                                ?
                                                <span>SL - &nbsp;
                                                {
                                                    row.sl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                
                                                </span>
                                                :
                                                null
                                            }
                                            
                                            {
                                                row.vl_wopay_arr.length>0
                                                ?
                                                <span><br/>VL (
                                                {
                                                    row.vl_wopay_arr.map((row3,key3)=>
                                                    <span key={key3}>
                                                        {
                                                            key3 === row.sl_wopay_arr.length-1
                                                            ?
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())}</span>
                                                            :
                                                            <span>{moment(row3.date).format('D')+(row3.period==='NONE'?'':'-'+row3.period.toLowerCase())},</span>

                                                        }
                                                    </span>
                                                )
                                                }
                                                )
                                                </span>
                                                :
                                                null
                                            }
                                            

                                            </Box>
                                        :
                                        null
                                    }
                                    <br/> */}
                                    <span style = {{whiteSpace:'pre-line'}}>
                                    {
                                        row.remarks_text
                                    }
                                    </span>
                                    </Box>
                                } 
                            </td>

                        </tr>
                    )
                }
            </tbody>
            </table>
            <div style={{marginTop:'20px',display:'flex',justifyContent:'space-between',padding:'0 150px 0 150px'}}>
                <div>
                    <p>Prepared:</p>
                    <div>
                    <p style={{textAlign:'center'}}>
                    {/* _______________________________________ <br/> */}
                    <br/>
                    <strong style={{textTransform:'uppercase'}}><u>{props.mratuPreparedByName} </u></strong><br/>
                    {/* {props.mratuPreparedByPos} */}
                    {formatPos(props.mratuPreparedByPos)}</p>
                    </div>
                   
                </div>
                <div>
                    <p>Recommending Approval:</p>
                    <div>
                    <p style={{textAlign:'center'}}>
                    {/* _______________________________________ <br/> */}
                    <br/>
                    <strong style={{textTransform:'uppercase'}}><u>{props.mratuDeptHeadName} </u></strong><br/>
                    {formatPos(props.mratuDeptHeadPos) }</p>
                    </div>
                   
                </div>
            </div>
            </div>
            {/* <div className='footer-print'>
                <FormFooter font = {12} version='CGB.F.037.REV00' phone = '(085) 817-5598' email='cmo.butuan@gmail.com' website='http://www.butuan.gov.ph'/>
            </div> */}
        </div>
    )
})
export default MRATUPrint
