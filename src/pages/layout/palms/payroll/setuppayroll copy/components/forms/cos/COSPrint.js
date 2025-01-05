import React, { useEffect, useState } from "react";
import './COSPrint.css';
import { COSHeader } from "./COSHeader";
import { COSFooter } from "./COSFooter";
import { COSMain } from "./COSMain";
import { PayrollPager } from "../../pager/PayrollPager";
export const COSPrint = React.forwardRef((props,ref) =>{
    const [printData,setPrintData] = useState([])
    const [perPage,setPerPage] = useState(10)
    useEffect(()=>{
        const chunkSize = perPage;
        let arr = [];
        for (let i = 0; i < props.empList.length; i += chunkSize) {
            const chunk = props.empList.slice(i, i + chunkSize);
            arr.push(chunk)
        }
        // console.log(arr)
        setPrintData(arr)
    },[props.empList])
    
    return (
        <div id = 'cos-template' ref = {ref}>
            {
                printData.length>0
                ?
                printData.map((item,index)=>{
                    return(
                        <div key={index} className={index>0?'page-break':''} style={{padding:'20px',height:'100vh'}}>
                        <COSHeader selectedOffice = {props.selectedOffice} periodFrom = {props.periodFrom} periodTo = {props.periodTo} signatories = {props.signatories}/>
                        <COSMain empList = {item} index={index} loans={props.loans} perPage = {perPage} isGrandTotal = {index !==printData.length-1 ?false:true} printData={printData} periodFrom = {props.periodFrom} periodTo = {props.periodTo} wTax = {props.wTax}/>
                        <COSFooter signatories = {props.signatories} />
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