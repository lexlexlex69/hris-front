import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Skeleton from '@mui/lab/Skeleton';
import Fade from '@mui/material/Fade';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import Divider from '@mui/material/Divider'

import axios from 'axios';
import { toast } from 'react-toastify'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import Qs from './managePositionDialogTabs/Qs';

const ManagePositionDialog = ({ data, positions, setPositions }) => {

    // media query
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    const [value, setValue] = React.useState('1');
    const [loader, setLoader] = useState(false)
    const [choices, setChoices] = useState(1)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // backdrop
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    // inputs states
    const [items, setItems] = useState({
        id: '',
        positionTitle: '',
        positionDescription: '',
        positionRemarks: '',
        positionServiceType: ''
    })
    const [isUpdate, setIsUpdate] = useState(true)

    const handleChangeInputs = (e) => {
        setItems({ ...items, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setOpen(true)
        try {
            let update = await axios.post(`/api/recruitment/updatePosition`, items)
            if (update.data.status === 200) {
                toast.success('position updated.')
                setOpen(false)
                let updatedPositions = positions.map(item => item.id === items.id ? {
                    ...item,
                    position_name: items.positionTitle,
                    description: items.positionDescription,
                    service_type: items.positionServiceType,
                    created_at: update.data.date_created,
                    updated_at: new Date(),
                } : item)
                setPositions(updatedPositions)
            }
            else if (update.data.status === 500) {
                toast.error(update.data.message)
                setOpen(false)
            }

        }
        catch (err) {
            toast.error(err)
            setOpen(false)
        }
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            setLoader(true)
            clearTimeout(timerId)
        }, 1000)
        setItems({
            id: data.id,
            positionTitle: data.position_name,
            positionDescription: data.description,
            positionRemarks: data.remarks,
            positionServiceType: data.service_type
        })
        return () => clearTimeout(timerId)
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <Grid container spacing={2} sx={{ p: 1 }}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', bgcolor: '#fff', flex: 1, mb: 1, width: { xs: '100%', md: '50%' }, m: 'auto' }}>
                        <Box display='flex' flexDirection='row' gap={2}>
                            <FormatAlignCenterIcon color='primary' />
                            <Typography variant='body1' color='primary'>
                            QUALIFICATION STANDARDS
                            </Typography>
                        </Box>
                        <Qs id={data.id} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default React.memo(ManagePositionDialog);