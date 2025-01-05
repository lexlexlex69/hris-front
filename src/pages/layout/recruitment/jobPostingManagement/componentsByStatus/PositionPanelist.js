import React, { useEffect, useState } from 'react';
import { green, blue } from '@mui/material/colors'
import Container from '@mui/material/Container'
import Alert from '@mui/lab/Alert'
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Fade from '@mui/material/Fade'
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import axios from 'axios'
import { toast } from 'react-toastify'

import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CancelIcon from '@mui/icons-material/Cancel';

import CustomBackdrop from './CustomBackdrop'
import Skeleton from '@mui/material/Skeleton'
import Swal from 'sweetalert2';


let timer = null

const PositionPanelist = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    const [selectResult, setSelectResult] = useState('')
    const [defaultPanelList, setDefaultPanelList] = useState(null)
    const [panelList, setPanelList] = useState([])
    const [panelCardCloseLoader, setPanelCardCloseLoader] = useState()
    const [currentItemIndex, setCurrentItemIndex] = useState()

    const [backdrop, setBackdrop] = useState(false)

    const autoCompleteChange = async (value) => {
        console.log(value)
        clearTimeout(timer)
        timer = setTimeout(async () => {
            let res = await axios.get(`/api/recruitment/set-panelist/panelistAutoComplete?param=${value}`)
            console.log(res)
            setOptions(res.data);
            setSelectResult(value)
        }, 500)
    }

    const removePanelist = (item, i) => {
        console.log(item)
        let filtered = panelList.filter(x => x.id !== item.id)
        setPanelList(filtered)
        setCurrentItemIndex(i)
    }

    const handlePanelList = () => {
        let checkPanelist = panelList.filter(item => item.id === selectResult.id)
        if (checkPanelist.length > 0) {
            toast.error('Employee already in the list!')
            return
        }
        setPanelList(prev => ([...prev, selectResult]))
    }

    const handleSubmit = async () => {
        let toSubmitPanelist = panelList.map(item => item.id)
        let postData = {
            vacancy_id: data.job_vacancies_id,
            panel_lists: toSubmitPanelist
        }
        if (panelList.length > 0) {
            setBackdrop(true)
            let res = await axios.post(`/api/recruitment/set-panelist/submitPanelist`, postData)
            console.log(res)
            setBackdrop(false)
            if (res.data.status === 200) {
                toast.success('Panel added!')
                let newDefault = [...defaultPanelList]
                res.data.panel_lists.forEach(item => {
                    newDefault.push(item)
                })
                setDefaultPanelList(newDefault)
                setPanelList([])
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
        else {
            toast.warning('Nothing to submit!')
            return
        }

    }

    const fetchPanelist = async (controller) => {
        let res = await axios.post(`/api/recruitment/set-panelist/fetchPanelist`, { vacancy_id: data.job_vacancies_id }, { signal: controller.signal })
        console.log(res)
        setDefaultPanelList(res.data.panel_lists)
    }

    const handleRemove = async (item, i) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setPanelCardCloseLoader(i)
                let res = await axios.post(`/api/recruitment/set-panelist/removePanel`, { vacancy_id: data.job_vacancies_id, employee_id: item.employee_id, panel_id: item.panelist_id })
                console.log(res)
                setPanelCardCloseLoader('')
                if (res.data.status === 200) {
                    let filtered = defaultPanelList.filter(x => x.id !== item.id)
                    setDefaultPanelList(filtered)
                    toast.success('Panel removed!')
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
            }
        })

    }

    const setChairman = (item, index) => {
        Swal.fire({
            text: `Set ${item.fname + ' ' + item.mname + '' + item.lname} as chairman of the panel?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ok'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setBackdrop(true)
                let res = await axios.post(`/api/recruitment/set-panelist/setChairmanPanel`, { panelist_id: item.panelist_id })
                console.log(res)
                if (res.data.status === 200) {
                    let newPanelist = defaultPanelList.map((x, i) => {
                        if (x.panelist_id === item.panelist_id) {
                            return { ...x, is_chairman: 1 }
                        }
                        else {
                            return {...x,is_chairman:0}
                        }
                    })
                    setDefaultPanelList(newPanelist)
                    toast.success('Panel chairman is updated!')
                }
                else if (res.data.status === 500) {
                    toast.error(res.data.message)
                }
                setBackdrop(false)

            }
        })

    }

    useEffect(() => {
        let controller = new AbortController()
        fetchPanelist(controller)
    }, [])

    return (
        <Grid container spacing={1} sx={{ pb: 2 }}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
                <CustomBackdrop open={backdrop} title='Please wait . . .' />
                <Container maxWidth="lg" sx={{ pt: 2, px: { xs: 2, md: 2 }, width: { xs: '90%', md: '100%' } }}>
                    <Alert severity='info'>Panel Lists</Alert>
                    <Box display='flex' sx={{ mt: 2 }}>
                        {defaultPanelList ? (
                            <Fade in>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {defaultPanelList && defaultPanelList.map((item, i) => (
                                        <Card sx={{ p: 1, m: .5, borderRadius: .5, width: { xs: '40%', md: '10rem' } }}>
                                            <Box display="flex" sx={{ justifyContent: 'space-between', mb: 1 }}>
                                                <Box display="flex" sx={{ flex: 1, justifyContent: 'flex-start' }}>
                                                    <AccountCircleIcon />
                                                </Box>
                                                {panelCardCloseLoader === i ? (
                                                    <Box display='flex' sx={{ flex: 1, justifyContent: 'flex-end' }}>
                                                        <CircularProgress color="error" size={25} />
                                                    </Box>
                                                ) : (
                                                    <Box display='flex' sx={{ flex: 1, justifyContent: 'flex-end' }}>
                                                        <CancelIcon sx={{ cursor: 'pointer', '&:hover': { color: 'error.dark' }, color: 'error.main' }} onClick={() => handleRemove(item, i)} />
                                                    </Box>
                                                )}
                                            </Box>
                                            <Typography sx={{ fontSize: '12px' }} align="center" >{item.fname} {item.mname} {item.lname}</Typography>
                                            <FormControlLabel control={<Checkbox checked={item.is_chairman === 1 ? 'checked' : ''} onClick={() => setChairman(item, i)} />} label="Chairman" />
                                        </Card>
                                    ))}
                                </div>
                            </Fade>
                        ) : (
                            <Box display='flex' sx={{ gap: 1, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Skeleton variant="rounded" width="40%" height={80} animation="pulse" />
                                <Skeleton variant="rounded" width="40%" height={80} animation="pulse" />
                                <Skeleton variant="rounded" width="40%" height={80} animation="pulse" />
                                <Skeleton variant="rounded" width="40%" height={80} animation="pulse" />
                                <Skeleton variant="rounded" width="40%" height={80} animation="pulse" />
                            </Box>
                        )}

                    </Box>
                </Container>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
                <Container sx={{ pt: 2, px: { xs: 2, md: 5 }, width: { xs: '90%', md: '80%' } }}>
                    <Alert severity='info'>Position title: {data?.position_title}</Alert>
                    <Box display="flex"
                        sx={{ mt: 1, gap: 2 }}
                    >
                        <Autocomplete
                            size='small'
                            sx={{ flex: 1 }}
                            onChange={(e, v) => setSelectResult(v)}
                            fullWidth
                            placeholder='search employee'
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(option) => option.fname + ' ' + option.mname + ' ' + option.lname}
                            options={options}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField
                                    required
                                    {...params}
                                    label="add panelist"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                    onChange={e => autoCompleteChange(e.target.value)}
                                />
                            )}
                        />
                        <Fab
                            color="primary"
                            size='small'
                            onClick={handlePanelList} disabled={!selectResult ? true : false}
                        >
                            <AddIcon />
                        </Fab>
                    </Box>
                    <Box display="flex" sx={{ flexDirection: 'column', mt: 3, gap: 1 }}>
                        {panelList.map((item, i) => (
                            <Box display='flex' sx={{ flex: 1, width: '100%', alignItems: 'center' }} className='animate__animated animate__fadeInDown animate__faster'>
                                <Typography fullWidth sx={{ flex: 1, p: 1, borderRadius: '.2rem', color: 'primary.dark', border: `2px solid ${blue[800]}` }} align='center'>{item.fname} {item.mname} {item.lname}</Typography>
                                <CloseIcon sx={{ m: 1, cursor: 'pointer' }} color="error" onClick={() => removePanelist(item, i)} />
                            </Box>
                        ))}
                    </Box>
                    <Box display="flex" sx={{ mt: 3, justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" endIcon={<ArrowForwardIcon />} sx={{ borderRadius: '2rem' }} onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    );
};

export default PositionPanelist;