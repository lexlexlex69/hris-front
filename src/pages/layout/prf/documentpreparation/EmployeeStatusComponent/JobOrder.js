import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Box, Button, Card, CardContent, CircularProgress, Divider, FormControl, Menu, MenuItem, Skeleton, Stack, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useMediaQuery, useScrollTrigger } from '@mui/material'

import { Settings as SettingsIcon, InfoOutlined as InfoOutlinedIcon, Add as AddIcon } from '@mui/icons-material'
import { tableHeadD } from '../ProcessDocument'
import { PrfStateContext } from '../../PrfProvider'
import { CustomCenterModal, TableContainerComp } from '../../components/export_components/ExportComp'
import { autoCapitalizeFirstLetter, formatDateToWorded, formatDefaultPositionName, formatName } from '../../../customstring/CustomString'
import { usePopover } from '../../../custompopover/UsePopover'
import JODocument from '../process_document/JODocument'
import { useReactToPrint } from 'react-to-print'
// import { getPrfSignatories2 } from '../DocRequest'
import { toast } from 'react-toastify'
import { addJobDescription, addJobTerms, getPrfSignatories, setAppointmentDate } from '../DocRequest'
import Swal from 'sweetalert2'



function JobOrder({ applicantList, setApplicantList, loader }) {
    const { tempReq, setTempReq, applicantData, setApplicantData, deptData, openedPR } = useContext(PrfStateContext)
    const [open, setOpen] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [signatoryJO, setSignatoryJO] = useState(null)

    const [termsConditionRef, setTermsConditionRef] = useState(null)
    const [termsConditionBool, setTermsConditionBool] = useState(false)
    const [loading, setLoading] = useState(true)
    const [joTermsCondition, setJoTermsCondition] = useState(null)
    const [joDescription, setJoDescription] = useState(null)
    const [joDesc, setJoDesc] = useState(null)
    const [cData, setCData] = useState(null)
    const [timePeriod, setTimePeriod] = useState({ from: '', to: '' })

    const matches = useMediaQuery('(min-width: 565px)');
    const joRef = useRef();
    const popover = usePopover();
    const today = new Date().toISOString().split('T')[0];
    // const joDesc = useRef();

    useEffect(() => {
        getPrfSignatories({ prfData: tempReq })
            .then(res => {
                if (res.status === 200) {
                    setSignatoryJO(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.message)
            })
            .finally(() => {
                setLoading(false)
            })

        // console.log(applicantList)
        // getPrfSignatories2({ signatory_category: 'job order', signatory_slug: 'prepared_by', prf_data: tempReq })
        //     .then(res => {
        //         if (res.data.status === 500) { console.log(res.data.message); toast.error(res.data.message) }
        //         if (res.data.status === 200) {
        //             setSignatoryJO((prev) => ({ ...prev, prepByN: res.data.data.office_division_assign, prepByP: formatDefaultPositionName(res.data.data.position_name).props.children[0], prepByD: `(${formatDefaultPositionName(res.data.data.position_name).props.children[4]}` }))
        //         }

        //         return getPrfSignatories2({ signatory_category: 'department', signatory_slug: 'department_head', prf_data: tempReq })
        //     })
        //     .then(res => {
        //         if (res.data.status === 500) { console.log(res.data.message); toast.error(res.data.message) }
        //         if (res.data.status === 200) {
        //             setSignatoryJO((prev) => ({ ...prev, recAppN: res.data.data.office_division_assign, recAppP: res.data.data.headoffice_position, recAppD: res.data.data.position_name }))
        //         }

        //         return getPrfSignatories2({ signatory_category: 'job order', signatory_slug: 'certified_existence_appropriation', prf_data: tempReq })
        //     })
        //     .then(res => {
        //         if (res.data.status === 500) { console.log(res.data.message); toast.error(res.data.message) }
        //         if (res.data.status === 200) {
        //             setSignatoryJO((prev) => ({ ...prev, certAppN: formatName(res.data.data.fname, res.data.data.mname, res.data.data.lname, res.data.data.extname, 0), certAppP: formatDefaultPositionName(res.data.data.position_name).props.children[0], certAppD: `(${formatDefaultPositionName(res.data.data.position_name).props.children[4]}` }))
        //         }

        //         return getPrfSignatories2({ signatory_category: 'job order', signatory_slug: 'approved', prf_data: tempReq })
        //     })
        //     .then(res => {
        //         if (res.data.status === 500) { console.log(res.data.message); toast.error(res.data.message) }
        //         if (res.data.status === 200) {
        //             setSignatoryJO((prev) => ({ ...prev, appN: formatName(res.data.data.fname, res.data.data.mname, res.data.data.lname, res.data.data.extname, 0), appP: res.data.data.position_name, appD: '' }))
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //         toast.error(err)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
    }, [])

    // useEffect(() => {
    //     console.log(joTermsCondition)
    // }, [joTermsCondition])


    const handleJOPrint = useReactToPrint({
        content: () => {
            if (joRef.current) {
                return joRef.current;
            }
            return null;
        },
    })

    const handleAction = (ev, type, data) => {
        ev.preventDefault();
        setOpen(type)
        console.log(type, data, tempReq)
        setApplicantData(data)
        setTermsConditionBool(false)

        switch (type) {
            case 'jo-POE':
                setModalTitle('Period of employment setting')
                if (data.appoint_date !== null) {
                    let temp = JSON.parse(data.appoint_date)
                    setTimePeriod({ from: temp[0], to: temp[1] })
                } else {
                    setTimePeriod({ from: '', to: '' })
                }
                break;

            case 'jo-JD':
                setModalTitle('Job description setting')
                if (tempReq.job_desc !== null) {
                    let temp = JSON.parse(tempReq.job_desc)
                    setJoDescription(temp)
                } else {
                    setJoDescription(null)
                }
                break;

            case 'view':
                setCData({ prfData: tempReq, applicantList: applicantList })
                break;

            case 'editcontent':
                setModalTitle('Terms & condition setting')
                if (tempReq.terms_condi !== null) {
                    let temp = JSON.parse(tempReq.terms_condi)
                    setJoTermsCondition(temp)
                } else {
                    setJoTermsCondition(null)
                }

                break;

            default:
                toast.warning('Error! Action not found!')
                break;
        }
    }

    const handleSaveTC = (ev) => {
        ev.preventDefault();

        if (!termsConditionRef) {
            toast.warning('Please enter terms and conditions');
            return;
        }

        // Create new term object
        // const newTerm = {
        //     term: termsConditionRef
        // };

        // Update joTermsCondition by adding new term to existing array
        setJoTermsCondition(prev =>
            prev ? [...prev, termsConditionRef] : [termsConditionRef]
        );

        // Clear the input field after saving
        setTermsConditionRef('');
    }
    const handleRemoveTC = (ev, index) => {
        console.log(index)
        let m = joTermsCondition.filter((d, dx) => dx !== index)
        console.log(m)

        setJoTermsCondition((prev) => (m))

        setTermsConditionRef('')
    }

    const handleSavePeriodTime = () => {
        if (timePeriod.from === '' || timePeriod.to === '') {
            toast.warning('Please fill up the required fields!')
            return;
        }

        // if (timePeriod === )
        let temp = JSON.parse(applicantData.appoint_date)
        if (timePeriod.from === temp[0] && timePeriod.to === temp[1]) {
            toast.warning('Please change the time period!')
            return;
        }


        let t_data = {
            appoint_date: timePeriod,
            type: 'job-order',
            appData: applicantData,
            prfData: tempReq,
        }

        console.log(t_data)

        Swal.fire({
            title: "Click submit to continue?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                setAppointmentDate(t_data)
                    .then(r => {
                        if (r.data.status === 500) toast.error(r.data.message);
                        if (r.data.status === 400) toast.error(r.data.message);
                        if (r.data.status === 200) {
                            toast.success(r.data.message);
                            setApplicantList(r.data.list)
                        }
                    })
                    .catch((err) => toast.error(err.message))
            }
        });
    }

    const handleSaveTerms = () => {
        console.log(joTermsCondition)
        if (joTermsCondition.length === 0) {
            toast.warning('Please add terms & condition!')
            return;
        }

        let t_data = {
            terms: joTermsCondition,
            appData: applicantData,
            prfData: tempReq,
        }

        console.log(t_data)

        Swal.fire({
            title: "Click submit to continue?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                addJobTerms(t_data)
                    .then(r => {
                        if (r.data.status === 500) toast.error(r.data.message);
                        if (r.data.status === 400) toast.error(r.data.message);
                        if (r.data.status === 200) {
                            toast.success(r.data.message);
                            setTempReq(r.data.data);
                        }
                    })
                    .catch((err) => toast.error(err.message))
            }
        })
    }

    const handleSaveDescription = () => {
        console.log(joDescription, joDescription.length)
        if (joDescription.length === 0) {
            toast.warning('Please add description!')
            return;
        }

        let t_data = {
            description: joDescription,
            appData: applicantData,
            prfData: tempReq,
        }

        Swal.fire({
            title: "Click submit to continue?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                addJobDescription(t_data)
                    .then(r => {
                        if (r.data.status === 500) toast.error(r.data.message);
                        if (r.data.status === 400) toast.error(r.data.message);
                        if (r.data.status === 200) {
                            toast.success(r.data.message);
                            setTempReq(r.data.data);
                        }
                    })
                    .catch((err) => toast.error(err.message))
            }
        })
    }
    const handleAddDescription = () => {
        if (!joDesc) {
            toast.warning('Please enter description!')
            return;
        }

        setJoDescription((prev) => (prev ? [...prev, joDesc] : [joDesc]))

        setJoDesc('')
    }

    return (<>
        <Fragment>
            <CustomCenterModal key={'open1'} matches={matches} openner={open === 'letterhead' || open === 'editcontent' || open === 'jo-POE' || open === 'jo-JD'}
                comptitle={modalTitle} compSize={'40%'} handleCloseBTN={() => setOpen(null)}>

                {open === 'editcontent' && <>
                    <FormControl fullWidth sx={{ gap: '1rem' }}>
                        <TextField variant="outlined" multiline rows={4} maxRows={4} size="small" label="Work Agreement Terms" value={termsConditionRef} onChange={(ev) => setTermsConditionRef(ev.target.value)} />
                        <Box>
                            <Button variant="contained" size="small" sx={{}} onClick={(ev) => handleSaveTC(ev)}> Add </Button>
                        </Box>
                    </FormControl>
                    <Divider sx={{ margin: '1rem 0' }} />
                    <Card>
                        <CardContent>
                            <Box sx={{ overflowY: 'scroll' }}>
                                {!joTermsCondition ? <div style={{ textAlign: 'center' }}> No Terms & Condition </div> :
                                    <ol style={{ height: '200px', position: 'relative', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {joTermsCondition.map((m, mx) => (
                                            <li key={mx} style={{ textAlign: 'justify' }}>
                                                {
                                                    termsConditionBool
                                                        ?
                                                        <Stack sx={{ gap: '0.4rem' }}>
                                                            <FormControl fullWidth>
                                                                <TextField multiline variant="outlined" rows={3} maxRows={4} value={m} InputProps={{ padding: 2 }} />
                                                            </FormControl>
                                                            <Button variant="contained" color="error" size="small" onClick={(ev) => handleRemoveTC(ev, mx)} > remove </Button>
                                                        </Stack>
                                                        :
                                                        m
                                                }
                                            </li>
                                        ))}
                                    </ol>
                                }
                            </Box>
                            &nbsp;
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: 'cornflowerblue', display: 'flex', alignItems: 'center' }} > <InfoOutlinedIcon /> <em> Double click to toggle edit and remove </em> </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Divider sx={{ margin: '1rem 0' }} />
                    <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {/* onDoubleClick={(ev) => setTermsConditionBool(!termsConditionBool)} */}
                        <Button variant="contained" color={termsConditionBool ? 'error' : 'primary'} onClick={() => setTermsConditionBool(!termsConditionBool)} size="small" > {termsConditionBool ? 'Cancel' : 'Edit'} </Button>
                        {/* <Button variant="contained" color="error" onClick={() => setOpen(null)} size="small" > Close </Button> */}
                        <Button variant="contained" color="success" onClick={() => handleSaveTerms()} size="small" > Save </Button>
                    </Box>
                </>
                }

                {open === 'jo-POE' && <>
                    <Stack spacing={1}>
                        <TextField
                            value={timePeriod.from}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            label="From"
                            onChange={(ev) => setTimePeriod((prev) => ({ ...prev, from: ev.target.value }))}
                            type='date'
                            size="small"
                            inputProps={{ min: today, max: timePeriod.to }}
                        />
                        <TextField
                            value={timePeriod.to}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            label="To"
                            onChange={(ev) => setTimePeriod((prev) => ({ ...prev, to: ev.target.value }))}
                            type='date'
                            size="small"
                            inputProps={{ min: today }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant='contained' color='success' onClick={handleSavePeriodTime}> Save </Button>
                        </Box>
                    </Stack>
                </>
                }
                {open === 'jo-JD' && <>
                    <FormControl fullWidth>
                        <TextField multiline variant="outlined" rows={2} maxRows={2} InputProps={{ padding: 2, fontSize: '12px' }} placeholder='Enter Job Description' value={joDesc} onChange={(ev) => setJoDesc(ev.target.value)} />
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                        <Button variant='contained' startIcon={<AddIcon />} color='primary' size='small' onClick={handleAddDescription}> Add </Button>
                    </Box>

                    <Stack spacing={1} sx={{ boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.2)', maxHeight: '160px', overflowY: 'scroll', marginTop: '0.4rem', padding: '0.5rem 0' }}>
                        {
                            !joDescription ? <div style={{ textAlign: 'center' }}> No Terms & Condition </div> :
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {
                                        joDescription.map((n, nx) => (
                                            termsConditionBool ?
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                    <TextField multiline variant="outlined" rows={2} maxRows={2} value={n} InputProps={{ padding: 2 }} onChange={(ev) => setJoDescription((prev) => prev.map((m, mx) => mx === nx ? ev.target.value : m))} />
                                                    <Button variant='contained' color='error' size='small' onClick={() => setJoDescription((prev) => prev.filter((m, mx) => mx !== nx))}> Remove </Button>
                                                </Box>
                                                :
                                                <li key={nx} style={{ textAlign: 'justify' }}>{n}</li>

                                        ))
                                    }
                                </ul>
                        }
                    </Stack>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                        <Box>
                            <Button variant="contained" color={termsConditionBool ? 'error' : 'primary'} onClick={() => setTermsConditionBool(!termsConditionBool)} size="small" > {termsConditionBool ? 'Cancel' : 'Edit'} </Button>
                        </Box>
                        <Box>
                            <Button variant='contained' color="success" size='small' onClick={handleSaveDescription}> Save </Button>
                        </Box>
                    </Box>
                </>
                }

            </CustomCenterModal>

            {/* printing views */}
            <CustomCenterModal compSize={'60%'} comptitle={''} matches={matches} handleCloseBTN={() => setOpen(null)} openner={open === 'view'} >
                {open === 'view' && <>
                    {applicantList.length !== 0 && (
                        <JODocument ref={joRef} signatories={signatoryJO} data={cData} />
                    )}
                </>}
            </CustomCenterModal>
        </Fragment >

        {loading ? <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }
            }>
                <Stack spacing={1} justifyContent="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size="30px" />
                    </Box>
                    <Typography variant='caption' sx={{ display: 'inline' }}> Fetching data... </Typography>
                </Stack>
            </Box>
        </> : <>
            <Box>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<SettingsIcon />} onClick={popover.handleOpen}> Job order </Button>
                </Stack>

                <Menu id="basic-menu" anchorEl={popover.anchorEl} open={popover.open} onClose={popover.handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button', }}>
                    <MenuItem onClick={(ev) => handleAction(ev, 'view')}> View </MenuItem>
                    <MenuItem onClick={(ev) => handleAction(ev, 'editcontent')}> Terms and condition </MenuItem>
                    <MenuItem onClick={(ev) => handleAction(ev, 'jo-JD')}>Job description</MenuItem>
                    {/* <MenuItem onClick={(ev) => handleJO(ev, 'letterhead')}>Letterhead</MenuItem> */}
                    {/* <MenuItem onClick={(ev) => handleJO(ev, 'signatories')}>Signatories</MenuItem> */}
                </Menu>
            </Box>
            <Divider sx={{ marginTop: "1rem", marginBottom: '1rem' }} />
            <Box>
                <TableContainerComp height={'320px'} maxHeight={'300px'}>
                    <TableHead>
                        <TableRow>
                            {tableHeadD.map((column, index) =>
                                <TableCell key={column.headerName + '-' + index} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: column.width, backgroundColor: "#1565C0 !important" }}>
                                    {column.headerName.toUpperCase()}
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ?
                            Array.from(Array(5)).map((item, index) => (
                                <TableRow key={index}>
                                    {Array.from(Array(5)).map((item2, index2) => (
                                        <TableCell component="th" scope="row" key={index2}>
                                            <Skeleton variant="text" width="" height={45} animation='wave' sx={{ borderRadius: 0 }} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : <>
                                {applicantList.map((i, indx) => (
                                    <TableRow key={'applicants-' + indx}>
                                        <TableCell sx={{ color: i.appoint_date ? 'black' : 'red' }}>
                                            {i.appoint_date ?
                                                JSON.parse(i.appoint_date).map((d, dx) => dx === 0 ? formatDateToWorded(d) : ` - ${formatDateToWorded(d)}`)
                                                : 'Unset'
                                            }
                                        </TableCell>
                                        <TableCell> {autoCapitalizeFirstLetter(formatName(i.fname, i.mname, i.lname, i.extname, 0)) || 'N/A'} </TableCell>
                                        <TableCell> {i.emailadd} </TableCell>
                                        <TableCell> {i.cpno ? i.cpno : i.telno} </TableCell>
                                        <TableCell>
                                            <Stack spacing={1}>
                                                {/* {tempReq.emp_stat === 'Job Order' && <> */}
                                                <Button variant="contained" size="small" onClick={(ev) => handleAction(ev, 'jo-POE', i)}>Period of Employment</Button>
                                                {/* </>} */}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        }
                    </TableBody>
                </TableContainerComp>
                {/* <Box sx={{ mt: 1 }}>
                    <Pagination shape="rounded" count={Math.ceil(total / perPage)} page={page} color='primary' onChange={(ev, v) => handlePaginate(ev)} />
                </Box> */}
            </Box>
        </>}
    </>)
}

export default JobOrder