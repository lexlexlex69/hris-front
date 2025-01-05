import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import { blue } from '@mui/material/colors'
import { Tooltip, Button, Skeleton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import CommonModal from '../../../../../common/Modal';
import CommonBackdrop from '../../../../../common/Backdrop';

import axios from 'axios'
import AddOrg from './AddOrg';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import Personnels from './Personnels';
import Transfer from './Transfer';

const defineType = (type) => {
    if (type === 'dept')
        return 'Department'
    if (type === 'div')
        return 'Division'
    if (type === 'sec')
        return 'Section'
    if (type === 'unit')
        return 'Unit'
    if (type === 'sub-unit')
        return 'Sub-Unit'
}

const OrgCard = ({ data, color, searchOrg }) => {
    const [openAddDiv, setOpenAddDiv] = useState(false)
    const [div, setDiv] = useState([])
    const [sec, setSec] = useState([])
    const [unit, setUnit] = useState([])
    const [dept, setDept] = useState([])
    const [zoomControl, setZoomControl] = useState(1)
    const [inputState, setInputState] = useState({
        title: '',
        shortName: '',
        type: '',
        anchorType: '',
        anchorId: ''
    })
    const [cBd, setCBd] = useState(false)
    const inputStateChange = (e) => {
        setInputState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // functions
    const handleSubmitData = async (e) => {
        e.preventDefault()
        setCBd(true)
        let res = await axios.post(`/api/dashboard/employee_management/set-org`, inputState)
        if (res.data.status === 200) {
            setOpenAddDiv(false)
            setInputState({
                title: '',
                shortName: '',
                type: '',
                anchorType: '',
                anchorId: ''
            })
            searchOrg()
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        setCBd(false)
    }

    useEffect(() => {
        let tempDiv = []
        let tempSec = []
        let tempUnit = []
        tempDiv = data?.children
        data.children?.forEach((item, i) => {
            if (item.children.length) {
                item.children?.forEach((item2, i2) => {
                    tempSec.push(item2)
                })
            }
        })

        data.children?.forEach((item, i) => {
            if (item.children.length) {
                item.children?.forEach((item2, i2) => {
                    if (item.children.length) {
                        item2.children?.forEach((item3, i3) => {
                            tempUnit.push(item3)
                        })
                    }
                })
            }
        })
        setDept(data)
        setDiv(tempDiv)
        setSec(tempSec)
        setUnit(tempUnit)
    }, [data])

    return (
        <Box width='100%' height='100%'>
            <CommonModal open={openAddDiv} customWidth='40%' setOpen={setOpenAddDiv} title="Add Division / Section / Unit" >
                <CommonBackdrop open={cBd} setOpen={setCBd} title='Adding data, please wait . . .' />
                <AddOrg inputState={inputState} handleSubmitData={handleSubmitData} div={div} sec={sec} unit={unit} dept={dept} inputStateChange={inputStateChange} />
            </CommonModal>
            <Box display='flex' justifyContent='center' mb={1}>
                <Box flex={2}>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenAddDiv(prev => !prev)} sx={{ borderRadius: '1rem' }}>
                        Insert data
                    </Button>
                </Box>
            </Box>
            <Box sx={{ overflow: 'scroll', height: '64vh', py: 2 }}>
                <Box sx={{ transform: `scale(${zoomControl})`, width: '500%', transition: `all .2s` }}>
                    {data && <RecursiveComponentCard searchOrg={searchOrg} data={data} color={blue} colorValue={800} />}
                </Box>
            </Box>
            <Box display='flex' justifyContent='center' flex={1} >
                <Box>
                    <Typography sx={{ cursor: 'pointer', fontSize: '12px' }} onClick={() => setZoomControl(prev => prev + .1)}><ZoomInIcon sx={{ fontSize: 35, cursor: 'pointer' }} color='primary' /> zoom in</Typography>

                </Box>
                <Box ml={2}>
                    <Typography sx={{ cursor: 'pointer', fontSize: '12px' }} onClick={() => setZoomControl(prev => prev - .1)}><ZoomOutIcon sx={{ fontSize: 35 }} color='error' /> zoom out</Typography>
                </Box>
            </Box>
        </Box>
    );
};

const RecursiveComponentCard = ({ data, color, colorValue, total, curr, searchOrg }) => {
    const [open, setOpen] = useState(false)
    const [openTransfer, setOpenTransfer] = useState(false)
    const [transferData, setTransferData] = useState(false)
    const [orgData, setOrgData] = useState('')
    const handleOpen = (orgId) => {
        setOrgData(orgId)
        setOpen(prev => !prev)
    }
    const handleOpenTransfer = (orgId, level) => {
        setTransferData({ orgId: orgId, level: level })
        setOpenTransfer(true)
    }
    const [personnelList, setPersonnelList] = useState([])
    const [personnelLoader, setPersonnelLoader] = useState(true)
    const [checBox, setCheckBox] = useState(false)

    const [deleteIndicator, setDeleteIndicator] = useState(false)
    // functions
    const showList = async (param) => {
        setCheckBox(prev => !prev)
        setPersonnelLoader(true)
        let res = await axios.get(`/api/dashboard/employee_management/employee-list?org_id=${param}`)
        setPersonnelList(res.data)
        setPersonnelLoader(false)
    }

    const handleDelete = async () => {
        Swal.fire({
            title: "Remove organization?",
            text: "It will also remove offices/sections under it.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'remove'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeleteIndicator(true)
                let res = await axios.post(`/api/dashboard/employee_management/remove-org`, { org_id: data.id })
                if (res.data.status === 200) {
                    searchOrg()
                }
                if (res.data.status === 500) {
                    toast.error(res.data.message, { position: 'top-center' })
                }
                setDeleteIndicator(false)
            }
        })

    }

    useEffect(() => {
        setPersonnelList([])
        setCheckBox(false)
    }, [data])
    return (
        <>
            <Box display='flex' flexDirection='column' alignItems='center' mx='auto' flex={1} sx={{ position: 'relative', '&:hover': { zIndex: 2000 }, px: '10px' }} >
                {data?.type !== 'dept' ? <Box className='orgB-pipe' sx={{ bgcolor: 'primary.main' }}></Box> : ''}
                {/* for borders / lines that connects the nodes */}
                {data?.type !== 'dept' ? (
                    <>
                        {
                            curr === 0 && total !== 1 ?
                                <Box sx={{ height: '5px', bgcolor: 'primary.main', position: 'absolute', width: 'calc(50% + 2px)', right: 0, top: '-5px' }}></Box>
                                : curr === (total - 1) && total !== 1 ?
                                    <Box sx={{ height: '5px', bgcolor: 'primary.main', position: 'absolute', width: 'calc(50% + 2px)', left: 0, top: '-5px' }}></Box>
                                    :
                                    curr === 0 && total === 1 ? '' :
                                        <Box sx={{ height: '5px', bgcolor: 'primary.main', position: 'absolute', width: 'calc(100%)', right: 0, top: '-5px' }}></Box>
                        }
                    </>
                ) : null}
                <Card className='orgB' raised sx={{ width: '12rem', minHeight: '8rem', bgcolor: color ? color[colorValue ? Number(colorValue) - 50 : 800] : '', '&:hover': { boxShadow: '3px 3px 3px 3px lightblue' }, cursor: 'pointer', position: 'relative' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}><Checkbox checked={checBox} onChange={() => showList(data.id)} /></Box>
                    <CardContent sx={{ zIndex: 1500, mt: -5 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
                            <Typography fontSize={'12px'} align='center' fontWeight={700} color='primary.main'>
                                {defineType(data?.type)}
                            </Typography>
                            <Typography fontSize={'12px'} align='center'>
                                {data?.title}
                            </Typography>
                        </Box>
                        <Box sx={{ position: 'absolute', bgcolor: deleteIndicator ? 'error.light' : 'primary.light', width: '100%', left: 0, px: 2, display: 'flex', bottom: 0 }}>
                            {data?.type !== 'dept' ? (
                                <Box display='flex' justifyContent='space-between' sx={{ width: '100%', alignItems: 'center', py: 1 }}>
                                    <Tooltip title="remove">
                                        <DeleteIcon sx={{ cursor: 'pointer', color: 'error.dark' }} onClick={() => handleDelete(data.id)} />
                                    </Tooltip>
                                    <Tooltip title="Personnel">
                                        <PeopleAltIcon sx={{ cursor: 'pointer', color: 'primary.dark' }} onClick={() => handleOpen(data.id)} />
                                    </Tooltip>
                                    <Tooltip title="transfer" >
                                        <CompareArrowsIcon sx={{ cursor: 'pointer', color: '#fff' }} onClick={() => handleOpenTransfer(data.id, data?.level)} />
                                    </Tooltip>
                                </Box>
                            ) : (
                                <>
                                    <Box display='flex' justifyContent='space-between' sx={{ width: '100%', alignItems: 'center', py: 1 }}>
                                        <Tooltip title="Personnel">
                                            <PeopleAltIcon sx={{ cursor: 'pointer', color: 'primary.dark' }} onClick={() => handleOpen(data.id)} />
                                        </Tooltip>
                                    </Box>
                                </>
                            )}
                        </Box>
                        {checBox && (
                            <Box mb={3} mt={1}>
                                {/* for personnel list */}
                                {personnelLoader ? (
                                    <>
                                        <Box display='flex' flexDirection='column' gap={1}>
                                            {Array.from(Array(5)).map((item, i) =>
                                                <Skeleton variant='text' key={i} />
                                            )}
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        {Array.isArray(personnelList) && personnelList.length ? (
                                            <Box display='flex' flexDirection='column' gap={1}>
                                                {personnelList.map((item, i) => (
                                                    <Box p={'5px'} border={`2px solid ${blue[800]}`} borderRadius={'5px'}>
                                                        <Typography fontSize={item.fullname?.length > 15 ? '10px' : '12px'} color='primary.dark' align='center'>{item.fullname}</Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) :
                                            <Typography fontSize={'12px'} align='center' color="error">empty</Typography>}
                                    </>
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>
                {open && <Personnels open={open} setOpen={setOpen} orgId={orgData} />}
                {openTransfer && <Transfer open={openTransfer} setOpen={setOpenTransfer} orgId={orgData} searchOrg={searchOrg} transferData={transferData} />}
                {data?.children?.length ? <Box className='orgB-pipe' sx={{ bgcolor: 'primary.main' }}></Box> : ''}
                <Box display='flex' justifyContent='center'>
                    {data?.children?.length ? data?.children?.map((item, i) => (
                        <>
                            <RecursiveComponentCard key={i} data={item} searchOrg={searchOrg} total={data?.children?.length} curr={i} />
                        </>
                    )) : ''}
                </Box>
            </Box >
        </>
    )
}

export default OrgCard;