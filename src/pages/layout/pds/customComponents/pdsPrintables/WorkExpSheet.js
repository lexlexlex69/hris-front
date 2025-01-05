import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { formatExtName, formatMiddlename } from '../../../customstring/CustomString';

const WorkExpSheet = ({ data,personalInfo }) => {
    const [workExperienceSheetArr, setWorkExperienceSheetArr] = useState([])
    useEffect(() => {
        let newData = []
        let data2;
        data.map((item) => {
            if (item.work_experience_sheet) {
                newData.push(JSON.parse(item.work_experience_sheet))
                data2 = newData?.filter(el=>el?.position)
            }
        })
        setWorkExperienceSheetArr(data2)
        console.log(data2)
    }, [data])
    return (
        <Box display="" mx="" my="" className='force-break' sx={{ px: '40px', py: '30px' }}>
            <Box sx={{ border: '1px solid black' }}>
                <Typography variant="body1" color="#fff" align="center" sx={{ bgcolor: '#969696', width: '100%', p: 1 }}>
                    WORK EXPERIENCE SHEET
                </Typography>
                <Box display="flex" sx={{ p: 1, bgcolor: '#EAEAEA', borderBottom: '1px solid black' }}>
                    <Typography variant="body2" sx={{ width: '20%' }}>
                        <b>Instruction</b>
                    </Typography>
                    <Typography variant="body2" sx={{ width: '100%' }}>
                        <b>1. Include only the work experiences relevant to the position being applied to.</b><br />
                        <b>2. The duration should include start and finish dates, if known, month in abbreviated form, if known, and year in full. For the current position, use the word Present, e.g., 1998-Present. Work experience should be listed from most recent first.  </b>
                    </Typography>
                </Box>
                <Box>
                    {
                        workExperienceSheetArr && workExperienceSheetArr.length>1
                        ?
                        workExperienceSheetArr && workExperienceSheetArr.map((item, index) => (
                        index !== workExperienceSheetArr.length-1
                        ?
                        (
                        <Box sx={{mt:2, pl: 1, borderBottom: '1px solid black',py:5 }} key={index}>
                            <Typography variant="body1" color="initial" gutterBottom>• Duration: {moment(item?.from).format('MMM YYYY')} - {item?.to?moment(item?.to).format('MMM YYYY'):'PRESENT'}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Position: {item?.position}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Office/Unit: {item?.nameOfOffice}</Typography>
                            {/* <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {item?.immediateSupervisor}</Typography> */}
                            <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {item?.immediateSupervisor}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Agency/Organization and Location: {item?.nameOfAgency}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• List of Accomplishments and Contributions (if any):</Typography>
                            <Box sx={{ pl: 5 }}>
                                {item?.listOfAccomplishmentsArr.map((x, index) => (
                                    <Typography variant="body1" color="initial">• {x}</Typography>
                                ))}
                            </Box>
                            <Typography variant="body1" color="initial" gutterBottom>• Summary of Actual Duties:</Typography>
                            <Box sx={{ pl: 5 }}>
                                {item?.actualDuties}
                            </Box>
                        </Box>
                        )
                        :
                        null
                        ))
                        :
                        workExperienceSheetArr && workExperienceSheetArr.map((item, index) => (
                        <Box sx={{ pl: 1, borderBottom: '1px solid black',py:5 }} key={index}>
                            <Typography variant="body1" color="initial" gutterBottom>• Duration: {moment(item?.from).format('MMM YYYY')} - {item?.to?moment(item?.to).format('MMM YYYY'):'PRESENT'}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Position: {item?.position}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Office/Unit: {item?.nameOfOffice}</Typography>
                            {/* <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {item?.immediateSupervisor}</Typography> */}
                            <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {item?.immediateSupervisor}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Agency/Organization and Location: {item?.nameOfAgency}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• List of Accomplishments and Contributions (if any):</Typography>
                            <Box sx={{ pl: 5 }}>
                                {item?.listOfAccomplishmentsArr.map((x, index) => (
                                    <Typography variant="body1" color="initial">• {x}</Typography>
                                ))}
                            </Box>
                            <Typography variant="body1" color="initial" gutterBottom>• Summary of Actual Duties:</Typography>
                            <Box sx={{ pl: 5 }}>
                                {item?.actualDuties}
                            </Box>
                        </Box>
                        ))
                }
                    
                </Box>
            </Box>
            {/* added */}
            <Box className='force-break' sx={{mt:1}}>
                {
                    workExperienceSheetArr && workExperienceSheetArr.length>1
                    ?
                    workExperienceSheetArr && workExperienceSheetArr.map((item, index) => (
                        index === workExperienceSheetArr.length-1
                        ?
                        (
                        <Box sx={{ pl: 1, border: '1px solid black',py:5 }} key={index}>
                            <Typography variant="body1" color="initial" gutterBottom>• Duration: {moment(item?.from).format('MMM YYYY')} - {item?.to?moment(item?.to).format('MMM YYYY'):'PRESENT'}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Position: {item?.position}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Office/Unit: {item?.nameOfOffice}</Typography>
                            {/* <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {item?.immediateSupervisor}</Typography> */}
                            <Typography variant="body1" color="initial" gutterBottom>• Immediate Supervisor: {item?.immediateSupervisor}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• Name of Agency/Organization and Location: {item?.nameOfAgency}</Typography>
                            <Typography variant="body1" color="initial" gutterBottom>• List of Accomplishments and Contributions (if any):</Typography>
                            <Box sx={{ pl: 5 }}>
                                {item?.listOfAccomplishmentsArr.map((x, index) => (
                                    <Typography variant="body1" color="initial">• {x}</Typography>
                                ))}
                            </Box>
                            <Typography variant="body1" color="initial" gutterBottom>• Summary of Actual Duties:</Typography>
                            <Box sx={{ pl: 5 }}>
                                {item?.actualDuties}
                            </Box>
                        </Box>
                        )
                        :
                        null
                    ))
                    :
                    null
                }
                <Box sx={{display:'flex',flexDirection:'column',mt:5}}>
                    <Box sx={{display:'flex',justifyContent:'flex-end'}}>
                    <Typography sx={{textAlign:'center'}}><span><strong>{personalInfo.fname} {formatMiddlename(personalInfo.mname)} {personalInfo.lname} {formatExtName(personalInfo.extname)}</strong></span><br/>
                    <span style={{borderTop:'solid 1px'}}>(Signature over Printed Name of Employee/Applicant)</span><br/><br/>
                    <span>Date:</span><span style={{borderBottom:'solid 1px',padding:'0 10px 0 10px'}}>{moment().format('MM-DD-YYYY')}</span>
                    </Typography>
                    </Box>
                    {/* <Box sx={{display:'flex',justifyContent:'flex-end',mt:2}}>
                    <Typography></Typography>
                    </Box> */}
                </Box>
            </Box>
            
            {/* end added */}

        </Box>
    );
};

export default React.memo(WorkExpSheet);