import React, { useEffect, useState } from "react";
import { formatExtName, formatMiddlename, formatWithCommas, isNumeric, truncateToDecimals } from "../../../../../../customstring/CustomString";
import { Box } from "@mui/material";
import { green, grey } from "@mui/material/colors";

export const RegularMain = ({empList,index,loans,perPage,isGrandTotal,printData}) =>{
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
    const checkLoansCell = (row) =>{
        const col_num = loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        if(col_num>0){
            if(row.loan_dtl){
                for(let i=0;i<col_num;i++){
                    cols.push(<td>
                            {
                                loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).map((item,key)=>{
                                    return (
                                        isExists(row,item)
                                        ?
                                        <span key={key} style={{display:'flex',justifyContent:'space-between',fontSize:'.7rem'}}>
                                            <span>{key+1}.</span> <span>{isExists(row,item)}</span>
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
            }else{
                for(let i=0;i<col_num;i++){
                    cols.push(<td>
                        </td>
                    )
                }
                return (
                    <>{cols}</>
                )
            }
        }else{
            return (<td></td>)
        }
    }
    const isExists = (row,loan_abbr) =>{
        let loan_dtl_arr = JSON.parse(row.loan_dtl).filter(el=>el.loan_abbr === loan_abbr);
        if(loan_dtl_arr.length>0){
            return formatWithCommas(loan_dtl_arr[0].amount.toFixed(2))
        }else{
            return null;
        }
    }
    const loansCell = () =>{
        const col_num = loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3 === 0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for(let i=0;i<col_num;i++){
            cols.push(<td rowSpan={2}>
                <Box sx={{display:'flex',flexDirection:'column',fontSize:'.7rem',textAlign:'left'}}>
                    {
                        loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).map((item,key)=>{
                            return (
                                <span key={key} style={{paddingLeft:'13px',textIndent:'-13px'}}>
                                    {key+1}. {item}
                                </span>
                            )
                        })
                    }
                </Box>
                </td>
            )
            col_page++;
        }
        if(col_num>0){
            return (
                <>{cols}</>
            )
        }else{
            return <td rowSpan={2}></td>
        }
    }
    const loansCellExtra = () =>{
        const col_num = loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3 === 0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for(let i=0;i<col_num;i++){
            cols.push(<td>
                </td>
            )
            col_page++;
        }
        if(col_num>0){
            return (
                <>{cols}</>
            )
        }else{
            return <td></td>
        }
    }
    const [totalPageDeductions,setTotalPageDeductions] = useState(0)
    const pageTotal = (type) =>{
        var m_salary = empList.map((el)=>{
            return parseFloat(el.m_salary)
        }).reduce((total,a) =>{
            return total + a
        })
        var wopay = empList.map((el)=>{
            return parseFloat(el.total_wopay)
        }).reduce((total,a) =>{
            return total + a
        })

        var w_tax = empList.map((el)=>{
            return parseFloat(truncateToDecimals(el.tax))
        }).reduce((total,a) =>{
            return total + a
        })

         var pera = empList.map((el)=>{
            return parseFloat(el.pera)
        }).reduce((total,a) =>{
            return total + a
        })
        var gsis_per = empList.map((el)=>{
            return parseFloat(el.gsis_personal_share)
        }).reduce((total,a) =>{
            return total + a
        })

        var pagibig_per = empList.map((el)=>{
            return parseFloat(el.pagibig)
        }).reduce((total,a) =>{
            return total + a
        })

        var ph_per = empList.map((el)=>{
            return parseFloat(truncateToDecimals(el.ph_personal_share))
        }).reduce((total,a) =>{
            return total + a
        })
        var loan_arr = empList.filter(el=>{
            if(el.loan_dtl){
                return true;
            }
        }).map(el=>{
            return JSON.parse(el.loan_dtl)
        })
        var total_loan = 0;
        loan_arr.forEach(el=>{
            var t_total = el.map(el2=>{
                return el2.amount
            }).reduce((total,a)=>{
                return total + a;
            })
            total_loan+=t_total
        })
        var provident = empList.map((el)=>{
            return parseFloat(el.provident)
        }).reduce((total,a) =>{
            return total + a
        })
        switch(type){
            case 'm_salary':
                // var t_total = empList.map((el)=>{
                //     return el.m_salary
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                return formatWithCommas(parseFloat(m_salary).toFixed(2));
            break;
            case 'wopay':
                // var t_total = empList.map((el)=>{
                //     return el.total_wopay
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if(wopay>0){
                    return formatWithCommas(parseFloat(wopay).toFixed(2));
                }else{
                    return '-';
                }
            break
            case 'accrued':
                var t_total = empList.map((el)=>{
                    return el.m_salary-el.total_wopay
                }).reduce((total,a) =>{
                    return total + a
                })
                if(t_total>0){
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'pera':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.pera)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if(pera>0){
                    return formatWithCommas(parseFloat(pera).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'wtax':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.tax)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if(w_tax>0){
                    return formatWithCommas(parseFloat(w_tax).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'gsis-personal':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.gsis_personal_share)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if(gsis_per>0){
                    return formatWithCommas(parseFloat(gsis_per).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'gsis-gov':
                var t_total = empList.map((el)=>{
                    return parseFloat(el.gsis_gov_share)
                }).reduce((total,a) =>{
                    return total + a
                })
                if(t_total>0){
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'ecc':
                var t_total = empList.map((el)=>{
                    return parseFloat(el.ecc)
                }).reduce((total,a) =>{
                    return total + a
                })
                if(t_total>0){
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'pagibig-personal':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(el.pagibig)
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if(pagibig_per>0){
                    return formatWithCommas(parseFloat(pagibig_per).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'pagibig-gov':
                var t_total = empList.map((el)=>{
                    return parseFloat(el.pagibiggov)
                }).reduce((total,a) =>{
                    return total + a
                })
                if(t_total>0){
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'PH-personal':
                // var t_total = empList.map((el)=>{
                //     return parseFloat(truncateToDecimals(el.ph_personal_share))
                // }).reduce((total,a) =>{
                //     return total + a
                // })
                if(ph_per>0){
                    return formatWithCommas(parseFloat(ph_per).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'PH-gov':
                var t_total = empList.map((el)=>{
                    return parseFloat(el.ph_gov_share.toFixed(2))
                }).reduce((total,a) =>{
                    return total + a
                })
                if(t_total>0){
                    return formatWithCommas(parseFloat(t_total).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'provident':
                if(provident>0){
                    return formatWithCommas(parseFloat(provident).toFixed(2));
                }else{
                    return '-';
                }
            break;
            case 'total-deductions':
                return (wopay+w_tax+gsis_per+pagibig_per+ph_per+total_loan)>0?formatWithCommas((wopay+w_tax+gsis_per+pagibig_per+ph_per+total_loan).toFixed(2)):'-';
            break;
            case 'total-15th-pay':
                return formatWithCommas((((m_salary+pera)-(w_tax+gsis_per+pagibig_per+ph_per+wopay+total_loan))/2).toFixed(2));
                // return formatWithCommas((parseFloat(m_salary+parseFloat(pera))-(parseFloat(w_tax)+parseFloat(gsis_per)+parseFloat(pagibig_per)+parseFloat(ph_per)+parseFloat(wopay)+parseFloat(total_loan))/2).toFixed(2))
            break;
            case 'total-30th-pay':
                return formatWithCommas(truncateToDecimals(((m_salary+pera)-(w_tax+gsis_per+pagibig_per+ph_per+wopay+total_loan))/2).toFixed(2))

            break;
        }
        
    }
    const totalDeductions = (item,key) =>{
        if(item.loan_dtl){
            var t_total = JSON.parse(item.loan_dtl).map((el)=>{
                return el.amount
            }).reduce((total,amount)=>{
                return total + amount
            })
            return (
                t_total
            )
        }else{
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
    const loansCellFooter = () =>{
        const col_num = loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3 === 0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        for(let i=0;i<col_num;i++){
            cols.push(<td>
                <Box sx={{display:'flex',flexDirection:'column',fontSize:'.7rem',textAlign:'right'}}>
                    {
                        loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).map((item,key)=>{
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
        if(col_num>0){
            return (
                <>{cols}</>
            )
        }else{
            return <td></td>
        }
    }
    const loansCellFooterTotal = (loan_abbr)=>{
        var total = 0;
        var filtered = empList.map(el=>{
            return el.loan_dtl;
        }).filter(el2=>el2 != null)
        filtered.forEach(el=>{
            var arr = JSON.parse(el)
            arr.forEach(el2=>{
                if(el2.loan_abbr === loan_abbr){
                    total+=el2.amount
                }
            })

        })
        return total>0?formatWithCommas(total.toFixed(2)):'-';
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
    const rTotalCellFooter = () =>{
        //Loans
        const col_num = loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1);
        const cols = [];
        let col_page = 1;
        let col_per_page = 3;
        let start = 15;
        for(let i=0;i<col_num;i++){
            let t_total_loan = 0;
            loans.slice((col_page-1)*col_per_page,(col_page-1)*col_per_page+col_per_page).forEach(el2=>{
                for(let x = 0 ; x<=index ;x++){
                    printData[x].forEach(el=>{
                    if(el.loan_dtl){
                        if(isExists(el,el2)){
                            t_total_loan+=parseFloat(isExists(el,el2)?.replace(',',''))
                            // console.log(t_total_loan)
                        }
                        
                    }
                })
                }
            })
            if(t_total_loan>0){
                cols.push(<td align="right">
                    {formatWithCommas(t_total_loan.toFixed(2))}
                    </td>
                )
            }else{
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
    useEffect(()=>{
        var table  = document.getElementById(`casual-payroll-table-${index}`)
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
        for(let x = 0 ; x<=index;x++){
            var table  = document.getElementById(`casual-payroll-table-${x}`)
            var rtotdeductiontable = table;
            var rtot15thPay = table;
            var rtot30thPay = table;

            let rtotdeductiontable_arr = Array.from(rtotdeductiontable.rows)

            rtotdeductiontable_arr.splice(rtotdeductiontable_arr.length-1,1)

            let rtotDeductionsSubTotal = rtotdeductiontable_arr.slice(3).reduce((total,row,i,arr) => {
                var rem_commas = (row.cells[16+(loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1))]?.innerHTML)?.replace(',','');
                if(i<(printData[x].length-1)*2){
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }else{
                    arr.splice(1);
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }
                // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
                // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);

            rTotalDeductions+=rtotDeductionsSubTotal;


            //15th month pay running total
            let rtot15thPay_arr = Array.from(rtot15thPay.rows)

            rtot15thPay_arr.splice(rtot15thPay_arr.length-1,1)

            let rtot15thPaySubTotal = rtot15thPay_arr.slice(3).reduce((total,row,i,arr) => {
                var rem_commas = (row.cells[17+(loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1))]?.innerHTML)?.replace(',','');
                if(i<(printData[x].length-1)*2){
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }else{
                    arr.splice(1);
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }
                // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
                // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);
            rTotal15thPay+=rtot15thPaySubTotal;

            //30th month pay running total
            let rtot30thPay_arr = Array.from(rtot30thPay.rows)

            rtot30thPay_arr.splice(rtot30thPay_arr.length-1,1)

            let rtot30thPaySubTotal = rtot30thPay_arr.slice(3).reduce((total,row,i,arr) => {
                var rem_commas = (row.cells[18+(loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1))]?.innerHTML)?.replace(',','');
                if(i<(printData[x].length-1)*2){
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }else{
                    arr.splice(1);
                    return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
                }
                // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
                // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }, 0);
            rTotal30thPay+=rtot30thPaySubTotal;

        }
        // console.log(rTotal30thPay)
        //End  Runningtotal deductions



        // Total Deductions

        let totdeductiontable_arr = Array.from(totdeductiontable.rows)

        totdeductiontable_arr.splice(totdeductiontable_arr.length-1,1)

        let totDeductionsSubTotal = totdeductiontable_arr.slice(3).reduce((total,row,i,arr) => {
            var rem_commas = (row.cells[16+(loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1))]?.innerHTML)?.replace(',','');
            if(i<(empList.length-1)*2){
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }else{
                arr.splice(1);
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0)
            }
            // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
            // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
        }, 0);
        //End total deductions

        //Total 15th month pay

        let table15thpay_arr = Array.from(table15thpay.rows)

        table15thpay_arr.splice(table15thpay_arr.length-1,1)

        let tot15thSubTotal = table15thpay_arr.slice(3).reduce((total,row,i,arr) => {
            var rem_commas = (row.cells[17+(loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1))]?.innerHTML)?.replace(',','');
            if(i<(empList.length-1)*2){
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }else{
                arr.splice(1);
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0)
            }
            // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
            // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
        }, 0);
        //End total 15th pay

        //Total 20th month pay

        let table30thpay_arr = Array.from(table30thpay.rows)

        table30thpay_arr.splice(table30thpay_arr.length-1,1)

        let tot30thSubTotal = table30thpay_arr.slice(3).reduce((total,row,i,arr) => {
            var rem_commas = (row.cells[18+(loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3===0?0:1))]?.innerHTML)?.replace(',','');
            if(i<(empList.length-1)*2){
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
            }else{
                arr.splice(1);
                return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0)
            }
            // var rem_commas = (row.cells[15+Math.floor(loans.length/3)+(loans.length%3===0?0:1)]?.innerHTML).replace(',','');
            // return total + (isNumeric(rem_commas) ? parseFloat(rem_commas) : 0);
        }, 0);
        //End total 30th pay

        document.getElementById(`total-deductions-${index}`).innerHTML = totDeductionsSubTotal>0?formatWithCommas(totDeductionsSubTotal.toFixed(2)):'-';
        document.getElementById(`r-total-deductions-${index}`).innerHTML = rTotalDeductions > 0?formatWithCommas(rTotalDeductions.toFixed(2)):'-';
        document.getElementById(`r-total-15th-pay-${index}`).innerHTML = formatWithCommas(rTotal15thPay.toFixed(2));
        document.getElementById(`r-total-30th-pay-${index}`).innerHTML = formatWithCommas(rTotal30thPay.toFixed(2));
        document.getElementById(`total-15th-pay-${index}`).innerHTML = formatWithCommas(tot15thSubTotal.toFixed(2));
        document.getElementById(`total-30th-pay-${index}`).innerHTML = formatWithCommas(tot30thSubTotal.toFixed(2));

    },[empList,index,loans])
    const runningTotal = (type,index) =>{
        let total = 0;
        switch(type){
            case 'm_salary':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.m_salary)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                return (formatWithCommas(total.toFixed(2)));
            break;
            case 'accrued':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.m_salary-el.wopay)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                return (formatWithCommas(total.toFixed(2)));
            break;
            case 'wopay':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.wopay)
                    }).reduce((total,a)=>{
                        return total + a
                    },'-')
                    total+=t_total;
                }
                if(total>0){
                }else{
                    return ('-')
                }
            break;
            case 'pera':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.pera)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'w_tax':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.tax)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'gsis-per':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.gsis_personal_share)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'gsis-gov':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.gsis_gov_share)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'gsis-ecc':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.ecc)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'pagibig-per':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.pagibig)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'pagibig-gov':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.pagibiggov)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'ph-per':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(truncateToDecimals(el.ph_personal_share))
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'ph-gov':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.ph_gov_share.toFixed(2))
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            case 'provident':
                var i = 0;
                for(i;i <= index;i++){
                    var t_total = printData[i].map(el=>{
                        return parseFloat(el.provident)
                    }).reduce((total,a)=>{
                        return total + a
                    })
                    total+=t_total;
                }
                if(total>0){
                    return (formatWithCommas(total.toFixed(2)));
                }else{
                    return ('-')
                }
            break;
            default:
            total = 0;
            break
        }
    }
    return (
        <main>
        <table className="casual-table" id = {`casual-payroll-table-${index}`}>
                    <thead>
                    <tr style={{whiteSpace:'nowrap'}}>
                        <th rowSpan="3">No.</th>
                        <th rowSpan="3">Employee Name <br/>Position</th>
                        <th rowSpan="3">Monthly Rate</th>
                        <th rowSpan="3">LWOP <br/> Adjustment</th>
                        <th rowSpan="3">Amount Accrued</th>
                        <th rowSpan="3">PERA</th>
                        <th  colspan="9">Contributions</th>
                        <th align="center" colSpan={(loans.length === 0?1:Math.floor(loans.length/3)+(loans.length%3==0?0:1))}>
                                            Loans
                        </th>
                        <th >Other Deductions</th>
                        <th ></th>
                        <th  colspan="2">Net Amount</th>
                        <th rowSpan="3">No.</th>
                        <th rowSpan="3">Signature of Payee</th>
                    </tr>
                    <tr>
                        <td rowSpan="2">Withholding Tax</td>
                        <td  colspan="3">GSIS</td>
                        <td  colspan="2">Pag-Ibig</td>
                        <td  colspan="2">PHIC</td>
                        <td >Provident</td>
                        {
                            loansCell()
                        }
                        <td rowSpan="2"></td>
                        <td rowSpan="2">Total Deductions</td>
                        <td rowSpan="2">15th Pay</td>
                        <td rowSpan="2">30th Pay</td>
                    </tr>
                    <tr>
                        <td>Personal Share</td>
                        <td>Gov't Share</td>
                        <td>ECC</td>
                        <td>Personal Share</td>
                        <td>Gov't Share</td>
                        <td>Personal Share</td>
                        <td>Gov't Share</td>
                        <td>Personal Share</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        empList&&empList.map((item,key)=>{
                        return(
                            <>
                            <tr key={item.id}>
                                <td>
                                    {index*perPage+(key+1)}
                                </td>
                                <td style={{whiteSpace:'nowrap',textTransform:'uppercase'}}>
                                {`${item.lname}, ${item.fname} ${formatMiddlename(item.mname)} ${formatExtName(item.extname)}`}
                                </td>
                                <td align="right">
                                    {formatWithCommas(parseFloat(item.m_salary).toFixed(2))}
                                </td>
                                <td align="right">
                                    {/* <Box sx={{display:'flex',flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>
                                    
                                    {
                                        item.total_wopay>0
                                        ?
                                        <span>{formatWithCommas(parseFloat(item.total_wopay).toFixed(2))}</span>
                                        :
                                        '-'
                                    }
                                    </Box> */}
                                    {
                                        item.total_wopay>0
                                        ?
                                        <span>{formatWithCommas(parseFloat(item.total_wopay).toFixed(2))}</span>
                                        :
                                        '-'
                                    }
                                </td>
                                <td align="right">
                                    {
                                        formatWithCommas(parseFloat(item.m_salary-item.total_wopay).toFixed(2))
                                    }
                                </td>
                                <td align="right">
                                    {formatWithCommas(parseFloat(item.pera).toFixed(2))}
                                </td>
                                
                                
                                <td align="right">
                                    {item.tax>0?formatWithCommas((item.tax).toFixed(2)):'-'}
                                </td>
                                <td align="right">
                                    {formatWithCommas(item.gsis_personal_share.toFixed(2))}
                                </td>
                                
                                <td align="right">
                                    {formatWithCommas(item.gsis_gov_share.toFixed(2))}
                                </td>
                                <td>
                                    {formatWithCommas(parseFloat(item.ecc).toFixed(2))}
                                </td>
                                <td align="right">
                                    {formatWithCommas(parseFloat(item.pagibig).toFixed(2))}
                                </td>
                                <td>
                                    {formatWithCommas(parseFloat(item.pagibiggov).toFixed(2))}
                                </td>
                                

                                <td align="right">
                                    {formatWithCommas(truncateToDecimals(item.ph_personal_share).toFixed(2))}

                                </td>


                                <td align="right">
                                    {formatWithCommas(item.ph_gov_share.toFixed(2))}

                                </td>
                                <td align="right">
                                    {item.provident>0?formatWithCommas(item.provident):'-'}
                                </td>

                                {
                                    checkLoansCell(item)
                                }
                                <td>
                                </td>
                                <td align="right">
                                    {
                                        formatWithCommas((parseFloat(item.tax)+parseFloat(item.gsis_personal_share)+parseFloat(item.pagibig)+parseFloat(item.ph_personal_share)+parseFloat(item.total_wopay)+totalDeductions(item)).toFixed(2))
                                    }
                                </td>

                                <td align="right">
                                    {formatWithCommas(((parseFloat(item.m_salary+parseFloat(item.pera))-(parseFloat(item.tax)+parseFloat(item.gsis_personal_share)+parseFloat(item.pagibig)+parseFloat(item.ph_personal_share)+parseFloat(item.total_wopay)+totalDeductions(item)))/2).toFixed(2))}
                                   
                                </td>
                                <td align="right">
                                    {formatWithCommas(truncateToDecimals((parseFloat(item.m_salary+parseFloat(item.pera))-(parseFloat(item.tax)+parseFloat(item.gsis_personal_share)+parseFloat(item.pagibig)+parseFloat(item.ph_personal_share)+parseFloat(item.total_wopay)+totalDeductions(item)))/2).toFixed(2))}
                                </td>
                                
                                <td>
                                {index*perPage+(key+1)}
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td align="left" style={{whiteSpace:'nowrap'}}>{item.position_name}</td>
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
                                {loansCellExtra()}
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </>
                        )
                    })
                    }
                    
                    </tbody>
                    <tfoot>
                    {/* <tr>
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
                        {loansCellExtra()}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr> */}
                    <tr>
                        <td></td>
                        <td>Page Total</td>
                        <td align="right">{pageTotal('m_salary')}</td>
                        <td align="right">{pageTotal('wopay')}</td>
                        <td align="right">{pageTotal('accrued')}</td>
                        <td align="right">{pageTotal('pera')}</td>
                        <td align="right">{pageTotal('wtax')}</td>
                        <td align="right">{pageTotal('gsis-personal')}</td>
                        <td align="right">{pageTotal('gsis-gov')}</td>
                        <td align="right">{pageTotal('ecc')}</td>
                        <td align="right">{pageTotal('pagibig-personal')}</td>
                        <td align="right">{pageTotal('pagibig-gov')}</td>
                        <td align="right">{pageTotal('PH-personal')}</td>
                        <td align="right">{pageTotal('PH-gov')}</td>
                        <td align="right">{pageTotal('provident')}</td>
                        {
                            loansCellFooter()
                        }
                        <td align="right">-</td>
                        {/* <td align="right">{pageTotal('total-deductions')}</td> */}
                        <td align="right" id = {`total-deductions-${index}`}></td>
                        <td align="right" id = {`total-15th-pay-${index}`}></td>
                        <td align="right" id = {`total-30th-pay-${index}`}></td>
                        {/* <td align="right">{pageTotal('total-30th-pay')}</td> */}
                        <td></td>
                        <td></td>
                    </tr>
                    {/* {
                        extraLoansCellFooter()
                    } */}
                    {/* <tr>
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
                        {loansCellExtra()}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr> */}
                    {/* <tr>
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
                        {loansCellExtra()}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr> */}
                    <tr>
                        <td></td>
                        <td align="left">{isGrandTotal?'Grand Total':'Running Total'}</td>
                        <td align="right">{runningTotal('m_salary',index)}</td>
                        <td align="right">{runningTotal('wopay',index)}</td>
                        <td align="right">{runningTotal('accrued',index)}</td>
                        <td align="right">{runningTotal('pera',index)}</td>
                        <td align="right">{runningTotal('w_tax',index)}</td>
                        <td align="right">{runningTotal('gsis-per',index)}</td>
                        <td align="right">{runningTotal('gsis-gov',index)}</td>
                        <td align="right">{runningTotal('gsis-ecc',index)}</td>
                        <td align="right">{runningTotal('pagibig-per',index)}</td>
                        <td align="right">{runningTotal('pagibig-gov',index)}</td>
                        <td align="right">{runningTotal('ph-per',index)}</td>
                        <td align="right">{runningTotal('ph-gov',index)}</td>
                        <td align="right">{runningTotal('provident',index)}</td>
                        {
                            rTotalCellFooter()
                        }
                        {/* <td align="right">{runningTotal('ph-gov',index)}</td> */}
                        <td align="right">-</td>
                        <td align="right" id = {`r-total-deductions-${index}`}></td>
                        <td align="right" id = {`r-total-15th-pay-${index}`}></td>
                        <td align="right" id = {`r-total-30th-pay-${index}`}></td>
                        <td></td>
                        <td></td>
                    </tr>
                    
                    </tfoot>
                </table>
        </main>
    )
}