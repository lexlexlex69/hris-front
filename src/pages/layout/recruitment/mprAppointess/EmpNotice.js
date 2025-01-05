import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import moment from 'moment';
import { blue } from '@mui/material/colors'
import BL from '../../../../assets/img/bl.svg'
import BB from '../../../../assets/img/bbb.png'
import { Print } from '@mui/icons-material';
import { Skeleton, Tooltip } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';

import EasyAccess from './EasyAccess';
import EasyAccessCards from './EasyAccessCards';

import { calculateSalaryToWord } from '../../pds/customFunctions/CustomFunctions';

const f = new Intl.NumberFormat()

const EmpNotice = ({ arr, offices, dept_id }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [heads, setHeads] = useState([])

    const fetchHeadOffices = async () => {
        let res = await axios.get(`/api/recruitment/office-heads/get_heads`)
        console.log(res)
        setHeads(res.data)
    }

    useEffect(() => {
        fetchHeadOffices()
    }, [])
    return (
        <>
            <EasyAccess showSelected={false}>
                <EasyAccessCards icon={<Print sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} onClick={handlePrint} />} title='Print Certification' shortText='E. Notice' />
            </EasyAccess>
            <div ref={componentRef}>
                {arr && arr.map((item, i) => (
                    <Box width='796.8px' mx='auto' className='force-break'>
                        {/* height='1123.1px' */}
                        <Box sx={{ overflowX: 'hidden', m: '50px' }}>
                            <Box display='flex' gap={1} position='relative'>
                                <img src={BL} width={85} style={{ zIndex: 10 }} />
                                <Box sx={{ zIndex: 10 }}>
                                    <Typography variant="body2" sx={{ fontSize: '12px' }} color="initial">Republic of the Philippines</Typography>
                                    <Typography variant="body2" sx={{ fontSize: '12px' }} color="initial"><b>CITY GOVERNMENT OF BUTUAN</b></Typography>
                                    <Typography variant="body2" sx={{ fontSize: '12px' }} color="initial"><b>City Human Resource Management Office</b></Typography>
                                    <Typography variant="body2" sx={{ fontSize: '12px' }} color="initial">City Hall Bldg., J.P. Rosales Ave., Doongan, Butuan City</Typography>
                                </Box>
                                <Box sx={{
                                    background: `linear-gradient(90deg, rgba(25,93,161,1) 0%, rgba(101,182,238,1) 0%, rgba(142,196,230,1) 0%, rgba(18,106,159,1) 41%, rgba(6,33,42,1) 77%, rgba(10,82,127,1) 100%)`,
                                    height: '20px', width: '100%', position: 'absolute', zIndex: 5, bottom: 0,
                                    ml: 5,
                                }}>
                                    <Box sx={{
                                        background: `linear-gradient(90deg, rgba(25,93,161,1) 0%, rgba(101,182,238,1) 0%, rgba(10,82,127,1) 0%, rgba(8,70,108,1) 49%, rgba(6,33,42,1) 77%, rgba(23,156,216,1) 100%)`
                                        , height: '5px', width: '100%', position: 'absolute', zIndex: 5, bottom: 0
                                    }} />
                                </Box>
                            </Box>
                            <Typography sx={{ fontSize: '1.5rem', mt: '20px' }} align='center' color="initial"><b>EMPLOYMENT NOTICE</b></Typography>
                            <Typography sx={{ fontSize: '1rem', mt: '20px' }} align='center' color="initial">{moment(item?.period_from, "YYYY-MM-DD").format("MMM DD, YYYY")}</Typography>
                            <Typography sx={{ fontSize: '1rem', mt: '20px' }} align='center' color="initial">To: {item?.fname} {item?.mname} {item?.lname}</Typography>
                            <Typography sx={{ fontSize: '1rem', mt: '20px', textIndent: '20px' }} color="initial">
                                We would like to inform you that you have been selected to be hired as a
                                <b>{item?.position_name} </b>  on a <b>Casual</b> status to be assigned at the <b>{offices.find(a => a.dept_code === dept_id).dept_title}</b>
                                with <b>salary grade {item?.propose_budget_sg} (SG {item?.propose_budget_sg}) equivalent to a monthly basic pay of</b> <b>{calculateSalaryToWord(item?.proposed_rate)} Pesos ( PHP {f.format(item?.proposed_rate)} ).</b> Please submit the following requirements for the processing of your casual appointment:
                            </Typography>

                            <Box mt={'20px'}>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 1. 2 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 2. 2 Copies – Work Experience Sheet (CSC Form 212 Attachment)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 3. 1 Photocopies – Certificate of Trainings (Indicated in the PDS)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 1 Photocopy – Certificate of Employment (Indicated in the PDS)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 5. Original and 1 Photocopy – Eligibility (if there’s any)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 6. Original and Colored Photocopy – CSC Exam w/CSC ERR Form</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 7. Two (2) Colored Photocopies – PRC ID; Certificate of Board Passer</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 8. Original and Colored Photocopy – Certificate of Good Standing</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 9. 2 Photocopies – Birth Certificate (PSA/NSO/Authenticated by the Civil Registrar)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 10. 2 Photocopies – Marriage Certificate (PSA/NSO/Authenticated by the Civil Registrar)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 11. 1 Photocopy – Transcript of Records (TOR)</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 12. Barangay Clearance</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 13. NBI Clearance</Typography>
                                <Typography sx={{ fontSize: '.8rem' }} color="initial"> 14. Drug Test Result</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '1rem', mt: '20px' }} color="initial"> Kindly <b>submit your complete requirements</b> to the City Human Resource Management
                                Office (CHRMO) the soonest possible time.</Typography>
                            <Box display='flex' justifyContent='flex-end'>
                                <Box>
                                    <Typography variant="body1" color="initial" align='center' fontWeight={700} sx={{ mt: '40px' }}>
                                        {heads ? (
                                            <>
                                                <span>{heads.find(a => a.office_division_acronym === 'CMO')?.office_division_assign?.toUpperCase()}</span><br></br>
                                                <span style={{ fontWeight: 400 }}>{heads.find(a => a.office_division_acronym === 'CMO')?.position}</span><br></br>
                                            </>
                                        ) : (
                                            <>
                                                <Skeleton variant='text' width='40%' sx={{ mx: 'auto' }} />
                                                <Skeleton variant='text' width='20%' sx={{ mx: 'auto' }} />
                                            </>
                                        )}
                                    </Typography>

                                    <Typography variant="body1" color="initial" sx={{ textIndent: '20px', mt: '20px' }}>
                                        For the City Mayor:
                                    </Typography>
                                    <Typography variant="body1" color="initial" align='center' fontWeight={700} sx={{ mt: '20px' }}>
                                        {heads ? (
                                            <>
                                                <span>{heads.find(a => a.office_division_acronym === 'CAdmO')?.office_division_assign?.toUpperCase()}</span><br></br>
                                                <span style={{ fontWeight: 400 }}>{heads.find(a => a.office_division_acronym === 'CAdmO')?.position}</span><br></br>
                                            </>
                                        ) : (
                                            <>
                                                <Skeleton variant='text' width='40%' sx={{ mx: 'auto' }} />
                                                <Skeleton variant='text' width='20%' sx={{ mx: 'auto' }} />
                                            </>
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display='flex' sx={{ mt: '40px' }} justifyContent='space-between' alignItems='flex-end'>
                                <Box>
                                    <Typography fontSize='12px' sx={{ color: 'primary.dark' }} color="initial">Phone: <span style={{ color: blue[500] }}>(Smart) +63950-733-2249</span></Typography>
                                    <Typography fontSize='12px' sx={{ color: 'primary.dark' }} color="initial"><u>Email: <span style={{ color: blue[500] }}>chrmocgb.recruit@gmail.com</span></u></Typography>
                                    <Typography fontSize='12px' sx={{ color: 'primary.dark' }} color="initial">Website: <span style={{ color: blue[500] }}>http://www.butuan.gov.ph</span></Typography>
                                </Box>
                                <Box>
                                    <img src={BB} width={'120px'} />
                                </Box>
                            </Box>
                            <Box sx={{ background: `linear-gradient(90deg, rgba(25,93,161,1) 0%, rgba(101,182,238,1) 0%, rgba(142,196,230,1) 0%, rgba(18,106,159,1) 41%, rgba(6,33,42,1) 77%, rgba(10,82,127,1) 100%)`, height: '10px' }}></Box>
                        </Box>
                    </Box>
                ))}
            </div>
        </>
    );
};

export default EmpNotice;