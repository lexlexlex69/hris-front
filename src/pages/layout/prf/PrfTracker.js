import React, { Fragment, useContext, useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { Box, Button, Chip, IconButton, MenuItem, Skeleton, Stack, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";
import ModuleHeaderText from "../moduleheadertext/ModuleHeaderText";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import PrfProvider, { PrfStateContext } from "./PrfProvider";
import { CustomDialog, TableContainerComp, phpPesoIntFormater } from "./components/export_components/ExportComp";
import NoDataFound from "./components/NoDataFound";
import Swal from "sweetalert2";
import {
    Search as SearchIcon, Cached as CachedIcon
} from "@mui/icons-material";

import { getNatReqData, getQS, } from "./axios/prfRequest";
import { getAllPrf } from "./axios/prfTracker";
import RequestStatModal from "./components/export_components/RequestStatModal";
import ViewRequestForm from "./requestdetails/view/ViewRequestForm";
import DashboardLoading from "../loader/DashboardLoading";

import { isEmptyObject } from "jquery";
import moment from "moment";

import { red } from "@mui/material/colors";
import { toast } from "react-toastify";
import Indorsement from "./documentpreparation/Indorsement";
import ProcessDocument from "./documentpreparation/ProcessDocument";
const colorRed = red[500];

const skele = [
    { id: 1, variant: "rectangular", width: 0, height: 50, sizing: 12 },
    { id: 2, variant: "rectangular", width: 0, height: 200, sizing: 9 },
    // { id: 3, variant: "rectangular", width: 100, height: 50, sizing: 12 },
    // { id: 4, variant: "rectangular", width: 100, height: 50, sizing: 6 },
]

function PrfTracker() {
    return (
        <>
            <PrfProvider>
                <PrfTrackerPage />
            </PrfProvider>
        </>
    );
}
export default PrfTracker;

const tableHeadColumns = [
    { field: "prf_no", headerName: "PRF NO.", width: "90px" },
    { field: "status", headerName: "STATUS", width: "300px" },
    { field: "office_dept", headerName: "OFFICE/DEPARTMENT" },
    { field: "head_count", headerName: "HEAD COUNT" },
    { field: "rate", headerName: "PAY/SALARY GRADE" },
    { field: "nature_req", headerName: "NATURE OF REQUEST", width: "165px" },
    { field: "date_requested", headerName: "DATE REQUESTED" },
    { field: "date_needed", headerName: "DATE NEEDED" },
    { field: "emp_status", headerName: "EMPLOYEE STATUS" },
    { field: "actions", headerName: "ACTIONS", width: "150px" },
];

function PrfTrackerPage() {
    const { noDataFound, setNoDataFound, matches, userId, deptData, setErrors, errors, natureReq, tempReq, setTempReq, setTempSign, tempStorage, } = useContext(PrfStateContext)
    const [trackData, setTrackData] = useState(tableHeadColumns)
    const [rowData, setRowData] = useState([])
    const [dataFiltered, setDataFiltered] = useState([])
    const [tabledOrgData, setTabledOrgData] = useState([])
    const [selectedDept, setSelectedDept] = useState(null)

    const [loading, setLoading] = useState(true)

    const [open, setOpen] = useState(0)
    const [modalWindow, setModalWindow] = useState(null);

    const [requestQueue, setRequestQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false);
    const processQueue = async () => {
        if (processingQueue || requestQueue.length === 0) return;
        setProcessingQueue(true);
        const currentRequest = requestQueue[0];
        try {
            await currentRequest();
        } catch (error) {
            console.error('Error processing request:', error);
        } finally {
            setRequestQueue(prevQueue => prevQueue.slice(1));
            setProcessingQueue(false);
        }
    };
    useEffect(() => {
        if (!processingQueue) {
            processQueue();
        }
    }, [requestQueue, processingQueue]);
    const enqueueRequest = (requestFn) => {
        setRequestQueue(prevQueue => [...prevQueue, requestFn]);
    };

    useEffect(() => {
        // console.log(rowData)
        if (isEmptyObject(rowData.data) || rowData.data === undefined) {
            setNoDataFound(true)
        } else {
            setNoDataFound(false)
            setDataFiltered(rowData.data)
        }
    }, [rowData])

    useEffect(() => {
        handleReloadData()
    }, [])



    const handleReloadData = () => {
        setLoading(true)
        setNoDataFound(true)

        Swal.fire({
            title: 'Loading...',
            icon: "info",
            text: 'Please wait while we fetch the data.',
            allowOutsideClick: false,
            showCancelButton: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });
        enqueueRequest(async () => {
            try {
                const [res1, res2] = await Promise.all([
                    getAllPrf(),
                ])
                // console.log(res2, res1, res2)
                // setTabledOrgData(res2.data.data)
                setRowData(res1.data)
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error fetching the data.',
                    allowOutsideClick: true,
                    showCancelButton: true,
                    showConfirmButton: true,
                });
            } finally {
                setNoDataFound(false)
                setLoading(false)
            }
        })
        Swal.close()
    }

    const handleOpenButton = (ev, key, it) => {
        ev.preventDefault();
        console.log(key, it)
        switch (key) {
            case 1:
                setOpen(1)
                // const newWindow = window.open('', '', 'width=800,height=400');
                // setModalWindow(newWindow);
                setTempReq(it)
                // setTempSign(tempStorage)
                break;
            case 2:
                console.log(key, it)
                setTempReq(it)
                setOpen(2)
                break;
            case 3:
                console.log(key, it)
                setTempReq(it)
                setOpen(3)
                break;

            default:
                toast.warning('Error, button not found!')
                break;
        }
    }



    // const handleSearchBtn = () => {
    //     console.log(selectedDept)
    //     if (!selectedDept) {
    //         return toast.warning('Please select a department first')
    //     }

    //     Swal.fire({
    //         title: 'Loading...',
    //         icon: "info",
    //         text: 'Please wait while we fetch the data.',
    //         allowOutsideClick: false,
    //         showCancelButton: false,
    //         showConfirmButton: false,
    //         onBeforeOpen: () => {
    //             Swal.showLoading();
    //         }
    //     });
    //     enqueueRequest(async () => {
    //         try {

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'There was an error fetching the data.',
    //                 allowOutsideClick: true,
    //                 showCancelButton: true,
    //                 showConfirmButton: true,
    //             });
    //         } finally {
    //             Swal.close()
    //         }
    //     })
    // }

    // const handleCloseView = () => {
    //     // if (modalWindow) {
    //     //     modalWindow.close();
    //     // }
    // }

    useEffect(() => {
        if (modalWindow) {
            const newWindow = modalWindow;
            newWindow.document.title = 'PRF';
            const styleElements = document.head.querySelectorAll('style, link[rel="stylesheet"]');
            styleElements.forEach(styleElement => {
                newWindow.document.head.appendChild(styleElement.cloneNode(true));
            });
            const observer = new MutationObserver(() => {
                const newStyleElements = document.head.querySelectorAll('style, link[rel="stylesheet"]');
                newStyleElements.forEach(newStyleElement => {
                    if (!Array.from(newWindow.document.head.querySelectorAll('style, link[rel="stylesheet"]')).some(existingElement => existingElement.href === newStyleElement.href)) {
                        newWindow.document.head.appendChild(newStyleElement.cloneNode(true));
                    }
                });
            });
            observer.observe(document.head, { childList: true, subtree: true });
            console.log(observer, styleElements, newWindow)
            return () => observer.disconnect();
        }
    }, [modalWindow]);

    return (
        <>
            <Box sx={{ margin: "0 10px 10px 10px" }}>
                {loading ? (
                    <>
                        <DashboardLoading />
                    </>
                ) : (
                    <>
                        <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF) - CITY HUMAN RESOURCE MANAGEMENT DEPARTMENT TRACKER" />
                        <Box sx={{ margin: "10px 0px" }}>
                            <Grid2 container spacing={2}>
                                <Grid2 item xs={12} lg={4}>
                                    <Stack direction="row" gap={1}>
                                        <Box>
                                            <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" size="small" onClick={handleReloadData}>
                                                <CachedIcon />
                                            </IconButton>
                                        </Box>
                                        {/* <SelectFieldRD name={"dept_id"} id={"dept-id"} label={'Select a department'} size={'small'}
                                            value={selectedDept} onchange={(ev) => setSelectedDept(ev.target.value)}>
                                            {deptData.map((item, index) => (
                                                <MenuItem key={"dept-ids-" + item.id} value={item.dept_title}>
                                                    {item.dept_title}
                                                </MenuItem>
                                            ))}
                                        </SelectFieldRD>
                                        <Button variant="contained" onClick={handleSearchBtn} >
                                            <SearchIcon />
                                        </Button> */}
                                    </Stack>
                                </Grid2>
                                <Grid2 item xs={12} lg={12}>
                                    <TableContainerComp>
                                        <TableHead key={'tablee-head'}>
                                            <TableRow>
                                                {trackData.map((column, index) => (
                                                    <TableCell key={column.headerName + '-' + index} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bolder", fontSize: "12px", width: column.width, backgroundColor: "#1565C0 !important" }}>
                                                        {column.headerName}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody key={'tablee-body'}>
                                            {!noDataFound ?
                                                Object.keys(rowData).length > 0 &&
                                                dataFiltered.data.map((it, idx) => (
                                                    <TableRow key={'table-body-' + idx}>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            {it.prf_no}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            <RequestStatModal deptData={deptData} signings={rowData.data.signings} items={it} />
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }} align="center">
                                                            {it.office_dept}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            {it.head_cnt}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            {it.pay_sal > 30 ? phpPesoIntFormater.format(it.pay_sal) : it.pay_sal}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            <Stack spacing={1}>
                                                                {natureReq.filter(opt => JSON.parse(it.nature_req).includes(opt.id)).map((ii, indx) => {
                                                                    return (
                                                                        <Chip disableRipple disableFocusRipple disableTouchRipple disableElevation label={ii.category_name}
                                                                            variant="outlined" color="default" size="small" sx={{ fontSize: "12px", padding: "2px 0px", height: "auto", width: "100%", '& .MuiChip-label': { display: 'block', whiteSpace: 'normal', }, }} />
                                                                    )
                                                                })}
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            {moment(it.date_requested).format("L")}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            {moment(it.date_needed).format("L")}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            {it.emp_stat}
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: "12px" }}>
                                                            <Stack gap={1}>
                                                                {/* <Button variant="contained" size='small' onClick={(ev) => handleOpenButton(ev, 1, it)} sx={{ fontSize: "12px" }}>
                                                                        View PRF
                                                                    </Button> */}
                                                                {/* {rowData.data.signings.filter((op) => op.id_pr_form === it.id).reverse()[0].request_stat === 'SELECTION COMPLETE' && */}
                                                                <Button variant="contained" color="secondary" size='small' onClick={(ev) => handleOpenButton(ev, 2, it)} sx={{ fontSize: '12px' }}>
                                                                    Indorsement
                                                                </Button>
                                                                {/* } */}
                                                                {/* {rowData.data.signings.filter((op) => op.id_pr_form === it.id).reverse()[0].request_stat === 'INDORSEMENT COMPLETE' && */}
                                                                <Button variant="contained" color="primary" size='small' onClick={(ev) => handleOpenButton(ev, 3, it)} sx={{ fontSize: '12px' }}>
                                                                    Document Preparation
                                                                </Button>
                                                                {/* } */}
                                                            </Stack>
                                                            {/* View PRF,
                                                                Pooling applicants,
                                                                Document Preparation - indorsement, summary of candidates, */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                                :
                                                Array.from(Array(5)).map((item, index) => (
                                                    <TableRow key={index}>
                                                        {Array.from(Array(5)).map((item2, index2) => (
                                                            <TableCell component="th" scope="row" key={index2}>
                                                                <Skeleton variant="text" width="" height={45} animation='wave' sx={{ borderRadius: 0 }} />
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                                // <NoDataFound spanNo={Object.keys(trackData).length} />
                                            }

                                        </TableBody>
                                    </TableContainerComp>
                                    {/* <Box> */}
                                    {/* <Pagination shape="rounded" count={Math.ceil(total / perPage)} page={page} color='primary' onChange={(ev, v) => handlePaginate(ev)} /> */}
                                    {/* </Box> */}
                                </Grid2>
                            </Grid2>
                        </Box>
                    </>
                )}
            </Box >
            {/* CUSTOM DIALOG */}
            < Fragment >
                {/* {open !== 0 && (
                    open === 1 && modalWindow && (
                        // createPortal(
                        //     <ViewRequestForm />, modalWindow.document.body
                        // )
                        'test'
                    )
                )} */}
                {open === 1 && modalWindow && modalWindow.document.body && createPortal(
                    <Fragment>
                        <ViewRequestForm />
                    </Fragment>,
                    modalWindow.document.body
                )}

                {open >= 2 && (
                    <>
                        <CustomDialog matches={matches} openner={open === 2} handleCloseBTN={() => { setOpen(0) }} comptitle="Preparation of Indorsement" compSize="275px">
                            <Indorsement closeModal={(ev) => setOpen(0)} />
                        </CustomDialog>
                        <CustomDialog matches={matches} openner={open === 3} handleCloseBTN={() => { setOpen(0) }} comptitle="Process of Document" compSize="220px">
                            <ProcessDocument />
                        </CustomDialog>
                    </>
                )}
            </Fragment >
        </>
    );
}




// import React, { useContext, useEffect } from 'react';
// import { ModalContext } from './ParentComponent';
// const ChildComponent = () => {
//   const { closeModal } = useContext(ModalContext);
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       closeModal();
//     };
//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [closeModal]);
//   return (
//     <div>
//       <h2>Modal Content</h2>
//       <button onClick={closeModal}>Close Modal</button>
//     </div>
//   );
// };
// export default ChildComponent;