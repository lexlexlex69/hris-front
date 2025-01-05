import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import Badge from '@mui/material/Badge';
import PersonalInfoTable from './tables/PdsInputUpdates';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import UnderDevWrapper from '../UnderDevWrapper';
import Education from './tables/Education';
import Eligiblity from './tables/Eligibility';
import Voluntary from './tables/Voluntary';
import Trainings from './tables/Trainings';
import WorkExp from './tables/WorkExp';
import CommonBackdrop from '../../../../common/Backdrop';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const AccordionItems = () => {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [expanded, setExpanded] = React.useState(false);

    const [personalInfo, setPersonalInfo] = useState([])
    const [personalAddress, setPersonalAddress] = useState([])
    const [familyBackground, setFamilyBackground] = useState([])
    const [children, setChildren] = useState([])
    const [educationalBackground, setEducationalBackground] = useState([])
    const [eligibility, setEligibility] = useState([])
    const [workExperience, setWorkExperience] = useState([])
    const [voluntary, setVoluntary] = useState([])
    const [trainings, setTrainings] = useState([])
    const [govid, setGovid] = useState([])
    const [_34_40, set_34_40] = useState([])
    const [otherInfo, setOtherInfo] = useState([])

    const [customBp, setCustomBp] = useState(true)

    const handleChange = (panel, arr) => (event, isExpanded) => {
        setExpanded(isExpanded && arr.length > 0 ? panel : false);
    };


    const fetchDeclineData = async () => {
        let res = await axios.get(`/api/pds/decline-updates/fetchDeclinedUpdates`)
        // console.log(res)
        setCustomBp(false)
        let pInfo = res.data.filter(item => item.table_name === 'hris_employee')
        setPersonalInfo(pInfo)
        let pAddress = res.data.filter(item => item.table_name === 'hris_employee_address')
        setPersonalAddress(pAddress)
        let family = res.data.filter(item => item.table_name === 'hris_employee_family')
        setFamilyBackground(family)
        let education = res.data.filter(item => item.table_name === 'hris_employee_education' && item.uid)
        setEducationalBackground(education)
        let eli = res.data.filter(item => item.table_name === 'hris_employee_eligibility' && item.uid)
        setEligibility(eli)
        let work = res.data.filter(item => item.table_name === 'hris_employee_employment' && item.uid)
        setWorkExperience(work)
        let volun = res.data.filter(item => item.table_name === 'hris_employee_voluntary' && item.uid)
        setVoluntary(volun)
        let train = res.data.filter(item => item.table_name === 'hris_employee_training' && item.uid)
        setTrainings(train)
        let others = res.data.filter(item => item.table_name === 'hris_employee_others')
        setOtherInfo(others)
        let _34 = res.data.filter(item => item.table_name === 'hris_employee_34_40')
        set_34_40(_34)
        let gov = res.data.filter(item => item.table_name === 'hris_employee_govid')
        setGovid(gov)
    }

    useEffect(() => {
        let controller = new AbortController()
        fetchDeclineData()
        return () => controller.abort()
    }, [])

    return (
        <div style={{ height: 'calc(100vh - 68px)' }}>
            <CommonBackdrop open={customBp} title="fetching data, please wait . . ." />
            <Box display='flex' flexDirection='column'>
                <Accordion expanded={expanded === 'personalInfo'} onChange={handleChange('personalInfo', personalInfo)} >
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Badge badgeContent={personalInfo?.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right', width: '33%', }}>
                            <Typography sx={{ flexShrink: 0, color: personalInfo.length > 0 ? '' : '#BEBEBE' }}> PERSONAL INFORMATION </Typography>
                        </Badge>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PersonalInfoTable arr={personalInfo} setState={setPersonalInfo} category='hris_employee' />
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'personalAddress'} onChange={handleChange('personalAddress', personalAddress)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Badge badgeContent={personalAddress?.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right', width: '33%', }}>
                            <Typography sx={{ flexShrink: 0, color: personalAddress.length > 0 ? '' : '#BEBEBE' }}>ADDRESS</Typography>
                        </Badge>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PersonalInfoTable arr={personalAddress} setState={setPersonalAddress} category='hris_employee_address' />
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'familyBackground'} onChange={handleChange('familyBackground', familyBackground)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Badge badgeContent={familyBackground?.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right', width: '33%', }}>
                            <Typography sx={{ flexShrink: 0, color: familyBackground.length > 0 ? '' : '#BEBEBE' }}>FAMILY BACKGROUND</Typography>
                        </Badge>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PersonalInfoTable arr={familyBackground} setState={setFamilyBackground} category='hris_employee_family' />
                    </AccordionDetails>
                </Accordion>
                {/* <UnderDevWrapper> */}
                <Accordion expanded={expanded === 'educationalBackground'} onChange={handleChange('educationalBackground', educationalBackground)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                    >
                        {/* <Badge badgeContent={educationalBackground?.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right', width: '33%', }}> */}
                        <Typography sx={{ flexShrink: 0, color: educationalBackground.length > 0 ? '' : '#BEBEBE' }}> EDUCATIONAL BACKGROUND{educationalBackground?.length > 0 ? <PriorityHighIcon color='error' /> : ''}</Typography>
                        {/* </Badge> */}
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'educationalBackground' &&
                            <Education arr={educationalBackground} setState={setEducationalBackground} />
                        }
                    </AccordionDetails>
                </Accordion>
                {/* </UnderDevWrapper> */}

                {/* <UnderDevWrapper> */}
                <Accordion expanded={expanded === 'eligibility'} onChange={handleChange('eligibility', eligibility)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, color: eligibility.length > 0 ? '' : '#BEBEBE' }}>ELIGIBILITY {eligibility?.length > 0 ? <PriorityHighIcon color='error' /> : ''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'eligibility' &&
                            <Eligiblity arr={eligibility} setState={setEligibility} />
                        }
                    </AccordionDetails>
                </Accordion>
                {/* </UnderDevWrapper> */}
                {/* <UnderDevWrapper> */}
                <Accordion expanded={expanded === 'workExperience'} onChange={handleChange('workExperience', workExperience)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, color: workExperience.length > 0 ? '' : '#BEBEBE' }}>WORK EXPERIENCE  {workExperience?.length > 0 ? <PriorityHighIcon color='error' /> : ''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'workExperience' &&
                            <WorkExp arr={workExperience} setState={setWorkExperience} />
                        }
                    </AccordionDetails>
                </Accordion>
                {/* </UnderDevWrapper> */}
                <Accordion expanded={expanded === 'voluntaryWorks'} onChange={handleChange('voluntaryWorks', voluntary)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, color: voluntary.length > 0 ? '' : '#BEBEBE' }}> {matches ? 'VOLUNTARY WORK' : 'VOLUNTARY WORK ON INVOLMENT IN CIVIC/NON-GOVERNMENT/PEOPLE/VOLUNTARY ORGANIZATION/S'}  {voluntary?.length > 0 ? <PriorityHighIcon color='error' /> : ''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'voluntaryWorks' &&
                            <Voluntary arr={voluntary} setState={setVoluntary} />
                        }
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'trainings'} onChange={handleChange('trainings', trainings)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Typography sx={{ flexShrink: 0, color: trainings.length > 0 ? '' : '#BEBEBE' }}>{matches ? 'LEARNING AND DEVELOPMENT' : 'LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAM ATTENDED'} {trainings?.length > 0 ? <PriorityHighIcon color='error' /> : ''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === 'trainings' &&
                            <Trainings arr={trainings} setState={setTrainings} />
                        }
                    </AccordionDetails>
                </Accordion>
                {/* <Accordion expanded={expanded === 'otherInfo'} onChange={handleChange('otherInfo', otherInfo)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                >
                    <Badge badgeContent={otherInfo?.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right', width: '33%', }}>
                        <Typography sx={{ flexShrink: 0, color: otherInfo.length > 0 ? '' : '#BEBEBE' }}>OTHER INFORMATION</Typography>
                    </Badge>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                        amet egestas eros, vitae egestas augue. Duis vel est augue.
                    </Typography>
                </AccordionDetails>
            </Accordion> */}
                <Accordion expanded={expanded === 'govid'} onChange={handleChange('govid', govid)}>
                    <AccordionSummary
                        sx={{ height: 'calc(11.1vh - 6.5px)' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Badge badgeContent={govid?.length} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right', width: '33%', }}>
                            <Typography sx={{ flexShrink: 0, color: govid.length > 0 ? '' : '#BEBEBE' }}>GOVERNMENT ID</Typography>
                        </Badge>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PersonalInfoTable arr={govid} setState={setGovid} category='hris_employee_govid' />
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
};

export default AccordionItems;