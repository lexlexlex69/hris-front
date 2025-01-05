import React,{useEffect, useState} from 'react';
import Logo from '../../../.././assets/img/bl.png'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography,Box } from '@mui/material';
import {blue,red,orange,green} from '@mui/material/colors';
import { tableCellClasses } from '@mui/material/TableCell';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import moment from 'moment';
import './SRATU.css';
import FormFooter from '../../forms/footer/FormFooter';
import { formatWithCommas } from '../../customstring/CustomString';
export const SRATUPrint = React.forwardRef((props,ref)=>{
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [months,setMonths] = useState([]);
    const [year,setYear] = useState('');
    useEffect(()=>{
        // console.log(props.date)
        var t_date = [];
        var year;
        if(props.date.length !==0){
            // props.date.forEach(el=>{
            //     t_date.push(el.format('MMMM'));
            //     year = el.format('YYYY')
            // })
            props.date.forEach((el,key)=>{
                if(key === 0){
                    t_date.push(el.format('MMMM')+ ' ' + props.date[key].format('DD - '));
                }else{
                    if(key === props.date.length-1){
                        if(el.format('MMMM') === props.date[key-1].format('MMMM')){
                            t_date.push(props.date[key].format('DD,'));
                        }else{
                            t_date.push(el.format('MMMM')+ ' ' + props.date[key].format('DD,'));
                        }
                    }else{
                        if(el.format('MMMM') === props.date[key-1].format('MMMM')){
                            t_date.push(props.date[key].format('DD'));
                        }else{
                            t_date.push(el.format('MMMM')+ ' ' + props.date[key].format('DD - '));
                        }
                    }
                }
                year = el.format('YYYY')
            })

            var t_new_arr = [... new Set(t_date)]
            // console.log(t_new_arr);
            setMonths(t_new_arr);
            setYear(year);
        }
        
    },[props.date])
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
        <div id='sratu' ref ={ref} style={{fontFamily:'cambria'}}>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                {/* <div style={{paddingRight:'20px'}}>
                    <img src={Logo} alt="" width={70} height={70} />
                </div> */}
                <div>
                <div style={{height:'140px',width:'100%'}}>
                    <img src={props.letterHead} height='100%' width='800px'/>
                </div>

                <p style={{textAlign:'center',lineHeight:'15px'}}>
                    {/* <span style={{fontSize:'.9rem'}}>Republic of the Philippines</span> <br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>CITY HUMAN RESOURCE MANAGEMENT OFFICE</span><br/>
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Butuan City</span> <br/><br/> */}
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>SUMMARY REPORT ON ABSENCES, TARDINESS AND UNDERTIME (SRATU)</span><br/>
                    {/* <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Month of {props.selectedMonthYear?props.selectedMonthYear.month.name:null} <u>{props.selectedMonthYear?props.selectedMonthYear.year:null}</u>
                    </span> */}
                    <span style={{fontSize:'.9rem',fontWeight:'bold'}}>PERIOD OF <u>{months.map((row,key)=><span key={key}>{row}</span>)} {year}</u>
                    </span>
                    {/* <span style={{fontSize:'.9rem',fontWeight:'bold'}}>Month of {months.map((row,key)=><span key={key}>{row}</span>)} <u>{year}</u>
                    </span> */}
                    <br/>
                    <br/>
                    <span style={{color:blue[600],fontSize:'1rem',textTransform:'uppercase',fontStyle:'italic',fontWeight:'bold'}}>
                        {props.empStatus}
                    </span>
                    
                </p>
                </div>

            </div>
                <table className='sratu-custom-table' id='table-with-page'>
                    <thead>
                        <tr className='sratu-custom-header'>
                            <th rowSpan={2}>
                                No.
                            </th>
                            <th rowSpan={2}>
                                NAME OF EMPLOYEE
                            </th>
                            <th rowSpan={2}>
                                Monthly Rate
                            </th>
                            <th rowSpan={2}>
                                Daily Rate
                            </th>
                            <th colSpan={4}>
                                ABSENCES, TARDINESS, UNDERTIME
                            </th>
                            <th rowSpan={2}>
                                REMARKS
                            </th>
                        </tr>
                        <tr style={{background:'#e3bfff',textAlign:'center'}}>
                            <th>
                                Days
                            </th>
                            <th>
                                Hrs.
                            </th>
                            <th>
                                Min.
                            </th>
                            <th>
                                TOTAL
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((row,key)=>
                                <tr key={key} style={{textAlign:'center'}}>
                                    <td>
                                        {key+1}
                                    </td>
                                    <td align='left'>
                                        {row.lname}, {row.fname} {row.mname?row.mname.charAt(0)+'.':''}
                                    </td>
                                    <td>
                                        {formatWithCommas((row.rate/12).toFixed(0))}
                                    </td>
                                    <td>
                                        {formatWithCommas(((row.rate/12)/22).toFixed(2))}
                                    </td>
                                    <td>
                                        {row.total_absent>0?row.total_absent:null}
                                    </td>
                                    <td>
                                        {row.total_late_undertime_hours>0?row.total_late_undertime_hours:null}
                                    </td>
                                    <td>
                                        {row.total_late_undertime_minutes>0?row.total_late_undertime_minutes:null}
                                    </td>
                                    <td>
                                        {row.total>0?row.total+' min/s':null}
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
                    <p style={{textAlign:'center'}}>_______________________________________ <br/>
                    <strong style={{textTransform:'uppercase'}}>{props.sratuPreparedByName} </strong><br/>
                    {/* {props.sratuPreparedByPos} */}
                    {formatPos(props.sratuPreparedByPos)}</p>
                    </div>
                   
                </div>
                <div>
                    <p>Certified Correct:</p>
                    <div>
                    <p style={{textAlign:'center'}}>_______________________________________ <br/>
                    <strong style={{textTransform:'uppercase'}}>{props.sratuDeptHeadName} </strong><br/>
                    {formatPos(props.sratuDeptHeadPos)}</p>
                    </div>
                   
                </div>
            </div>
            <div className='footer-print'>
                <FormFooter font = {12} version='CGB.F.082.REV00' phone = '(085) 817-5598' email='cmo.butuan@gmail.com' website='http://www.butuan.gov.ph'/>
            </div>
        </div>
    )
})
export default SRATUPrint;