import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red, yellow } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import Swal from 'sweetalert2'

import SpecialSkillsUpdates from './tableUpdates/SpecialSkillsUpdates'
import RecognitionUpdates from './tableUpdates/RecognitionUpdates'
import OrganizationUpdates from './tableUpdates/OrganizationUpdates'

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


function TableUpdates(props) {

    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));

    const [choice, setChoice] = useState('')
    const [specialSkills, setSpecialSkills] = useState([])
    const [recognition, setRecognition] = useState([])
    const [organization, setOrganization] = useState([])

    useEffect(() => {
        console.log(props.updates)
        let specialSkills = props.updates.filter(item => item.type_id === 1)
        let recognition = props.updates.filter(item => item.type_id === 2)
        let organization = props.updates.filter(item => item.type_id === 3)
        setSpecialSkills(specialSkills)
        setRecognition(recognition)
        setOrganization(organization)
    }, [])
    return (
        <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled={specialSkills.length <= 0 ? true : false} variant={choice === 'special_skills' ? 'contained' : 'outlined'} size="small" onClick={() => setChoice('special_skills')}>{matches ? 'SKILLS' : 'Special Skills'}</Button>
                <Button disabled={recognition.length <= 0 ? true : false} variant={choice === 'recognition' ? 'contained' : 'outlined'} size="small" onClick={() => setChoice('recognition')}>{matches ? 'Recognition' : 'NON-ACADEMIC DISTINCTIONS/RECOGNITION'}</Button>
                <Button disabled={organization.length <= 0 ? true : false} variant={choice === 'organization' ? 'contained' : 'outlined'} size="small" onClick={() => setChoice('organization')}>{matches ? 'ORGANIZATION' : 'MEMBER IN ASSOCIATION/ORGANIZATION'}</Button>
            </Box>
            <Box sx={{ mt: 2 }}>
                {choice === 'special_skills' ? (
                    <SpecialSkillsUpdates data={specialSkills && specialSkills} setData={setSpecialSkills} updates={props.updates} setUpdates={props.setUpdates} specialSkills={props.specialSkills} pdsParam={props.pdsParam.id || ''} />
                ) : choice === 'recognition' ?
                    (
                        <RecognitionUpdates data={recognition && recognition} setData={setRecognition} updates={props.updates} setUpdates={props.setUpdates} recognition={props.recognition} pdsParam={props.pdsParam.id || ''} />
                    ) : choice === 'organization' ?
                        (
                            <OrganizationUpdates data={organization && organization} setData={setOrganization} updates={props.updates} setUpdates={props.setUpdates} organization={props.organization} pdsParam={props.pdsParam.id || ''} />
                        ) : 'Disabled buttons means no available updates'}
            </Box>
        </Box>
    )
}

export default React.memo(TableUpdates)