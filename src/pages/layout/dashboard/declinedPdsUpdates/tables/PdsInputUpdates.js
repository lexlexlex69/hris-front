import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import Button from '@mui/material/Button'
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const PersonalInfoTable = ({ arr, setState, category }) => {

    const checkType = () => {
        if (category === 'hris_employee') {
            let newArr = arr.map((item, index) => {
                return { ...item, type: item.table_field === 'fname' ? 'FIRST NAME' : item.table_field === 'lname' ? 'LAST NAME' : item.table_field === 'mname' ? 'MIDDLE  NAME' : item.table_field === 'extname' ? 'NAME EXTENSION' : item.table_field === 'dob' ? 'DATE OF BIRTH' : item.table_field === 'sex' ? 'SEX' : item.table_field === 'civilstatus' ? 'CIVIL STATUS' : item.table_field === 'citizenship' ? 'CITIZENSHIP' : item.table_field === 'dual_citizenship' ? 'DUAL CITIZENSHIP' : item.table_field === 'height' ? 'HEIGHT' : item.table_field === 'weight' ? 'WEIGHT' : item.table_field === 'bloodtype' ? 'BLOOD TYPE' : item.table_field === 'cpno' ? 'CP NUMBER' : item.table_field === 'telno' ? 'TELEPHONE NUMBER' : item.table_field === 'emailadd' ? 'EMAIL ADDRESS' : item.table_field === 'gsisno' ? 'GSIS NO' : item.table_field === 'pag_ibig' ? 'PAG-IBIG NUMBER' : item.table_field === 'philhealth' ? 'PHILHEALTH' : item.table_field === 'sssno' ? 'SSS NUMBER' : item.table_field === 'tin' ? 'TIN' : item.table_field === 'baddress' ? 'BIRTH ADDRESS' : '' }
            })
            setLocalVariable(newArr)
        }
        else if (category === 'hris_employee_address') {
            let newArr = arr.map((item, index) => {
                return { ...item, type: item.table_field === 'radUnit' ? 'RESIDENTIAL: UNIT' : item.table_field === 'radStreet' ? 'RESIDENTIAL: STREET' : item.table_field === 'radVillage' ? 'RESIDENTIAL: VILLAGE' : item.table_field === 'radBrgy' ? 'RESIDENTIAL: BARANGAY' : item.table_field === 'radCity' ? 'RESIDENTIAL: CITY' : item.table_field === 'radProvince' ? 'RESIDENTIAL: PROVINCE' : item.table_field === 'radZip' ? 'RESIDENTIAL  ZIPCODE' : item.table_field === 'rad_district' ? 'RESIDENTIAL: DISTRICT' : item.table_field === 'radRegion' ? 'RESIDENTIAL:  REGION' : item.table_field === 'padUnit' ? 'PERMANENT: UNIT' : item.table_field === 'padStreet' ? 'PERMANENT: STREET' : item.table_field === 'padVillage' ? 'PERMANENT: VILLAGE' : item.table_field === 'padBrgy' ? 'PERMANENT: BARANGAY' : item.table_field === 'padCity' ? 'PERMANENT: CITY' : item.table_field === 'padProvince' ? 'PERMANENT: PROVINCE' : item.table_field === 'padZip' ? 'PERMANENT: ZIPCODE' : item.table_field === 'pad_district' ? 'PERMANENT: DISTRICT' : item.table_field === 'padRegion' ? 'PERMANENT: REGION' : '' }
            })
            setLocalVariable(newArr)
        }
        else if (category === 'hris_employee_family') {
            let newArr = arr.map((item, index) => {
                return { ...item, type: item.table_field === 'spouse_surname' ? 'SPOUSE SURNAME' : item.table_field === 'spouse_fname' ? 'SPOUSE  FIRST NAME' : item.table_field === 'spouse_mname' ? 'SPOUSE MIDDLE NAME' : item.table_field === 'occupation' ? 'OCCUPATION' : item.table_field === 'employeer_name' ? 'EMPLOYER NAME' : item.table_field === 'emp_address' ? 'EMPLOYER ADDRESS' : item.table_field === 'tel_no' ? 'EMPLOYER TEL. NO.' : item.table_field === 'father_surname' ? 'FATHER SURNAME' : item.table_field === 'father_fname' ? 'FATHER FIRST NAME' : item.table_field === 'father_mname' ? 'FATEHR MIDDLE NAME' : item.table_field === 'mother_maiden' ? 'MOTHER MAIDEN NAME' : item.table_field === 'mother_lname' ? 'MOTHER LAST NAME' : item.table_field === 'mother_fname' ? 'MOTHER FIRST NAME' : item.table_field === 'mother_mname' ? 'MOTHER MIDDLE  NAME' : item.table_field === 'father_extn' ? 'FATHER NAME EXTENSION' : item.table_field === 'spouse_extn' ? 'SPOUSE NAME EXTENSION' : '' }
            })
            setLocalVariable(newArr)
        }
        else if (category === 'hris_employee_govid') {
            let newArr = arr.map((item, index) => {
                return { ...item, type: item.table_field === 'gov_id' ? 'GOVERNMENT ISSUED ID' : item.table_field === 'id_no' ? 'ID/LICENSE/PASSPORT NO.' : item.table_field === 'date_place_issuance' ? 'DATE/PLACE OF ISSUANCE' : '' }
            })
            setLocalVariable(newArr)
        }
    }

    const [localVariable, setLocalVariable] = useState([])

    const markRead = async (param) => {
        Swal.fire({
            text: 'Processing, please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/pds/decline-updates/markRead`, { id: param.id })
        console.log(res)
        if (res.data.status === 200) {
            let newInfo = arr.filter(item => item.id !== param.id)
            setState(newInfo)
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        Swal.close()
    }

    useEffect(() => {
        checkType()
    }, [arr])
    return (
        <TableContainer >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: 'error.light' }}>
                    <TableRow>
                        <TableCell sx={{ color: '#fff' }}>#</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Field/Type</TableCell>
                        <TableCell align="left" sx={{ color: '#fff' }}>Old value</TableCell>
                        <TableCell align="left" sx={{ color: '#fff' }}>New value</TableCell>
                        <TableCell align="left" sx={{ color: '#fff' }}>Declination date</TableCell>
                        <TableCell align="left" sx={{ color: '#fff' }} width="40%">Reason</TableCell>
                        <TableCell align="left" sx={{ color: '#fff' }} width="20%"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {localVariable && localVariable.map((row, index) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {index + 1}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.type}
                            </TableCell>
                            <TableCell align="left" sx={{ color: 'error.main' }}>{row.old_value}</TableCell>
                            <TableCell align="left" sx={{ color: 'primary.main' }}>{row.new_value}</TableCell>
                            <TableCell align="left">{moment(row.created_at).format('MMM, DD YYYY')}</TableCell>
                            <TableCell align="left">{row.reason}</TableCell>
                            <TableCell align="left">
                                <Button variant="contained" color="warning" size='small' sx={{ borderRadius: '2rem' }} onClick={() => markRead(row)}>
                                    mark as read
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PersonalInfoTable;