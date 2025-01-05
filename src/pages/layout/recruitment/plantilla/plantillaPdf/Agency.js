import React, { useState, useEffect, useRef } from 'react'
import { orange, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import ArrowForward from '@mui/icons-material/ArrowForward';
import Skeleton from '@mui/material/Skeleton'

const Agency = ({plantillaPdf}) => {
    const [plantillaPdfState,setPlantillaPdfState] = useState(plantillaPdf)
    const onChangeInput = (e) => {
        setPlantillaPdfState({ ...plantillaPdfState, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                name='agency'
                                onBlur={onChangeInput}
                                label="DEPARTMENT, CORPORATION OR AGENCY/ LOCAL GOVERNMENT"
                            />
                            <TextField
                                sx={{ flex: 1, pointerEvents: 'none' }}
                                id=""
                                value={plantillaPdfState?.dept_title}
                                label="BUREAU OR OFFICE"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                value={plantillaPdfState?.branch}
                                label="DEPARTMENT / BRANCH / DIVISION"
                                name='branch'
                                onBlur={onChangeInput}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                value={plantillaPdfState?.place_of_work}
                                label="WORKSTATION / PLACE OF WORK"
                                name='place_of_work'
                                onChange={onChangeInput}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <TextField
                                    sx={{ flex: 1 }}
                                    id=""
                                    name='present_appro_act'
                                    value={plantillaPdfState?.present_appro_act}
                                    onBlur={onChangeInput}
                                    label="PRESENT APPROP ACT"
                                />
                                <TextField
                                    sx={{ flex: 1 }}
                                    id=""
                                    name='previous_appro_act'
                                    value={plantillaPdfState?.previous_appro_act}
                                    onBlur={onChangeInput}
                                    label="PREVIOUS APPRP ACT"
                                />
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex' }}>
                                <TextField
                                    sx={{ flex: 1 }}
                                    id=""
                                    label="OTHER COMPENSATION"
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="POSITION TITLE OF IMMEDIATE SUPERVISOR"
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="POSITION TITLE OF NEXT HIGHER SUPERVISOR"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="POSITION TITLE"
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="ITEM NUBMER"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="MACHINE, EQUIPMENT, TOOLS, ETC,. USED REGULARLY IN PERFORMANCE OF WORK"
                            />
                        </Box>
        </>
    );
};

export default Agency;