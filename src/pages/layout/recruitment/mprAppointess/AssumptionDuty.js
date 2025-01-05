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

function getDay(d) {
    let stringD = d.toString()
    if (stringD[1])
        return stringD[1] === '1' ? stringD + 'st' : stringD[1] === '2' ? stringD + 'nd' : stringD[1] === '3' ? stringD + 'rd' : stringD + 'th'
    else
        return stringD[0] === '1' ? stringD + 'st' : stringD[0] === '2' ? stringD + 'nd' : stringD[0] === '3' ? stringD + 'rd' : stringD + 'th'
}

const f = new Intl.NumberFormat()

const AssumptionDuty = ({ arr, offices, dept_id }) => {
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
                <EasyAccessCards icon={<Print sx={{ cursor: 'pointer', color: '#fff', fontSize: 40 }} onClick={handlePrint} />} title='Print Certification' shortText='Assmpt. Duty' />
            </EasyAccess>
            <div ref={componentRef}>
                {arr && arr.map((item, i) => (
                    <Box width='796.8px' mx='auto' className='force-break'>
                        {/* height='1123.1px' */}
                        <Box sx={{ overflowX: 'hidden', m: '50px' }}>
                            <Box>
                                <Typography sx={{ fontSize: '14px' }} color="initial">CS Form No. 4</Typography>
                                <Typography sx={{ fontSize: '14px' }} color="initial">Revised 2018</Typography>
                            </Box>
                            <Box display='flex' gap={1} position='relative' width='100%' mt={'20px'}>
                                <img src={BL} width={75} style={{ zIndex: 10, position: 'absolute', top: 0 }} />
                                <Box sx={{ zIndex: 10, width: '100%' }}>
                                    <Typography variant="body2" align='center' sx={{ fontSize: '16px' }} color="initial">Republic of the Philippines</Typography>
                                    <Typography variant="body2" align='center' sx={{ fontSize: '18px' }} color="initial"><b>CITY GOVERNMENT OF BUTUAN</b></Typography>
                                    <Typography variant="body2" align='center' sx={{ fontSize: '16px' }} color="initial">J.P. Rosales Ave., Doongan, Butuan City</Typography>
                                </Box>
                            </Box>
                            <Typography sx={{ fontSize: '1.5rem', mt: '20px' }} align='center' color="initial"><b>CERTIFICATION OF ASSUMPTION TO DUTY</b></Typography>
                            <Typography sx={{ fontSize: '1rem', mt: '20px', textIndent: '20px' }} color="initial">
                                This is to certify that
                                &nbsp;<b>{`${item?.fname.toUpperCase()} ${item?.mname[0]?.toUpperCase()} ${item?.lname?.toUpperCase()}`} </b>
                                has assumed the duties and responsibilities as <b>{item?.position_name}</b> of <b>{offices.find(a => a.dept_code === dept_id)?.dept_title}</b> effective <b>{moment(item?.period_from, "YYYY-MM-DD").format('MMM DD, YYYY')}.</b>
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '1rem', mt: '20px', textIndent: '20px' }} color="initial">
                                This certification is issued in connection with the issuance of the appointment of <b>{item?.lname?.toUpperCase()}</b> as <b>{item?.position_name?.toUpperCase()}.</b>
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '1rem', mt: '60px', textIndent: '20px' }} color="initial">
                                Done this {getDay(moment(item?.period_from, "YYYY-MM-DD").format('D'))} day of {moment(item?.period_from, "YYYY-MM-DD").format('MMM')} {moment(item?.period_from, "YYYY-MM-DD").format('YYYY')}
                            </Typography>

                            <Box display='flex' justifyContent='flex-end' width='100%'>
                                {heads?.length ? (
                                    <Typography variant="body1" color="initial" align='center' fontWeight={700} sx={{ mt: '50px' }}>
                                        <span>{heads.find(a => a.dept_code === dept_id)?.office_division_assign?.toUpperCase()}</span><br></br>
                                        <span style={{ fontWeight: 400 }}>{heads.find(a => a.dept_code === dept_id)?.position}</span><br></br>
                                    </Typography>
                                ) : (
                                    <Box display='flex' flexDirection='column' alignItems='flex-end' width='100%' mt='50px'>
                                        <Skeleton variant='text' width='40%' />
                                        <Skeleton variant='text' width='20%' />
                                    </Box>
                                )}
                            </Box>
                            <Box display='flex' flexDirection='column' justifyContent='flex-start'>
                                <Box m={'20px'}>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} color="initial">Date: {moment(new Date(), "YYYY-MM-DD").format('MMM DD, YYYY')}</Typography>
                                    <Typography variant="body1" sx={{ fontSize: '14px', mt: '20px' }} color="initial">Attested by:</Typography>
                                </Box>
                                <Box m={'20px'} width='50%'>
                                    {heads?.length ? (
                                        <>                  <Typography variant="body1" sx={{ fontSize: '14px' }} align='center' color="initial">{heads.find(a => a.dept_code === 12)?.office_division_assign}</Typography>
                                            <Typography variant="body1" sx={{ fontSize: '14px' }} align='center' color="initial">{heads.find(a => a.dept_code === 12)?.position}</Typography></>
                                    ) : (
                                        <Box display='flex' flexDirection='column' alignItems='center'>
                                            <Skeleton variant='text' width='60%' />
                                            <Skeleton variant='text' width='80%' />
                                        </Box>
                                    )}

                                </Box>
                            </Box>
                            <Box display='flex' justifyContent='space-between' mb="20px" mt="60px" >
                                <Box>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='flex-start' color="initial">201 File</Typography>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='flex-start' color="initial">Admin</Typography>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='flex-start' color="initial">COA</Typography>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='flex-start' color="initial">CSC</Typography>
                                </Box>
                                <Box sx={{ border: '1px solid black', p: '10px', alignSelf: 'flex-end' }}>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='center' color="initial">For submission to CSCFO</Typography>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='center' color="initial">within 30 days from the</Typography>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='center' color="initial">date of assumption of the</Typography>
                                    <Typography variant="body1" sx={{ fontSize: '14px' }} align='center' color="initial">appointee</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </div>
        </>
    );
};

export default AssumptionDuty;