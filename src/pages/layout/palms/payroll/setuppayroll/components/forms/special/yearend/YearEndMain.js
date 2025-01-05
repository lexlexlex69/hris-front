import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formatExtName, formatMiddlename, formatWithCommas } from '../../../../../../../customstring/CustomString';
import moment from 'moment';
export const YearEndMain = ({empList,index,perPage,isGrandTotal,printData,year}) => {
    const [pTotalMRate,setPTotalMRate] = useState(0);
    const [pTotal,setPTotal] = useState(0);
    const [pTotalCashGift,setTotalPCashGift] = useState(0);
    const [pTotalAAccrued,setPTotalAAccrued] = useState(0);
    const [pTotalBCGEA,setPTotalBCGEA] = useState(0);
    const [pTotalAmountDue,setPTotalAmountDue] = useState(0);
    const [rTotal,setRTotal] = useState(0);
    const [rTotalCGift,setRTotalCGift] = useState(0);
    const [rTotalBCGEA,setRTotalBCGEA] = useState(0);
    const [rTotalAccured,setRTotalAAccrued] = useState(0);
    const [rTotalAmountDue,setRTotalAmountDue] = useState(0);
    useEffect(()=>{
        // console.log(printData)
        let end = index;
        let i = 0;
        let rTotal_temp = 0;
        let rTotalCGift_temp = 0;
        let rTotalAccrued_temp = 0;
        let rTotalAmountDue_temp = 0;
        let rTotalBCGEA_temp = 0;
        for(i;i<=end;i++){
            let tempTotal = printData[i].map((el)=> {
                return parseFloat(el.amount)
            }).reduce((total,a)=>{
                return total + a
            })
            rTotal_temp+=tempTotal

            let tempTotalCGift = printData[i].map((el)=> {
                return parseFloat(el.cashgift)
            }).reduce((total,a)=>{
                return total + a
            })
            rTotalCGift_temp+=tempTotalCGift

            let tempTotalAAccrued = printData[i].map((el)=> {
                return (parseFloat(el.amount)+parseFloat(el.cashgift))
            }).reduce((total,a)=>{
                return total + a
            })
            rTotalAccrued_temp+=tempTotalAAccrued

            let tempTotalAmountDue = printData[i].map((el)=> {
                return (parseFloat(el.amount)+parseFloat(el.cashgift))-parseFloat(el.deduction)
            }).reduce((total,a)=>{
                return total + a
            })
            rTotalAmountDue_temp+=tempTotalAmountDue

            let tempTotalBCGEA = printData[i].map((el)=> {
                return parseFloat(el.deduction)
            }).reduce((total,a)=>{
                return total + a
            })
            rTotalBCGEA_temp+=tempTotalBCGEA
        }
        setRTotal(rTotal_temp);
        setRTotalCGift(rTotalCGift_temp);
        setRTotalAAccrued(rTotalAccrued_temp);
        setRTotalAmountDue(rTotalAmountDue_temp);
        setRTotalBCGEA(rTotalBCGEA_temp)
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
        let subTotalCGift = empList.map((el)=> {
            return parseFloat(el.cashgift)
        }).reduce((total,a)=>{
            return total + a
        })
        let subTotalAAccrued = empList.map((el)=> {
            return parseFloat(el.amount)+parseFloat(el.cashgift)
        }).reduce((total,a)=>{
            return total + a
        })
        let subTotalBCGEA = empList.map((el)=> {
            return el.deduction
        }).reduce((total,a)=>{
            return total + a
        })
        let subTotalAmountDue = empList.map((el)=> {
            return (parseFloat(el.amount)+parseFloat(el.cashgift))-parseFloat(el.deduction)
        }).reduce((total,a)=>{
            return total + a
        })
        setPTotalMRate(subTotalMRate)
        setPTotal(subTotal)
        setTotalPCashGift(subTotalCGift)
        setPTotalAAccrued(subTotalAAccrued)
        setPTotalBCGEA(subTotalBCGEA)
        setPTotalAmountDue(subTotalAmountDue)
    },[empList])
    const amountAccrued = (amount,cashgift) => {
        let total = parseFloat(amount)+parseFloat(cashgift);
        
        return total>0?formatWithCommas(total.toFixed(2)):'-'
    }
    const amountDue = (amount,cashgift,bcgea) => {
        // console.log(bcgea)
        let total = (parseFloat(amount)+parseFloat(cashgift))-parseFloat(bcgea);
        // console.log(total)
        return total>0?formatWithCommas(total.toFixed(2)):'-'
    }
    return (
    <main style={{display:'flex',justifyContent:'space-between'}}>
        <table style={{width:'100%'}}>
                    <thead>
                    <tr style={{whiteSpace:'nowrap'}}>
                        <th rowSpan="2" align='center'>No.</th>
                        <th rowSpan="2" >Employee Name</th>
                        <th rowSpan="2" >Position</th>
                        <th rowSpan="2" >Monthly <br/> Rate</th>
                        <th rowSpan="2"  align='center'>Date <br/> Started</th>
                        <th rowSpan="2">Year End <br/> Bonus</th>
                        <th rowSpan="2">Cash <br/> Gift</th>
                        <th rowSpan="2">Amount <br/> Accrued</th>
                        <th rowSpan="2">Withholding <br/> Tax</th>
                        <th colspan="2" >Deduction</th>
                        <th rowSpan="2" >Amount <br/> Due</th>
                        <th rowSpan="2" align='center'>No.</th>
                        <th  rowSpan="2">Signature of <br/> Payee</th>
                    </tr>
                    <tr>
                        <th>BCGEA</th>
                        <th>&nbsp;</th>
                    </tr>
                   
                    </thead>
                    <tbody>
                    {
                        empList&&empList.map((item,key)=>{
                        return(
                            <tr key={item.id}>
                                <td align='center' style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>
                                    {index*perPage+(key+1)}
                                </td>
                                <td style={{whiteSpace:'nowrap',textTransform:'uppercase',color:item.date_resigned?'red':'auto',borderColor:'#000'}} >
                                {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                </td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{item.description}</td>
                                <td align='right' style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{formatWithCommas(parseFloat(item.m_salary).toFixed(2))}</td>
                                <td align='center' style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{item.date_hired}</td>
                                <td align='right' style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{item.amount>0?formatWithCommas(parseFloat(item.amount).toFixed(2)):'-'}</td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{item.cashgift>0?formatWithCommas(parseFloat(item.cashgift).toFixed(2)):'-'}</td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{
                                        amountAccrued(item.amount,item.cashgift)
                                    }
                                </td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>-</td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{item.deduction>0?item.deduction:'-'}</td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>-</td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{
                                    amountDue(item.amount,item.cashgift,item.deduction)
                                }</td>
                                <td align='center' style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>
                                {index*perPage+(key+1)}
                                </td>
                                <td style={{color:item.date_resigned?'red':'auto',borderColor:'#000'}}>{item.date_resigned?`Resigned ${moment(item.date_resigned).format('MM/DD/YYYY')}`:''}</td>
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
                            <td align='right'>{formatWithCommas(pTotalCashGift.toFixed(2))}</td>
                            <td align='right'>{formatWithCommas(pTotalAAccrued.toFixed(2))}</td>
                            <td></td>
                            <td align='right'>{formatWithCommas(pTotalBCGEA.toFixed(2))}</td>
                            <td></td>
                            <td align='right'>{formatWithCommas(pTotalAmountDue.toFixed(2))}</td>
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
                            <td align='right'>{formatWithCommas(rTotalCGift.toFixed(2))}</td>
                            <td align='right'>{formatWithCommas(rTotalAccured.toFixed(2))}</td>
                            <td></td>
                            <td align='right'>{formatWithCommas(rTotalBCGEA.toFixed(2))}</td>
                            <td></td>
                            <td align='right'>{formatWithCommas(rTotalAmountDue.toFixed(2))}</td>
                            <td></td>
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
                            This is to certify that the employees herein listed in this roll,
                            have at least <b> SATISFACTORY </b> rating in their Individual
                            Performance Commitment and Review (IPCR) as applicable for the
                            current year.
                            </p>
                        </div>
                        <div>
                            <p>
                            This is to certify that the employees herein listed in this roll,
                            have rendered at lease a total or an aggregate of four (4) months
                            of service within the current year and are still in the government
                            service as of <b> NOVEMBER 30, {year} </b> except those in "*".
                            </p>
                            <p>
                            "*" employee has rendered less than four (4) months of service
                            within the current year.
                            </p>
                        </div>

                        <div className="flex-column-center">
                            <b>OWEN M. DUCENA, MPA</b>
                            <i>CHRM Officer</i>
                        </div>
                    </div>
                </div>
        </main>
    )
}