import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formatExtName, formatMiddlename, formatWithCommas } from '../../../../../../../customstring/CustomString';
import moment from 'moment';
export const SRIMain = ({empList,index,perPage,isGrandTotal,printData,year,isHR,deptHead}) => {
    const [pTotalMRate,setPTotalMRate] = useState(0);
    const [pTotal,setPTotal] = useState(0);
    const [rTotal,setTTotal] = useState(0);
    useEffect(()=>{
        let end = index;
        let i = 0;
        let rTotal = 0;
        for(i;i<=end;i++){
            let tempTotal = printData[i].map((el)=> {
                return parseFloat(el.amount)
            }).reduce((total,a)=>{
                return total + a
            })
            rTotal+=tempTotal
        }
        setTTotal(rTotal);
        let subTotalMRate = empList.map((el)=> {
            return parseFloat(el.m_salary)
        }).reduce((total,a)=>{
            return total + a
        })
        let subTotal = empList.map((el)=> {
            return parseFloat(el.amount)
        }).reduce((total,a)=>{
            return total + a
        })
        setPTotalMRate(subTotalMRate)
        setPTotal(subTotal)
    },[empList])
    return (
    <main style={{display:'flex',justifyContent:'space-between'}}>
        <table id = {`pei-payroll-table-${index}`} style={{width:'100%'}}>
                    <thead>
                    <tr style={{whiteSpace:'nowrap'}}>
                        {/* <th rowSpan="2" align='center'>No.</th>
                        <th rowSpan="2" style={{minWidth:250}}>Employee Name <br/>Position</th>
                        <th rowSpan="2" style={{minWidth:150}}>Position</th>
                        <th rowSpan="2" style={{minWidth:90}}>Monthly <br/> Rate</th>
                        <th rowSpan="2" style={{minWidth:90}} align='center'>Start <br/> Date</th>
                        <th rowSpan="2">PEI</th>
                        <th colspan="3" style={{minWidth:200}}>Deduction</th>
                        <th rowSpan="2" style={{minWidth:100}}>Amount <br/> Due</th>
                        <th rowSpan="2" align='center'>No.</th>
                        <th  rowSpan="2">Signature of <br/> Payee</th> */}
                        
                        <th rowSpan="2" align='center'>No.</th>
                        <th rowSpan="2" >Employee Name</th>
                        <th rowSpan="2" >Position</th>
                        <th rowSpan="2" >Monthly <br/> Rate</th>
                        <th rowSpan="2"  align='center'>Start <br/> Date</th>
                        <th rowSpan="2">CNA</th>
                        <th colspan="3" >Deduction</th>
                        <th rowSpan="2" >Amount <br/> Due</th>
                        <th rowSpan="2" align='center'>No.</th>
                        <th  rowSpan="2">Signature of <br/> Payee</th>
                    </tr>
                    <tr>
                        <th>&nbsp;</th>
                        <th></th>
                        <th></th>
                    </tr>
                   
                    </thead>
                    <tbody>
                    {
                        empList&&empList.map((item,key)=>{
                        return(
                            <tr key={item.id}>
                                <td align='center' style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>
                                    {index*perPage+(key+1)}
                                </td>
                                <td style={{whiteSpace:'nowrap',textTransform:'uppercase',color:item.date_resigned?'red':'black',borderColor:'#000'}}>
                                {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                </td>
                                <td style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>{item.description}</td>
                                <td align='right' style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>{formatWithCommas(parseFloat(item.m_salary).toFixed(2))}</td>
                                <td align='center' style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>{item.date_hired}</td>
                                <td align='right' style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>{item.amount>0?formatWithCommas(parseFloat(item.amount).toFixed(2)):'-'}</td>
                                <td style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>-</td>
                                <td style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>-</td>
                                <td style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>-</td>
                                <td align='right' style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>{formatWithCommas(parseFloat(item.amount).toFixed(2))}</td>
                                <td align='center' style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>
                                {index*perPage+(key+1)}
                                </td>
                                <td style={{color:item.date_resigned?'red':'black',borderColor:'#000'}}>{item.date_resigned?`Separated ${moment(item.date_resigned).format('MM/DD/YYYY')}`:''}</td>
                            </tr>
                        )
                    })
                    }
                    
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>&nbsp;</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>Page Total</td>
                            <td></td>
                            {/* <td>{formatWithCommas(pTotalMRate.toFixed(2))}</td> */}
                            <td></td>
                            <td></td>
                            <td align='right'>{formatWithCommas(pTotal.toFixed(2))}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td align='right'>{formatWithCommas(pTotal.toFixed(2))}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td align="left">{isGrandTotal?'Grand Total':'Running Total'}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td align='right'>{formatWithCommas(rTotal.toFixed(2))}</td>
                             <td></td>
                            <td></td>
                            <td></td>
                            <td align='right'>{formatWithCommas(rTotal.toFixed(2))}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                    
                </table>
                <div className='side-text'>
                    <div className="text-center">
                        <b>CERTIFICATION</b>
                    </div>
                    <div style={{display: 'flex',flexDirection: 'column', gap: '20px'}}>
                        <div>
                            <p>
                            This is to certify that the employees herein listed in this roll, have met the requirements commensurate to the amount stipulated herein as provided by CNA Guidelines FY {year}
                            </p>
                        </div>

                        {
                            isHR
                            ?
                            null
                            :
                            <div className="flex-column-center" style={{marginBottom:
                            '20px'}}>
                                <b style={{textTransform:'uppercase'}}>{deptHead?.head_name}</b>
                                <i>{deptHead?.head_position}</i>
                            </div>

                        }
                        
                        <div className="flex-column-center">
                            <b>OWEN M. DUCENA, MPA</b>
                            <i>CHRM Officer</i>
                        </div>
                    </div>
                </div>
        </main>
    )
}