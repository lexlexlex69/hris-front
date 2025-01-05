import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography'
import { blue, orange, red } from '@mui/material/colors'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Tooltip from '@mui/material/Tooltip';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import axios from 'axios'
import { toast } from 'react-toastify';
import { CardContent, MenuItem } from '@mui/material';

import CommonBackdrop from '../../../../../common/Backdrop';

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

const Transfer = ({ open, setOpen, transferData, searchOrg }) => {
    const [dept, setDept] = useState([])
    const fetchDept = async () => {
        let res = await axios.get(`/api/dashboard/employee_management/fetch-department-org`)
        setDept(res.data)
    }

    const [org, setOrg] = useState('')
    const [loader, setLoader] = useState(false)
    const [transferLoader, setTransferLoader] = useState(false)
    const [selectedDept, setSelectedDept] = useState('')

    const [zoomLevel, setZoomLevel] = useState(1)

    const handleSearchOrg = async () => {
        setLoader(true)
        try {
            let res = await axios.post(`/api/dashboard/employee_management/fetch-search-org`, { dept_code: selectedDept })
            setOrg(res.data)
            console.log(res)
        }
        catch (err) {
            toast.error(err)
        }
        setLoader(false)
    }

    useEffect(() => {
        fetchDept()
    }, [])
    return (
        <Box>
            <Box sx={{ p: 2, position: 'absolute', top: 0, left: '50%', transform: 'translate(5%,-20%)', zIndex: 2000, width: '40rem', height: '30rem', borderRadius: 1, display: open ? 'block' : 'none', transition: 'all .5s', boxShadow: `2px 10px 15px 2px ${red[400]}`, bgcolor: '#fff', '&:hover': { zIndex: 2000, boxShadow: `2px 10px 15px 2px ${red[800]}` }, zIndex: 900, cursor: 'pointer', pb: 2, pt: 1, px: 1, overflow: 'hidden' }}>
                <CommonBackdrop open={loader} setOpen={setLoader} title="fetching department data" />
                <CommonBackdrop open={transferLoader} setOpen={setTransferLoader} title="updating organization . . ." />
                <Tooltip title="close">
                    <CloseIcon sx={{ float: 'right' }} color='error' onClick={() => setOpen(false)} />
                </Tooltip>
                <Box>
                    <Typography variant="body1" align='center' color="error" mb={.5}>Transfer</Typography>
                </Box>
                <Box display='flex' sx={{ px: 2, alignItems: 'center', gap: 2 }}>
                    <TextField
                        id=""
                        label="select department"
                        fullWidth
                        select

                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                    >
                        {dept && dept.map((item) => (
                            <MenuItem value={item.dept_code} >{item.title}</MenuItem>
                        ))}
                    </TextField>
                    <SearchIcon color='primary' sx={{ fontSize: 40 }} onClick={handleSearchOrg} />
                </Box>
                <Box display='flex'>
                    <ZoomInIcon color='primary' onClick={() => setZoomLevel(prev => prev + .1)} sx={{ fontSize: 45 }} />
                    <ZoomOutIcon color='error' sx={{ fontSize: 45 }} onClick={() => setZoomLevel(prev => prev - .1)} />
                </Box>
                <Box mt={2} sx={{ height: '70%', width: '100%', overflow: 'scroll' }}>
                    <Box sx={{ transform: `scale(${zoomLevel})`, transition: 'all .3s', position: 'relative' }}>
                        {org && <OrgTransferRecursion data={org} transferData={transferData} setTransferLoader={setTransferLoader} searchOrg={searchOrg} />}
                    </Box>
                </Box>
            </Box>

        </Box>

    );
};

const OrgTransferRecursion = ({ data, curr, total, transferData, searchOrg, setTransferLoader }) => {

    const handleTransferOrg = async () => {
        setTransferLoader(true)
        if (data.level < transferData.level || data.type === 'dept') {
            let res = await axios.post(`/api/dashboard/employee_management/transfer-org`, {
                origOrgId: transferData?.orgId,
                transferOrgId: data?.id
            })
            if (res.data.status === 200) {
                searchOrg()
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            setTransferLoader(false)
        }
        else {
            toast.error('Sorry, inserting organization wth the same or higher level is not allowed!')
            setTransferLoader(false)
        }
    }
    return (
        <Box display='flex' flex={1} flexDirection='column' mx='auto' alignItems='center' position='relative' px={2}>
            {data?.type !== 'dept' && <Box sx={{ height: '20px', width: '5px', bgcolor: 'primary.dark' }}></Box>}
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
            <Card raised sx={{ minWidth: '5rem', maxWidth: '8rem', minHeight: '5rem' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Typography variant="body2" fontSize='12px' color="#5C5C5C">{defineType(data.type)}</Typography>
                    <Typography variant="body2" fontSize='10px' color="primary" align='center'>{data.title}</Typography>
                    <Tooltip title="transfer under this Organization">
                        <DoneOutlineIcon sx={{ fontSize: 30, '&:hover': { color: 'primary.main' } }} onClick={handleTransferOrg} />
                    </Tooltip>
                </CardContent>
            </Card>
            {data?.children?.length > 0 && <Box sx={{ height: '20px', width: '5px', bgcolor: 'primary.dark' }}></Box>}
            <Box display='flex'>
                {data?.children?.length ? data?.children.map((item, i) => (
                    <OrgTransferRecursion key={i} data={item} curr={i} total={data?.children?.length} searchOrg={searchOrg} setTransferLoader={setTransferLoader} transferData={transferData} />
                )) : ''}
            </Box>

        </Box>
    )
}

export default Transfer;