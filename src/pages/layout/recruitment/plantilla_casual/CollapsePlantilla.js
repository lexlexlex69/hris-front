import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ArrowForward from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { blue } from '@mui/material/colors';

import axios from 'axios'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { Add, Delete } from '@mui/icons-material';

import CommonBackdrop from '../../../../common/Backdrop';
import CollapsePositionSelect from './CollapsePositionSelect';

const CollapsePlantilla = ({ data, handleClose, setPlantillaCs, plantillaCs,setTotal,perPage }) => {
    const [ch, setCh] = useState(null)
    const [nCollapse, setNCollapse] = useState([
        {
            uuid: Date.now().toString(36) + Math.random().toString(36).substring(2),
            sequence: '',
            dept_id: '',
            position_id: ''
        }
    ])

    const [cbd, setCbd] = useState(false)

    const [offices, setOffices] = useState([])

    const handleAddRow = () => {
        setNCollapse(prev => [...prev, {
            uuid: Date.now().toString(36) + Math.random().toString(36).substring(2),
            sequence: '',
            dept_id: '',
            position_id: ''
        }])
    }

    const handleChangeCollapse = (e, uuid) => {
        console.log(uuid)
        let ChangeCollase = nCollapse.map((item) => item.uuid === uuid ? ({ ...item, [e.target.name]: e.target.value }) : item)
        setNCollapse(ChangeCollase)
    }

    const handleRemove = (param) => {
        let filteredCollapse = nCollapse.filter(item => item.uuid !== param.uuid)
        setNCollapse(filteredCollapse)
    }

    const fetchOffices = async () => {
        let controller = new AbortController()
        let res = await axios.get(`/api/recruitment/plantilla/getOffices`, { signal: controller.signal })
        setOffices(res.data.dept)
    }

    const handleAddCollapsedPositions = (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Proceed submitting?',
            text: `You are passing ${nCollapse?.length} collapse position.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setCbd(true)
                let res = await axios.post(`/api/recruitment/plantilla-casual/add-collapse-plantilla`, { data: nCollapse, reference_plantilla_id: data?.plantilla_id })
                console.log(res)
                if (res.data.status === 200) {
                    // return dept_id,pos and sequeunce when x.uuid === y.uuid and find res.data.returns pos and dept if x.uuid === y.uuid
                    let toPush = nCollapse.map((x) => res.data.returns.some(y => x.uuid === y.uuid) ? ({ dept_id: x?.dept_id, position_id: x?.position_id, is_collapse_reference: data?.plantilla_id, sequence: x?.sequence, position_name: res.data?.returns?.find((a) => a.uuid === x.uuid)?.pos, dept_title: res.data?.returns?.find((a) => a.uuid === x.uuid)?.dept }) : x)
                    toPush.map((x) => x.plantilla_id === data?.plantilla_id ? ({ ...x, is_collapse: 1,increase_decrease: x.propose_budget_amount }) : x)
                    let pushArr = [...plantillaCs]
                    toPush.forEach((item) => {
                        pushArr.unshift(item)
                    })
                    setPlantillaCs(pushArr.slice(0,perPage))
                    setTotal(prev => prev + nCollapse?.length)
                    setCbd(false)
                    handleClose()
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }

            }
        })
    }

    useEffect(() => {
        fetchOffices()
    }, [])
    return (
        <Box sx={{ height: 'calc(100vh - 66px)', py: 1, px: 2 }}>
            <CommonBackdrop open={cbd} setOpen={setCbd} title="submitting positions. . ." />
            <Box>
                <Typography variant="body2" color="primary">Department: {data?.dept_title}</Typography>
                <Typography variant="body2" color="primary">Position: {data?.position_name}</Typography>
                <Typography variant="body2" color="primary">Sequence: {data?.sequence}</Typography>
            </Box>
            {!ch && (
                <Box display='flex' alignItems='center' justifyContent='center' sx={{ height: 'calc(100vh - 66px)' }} gap={2} >
                    <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.main', transition: 'all .3s', color: '#fff' }, width: '10rem', textAlign: 'center', minHeight: '8rem', display: 'flex', alignItems: 'center', border: '2px solid', borderImageSlice: 1, borderWidth: 5, borderImageSource: `linear-gradient(90deg, rgba(25,93,161,1) 0%, rgba(10,82,127,1) 0%, rgba(10,82,127,1) 5%, rgba(10,82,127,1) 37%, rgba(34,154,195,1) 68%, rgba(23,156,216,1) 100%)`, }} onClick={() => setCh(1)}>
                        <CardContent>
                            Rectify Plantilla
                        </CardContent>
                    </Card>
                    <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.main', transition: 'all .3s', color: '#fff' }, width: '10rem', textAlign: 'center', minHeight: '8rem', display: 'flex', alignItems: 'center', border: '2px solid', borderImageSlice: 1, borderWidth: 5, borderImageSource: `linear-gradient(90deg, rgba(25,93,161,1) 0%, rgba(10,82,127,1) 0%, rgba(10,82,127,1) 5%, rgba(10,82,127,1) 37%, rgba(34,154,195,1) 68%, rgba(23,156,216,1) 100%)` }} onClick={() => setCh(2)}>
                        <CardContent>
                            Collapse from Plantilla permanent
                        </CardContent>
                    </Card>
                </Box>
            )}
            {ch === 1 && (
                <Box display='flex' alignItems='center' flexDirection='column' justifyContent='center' width='100%' pb={2}>
                    <form onSubmit={handleAddCollapsedPositions} >
                        <Box mt={2} display='flex' flexDirection='column'>
                            <Box display='flex' gap={2} flexDirection='column'>
                                {nCollapse && nCollapse.map((item, i) => (
                                    <>
                                        <Card raised>
                                            <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <TextField
                                                    id=""
                                                    label="Sequence"
                                                    name='sequence'
                                                    required
                                                    value={item.sequence}
                                                    onChange={(e) => handleChangeCollapse(e, item.uuid)}
                                                />
                                                <TextField required label="Requesting Office / Division" fullWidth name='dept_id'
                                                    InputProps={{ sx: { minWidth: '10rem', maxWidth: '20rem' } }}
                                                    select
                                                    defaultValue=' '
                                                    value={item.dept_id}
                                                    onChange={(e) => handleChangeCollapse(e, item.uuid)}
                                                >
                                                    {offices.length > 0 && offices.map((item, i) => (
                                                        <MenuItem key={i} value={item?.dept_code}>
                                                            {item?.dept_title}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <CollapsePositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/plantilla/AutoCompletePositions' nCollapse={nCollapse} uuid={item.uuid} setTitle={setNCollapse} />
                                                {i !== 0 ?
                                                    <Tooltip title='remove item'>
                                                        <Delete color='error' onClick={() => handleRemove(item)} sx={{ cursor: 'pointer', '&:hover': { color: 'error.dark' } }} />
                                                    </Tooltip>
                                                    : (
                                                        <Delete sx={{ color: '#fff', pointerEvents: 'none' }} />
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </>
                                ))}
                            </Box>
                            <Box display='flex' mt={2} justifyContent='space-between' alignItems='center'  >
                                <Button variant='contained' type='submit' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }}>Submit</Button>
                                <Add sx={{ border: `2px solid ${blue[500]}`, fontSize: 35, color: `${blue[500]}`, borderRadius: '50%', cursor: 'pointer', '&:hover': { bgcolor: `${blue[500]}`, color: `#fff`, transition: 'all .2s' } }} onClick={handleAddRow} />
                            </Box>
                        </Box>
                    </form>
                </Box>
            )}
        </Box>
    );
};

export default CollapsePlantilla;