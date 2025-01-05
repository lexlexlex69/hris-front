import React, { useState, useLayoutEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Paper, Typography, TextField } from '@mui/material';
import moment from 'moment';
import { read, utils, writeFileXLSX } from 'xlsx';

const PrintVacancyList = ({ vacancyList }) => {
    console.log(vacancyList)
    const sample = [{
        sample: '1',
        index: 1
    },
    {
        sample: '2',
        index: 2
    }]
    const heightRef = useRef(null)
    const [value, setValue] = useState('1');
    const [agency, setAgency] = useState(null)
    const [officer, setOfficer] = useState(null)
    const [officerPosition, setOfficerPosition] = useState(null)
    const [dateLater, setDateLater] = useState(new Date())
    const tableRef = useRef(null)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const exportFile = () => {
        let ws = utils.table_to_sheet(tableRef.current);

        let sheet2data = vacancyList.map((item) => ({
            agency_name: agency,
            place_of_assignment: item.dept_title,
            position_title: item.position_title,
            plantilla_item_no: item.plantilla_no,
            salary_grade: item.plantilla_sg,
            annual_salary: item.monthly_salary,
            eligibility: item.qs?.eligibility,
            education: item.qs?.education,
            training: item.qs?.training,
            experience: item.qs?.experience,
            competency: item.qs?.competency,
            instructions: 'The City Government of Butuan highly encourages qualified applicants to apply regardless of status, race, color, gender, religion, age, disability, origin, ethnicity or political affiliation. Interested and qualified applicants should signify their interest in writing. Attach the following documents to the application letter and send to the address below not later than January 27, 2023 Documents: 1. Fully accomplished Personal Data Sheet (PDS) with recent passport-sized picture (CS Form No. 212, Revised 2017) which can be downloaded at www.csc.gov.ph; 2. Performance rating in the last rating period (if applicable); 3. Photocopy of certificate of eligibility/rating/license; and 4. Photocopy of Transcript of Records. QUALIFIED APPLICANTS are advised to hand in or send through courier/email their application to: sample officer of hrmo City Human Resource Management Officer Butuan City chrmocgb.recruit@gmail.com APPLICATIONS WITH INCOMPLETE DOCUMENTS SHALL NOT BE ENTERTAINED',
        }))
        let ws2 = utils.json_to_sheet(sheet2data);
        let wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Sheet 1");
        utils.book_append_sheet(wb, ws2, "Sheet 2");
        writeFileXLSX(wb, "SheetJSReactAoO.xlsx");
    }
    return (
        <Box sx={{ width: '100%', typography: 'body1', px: 2 }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} ref={heightRef}>
                    <Box display='flex' justifyContent='flex-end' mr={5} mt={2}>
                        <Button variant='contained' sx={{ borderRadius: '2rem' }} onClick={exportFile}>Generate excel</Button>
                    </Box>
                    <Box display='flex' gap={1}>
                        <TextField
                            id=""
                            label="AGENCY NAME"
                            size='small'
                            value={agency}
                            onChange={(e) => setAgency(e.target.value)}
                        />
                        <TextField
                            id=""
                            label="HRMO OFFICER"
                            size='small'
                            value={officer}
                            onChange={(e) => setOfficer(e.target.value)}
                        />
                        <TextField
                            id=""
                            label="HRMO OFFICER POSITION"
                            size='small'
                            value={officerPosition}
                            onChange={(e) => setOfficerPosition(e.target.value)}
                        />
                        <TextField
                            id=""
                            label="DATE NOT LATER THAN"
                            size='small'
                            focused
                            type='date'
                            value={dateLater}
                            onChange={(e) => setDateLater(e.target.value)}
                        />
                    </Box>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="SHEET 1" value="1" />
                        <Tab label="SHEET 2" value="2" />
                        <Tab label="INSTRUCTIONS" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Box sx={{ p: 2, overflowY: 'scroll' }}>
                        <Box display="flex" justifyContent="space-between">
                            <Box>
                                <Typography variant='body1'>CS FORM NO. 9</Typography>
                                <Typography variant='body1' sx={{ lineHeight: '.5' }}>Revised 2018</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ border: '1px solid black', width: '350px', p: .3, textAlign: 'center' }} variant='body1'>Electronic copy to be submitted to the SCS FO must be in MS Excel format</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="center">
                            <Box>
                                <Typography variant='body1' textAlign="center">Republic of the Philippines</Typography>
                                <Typography variant='body1' textAlign="center" sx={{ lineHeight: '.5', fontWeight: 'bold' }}>{agency ? agency : '(Select Agency Name)'} </Typography>
                                <Typography variant='body1' textAlign="center">Request for Publication of Vacant Positions</Typography>
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="body1" color="initial">
                                To: CIVIL SERVICE COMMISSION (CSC)
                            </Typography>
                            <Typography variant="body1" color="initial">
                                We herby request the publication of the following vacant positions, which are authorized to be filled, (Select Agency Name) in the CSC website:
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                            <Box mt={4}>
                                <Typography variant='body1' textAlign="center" sx={{ textDecoration: 'underline' }}>{officer}</Typography>
                                <Typography variant='body1' textAlign="center">{officerPosition}</Typography>
                                <Box display="flex">
                                    <Typography variant="body1" color="initial">Date</Typography>
                                    <Typography variant="body1" color="initial" sx={{ textDecoration: 'underline' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <TableContainer sx={{ p: 4 }}>
                            <Table aria-label="vacancy list table" size='small'>
                                <TableHead>
                                    <TableRow className='recruitment-print-table-tr'>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' rowSpan={2}>No.</TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' rowSpan={2}>
                                            <Typography className='recruitment-print-table-title-form9' variant="body1" color="initial">Position Title</Typography>
                                            <Typography className='recruitment-print-table-title-form9' variant="body1" color="initial" fontWeight="bold">(Parenthetical Title, if applicable)</Typography>
                                        </TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' rowSpan={2} align="left">Plantilla No.</TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' rowSpan={2} align="left">Salary/Job/Pay Grade</TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' rowSpan={2} align="left" fontWeight="bold">Monthly Salary</TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' align='center' colSpan={5}>
                                            Qualification Standards
                                        </TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' rowSpan={2} align="left" fontWeight="bold">Place of Assignment</TableCell>
                                    </TableRow>
                                    <TableRow className='recruitment-print-table-tr' >
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' >
                                            Education
                                        </TableCell >
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td' >
                                            Training
                                        </TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>
                                            Experience
                                        </TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>
                                            Eligibility
                                        </TableCell>
                                        <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>
                                            Competency (if applicable)
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vacancyList && vacancyList.map((item, index) => (
                                        <TableRow key={item?.job_vacancies_id}>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{index + 1}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.position_title}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.plantilla_no}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.plantilla_sg}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{new Intl.NumberFormat('PHP', { style: 'currency', currency: 'PHP' }).format(item?.monthly_salary)}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.education}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.training}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.experience}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.eligibility}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.competency}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.dept_title}</TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant="body1" color="initial">Interested and qualified applicants should signify their interest in writing. Attach the following documents to the application letter and send to the address below noy alter than {moment(dateLater).format('MMMM DD, YYYY')}.</Typography>
                        <Typography variant="body1" color="initial">1. Fully accomplished Personal Data Sheet (PDS) with recent passport-sized picture (CS form. 212 Revised 2017) which can be downloaded at www.csc.gov.ph;</Typography>
                        <Typography variant="body1" color="initial">2. Performance rating in the last rating period (if applicable);</Typography>
                        <Typography variant="body1" color="initial">3. Photocopy of certificate of eigibility/rating/license; and</Typography>
                        <Typography variant="body1" color="initial">4. Photocopy of Transcript of Records</Typography>
                        <Typography variant="body1" color="initial"> <b>QUALIFIED APPLICANTS</b> are advised to hand in or send through courier/email their application to:</Typography>
                        <Typography variant="body1" color="initial" sx={{ textDecoration: 'underline' }}>{officer}</Typography>
                        <Typography variant="body1" color="initial" sx={{ textDecoration: 'underline' }}>{officerPosition}</Typography>
                        <Typography variant="body1" color="initial" sx={{ textDecoration: 'underline' }}>Butuan City</Typography>
                        <Typography variant="body1" color="initial" sx={{ textDecoration: 'underline' }}>chrmocgb.recruit@gmail.com</Typography>
                        <Typography variant="body1" color="initial"><b>APPLICATIONS WITH INCOMPLETE DOCUMENTS SHALL NOT BE ENTERTAINED.</b></Typography>
                    </Box>
                    <div style={{ display: 'none' }}>
                        <TableContainer ref={tableRef}>
                            <Table size='small'>
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={8}>CS form No. 9</TableCell>
                                        <TableCell colSpan={4} style={{ border: '1px solid black' }}>Electronic copy to be submitted to the CSC FO must be in MS Excel format</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8}>Revised 2018</TableCell>
                                        <TableCell colSpan={4}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell colSpan={3}>Republic of the Philippines</TableCell>
                                        <TableCell colSpan={4}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell colSpan={3}>{agency}</TableCell>
                                        <TableCell colSpan={4}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell colSpan={3}>Request for Publication of Vacant Positions</TableCell>
                                        <TableCell colSpan={4}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}>To: CIVIL SERVICE COMMISSION (CSC)</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}> We hereby request the publication of the following vacant positions, which are authorized to be filled, at the CGO BUTUAN , AGUSAN DEL NORTE in the CSC website:</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8}></TableCell>
                                        <TableCell colSpan={4}>{officer}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8}></TableCell>
                                        <TableCell colSpan={4}>{officerPosition}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={8}></TableCell>
                                        <TableCell colSpan={4}>Date: {moment(new Date).format('MMMM DD, YYYY')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Position Title
                                            (Parenthetical Title, if applicable)</TableCell>
                                        <TableCell>Plantilla No.</TableCell>
                                        <TableCell>Salary/Job/Pay Grade	</TableCell>
                                        <TableCell>Monthly Salary</TableCell>
                                        <TableCell colSpan={5}>Qualification Standards</TableCell>
                                        <TableCell>Place of Assignment</TableCell>
                                    </TableRow>
                                    {vacancyList && vacancyList.map((item, index) => (
                                        <TableRow key={item?.job_vacancies_id}>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{index + 1}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.position_title}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.plantilla_no}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.plantilla_sg}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.monthly_salary}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.education}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.training}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.experience}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.eligibility}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.qs?.competency}</TableCell>
                                            <TableCell className='recruitment-print-table-title-form9 recruitment-print-table-td'>{item?.dept_title}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow></TableRow>
                                    <TableRow></TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            Interested and qualified applicants should signify their interest in writing. Attach the following documents to the application letter and send to the address below noy alter than {moment(dateLater).format('MMMM DD, YYYY')}.
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            1. Fully accomplished Personal Data Sheet (PDS) with recent passport-sized picture (CS Form No. 212, Revised 2017) which can be downloaded at www.csc.gov.ph;
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            2. Performance rating in the last rating period (if applicable);
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            3. Photocopy of certificate of eligibility/rating/license; and
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            4. Photocopy of Transcript of Records.
                                        </TableCell>
                                    </TableRow>
                                    <TableRow></TableRow>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            QUALIFIED APPLICANTS are advised to hand in or send through courier/email their application to:
                                        </TableCell>
                                    </TableRow>
                                    <TableRow></TableRow>
                                    <TableRow></TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            OWEN M. DUCENA, MPA
                                        </TableCell>
                                        <TableCell colSpan={8}>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            City Human Resource Management Officer
                                        </TableCell>
                                        <TableCell colSpan={8}>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            Butuan City
                                        </TableCell>
                                        <TableCell colSpan={8}>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            chrmocgb.recruit@gmail.com
                                        </TableCell>
                                        <TableCell colSpan={8}>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            APPLICATIONS WITH INCOMPLETE DOCUMENTS SHALL NOT BE ENTERTAINED.
                                        </TableCell>
                                        <TableCell colSpan={8}>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                </TabPanel>
                <TabPanel value="2">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>agency_name</TableCell>
                                    <TableCell>place_of_assignment</TableCell>
                                    <TableCell>position_title</TableCell>
                                    <TableCell>plantilla_item_no</TableCell>
                                    <TableCell>salary_grade</TableCell>
                                    <TableCell>annual_salary</TableCell>
                                    <TableCell>eligibility</TableCell>
                                    <TableCell>education</TableCell>
                                    <TableCell>training</TableCell>
                                    <TableCell>experience</TableCell>
                                    <TableCell>competency</TableCell>
                                    <TableCell>instructions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vacancyList && vacancyList.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>agency_name</TableCell>
                                        <TableCell>{item?.dept_title}</TableCell>
                                        <TableCell>{item.position_title}</TableCell>
                                        <TableCell>{item.plantilla_no}</TableCell>
                                        <TableCell>{item.sg}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('PHP', { style: 'currency', currency: 'PHP' }).format(item?.monthly_salary)}</TableCell>
                                        <TableCell>{item?.qs?.eligibility}</TableCell>
                                        <TableCell>{item.qs?.education}</TableCell>
                                        <TableCell>{item.qs?.training}</TableCell>
                                        <TableCell>{item.qs?.experience}</TableCell>
                                        <TableCell>{item.qs?.competency}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontSize: '8px' }} color="initial">
                                                The City Government of Butuan highly encourages qualified applicants to apply regardless of status, race, color, gender, religion, age, disability, origin, ethnicity or political affiliation.  Interested and qualified applicants should signify their interest in writing. Attach the following documents to the application letter and send to the address below not later than January 27, 2023 Documents: 1. Fully accomplished Personal Data Sheet (PDS) with recent passport-sized picture (CS Form No. 212, Revised 2017) which can be downloaded at www.csc.gov.ph; 2. Performance rating in the last rating period (if applicable); 3. Photocopy of certificate of eligibility/rating/license; and 4. Photocopy of Transcript of Records. QUALIFIED APPLICANTS are advised to hand in or send through courier/email their application to: {officer} City Human Resource Management Officer Butuan City chrmocgb.recruit@gmail.com APPLICATIONS WITH INCOMPLETE DOCUMENTS SHALL NOT BE ENTERTAINED
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
            </TabContext>
        </Box>

    );
};

export default React.memo(PrintVacancyList);