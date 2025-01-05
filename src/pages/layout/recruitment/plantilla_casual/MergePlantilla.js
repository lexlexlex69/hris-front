import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ArrowForward from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'
import { blue } from '@mui/material/colors';

import axios from 'axios'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import CollapsePositionSelect from './CollapsePositionSelect';
import CommonBackdrop from '../../../../common/Backdrop';

const MergePlantilla = ({ data, handleClose, plantillaCs, setPlantillaCs }) => {

    const [plantilla, setPlantilla] = useState({
        position_id: '',
        sequence: '',
        dept_id: '',
        position_name: ''
    })
    const [offices, setOffices] = useState([])
    const [cbd, setCbd] = useState(false)

    const fetchOffices = async () => {
        let controller = new AbortController()
        let res = await axios.get(`/api/recruitment/plantilla/getOffices`, { signal: controller.signal })
        setOffices(res.data.dept)
    }

    const handleSubmitMerging = async (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Proceed submitting?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let office = offices.find(a => a.dept_code === plantilla.dept_id)
                setCbd(true)
                let res = await axios.post(`/api/recruitment/plantilla-casual/merge-plantilla-casual`, { plantilla: plantilla, to_merge: data })
                if (res.data.status === 200) {
                    let addedPlantilla = [...plantillaCs]
                    addedPlantilla.unshift({
                        'plantilla_id': res.data.id,
                        'position_name': plantilla.position_name,
                        'position_id': plantilla.position_id,
                        'dept_id': plantilla.dept_id,
                        'dept_title': office?.dept_title,
                        'is_merge': 1
                    })
                    // set is_merge_reference to 1 if new added plantilla found
                    let merge_reference = addedPlantilla.map( x => data.some(y => x.plantilla_id === y.plantilla_id) ? ({ ...x, is_merge_reference: res.data.id,increase_decrease:x?.propose_budget_amount }) : x)
                       // set increase_decrease for all to merge data
                    setPlantillaCs(merge_reference)
                    handleClose()
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
                setCbd(false)
            }
        })
    }

    useEffect(() => {
        fetchOffices()
    }, [])
    return (
        <Box p={1} display='flex' height='calc(100vh - 66px)'>
            <CommonBackdrop open={cbd} title='Processing request . . .' />
            <Box flex={1.5}>
                <Typography variant="body2" color="primary">TO MERGE PLANTILLA(S)</Typography>
                <Box sx={{ height: 'calc(100vh - 18%)', overflowY: 'scroll', px: 5, py: 2 }}>
                    {data && data.map((item, i) => (
                        <Card sx={{ mt: 1, position: 'relative' }} raised>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ position: 'absolute', top: 2, left: 2, bgcolor: blue[700], borderRadius: '50%', color: '#fff', width: '1.5rem', height: '1.5rem', textAlign: 'center', fontSize: '14px' }}>{i + 1}</Box>
                                <Typography sx={{ pl: 2 }} variant="body2" color="initial"><u>SEQUENCE</u>: {item?.sequence}</Typography>
                                <Typography sx={{ pl: 2 }} variant="body2" color="initial"><u>Department</u>: {item?.dept_title}</Typography>
                                <Typography sx={{ pl: 2 }} variant="body2" color="initial"><u>Position</u>: {item?.position_name}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
            <Box flex={2}>
                <form onSubmit={handleSubmitMerging}>
                    <Typography variant="body2" color="primary" sx={{ pl: 2 }}>CREATE NEW PLANTILLA</Typography>
                    <Box display='flex' flexDirection='column' gap={4} sx={{ px: { xs: 5, md: 10, lg: 10 } }} pt={5}>
                        <TextField label="Sequence" sx={{ mt: 2 }} required type='number' InputProps={{ inputProps: { min: 1 } }} value={plantilla.sequence} onChange={(e) => setPlantilla(prev => ({ ...prev, sequence: e.target.value }))} focused />
                        <TextField
                            required
                            label="Requesting Office / Division"
                            fullWidth name='dept_id'
                            select
                            defaultValue=' '
                            value={plantilla.dept_id}
                            onChange={(e) => setPlantilla(prev => ({ ...prev, dept_id: e.target.value }))}
                        >
                            {offices.length > 0 && offices.map((item, i) => (
                                <MenuItem key={i} value={item?.dept_code}>
                                    {item?.dept_title}
                                </MenuItem>
                            ))}
                        </TextField>
                        <CollapsePositionSelect componentTitle='POSITION TITLE' optionTitle='position_name' url='/api/recruitment/plantilla/AutoCompletePositions' setTitle={setPlantilla} />
                        <Box display='flex' justifyContent='flex-end'>
                            <Button variant='contained' type='submit' size='large' startIcon={<ArrowForward />} sx={{ borderRadius: '2rem' }}>Submit</Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default MergePlantilla;