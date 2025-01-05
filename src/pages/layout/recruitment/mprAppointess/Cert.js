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

function getDay(d) {
    let stringD = d.toString()
    if (stringD[1])
        return stringD[1] === '1' ? stringD + 'st' : stringD[1] === '2' ? stringD + 'nd' : stringD[1] === '3' ? stringD + 'rd' : stringD + 'th'
    else
        return stringD[0] === '1' ? stringD + 'st' : stringD[0] === '2' ? stringD + 'nd' : stringD[0] === '3' ? stringD + 'rd' : stringD + 'th'
}

const Cert = ({ arr, offices, dept_id }) => {
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
                <EasyAccessCards icon={<Print sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} onClick={handlePrint} />} title='Print Certification' shortText='Certification' />
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
                            <Typography sx={{ fontSize: '1.5rem', mt: '20px' }} align='center' color="initial"><b>CERTIFICATION</b></Typography>
                            <Typography sx={{ fontSize: '1rem', mt: '20px', textIndent: '20px' }} color="initial">
                                This is to certify that the casual appointment of <u><b>{item?.fname?.toUpperCase() + ' ' + item?.mname?.toUpperCase() + ' ' + item?.lname?.toUpperCase() + ' ' + item?.extname?.toUpperCase()}</b>
                                </u> as <u><b>{item?.position_name?.toUpperCase()}</b></u> under the <u><b>{offices.find(a => a.dept_code === dept_id).dept_title}</b></u>, is essentially neccessary for the judicious delivery of services which can no longer be undertaken by the existing permanent employees.
                            </Typography>
                            <Typography variant="body1" color="initial" sx={{ textIndent: '20px', mt: '20px' }}>
                                This is to certify further that the said appointee has met the
                                minimum qualification requirement in addition to the specific expertise
                                required by the aforementioned position.
                            </Typography>
                            <Typography variant="body1" color="initial" sx={{ textIndent: '20px', mt: '20px' }}>
                                Finally, it is understood that the services may be terminated earlier
                                than expected when no longer needed or when the performance is below
                                at par.
                            </Typography>
                            <Typography variant="body1" color="initial" sx={{ textIndent: '20px', mt: '20px' }}>
                                Issued this <u><b>{getDay(moment(item?.period_from, "YYYY-MM-DD").format('D'))}</b></u> day of <u><b>{moment(item?.period_from, "YYYY-MM-DD").format('MMM')} {moment(item?.period_from, "YYYY-MM-DD").format('Y')}</b></u> in Butuan City, Philippines.
                            </Typography>

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
                            <Typography variant="body1" color="initial" align='center' fontWeight={700} sx={{ mt: '40px' }}>
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
                            <Box display='flex' sx={{ mt: '240px' }} justifyContent='space-between' alignItems='flex-end'>
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

export default Cert;