import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// mui icons
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// external import function
import { getEmployeeGovId, handleUpdate, getGidUpdates, handleConfirmUpdate } from './Controller'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Tooltiptheme = createTheme({
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    color: '#fff',
                    bottom: -10,
                    right: 0,
                    border: `2px solid #b91400`,
                },
                popper: {
                    zIndex: 700 + '!important',
                }
            },
        },
    },
});

function Gid() {
    // pdsParam
    const pdsParam = useParams()
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [gid, setGid] = useState('')
    const [toCompare, setToCompare] = useState('')
    const gov_id = useRef('')
    const id_no = useRef('')
    const date_place_issuance = useRef('')
    const [loader, setLoader] = useState(false)
    // modal states
    const [toUpdate, setToUpdate] = useState('')
    const [open, setOpen] = useState(false);
    const handleOpenModal = (latest, reff) => {
        //console.log(latest)
        setToUpdate({
            new: latest,
            reff: reff
        })
        setOpen(true)
    };
    const handleCloseModal = () => setOpen(false);

    useEffect(() => {
        const controller = new AbortController()
        if (pdsParam.id && localStorage.getItem('hris_roles') === '1') {
            //console.log('yes')
            getGidUpdates(pdsParam.id, setGid, setToCompare, setLoader)
        }
        else {
            //console.log('no')
            // getEmployeeGovId('', setGid, controller,setLoader)
            getGidUpdates('', setGid, setToCompare, setLoader)

        }
    }, [])
    return (
        <Grid container spacing={1}>
            <Modal
                sx={{ zIndex: 999 }}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: matches ? '90%' : '40%',
                            bgcolor: 'background.paper',
                            // borderBottomLeftRadius: '1rem',
                            // borderBottomRightRadius: '1rem',
                            borderRadius: '1rem',
                            boxShadow: 24,
                            px: 2,
                            pb: 4,
                            pt: 2,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography id="modal-modal-title" sx={{ color: '#A1A2A3' }}>
                                OLD ENTRY
                            </Typography>
                            <Typography id="modal-modal-title" sx={{ bgcolor: red[500], p: .5, color: '#fff' }}>
                                {toUpdate && toUpdate.new.old_value}
                            </Typography>
                            <Typography id="modal-modal-title" sx={{ color: '#A1A2A3', mt: 1 }}>
                                NEW ENTRY
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ bgcolor: blue[500], p: .5, color: '#fff' }}>
                                {toUpdate && toUpdate.new.new_value}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Button variant='contained' onClick={() => handleConfirmUpdate(toUpdate, handleCloseModal, toCompare, setToCompare)}>Confirm</Button>
                            <Button variant='contained' color="error" onClick={handleCloseModal}>close</Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <ThemeProvider theme={Tooltiptheme}>
                    <Typography sx={{ p: 1, color: '#fff', mb: 1, bgcolor: '#62757f' }}>Goverment Issued ID (i.e. Passport, GSIS, SSS, PRC, Driver's License, etc. )  <br /> <small style={{ backgroundColor: '#49575e', padding: 5 }}>PLEASE INDICATE ID Number and Date of Issuance</small></Typography>
                    <Grid container spacing={1}>
                        {loader ? (
                            <>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <Tooltip title={toCompare.gov_id ? toCompare.gov_id.new_value : ''} open placement='top-end' arrow>
                                        <TextField label="Government Issued ID" size="small" sx={{ bgcolor: toCompare.gov_id ? '#ffcf4a' : null }} defaultValue={gid.gov_id} inputRef={gov_id} onClick={() => toCompare.gov_id && localStorage.getItem('hris_roles') === '1' ? handleOpenModal(toCompare.gov_id, gov_id) : null} fullWidth />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <Tooltip title={toCompare.id_no ? toCompare.id_no.new_value : ''} open placement='top-end' arrow>
                                        <TextField label="ID/License/Passport No." size="small" sx={{ bgcolor: toCompare.id_no ? '#ffcf4a' : null }} defaultValue={gid.id_no} inputRef={id_no} onClick={() => toCompare.id_no && localStorage.getItem('hris_roles') === '1' ? handleOpenModal(toCompare.id_no, id_no) : null} fullWidth />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                    <Tooltip title={toCompare.date_place_issuance ? toCompare.date_place_issuance.new_value : ''} open placement='top-end' arrow>
                                        <TextField label=" DATE/PLACE OF ISSUANCE: " size="small" sx={{ bgcolor: toCompare.date_place_issuance ? '#ffcf4a' : null }} defaultValue={gid.date_place_issuance} inputRef={date_place_issuance} onClick={() => toCompare.date_place_issuance && localStorage.getItem('hris_roles') === '1' ? handleOpenModal(toCompare.date_place_issuance, date_place_issuance) : null} fullWidth />
                                    </Tooltip>
                                </Grid>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 1, width: '100%', px: 2 }}>
                                <Skeleton width="100%" variant="text" />
                                <Skeleton width="100%" variant="text" />
                                <Skeleton width="100%" variant="text" />
                            </Box>
                        )}

                    </Grid>
                    {localStorage.getItem('hris_roles') === '1' && pdsParam.id ? null : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <Button variant='contained' color="success" sx={{ color: '#fff', mb: 2, borderRadius: '2rem' }} onClick={() => handleUpdate(localStorage.getItem('hris_roles') === '1' && pdsParam.id ? pdsParam.id : '', { gov_id, id_no, date_place_issuance }, gid, setGid, setToCompare, setLoader)}> Submit update</Button>
                        </Box>
                    )}
                </ThemeProvider>
            </Grid>
        </Grid>
    )
}

export default React.memo(Gid)