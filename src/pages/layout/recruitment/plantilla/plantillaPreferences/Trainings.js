import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

function Trainings({ id: positionId }) {

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    const [isCreated, setIsCreated] = useState(false)
    const [loader, setLoader] = useState(true)
    const [items, setItems] = useState([])
    const [isRequired, setIsRequired] = useState(true)
    const [isRequiredLoader, setIsRequiredLoader] = useState(false)
    const [isRequiredDiasble, setIsRequiredDisable] = useState(false)
    const handleChange = (e) => {
        setItems({ ...items, [e.target.name]: e.target.value })
    }

    const handleRequire = async () => {
        setIsRequiredLoader(true)
        try {
            let require = await axios.post(`/api/recruitment/toggleRequiredPointSystem`, { id: items.id, category: 'trainings', isRequired: isRequired })
            if (require.data.status === 200) {
                setIsRequiredLoader(false)
                setIsRequired(prev => !prev)
                toast.success('updated')
            }
            else {
                toast.error(require.data)
                setIsRequiredLoader(false)
            }
        }
        catch (err) {
            toast.error(err.message)
            setIsRequiredLoader(false)
        }
    }

    const handleCreate = async () => {
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        try {
            let create = await axios.post(`/api/recruitment/submitEntriesForPointSystem`, { category: 'trainings', id: positionId })
            Swal.close()
            if (create.data.status === 200) {
                setItems({
                    id: create.data.id,
                    description: '',
                    position_id: positionId,
                    hours: 0,
                    years: 0,
                    value: 0,
                    percent_value: 0,

                })
                setIsCreated(true)
                setIsRequiredDisable(false)
            }
        }
        catch (err) {
            toast.error(err.message)
        }

    }



    const handleUpdate = async () => {
        Swal.fire({
            text: 'Processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        try {
            let update = await axios.post(`/api/recruitment/updateEntriesForPointSystem`, { items, category: 'trainings' })
            if (update.data.status === 200)
                Swal.close()
            else
                toast.error(update.data.message)
        }
        catch (err) {
            toast.error(err.message)
        }
    }

    const fetchFromApi = async (controller) => {
        try {
            let pointSystemData = await axios.post(`/api/recruitment/collectPointSystemPerCategory`, {
                category: 'trainings',
                plantilla_id: positionId,
            }, { signal: controller.signal })
            setLoader(false)
            if (pointSystemData.data.status === 200) {
                if (pointSystemData.data.point_system_items.length === 0) {
                    setIsCreated(false)
                    setIsRequiredDisable(true)
                }
                else {
                    setItems(pointSystemData.data.point_system_items[0])
                    if (pointSystemData.data.point_system_items[0].is_required === 1) {
                        setIsRequired(true)
                    }
                    else {
                        setIsRequired(false)
                    }
                    setIsCreated(true)
                }
            }
        }
        catch (err) {
            setLoader(false)
            if (err.message === 'canceled')
                return
            else
                toast.error(err.message)
        }
    }

    useEffect(() => {
        let controller = new AbortController()
        fetchFromApi(controller)
    }, [])
    return (
        <Box sx={{ flexGrow: 1 }}>
            {loader ? (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5, mb: 3 }}>
                        <Skeleton variant="text" sx={{ flex: 1 }} height="" animation="pulse" />
                        <Skeleton variant="text" sx={{ flex: 1 }} height="" animation="pulse" />
                        <Skeleton variant="text" sx={{ flex: 1 }} height="" animation="pulse" />
                    </Box>
                    <Skeleton variant="text" width='20%' height="" animation="pulse" />
                </>

            ) : (
                <Fade in>
                    <div>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <FormGroup>
                                <FormControlLabel control={<Switch disabled={isRequiredDiasble} checked={isRequired} />} onChange={handleRequire} label={isRequiredLoader ? (<CircularProgress />) : isRequired ? "Required" : "Not Required"} />
                            </FormGroup>
                        </Box>
                        {!isCreated && (
                            <Alert severity="warning"
                                action={
                                    <Button variant='contained' color="primary" size="small" startIcon={<AddIcon />} onClick={handleCreate}>
                                        create
                                    </Button>
                                }
                            >You haven't set default values for this position</Alert>
                        )}
                        {isCreated && (
                            <>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 2 }}>
                                    <TextField disabled={!isRequired} label="Description" size='small' name='description' multiline rows={3} value={items.description} onChange={handleChange}></TextField>
                                    <Box sx={{ display: 'flex', gap: 2, flexDirection: matches ? 'column' : 'row' }}>
                                        <TextField disabled={!isRequired} label="Number of Hours" type='number' size='small' name='hours' value={items.hours} onChange={handleChange}></TextField>
                                        <TextField disabled={!isRequired} label="Points" type='number' size='small' name='value' value={items.value} onChange={handleChange}></TextField>
                                        <TextField disabled={!isRequired} label="Percent Value" type='number' size='small' name='percent_value' value={items.percent_value} onChange={handleChange}></TextField>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                    <Button disabled={!isRequired} variant="contained" color="warning" startIcon={<EditIcon />} sx={{ borderRadius: '2rem' }} onClick={handleUpdate}>
                                        Update
                                    </Button>
                                </Box>
                            </>
                        )}
                    </div>
                </Fade>
            )}

        </Box>
    );
};

export default React.memo(Trainings)