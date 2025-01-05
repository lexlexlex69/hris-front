import React, { useEffect, useState } from "react";
import '.././Special.css';
import { PEIHeader } from "./PEIHeader";
import { PEIFooter } from "./PEIFooter";
import { PEIMain } from "./PEIMain";
import { PayrollPager } from "../../../pager/PayrollPager";
export const PEIPrint = React.forwardRef((props,ref) =>{
    const [printData,setPrintData] = useState([])
    const [perPage,setPerPage] = useState(22)
    useEffect(()=>{
        const chunkSize = perPage;
        let arr = [];
        for (let i = 0; i < props.empList.length; i += chunkSize) {
            const chunk = props.empList.slice(i, i + chunkSize);
            arr.push(chunk)
        }
        console.log(arr)
        setPrintData(arr)
    },[props.empList])
    
    return (
        <div id = 'special-template' ref = {ref}>
            {
                printData.length>0
                ?
                printData.map((item,index)=>{
                    return(
                        <div key={index} className={index>0?'page-break':''} style={{padding:'20px',height:'100vh'}}>
                        <PEIHeader selectedOffice = {props.selectedOffice} year = {props.year} signatories = {props.signatories} empStatus = {props.empStatus}/>
                        <PEIMain empList = {item} index={index} perPage = {perPage} isGrandTotal = {index !==printData.length-1 ?false:true} printData={printData} year = {props.year} isHR = {props.isHR} deptHead = {props.deptHead}/>
                        <PEIFooter signatories = {props.signatories} page = {index+1} totalPage = {printData.length}/>
                        <PayrollPager id='footer-content-default' page = {index+1} totalPage = {printData.length} user = {props.user}/>

                        </div>
                    )
                })
                :
                null
            }
        </div>
    )
})