import React, { useEffect, useState } from "react";
import { formatEmptyNumber, formatExtName, formatMiddlename, formatTwoDateToTextPayroll, formatWithCommas, isNumeric, truncateToDecimals } from "../../../../../../customstring/CustomString";
import { Box } from "@mui/material";
import { green, grey } from "@mui/material/colors";

export const JOMain = ({ empList, index, loans, perPage, isGrandTotal, printData, periodFrom, periodTo, wTax }) => {

    // useEffect(()=>{
    //     const chunkSize = 10;
    //     let arr = [];
    //     for (let i = 0; i < empList.length; i += chunkSize) {
    //         const chunk = empList.slice(i, i + chunkSize);
    //         arr.push(chunk)
    //     }
    //     console.log(arr)
    //     setPrintData(arr)
    // },[empList])
    const checkLoansCell = (row) => {
        const col_num = loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        if (col_num > 0) {
            if (row.loan_dtl) {
                for (let i = 0; i < col_num; i++) {
                    cols.push(<td>
                        {
                            loans.slice((col_page - 1) * col_per_page, (col_page - 1) * col_per_page + col_per_page).map((item, key) => {
                                return (
                                    isExists(row, item)
                                        ?
                                        <span key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem' }}>
                                            <span>{key + 1}.</span>&nbsp; <span>{isExists(row, item)}</span>
                                        </span>
                                        :
                                        <span key={key}>

                                        </span>
                                )
                            })
                        }
                    </td>
                    )
                    col_page++;
                }
                return (
                    <>{cols}</>
                )
            } else {
                for (let i = 0; i < col_num; i++) {
                    cols.push(<td>
                    </td>
                    )
                }
                return (
                    <>{cols}</>
                )
            }
        } else {
            return (<td></td>)
        }
    }
    const isExists = (row, loan_abbr) => {
        let loan_dtl_arr = JSON.parse(row.loan_dtl).filter(el => el.loan_abbr === loan_abbr);
        if (loan_dtl_arr.length > 0) {
            return formatWithCommas(loan_dtl_arr[0].amount.toFixed(2))
        } else {
            return null;
        }
    }
    const loansCell = () => {
        const col_num = loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for (let i = 0; i < col_num; i++) {
            cols.push(<td rowSpan={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: '.7rem', textAlign: 'left' }}>
                    {
                        loans.slice((col_page - 1) * col_per_page, (col_page - 1) * col_per_page + col_per_page).map((item, key) => {
                            return (
                                <span key={key} style={{ paddingLeft: '13px', textIndent: '-13px' }}>
                                    {key + 1}. {item}
                                </span>
                            )
                        })
                    }
                </Box>
            </td>
            )
            col_page++;
        }
        if (col_num > 0) {
            return (
                <>{cols}</>
            )
        } else {
            return <td rowSpan={2}></td>
        }
    }
    const loansCellExtra = () => {
        const col_num = loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for (let i = 0; i < col_num; i++) {
            cols.push(<td>
            </td>
            )
            col_page++;
        }
        if (col_num > 0) {
            return (
                <>{cols}</>
            )
        } else {
            return <td></td>
        }
    }
    const [totalPageDeductions, setTotalPageDeductions] = useState(0)
    const [totalMSalary, setTotalMSalary] = useState();
    const [totalPSalary, setTotalPSalary] = useState();
    const [totalAbsentDays, setTotalAbsentDays] = useState();
    const [totalLateHrs, setTotalLateHrs] = useState();
    const [totalLateMins, setTotalLateMins] = useState();
    const [totalLateDeduct, setTotalLateDeduct] = useState();
    const [totalAccrued, setTotalAccrued] = useState();
    const [totalPagIbig, setTotalPagIbig] = useState();
    const [totalSSS, setTotalSSS] = useState();
    const [totalPH, setTotalPH] = useState();
    const [totalContri, setTotalContri] = useState();
    const [totalAmountDue, setTotalAmountDue] = useState();
    useEffect(() => {
        var m_salary = empList.map((el) => {
            return parseFloat(el.m_salary)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalMSalary(formatEmptyNumber(m_salary, '-'))
        var p_salary = empList.map((el) => {
            return parseFloat(el.m_salary * 22) / 2
        }).reduce((total, a) => {
            return total + a
        })
        setTotalPSalary(formatEmptyNumber(p_salary, '-'))

        var absent_days = empList.map((el) => {
            return parseFloat(el.wopay_days)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalAbsentDays(formatEmptyNumber(absent_days, '-'))

        var late_hrs = empList.map((el) => {
            return parseFloat(el.wopay_hours)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalLateHrs(formatEmptyNumber(late_hrs, '-'))

        var late_mins = empList.map((el) => {
            return parseFloat(el.wopay_minutes)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalLateMins(formatEmptyNumber(late_mins, '-'))

        var late_deduct = empList.map((el) => {
            return parseFloat(el.total_wopay)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalLateDeduct(formatEmptyNumber(late_deduct, '-'))

        var accrued = empList.map((el) => {
            return (parseFloat(el.m_salary * 22) / 2) - parseFloat(el.total_wopay)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalAccrued(formatEmptyNumber(accrued, '-'))

        var pagibig = empList.map((el) => {
            return parseFloat(el.pagibig)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalPagIbig(formatEmptyNumber(pagibig, '-'))

        var sss = empList.map((el) => {
            return parseFloat(el.sss)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalSSS(formatEmptyNumber(sss, '-'))

        var ph = empList.map((el) => {
            return parseFloat(el.ph_personal_share)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalPH(formatEmptyNumber(ph, '-'))

        var contri = empList.map((el) => {
            return parseFloat(el.tot_contri)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalContri(formatEmptyNumber(contri, '-'))

        var amount_due = empList.map((el) => {
            return (parseFloat(el.m_salary * 22) / 2) - parseFloat(el.total_wopay) - parseFloat(el.tot_contri)
        }).reduce((total, a) => {
            return total + a
        })
        setTotalAmountDue(formatEmptyNumber(amount_due, '-'))

        var w_tax = empList.map((el) => {
            return parseFloat(el.tax)
        }).reduce((total, a) => {
            return total + a
        })

        var pera = empList.map((el) => {
            return parseFloat(el.pera)
        }).reduce((total, a) => {
            return total + a
        })
        var gsis_per = empList.map((el) => {
            return parseFloat(el.gsis_personal_share)
        }).reduce((total, a) => {
            return total + a
        })

        var pagibig_per = empList.map((el) => {
            return parseFloat(el.pagibig)
        }).reduce((total, a) => {
            return total + a
        })

        var ph_per = empList.map((el) => {
            return parseFloat(truncateToDecimals(el.ph_personal_share))
        }).reduce((total, a) => {
            return total + a
        })
    }, [empList])
    const pageTotal = (type) => {
        var m_salary = empList.map((el) => {
            return parseFloat(el.m_salary)
        }).reduce((total, a) => {
            return total + a
        })
        var p_salary = empList.map((el) => {
            return parseFloat(el.m_salary) / 2
        }).reduce((total, a) => {
            return total + a
        })
        var wopay = empList.map((el) => {
            return parseFloat(el.total_wopay)
        }).reduce((total, a) => {
            return total + a
        })
        var w_tax = empList.map((el) => {
            return parseFloat(el.tax)
        }).reduce((total, a) => {
            return total + a
        })

        var pera = empList.map((el) => {
            return parseFloat(el.pera)
        }).reduce((total, a) => {
            return total + a
        })
        var gsis_per = empList.map((el) => {
            return parseFloat(el.gsis_personal_share)
        }).reduce((total, a) => {
            return total + a
        })

        var pagibig_per = empList.map((el) => {
            return parseFloat(el.pagibig)
        }).reduce((total, a) => {
            return total + a
        })

        var ph_per = empList.map((el) => {
            return parseFloat(truncateToDecimals(el.ph_personal_share))
        }).reduce((total, a) => {
            return total + a
        })
        var loan_arr = empList.filter(el => {
            if (el.loan_dtl) {
                return true;
            }
        }).map(el => {
            return JSON.parse(el.loan_dtl)
        })
        var total_loan = 0;
        loan_arr.forEach(el => {
            var t_total = el.map(el2 => {
                return el2.amount
            }).reduce((total, a) => {
                return total + a;
            })
            total_loan += t_total
        })
        switch (type) {
            case 'm_salary':
                // var t_total = empList.map((el)=>{
                //     return el.m_salary
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                return formatWithCommas(parseFloat(m_salary).toFixed(2));
                break;
            case 'p_salary':
                return formatWithCommas(parseFloat(p_salary).toFixed(2))
                break;
            case 'wopay':
                // var t_total = empList.map((el)=>{
                //     return el.total_wopay
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if (wopay > 0) {
                    return formatWithCommas(parseFloat(wopay).toFixed(2));
                } else {
                    return '-';
                }
                break
            case 'accrued':
                var t_total = empList.map((el) => {
                    return formatWithCommas(parseFloat(el.m_salary * 22) / 2) - el.total_wopay
                }).reduce((total, a) => {
                    return total + a
                })
                if (t_total > 0) {
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'pera':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.pera)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if (pera > 0) {
                    return formatWithCommas(parseFloat(pera).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'wtax':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.tax)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if (w_tax > 0) {
                    return formatWithCommas(parseFloat(w_tax).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'gsis-personal':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.gsis_personal_share)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if (gsis_per > 0) {
                    return formatWithCommas(parseFloat(gsis_per).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'gsis-gov':
                var t_total = empList.map((el) => {
                    return parseFloat(el.gsis_gov_share)
                }).reduce((total, a) => {
                    return total + a
                })
                if (t_total > 0) {
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'ecc':
                var t_total = empList.map((el) => {
                    return parseFloat(el.ecc)
                }).reduce((total, a) => {
                    return total + a
                })
                if (t_total > 0) {
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'pagibig-personal':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.pagibig)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if (pagibig_per > 0) {
                    return formatWithCommas(parseFloat(pagibig_per).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'pagibig-gov':
                var t_total = empList.map((el) => {
                    return parseFloat(el.pagibiggov)
                }).reduce((total, a) => {
                    return total + a
                })
                if (t_total > 0) {
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'PH-personal':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(truncateToDecimals(el.ph_personal_share))
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if (ph_per > 0) {
                    return formatWithCommas(parseFloat(ph_per).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'PH-gov':
                var t_total = empList.map((el) => {
                    return parseFloat(el.ph_gov_share.toFixed(2))
                }).reduce((total, a) => {
                    return total + a
                })
                if (t_total > 0) {
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                } else {
                    return '-';
                }
                break;
            case 'total-deductions':
                return (wopay + w_tax + gsis_per + pagibig_per + ph_per + total_loan) > 0 ? formatWithCommas((wopay + w_tax + gsis_per + pagibig_per + ph_per + total_loan).toFixed(2)) : '-';
                break;
            case 'total-15th-pay':
                return formatWithCommas((((m_salary + pera) - (w_tax + gsis_per + pagibig_per + ph_per + wopay + total_loan)) / 2).toFixed(2));
                // return formatWithCommas((parseFloat(m_salary+parseFloat(pera))-(parseFloat(w_tax)+parseFloat(gsis_per)+parseFloat(pagibig_per)+parseFloat(ph_per)+parseFloat(wopay)+parseFloat(total_loan))/2).toFixed(2))
                break;
            case 'total-30th-pay':
                return formatWithCommas(truncateToDecimals(((m_salary + pera) - (w_tax + gsis_per + pagibig_per + ph_per + wopay + total_loan)) / 2).toFixed(2))

                break;
        }

    }
    const totalDeductions = (item, key) => {
        if (item.loan_dtl) {
            var t_total = JSON.parse(item.loan_dtl).map((el) => {
                return el.amount
            }).reduce((total, amount) => {
                return total + amount
            })
            return (
                t_total
            )
        } else {
            return 0;
        }
    }
    // const loansCellFooter = () =>{
    //     if(loans.length>0){
    //         const col_num = loans.length === 0?0:Math.floor(loans.length/3)+(loans.length%3 === 0?0:1);
    //         const cols = [];
    //         let t_arr = [];
    //         let col_page = 1;
    //         let col_per_page = 3;
    //         let t_loan_name = (loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page))
    //         for(let i=0;i<=col_num;i++){
    //             var t_total_loan = 0;
    //             empList.forEach(el=>{
    //                 if(el.loan_dtl){
    //                     var t_l_dtl = JSON.parse(el.loan_dtl).filter(object=>object.loan_abbr === t_loan_name[i])
    //                     if(t_l_dtl.length>0){
    //                         console.log(t_l_dtl)
    //                         t_total_loan+=t_l_dtl[0].amount
    //                     }
    //                 }
    //             })
    //             if(t_total_loan>0){
    //                 t_arr.push({
    //                     loan_abbr:t_loan_name[i],
    //                     total:t_total_loan   
    //                 })
    //             }

    //             col_page++;
    //         }
    //         console.log(col_num)
    //         console.log(t_arr)
    //         for(var x = 0; x<col_num;x++){
    //             cols.push(<td>
    //             <Box sx={{display:'flex',flexDirection:'column',fontSize:'.7rem',textAlign:'right'}}>
    //                 {
    //                     t_arr.map((item,key)=>{
    //                         return (
    //                             <span key={key}>
    //                                 {formatWithCommas(item.total.toFixed(2))}
    //                             </span>
    //                         )
    //                     })
    //                 }
    //             </Box>
    //             </td>
    //     )
    //         }

    //         if(col_num>0){
    //             return (
    //                 <>{cols}</>
    //             )
    //         }else{
    //             return <td></td>
    //         }
    //     }

    // }
    const loansCellFooter = () => {
        const col_num = loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for (let i = 0; i < col_num; i++) {
            cols.push(<td>
                <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: '.7rem', textAlign: 'right' }}>
                    {
                        loans.slice((col_page - 1) * col_per_page, (col_page - 1) * col_per_page + col_per_page).map((item, key) => {
                            return (
                                <span key={key}>
                                    {loansCellFooterTotal(item)}
                                </span>
                            )
                        })
                    }
                </Box>
            </td>
            )
            col_page++;
        }
        if (col_num > 0) {
            return (
                <>{cols}</>
            )
        } else {
            return <td></td>
        }
    }
    const taxCellFooterExtra = () => {
        const col_num = wTax.length;
        const cols = [];
        for (let i = 0; i < col_num; i++) {
            cols.push(<td>
            </td>
            )
        }
        if (col_num > 0) {
            return (
                <>{cols}</>
            )
        } else {
            return <td></td>
        }
    }
    const loansCellFooterTotal = (loan_abbr) => {
        var total = 0;
        var filtered = empList.map(el => {
            return el.loan_dtl;
        }).filter(el2 => el2 != null)
        filtered.forEach(el => {
            var arr = JSON.parse(el)
            arr.forEach(el2 => {
                if (el2.loan_abbr === loan_abbr) {
                    total += el2.amount
                }
            })

        })
        return total > 0 ? formatWithCommas(total.toFixed(2)) : '-';
    }
    // const extraLoansCellFooter = () =>{

    //     //Loans
    //     const col_num = loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1);
    //     const cols = [];
    //     let col_page = 1;
    //     let col_per_page = 3;
    //     let start = 15;
    //     for(let i=0;i<col_num;i++){
    //         let t_total_loan = 0;
    //         loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).forEach((el2,key)=>{
    //             empList.forEach(el=>{
    //                 if(el.loan_dtl){
    //                     if(isExists(el,el2)){
    //                         t_total_loan+=parseFloat(isExists(el,el2).replace(',',''))
    //                     }

    //                 }
    //             })
    //         })
    //         if(t_total_loan>0){
    //             cols.push(<tr align="right">
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td></td>
    //                 <td>{formatWithCommas(t_total_loan.toFixed(2))}</td>

    //                 </tr>
    //             )
    //         }
    //         start++;
    //         col_page++;
    //     }
    //     return (
    //         <>{cols}</>
    //     )
    // }
    const rTotalCellFooter = () => {
        //Loans
        const col_num = loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        let start = 15;
        for (let i = 0; i < col_num; i++) {
            let t_total_loan = 0;
            loans.slice((col_page - 1) * col_per_page, (col_page - 1) * col_per_page + col_per_page).forEach(el2 => {
                for (let x = 0; x <= index; x++) {
                    printData[x].forEach(el => {
                        if (el.loan_dtl) {
                            if (isExists(el, el2)) {
                                t_total_loan += parseFloat(isExists(el, el2)?.replace(',', ''))
                                // console.log(t_total_loan)
                            }

                        }
                    })
                }
            })
            if (t_total_loan > 0) {
                cols.push(<td align="right">
                    {formatWithCommas(t_total_loan.toFixed(2))}
                </td>
                )
            } else {
                cols.push(<td align="right">
                    -
                </td>
                )
            }
            start++;
            col_page++;
        }
        return (
            <>{cols}</>
        )
    }
    useEffect(() => {
        var table = document.getElementById(`casual-payroll-table-${index}`)
        var totdeductiontable = table;
        var table15thpay = table;
        var table30thpay = table;

        //Loans
        // const col_num = Math.floor(loans.length/3)+(loans.length%3===0?0:1);
        // const cols = [];
        // let col_page = 1;
        // let col_per_page = 3;
        // let start = 15;
        // for(let i=0;i<col_num;i++){
        //     let t_total_loan = 0;
        //     loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).forEach(el2=>{
        //         empList.forEach(el=>{
        //             if(el.loan_dtl){
        //                 if(isExists(el,el2)){
        //                     t_total_loan+=parseFloat(isExists(el,el2).replace(',',''))
        //                 }

        //             }
        //         })
        //     })
        //     if(t_total_loan>0){
        //         document.getElementById("loan-total-"+index+"-"+i).innerHTML = formatWithCommas(t_total_loan.toFixed(2));
        //     }else{
        //         document.getElementById("loan-total-"+index+"-"+i).innerHTML = '-';
        //     }
        //     start++;
        //     col_page++;
        // }

        //End loans

        //Running Total Deductions
        let rTotalDeductions = 0;
        let rTotal15thPay = 0;
        let rTotal30thPay = 0;
        for (let x = 0; x <= index; x++) {
            var table = document.getElementById(`casual-payroll-table-${x}`)
            var rtotdeductiontable = table;
            var rtot15thPay = table;
            var rtot30thPay = table;

            let rtotdeductiontable_arr = Array.from(rtotdeductiontable.rows)

            rtotdeductiontable_arr.splice(rtotdeductiontable_arr.length - 1, 1)

            let rtotDeductionsSubTotal = rtotdeductiontable_arr.slice(3).reduce((total, row, i, arr) => {
                var rem_commas = (row.cells[16 + (loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1))]?.innerHTML)?.replace(',', '');
                if (i < (printData[x].length - 1) * 2) {
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                } else {
                    arr.splice(1);
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }
                // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
                // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);

            rTotalDeductions += rtotDeductionsSubTotal;


            //15th month pay running total
            let rtot15thPay_arr = Array.from(rtot15thPay.rows)

            rtot15thPay_arr.splice(rtot15thPay_arr.length - 1, 1)

            let rtot15thPaySubTotal = rtot15thPay_arr.slice(3).reduce((total, row, i, arr) => {
                var rem_commas = (row.cells[17 + (loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1))]?.innerHTML)?.replace(',', '');
                if (i < (printData[x].length - 1) * 2) {
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                } else {
                    arr.splice(1);
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }
                // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
                // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);
            rTotal15thPay += rtot15thPaySubTotal;

            //30th month pay running total
            let rtot30thPay_arr = Array.from(rtot30thPay.rows)

            rtot30thPay_arr.splice(rtot30thPay_arr.length - 1, 1)

            let rtot30thPaySubTotal = rtot30thPay_arr.slice(3).reduce((total, row, i, arr) => {
                var rem_commas = (row.cells[18 + (loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1))]?.innerHTML)?.replace(',', '');
                if (i < (printData[x].length - 1) * 2) {
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                } else {
                    arr.splice(1);
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }
                // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
                // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);
            rTotal30thPay += rtot30thPaySubTotal;

        }
        // console.log(rTotal30thPay)
        //End  Runningtotal deductions



        // Total Deductions

        let totdeductiontable_arr = Array.from(totdeductiontable.rows)

        totdeductiontable_arr.splice(totdeductiontable_arr.length - 1, 1)

        let totDeductionsSubTotal = totdeductiontable_arr.slice(3).reduce((total, row, i, arr) => {
            var rem_commas = (row.cells[16 + (loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1))]?.innerHTML)?.replace(',', '');
            if (i < (empList.length - 1) * 2) {
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            } else {
                arr.splice(1);
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0)
            }
            // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
            // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
        }, 0);
        //End total deductions

        //Total 15th month pay

        let table15thpay_arr = Array.from(table15thpay.rows)

        table15thpay_arr.splice(table15thpay_arr.length - 1, 1)

        let tot15thSubTotal = table15thpay_arr.slice(3).reduce((total, row, i, arr) => {
            var rem_commas = (row.cells[17 + (loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1))]?.innerHTML)?.replace(',', '');
            if (i < (empList.length - 1) * 2) {
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            } else {
                arr.splice(1);
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0)
            }
            // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
            // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
        }, 0);
        //End total 15th pay

        //Total 20th month pay

        let table30thpay_arr = Array.from(table30thpay.rows)

        table30thpay_arr.splice(table30thpay_arr.length - 1, 1)

        let tot30thSubTotal = table30thpay_arr.slice(3).reduce((total, row, i, arr) => {
            var rem_commas = (row.cells[18 + (loans.length === 0 ? 1 : Math.floor(loans.length / 3) + (loans.length % 3 === 0 ? 0 : 1))]?.innerHTML)?.replace(',', '');
            if (i < (empList.length - 1) * 2) {
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            } else {
                arr.splice(1);
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0)
            }
            // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
            // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
        }, 0);
        //End total 30th pay

        // document.getElementById(`total-deductions-${index}`).innerHTML = totDeductionsSubTotal>0?formatWithCommas(totDeductionsSubTotal.toFixed(2)):'-';
        // document.getElementById(`r-total-deductions-${index}`).innerHTML = rTotalDeductions > 0?formatWithCommas(rTotalDeductions.toFixed(2)):'-';
        // document.getElementById(`r-total-15th-pay-${index}`).innerHTML = formatWithCommas(rTotal15thPay.toFixed(2));
        // document.getElementById(`r-total-30th-pay-${index}`).innerHTML = formatWithCommas(rTotal30thPay.toFixed(2));
        // document.getElementById(`total-15th-pay-${index}`).innerHTML = formatWithCommas(tot15thSubTotal.toFixed(2));
        // document.getElementById(`total-30th-pay-${index}`).innerHTML = formatWithCommas(tot30thSubTotal.toFixed(2));

    }, [empList, index, loans])
    const runningTotal = (type, index) => {
        let total = 0;
        switch (type) {
            case 'm_salary':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.m_salary)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))
                break;
            case 'p_salary':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat((el.m_salary * 22) / 2)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))
                break;
            case 'absent_days':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.wopay_days)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total, '-'));
                break;
            case 'late_hrs':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.wopay_hours)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total, '-'));
                break;
            case 'late_mins':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.wopay_minutes)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total, '-'));
                break;
            case 'late_deduction':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.total_wopay)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total, '-'));
                break;
            case 'accrued':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(((el.m_salary * 22) / 2) - el.total_wopay)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatWithCommas(total.toFixed(2)));
                break;
            case 'wopay':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.total_wopay)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))
                break;

            case 'pagibig-per':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.pagibig)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))

                break;

            case 'ph-per':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.ph_personal_share)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))
                break;
            case 'sss':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.sss)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))
                break;
            case 'total-contri':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return parseFloat(el.tot_contri)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))
                break;
            case 'amount-due':
                var i = 0;
                for (i; i <= index; i++) {
                    var t_total = printData[i].map(el => {
                        return (parseFloat(el.m_salary * 22) / 2 - parseFloat(el.total_wopay)) - parseFloat(el.tot_contri)
                    }).reduce((total, a) => {
                        return total + a
                    })
                    total += t_total;
                }
                return (formatEmptyNumber(total))
                break;

            default:
                total = 0;
                break
        }
    }
    const taxCell = () => {
        let cols = [];
        for (let i = 0; i < wTax.length; i++) {
            cols.push(<th align="center">
                {wTax[i]}%
            </th>
            )
        }
        return (
            <>{cols}</>
        )

    }
    const rTotalTaxCell = () => {
        let cols = [];
        let x = 0;
        let total = 0;
        //loop wtax array
        for (let i = 0; i < wTax.length; i++) {
            cols.push(<td align="right">
                {rTotalTaxCells(wTax[i])}
            </td>
            )
        }


        return (
            <>{cols}</>
        )
    }
    const taxCellFooter = () => {
        let cols = [];
        for (let i = 0; i < wTax.length; i++) {
            cols.push(<td align="right">
                {totalTaxCells(wTax[i])}
            </td>
            )
        }
        return (
            <>{cols}</>
        )

    }
    const checkTaxCells = (item) => {
        let cols = [];
        for (let i = 0; i < wTax.length; i++) {
            if (item.fixed_tax !== null) {
                if (item.fixed_tax === wTax[i]) {
                    cols.push(<td align="center">
                        {item.tax > 0 ? formatWithCommas((item.tax).toFixed(2)) : ''}
                    </td>
                    )
                } else {
                    cols.push(<td>
                    </td>
                    )
                }
            } else {
                cols.push(<td>
                </td>
                )
            }

        }
        return (
            <>{cols}</>
        )

    }
    const rTotalTaxCells = (type) => {
        let total = 0;
        for (let x = 0; x <= index; x++) {
            let arr = printData[x].filter(el => el.fixed_tax === type)
            if (arr.length > 0) {
                let subTotal = arr.map(el => el.tax).reduce((total, a) => {
                    return total + a
                })
                total += subTotal;
                // return formatEmptyNumber(parseFloat(subTotal.toFixed(2)),'-')
            }
            // var t_total = printData[i].map(el=>{
            //     return parseFloat(el.m_salary)
            // }).reduce((total,a)=>{
            //     return total + a
            // })
            // total+=t_total;
        }
        return formatEmptyNumber(total, '-')

        // return (
        //     subTotal
        // )

    }
    const totalTaxCells = (type) => {
        let arr = empList.filter(el => el.fixed_tax === type)
        if (arr.length > 0) {
            console.log(arr)
            let subTotal = arr.map(el => el.tax).reduce((total, a) => {
                return total + a
            })
            return formatEmptyNumber(parseFloat(subTotal.toFixed(2)), '-')
        } else {
            return '-'
        }
        // return (
        //     subTotal
        // )
    }
    const calculateAmountDue = (m_salary, total_wopay, tot_contri) => {
        let total = formatWithCommas((((parseFloat(m_salary * 22) / 2) - parseFloat(total_wopay)) - parseFloat(tot_contri)).toFixed(2));
        // debugger;
        return total;
    }
    return (
        <main>
            <table className="casual-table" id={`casual-payroll-table-${index}`}>
                <thead>
                    <tr style={{ whiteSpace: 'nowrap' }}>
                        <th rowSpan="2" align="center">No.</th>
                        <th rowSpan="2">Employee Name</th>
                        <th rowSpan="2">Position</th>
                        <th rowSpan="2">Rate</th>
                        <th rowSpan="2">{formatTwoDateToTextPayroll(periodFrom, periodTo)}</th>
                        <th rowSpan="2">No. of <br /> Days</th>
                        <th rowSpan="2">Absent<br /> Days</th>
                        <th rowSpan="2">Late/UT<br /> (hrs.)</th>
                        <th rowSpan="2">Late/UT<br /> (mins.)</th>
                        <th rowSpan="2">Total<br /> Late/UT <br />(Deduction)</th>
                        <th rowSpan="2">Adjustment</th>
                        <th rowSpan="2">Amount Accrued</th>
                        <th rowSpan="2">Pag-Ibig</th>
                        <th rowSpan="2">Pag-Ibig <br /> MP2</th>
                        <th rowSpan="2">SSS</th>
                        <th rowSpan="2">PHIC</th>
                        <th rowSpan="2">1% PHIC <br /> Differential</th>
                        <th colSpan={wTax.length + 1}>Withholding Tax</th>
                        <th rowSpan="2">Total</th>
                        <th rowSpan="2">Amount Due</th>
                        <th rowSpan="2" align="center">No.</th>
                    </tr>
                    <tr>
                        {taxCell()}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        empList && empList.map((item, key) => {
                            return (
                                <>
                                    <tr key={item.id}>
                                        <td align="center">
                                            {index * perPage + (key + 1)}
                                        </td>
                                        <td style={{ whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                                            {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                        </td>
                                        <td>
                                            {item.position_name}
                                        </td>
                                        {/* RATE */}
                                        <td align="right">
                                            {formatWithCommas(parseFloat(item.m_salary).toFixed(2))}
                                        </td>
                                        {/* MONTHLY SALARY */}
                                        <td align="right">
                                            {formatWithCommas(parseFloat((item.m_salary * 22) / 2).toFixed(2))}
                                            {/* {item.m_salary * item.no_days} */}
                                        </td>
                                        <td align="right">
                                            {item.no_days}
                                        </td>
                                        <td align="right">
                                            {item.wopay_days > 0 ? parseFloat(item.wopay_days).toFixed(2) : '-'}
                                        </td>
                                        <td align="right">
                                            {item.wopay_hours > 0 ? parseFloat(item.wopay_hours).toFixed(2) : '-'}
                                        </td>
                                        <td align="right">
                                            {item.wopay_minutes > 0 ? parseFloat(item.wopay_minutes).toFixed(2) : '-'}
                                        </td>
                                        <td align="right">
                                            {item.total_wopay > 0
                                                ?
                                                <span>{formatWithCommas(parseFloat(item.total_wopay).toFixed(2))}</span>
                                                :
                                                '-'
                                            }
                                        </td>
                                        <td align="right">-</td>
                                        <td align="right">
                                            {
                                                formatWithCommas(parseFloat(((item.m_salary * 22) / 2) - item.total_wopay).toFixed(2))
                                            }
                                        </td>
                                        <td align="right">
                                            {formatWithCommas(parseFloat(item.pagibig).toFixed(2))}
                                        </td>

                                        <td align="right">
                                            {formatWithCommas(parseFloat(item.pagibig_mp2).toFixed(2))}
                                        </td>

                                        <td align="right">
                                            {formatWithCommas(parseFloat(item.sss).toFixed(2))}
                                        </td>


                                        <td align="right">
                                            {formatWithCommas(parseFloat(item.ph_personal_share).toFixed(2))}
                                            {/* {formatWithCommas(Number(item.ph_personal_share).toFixed(2))} */}

                                        </td>
                                        <td align="right">
                                            {item.provident > 0 ? formatWithCommas(parseFloat(item.provident).toFixed(2)) : '-'}
                                        </td>
                                        {
                                            checkTaxCells(item)
                                        }
                                        <td>
                                        </td>
                                        <td align="right">
                                            {formatWithCommas(item.tot_contri)}
                                        </td>

                                        <td align="right">
                                            {/* {
                                                formatWithCommas((parseFloat((item.m_salary * item.no_days) - item.total_wopay) - parseFloat(item.tot_contri)).toFixed(2))
                                            } */}
                                            {calculateAmountDue(item.m_salary, item.total_wopay, item.tot_contri)}

                                        </td>

                                        <td align="center">
                                            {index * perPage + (key + 1)}
                                        </td>
                                    </tr>
                                </>
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
                        <td></td>
                        <td></td>
                        <td></td>
                        {
                            taxCellFooterExtra()
                        }
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Page Total</td>
                        <td></td>

                        <td align="right">{totalMSalary}</td>
                        <td align="right">{totalPSalary}</td>
                        <td align="right">-</td>

                        <td align="right">{totalAbsentDays}</td>
                        <td align="right">{totalLateHrs}</td>
                        <td align="right">{totalLateMins}</td>
                        <td align="right">{totalLateDeduct}</td>
                        <td align="right">-</td>
                        <td align="right">{totalAccrued}</td>
                        <td align="right">{totalPagIbig}</td>
                        <td align="right">-</td>
                        <td align="right">{totalSSS}</td>
                        <td align="right">{totalPH}</td>
                        <td align="right">-</td>
                        {
                            taxCellFooter()
                        }
                        <td align="right">-</td>
                        {/* <td align="right">{pageTotal('total-deductions')}</td> */}
                        <td align="right"> {totalContri}</td>
                        <td align="right"> {totalAmountDue}</td>
                        {/* <td align="right" id = {`total-30th-pay-${index}`}></td> */}
                        {/* <td align="right">{pageTotal('total-30th-pay')}</td> */}
                    </tr>

                    {/* {
                        extraLoansCellFooter()
                    } */}
                    <tr>
                        <td></td>
                        <td align="left">{isGrandTotal ? 'Grand Total' : 'Running Total'}</td>
                        <td></td>
                        <td align="right">{runningTotal('m_salary', index)}</td>
                        <td align="right">{runningTotal('p_salary', index)}</td>
                        <td align="right">-</td>
                        <td align="right">{runningTotal('absent_days', index)}</td>
                        <td align="right">{runningTotal('late_hrs', index)}</td>
                        <td align="right">{runningTotal('late_mins', index)}</td>
                        <td align="right">{runningTotal('late_deduction', index)}</td>
                        <td align="right">{runningTotal('absent_days', index)}</td>
                        <td align="right">{runningTotal('accrued', index)}</td>
                        <td align="right">{runningTotal('pagibig-per', index)}</td>
                        <td align="right">-</td>
                        <td align="right">{runningTotal('sss', index)}</td>
                        <td align="right">{runningTotal('ph-per', index)}</td>
                        <td align="right">-</td>
                        {
                            rTotalTaxCell()
                        }
                        {/* <td align="right">{runningTotal('ph-gov',index)}</td> */}
                        <td align="right">-</td>
                        <td align="right">{runningTotal('total-contri', index)}</td>
                        <td align="right">{runningTotal('amount-due', index)}</td>
                    </tr>

                </tfoot>
            </table>
        </main>
    )
}