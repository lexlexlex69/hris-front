import React, { useEffect, useRef, useState } from "react"
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material"
import { Print as PrintIcon } from "@mui/icons-material"
import moment from "moment"

import { phpPesoIntFormater } from "../../components/export_components/ExportComp"
import { formatName, formatPositionName } from "../../../customstring/CustomString"
import { useReactToPrint } from "react-to-print"
import { toast } from "react-toastify"
import { isEmptyObject } from "jquery"
// import "../style/style.css"
import "./DocumentStyle.css"

export const JODocument = React.forwardRef((props, ref) => {
    const [loading, setLoading] = useState(true)
    const [jobDesc, setJobDesc] = useState(null)
    const [terms, setTerms] = useState(null)
    const [result, setResult] = useState(null)
    const [showRecommending, setShowRecommending] = useState(true)
    const [showCertified, setShowCertified] = useState(true)
    const printRef = useRef()

    const ITEMS_PER_PAGE = 3;
    const [pages, setPages] = useState([])

    useState(() => {
        let tempJD = null
        let tempTerms = null

        try {
            tempJD = JSON.parse(props.data.prfData.job_desc)
            tempTerms = JSON.parse(props.data.prfData.terms_condi)

            const newResults = props.data.applicantList.map(element => {
                let temp = JSON.parse(element.appoint_date)
                return {
                    name: formatName(element.fname, element.mname, element.lname, element.extname, 1),
                    from: temp[0],
                    to: temp[1],
                    ...element
                }
            })
            setResult(newResults)
        } catch (error) {
            console.log(error)
            toast.error('Error parsing JSON data: ' + error, { autoClose: 2000 })
        } finally {
            if (props.signatories.dept_head.assigned_by === props.signatories.accounting.assigned_by) {
                setShowRecommending(false)
            }

            if (props.signatories.dept_head.assigned_by === props.signatories.budget.assigned_by) {
                setShowCertified(false)
            }

            setJobDesc(tempJD)
            setTerms(tempTerms)
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isEmptyObject(result)) {
            const chunkedPages = []
            for (let i = 0; i < result.length; i += ITEMS_PER_PAGE) {
                chunkedPages.push(result.slice(i, i + ITEMS_PER_PAGE))
            }
            setPages(chunkedPages)
        }
    }, [result])

    useEffect(() => {
        console.log(pages)
    }, [pages])

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Job Order',
        onAfterPrint: () => console.log('Print complete'),
        removeAfterPrint: true,
    });

    return (
        loading
            ?
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size="30px" />
            </Box>
            :
            <>
                {/* <style>
                    {`
                        @media print {
                            @page {
                            size: landscape;
                            margin: 0.5in;
                            }
                            .page-break {
                            page-break-after: always;
                            }
                        }
                    `}
                </style> */}
                <Box sx={{ marginBottom: '2rem' }}>
                    <Button variant="contained" color="warning" onClick={handlePrint} startIcon={<PrintIcon />}> Print </Button>
                </Box>

                <Box>
                    <Box ref={printRef} sx={{ display: 'block' }}>
                        {pages.map((pageItems, pageIndex) => (
                            <Box key={pageIndex} sx={{
                                fontFamily: 'Arial Narrow',
                                lineHeight: '1',
                                width: '842px',
                                height: '100vh',
                                pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                margin: '0 auto', // Center horizontally
                                padding: '40px 20px', // Add padding top/bottom and left/right
                            }}>
                                <Box className="header" sx={{
                                    position: 'static',
                                    // top: '40px',
                                    // left: '0',
                                    // right: '0',
                                    textAlign: 'center',
                                    // marginBottom: '60px'
                                }}>
                                    <div style={{ textAlign: 'center', fontSize: '12px' }}>
                                        Republic of the Philippines
                                    </div>
                                    <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '13px' }}>
                                        CITY GOVERNMENT OF BUTUAN
                                    </div>
                                    <div style={{ textAlign: 'center', fontSize: '12px' }}>
                                        Butuan City
                                    </div>
                                </Box>
                                <div style={{ textDecoration: 'underline', fontWeight: 'bold', margin: '1rem 0', textAlign: 'center', fontSize: '20px' }}> JOB ORDER </div>
                                {/* body */}
                                <Box sx={{
                                    // flex: '1 1 auto',
                                    // margin: '120px 0 100px 0' // Space for header and footer
                                }}>
                                    {pageItems.map((it, ix) => (
                                        <>
                                            <table style={{ fontSize: '12px', width: '50%' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ display: 'flex' }}>
                                                            <span>Office</span>
                                                            <span style={{ flex: '1 1 auto' }}></span>
                                                            <span>:</span>
                                                        </td>
                                                        <td style={{ fontWeight: 'bold' }}>
                                                            CITY ACCOUNTING OFFICE OFFICE
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex' }}>
                                                            <span>Funding/Charges</span>
                                                            <span style={{ flex: '1 1 auto' }}></span>
                                                            <span>:</span>
                                                        </td>
                                                        <td>
                                                            CITY ACCOUNTING OFFICE
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table style={{ fontSize: '12px', width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center', width: '120px' }} colSpan={2} rowSpan={2}> NAME </td>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center' }} rowSpan={2}> POSITION </td>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center' }} rowSpan={2}> JOB DESCRIPTION </td>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center' }} rowSpan={2}> DAILY WAGE </td>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center' }} rowSpan={1} colSpan={2}> PERIOD OF EMPLOYMENT </td>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center' }} rowSpan={2}> ACKNOWLEDGEMENT</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center' }}> FROM </td>
                                                        <td style={{ fontWeight: 'bold', backgroundColor: 'rgb(189,214,238)', border: '1px solid black', textAlign: 'center' }}> TO </td>
                                                    </tr>
                                                    {/* {result && result.map((item, ix) => ( */}
                                                    <tr>
                                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                            1.
                                                        </td>
                                                        <td style={{ textAlign: 'left', fontWeight: 'bold', border: '1px solid black', textAlign: 'left' }}>
                                                            {it.name ?? 'NO NAME FOUND'}
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                            {props.data.prfData.position_title ?? 'NO POSITION TITLE FOUND'}
                                                        </td>
                                                        <td style={{ border: '1px solid black' }}>
                                                            <ul style={{ margin: 0 }}>
                                                                {!jobDesc ? (<li>Loading...</li>) :
                                                                    jobDesc.map((item, ix) => (
                                                                        <li>{item}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </td>
                                                        <td style={{ fontWeight: 'bold', border: '1px solid black', textAlign: 'center' }}>
                                                            {phpPesoIntFormater.format(props.data.prfData.pay_sal) ?? '0.00'}
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                            {moment(it.from).format('LL') ?? 'NO DATE FOUND'}
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>
                                                            {moment(it.to).format('LL') ?? 'NO DATE FOUND'}
                                                        </td>
                                                        <td style={{ border: '1px solid black', textAlign: 'center' }}>

                                                        </td>
                                                    </tr>
                                                    {/* ))} */}
                                                </tbody>
                                            </table>
                                            <br />
                                            <div style={{ fontSize: '10px' }}>
                                                <div>
                                                    This job order shall be subject to the following terms and condition:
                                                </div>
                                                <div>
                                                    <ol>
                                                        {!terms ? <li>Loading...</li> :
                                                            terms.map((item, ix) => (
                                                                <li>{item}</li>
                                                            ))
                                                        }
                                                    </ol>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </Box>

                                <table style={{ width: '100%', fontSize: '10px', position: 'relative' }}>
                                    <tbody>
                                        <tr>

                                            <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                                                <div>Prepared by:</div>
                                                <Box sx={{ marginTop: '3rem' }} />
                                                <div style={{ fontWeight: 'bold' }}>{props.signatories.dept_head.assigned_by}</div>
                                                <div>{
                                                    formatPositionName(props.signatories.dept_head.position_name).props.children[0]
                                                }</div>
                                                <div>{props.signatories.dept_head.position}</div>
                                            </td>

                                            {showRecommending && (
                                                <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                                                    <div>Recommending Approval:</div>
                                                    <Box sx={{ marginTop: '3rem' }} />
                                                    <div style={{ fontWeight: 'bold' }}>{props.signatories.accounting.assigned_by}</div>
                                                    <div>{props.signatories.accounting.position_name
                                                        // formatPositionName().props.children[0]
                                                    }</div>
                                                    <div>{props.signatories.accounting.position}</div>
                                                </td>
                                            )}

                                            {showCertified && (
                                                <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                                                    <div>Certified as to the Existence of Appropriation/Allotment:</div>
                                                    <Box sx={{ marginTop: '3rem' }} />
                                                    <div style={{ fontWeight: 'bold' }}>{props.signatories.budget.assigned_by}</div>
                                                    <div>{
                                                        formatPositionName(props.signatories.budget.position_name).props.children[0]
                                                    }</div>
                                                    <div>{props.signatories.budget.position}</div>
                                                </td>
                                            )}

                                            <td style={{ textAlign: 'center', verticalAlign: 'top' }}>
                                                <div>Approved:</div>
                                                <Box sx={{ marginTop: '3rem' }} />
                                                <div style={{ fontWeight: 'bold' }}>{props.signatories.mayor.auth_name}</div>
                                                <div>{props.signatories.mayor.position}</div>
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>

                                {/* footer */}
                                <Box className="footer" sx={{
                                    position: 'static',
                                    // bottom: '40px',
                                    // left: '0',
                                    // right: '0',
                                    textAlign: 'center'
                                }}>
                                    {/* page numbering */}
                                    <div style={{ display: 'flex', fontSize: '9px', marginTop: '1rem', }}>
                                        <div>CHRMO.02/AKP</div>
                                        <div style={{ flex: '1 1 auto' }}></div>
                                        <div>Page {pageIndex + 1} of {pages.length}</div>
                                    </div>
                                </Box>
                            </Box>
                        ))
                        }
                    </Box>
                </Box>
            </>
    )
})

export default JODocument

// const styles = {
//     body: {
//         paddingTop: 35,
//         paddingBottom: 65,
//         paddingHorizontal: 35,
//     },
//     title: {
//         fontSize: 24,
//         textAlign: 'center',
//         fontFamily: 'Oswald'
//     },
//     author: {
//         fontSize: 12,
//         textAlign: 'center',
//         marginBottom: 40,
//     },
//     subtitle: {
//         fontSize: 18,
//         margin: 12,
//         fontFamily: 'Oswald'
//     },
//     text: {
//         margin: 12,
//         fontSize: 14,
//         textAlign: 'justify',
//         fontFamily: 'Times-Roman'
//     },
//     image: {
//         marginVertical: 15,
//         marginHorizontal: 100,
//     },
//     header: {
//         fontSize: 12,
//         marginBottom: 20,
//         textAlign: 'center',
//         color: 'grey',
//     },
//     pageNumber: {
//         position: 'absolute',
//         fontSize: 12,
//         bottom: 30,
//         left: 0,
//         right: 0,
//         textAlign: 'center',
//         color: 'grey',
//     },
// };