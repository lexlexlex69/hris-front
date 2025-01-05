import React, { useEffect, useState } from "react";
import './CasualPrint.css';
import { CasualHeader } from "./CasualHeader";
import { CasualFooter } from "./CasualFooter";
import { CasualMain } from "./CasualMain";
import { PayrollPager } from "../../pager/PayrollPager";
export const CasualPrint = React.forwardRef((props,ref) =>{
    const [printData,setPrintData] = useState([])
    const [perPage,setPerPage] = useState(10)
    useEffect(()=>{
        const chunkSize = perPage;
        let arr = [];
        for (let i = 0; i < props.empList.length; i += chunkSize) {
            const chunk = props.empList.slice(i, i + chunkSize);
            arr.push(chunk)
        }
        setPrintData(arr)
    },[props.empList])
    
    return (
        <div id = 'casual-template' ref = {ref}>
            {
                printData.length>0
                ?
                printData.map((item,index)=>{
                    return(
                        <div key={index} className={index>0?'page-break':''} style={{padding:'20px',height:'100vh'}}>
                        <CasualHeader selectedOffice = {props.selectedOffice} periodFrom = {props.periodFrom} periodTo = {props.periodTo} signatories = {props.signatories}/>
                        <CasualMain empList = {item} index={index} loans={props.loans} perPage = {perPage} isGrandTotal = {index !==printData.length-1 ?false:true} printData={printData}/>
                        <CasualFooter signatories = {props.signatories} page={index+1} totalPage = {printData.length} user = {props.user}/>
                        <PayrollPager id='footer-content-default' page = {index+1} totalPage={printData.length} user = {props.user}/>
                        </div>
                    )
                })
                :
                null
            }
            
        </div>
    )
})