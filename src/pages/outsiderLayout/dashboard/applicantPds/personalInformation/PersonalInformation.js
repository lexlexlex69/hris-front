import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import Address from './address/Address';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import ArrowForward from '@mui/icons-material/ArrowForward';
import CardActions from '@mui/material/CardActions'
import { PdsContext } from '../MyContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Skeleton from '@mui/material/Skeleton'
import { Divider } from '@mui/material';



const PersonalInformation = () => {

    const firstRenderRef = useRef(true)
    const { contextId, handleContextId } = useContext(PdsContext)
    const [loader, setLoader] = useState(true)
    const [sameAddress, setSameAddress] = useState(false)
    const [update, setUpdate] = useState(false)
    const [addressState, setAddressState] = useState({
        radRegion: '',
        radProvince: '',
        radCity: '',
        radBrgy: '',
        radUnit: '',
        radStreet: '',
        radZip: '',
        radVillage: '',
        padRegion: '',
        padProvince: '',
        padCity: '',
        padBrgy: '',
        padUnit: '',
        padStreet: '',
        padVillage: '',
        padZip: '',
    })

    const [addressDefault, setAddressDefault] = useState({
        radRegion: '',
        radProvince: '',
        radCity: '',
        radBrgy: '',
        radUnit: '',
        radStreet: '',
        radZip: '',
        radVillage: '',
        padRegion: '',
        padProvince: '',
        padCity: '',
        padBrgy: '',
        padUnit: '',
        padStreet: '',
        padVillage: '',
        padZip: '',
    })

    const [personalAddInfo, setPersonalAddInfo] = useState({
        employment_status: '',
        source: '',
        desired_position: ''
    })
    const [personalInfo, setPersonalInfo] = useState({
        fname: '',
        mname: '',
        lname: '',
        extname: '',
        sex: '',
        dob: '',
        baddress: '',
        civilstatus: '',
        citizenship: '',
        dual_citizenship: '',
        height: '',
        weight: '',
        bloodtype: '',
        cpno: '',
        telno: '',
        emailadd: '',
        gsisno: '',
        gsisbp: '',
        pag_ibig: '',
        philhealth: '',
        sssno: '',
        tin: '',
    })

    const handleChangePersonal = (e) => {
        setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleChangePersonalAdd = (e) => {
        setPersonalAddInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }


    const handleSubmit = async () => {
        let flag = 0
        Object.values(personalInfo).map(item => {
            if (item && item !== null) {
                flag = 1
            }
        })
        Object.values(personalAddInfo).map(item => {
            if (item && item !== null) {
                flag = 1
            }
        })
        Object.values(addressState).map(item => {
            if (item && item !== null) {
                flag = 1
            }
        })

        if (flag === 0) {
            toast.warning('Empty Fields!')
            return
        }
        let addressStateTemp = { ...addressState }
        if (sameAddress) {
            addressStateTemp.padRegion = addressState.radRegion
            addressStateTemp.padProvince = addressState.radProvince
            addressStateTemp.padCity = addressState.radCity
            addressStateTemp.padBrgy = addressState.radBrgy
            addressStateTemp.padVillage = addressState.radVillage
            addressStateTemp.padUnit = addressState.radUnit
            addressStateTemp.padStreet = addressState.radStreet
            addressStateTemp.padZip = addressState.radZip
        }
        Swal.fire({
            text: 'Proccessing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let res = await axios.post(`/api/recruitment/applicant/pds/Education/submitPersonalInfo`, { personalInfo: personalInfo, personalAddInfo: personalAddInfo, address: addressStateTemp, contextId })
        if (res.data.status === 200) {
            toast.success('Saved/Updated',{autoClose:1000})
            handleContextId(res.data.id)
            localStorage.setItem('applicant_temp_id', res.data.id)
            setAddressDefault({ ...addressStateTemp })
            setUpdate(false)
        }
        if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        Swal.close()
    }

    const getPersonalInfoPersonalAddAddress = async (controller) => {
        let res = await axios.get(`/api/recruitment/applicant/pds/PersonalInfo/getPersonalInfoPersonalAddAddress?contextId=${contextId}`, {}, { signal: controller.signal })
        setLoader(false)
        if (res.data.status === 200) {
            setPersonalInfo(res.data.personal_information)
            setPersonalAddInfo(res.data.personal_additional || personalAddInfo)
            setAddressDefault(res.data.address)
        }
    }

    useEffect(() => {
        let controller = new AbortController()
        getPersonalInfoPersonalAddAddress(controller)
        return () => controller.abort()
    }, [])

    // used for context_id, temporary commented because applicants would first create account, this effect is only used for creating simutaneous applicant account
    // useEffect(() => {
    //     if (firstRenderRef.current) {
    //         firstRenderRef.current = false
    //     }
    //     else {
    //         setPersonalInfo({
    //             fname: '',
    //             mname: '',
    //             lname: '',
    //             extname: '',
    //             sex: '',
    //             dob: '',
    //             baddress: '',
    //             civilstatus: '',
    //             citizenship: '',
    //             dual_citizenship: '',
    //             height: '',
    //             weight: '',
    //             bloodtype: '',
    //             cpno: '',
    //             telno: '',
    //             emailadd: '',
    //             gsisno: '',
    //             gsisbp: '',
    //             pag_ibig: '',
    //             philhealth: '',
    //             sssno: '',
    //             tin: '',
    //         })
    //         setPersonalAddInfo({
    //             employment_status: '',
    //             source: '',
    //             desired_position: ''
    //         })
    //         setAddressState({
    //             radRegion: '',
    //             radProvince: '',
    //             radCity: '',
    //             radBrgy: '',
    //             radUnit: '',
    //             radStreet: '',
    //             radZip: '',
    //             radVillage: '',
    //             padRegion: '',
    //             padProvince: '',
    //             padCity: '',
    //             padBrgy: '',
    //             padUnit: '',
    //             padStreet: '',
    //             padVillage: '',
    //             padZip: '',
    //         })
    //     }
    // }, [contextId])

    return (
        <Box sx={{ px: { xs: 1, md: 15, lg: 15 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {loader ? (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, mb: 2 }}>
                        <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                        <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                        <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                    </Box>
                    {Array.from(Array(5)).map((item, i) => (
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
                            <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                            <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                            <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                        </Box>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Skeleton variant="reactangle" width="30%" height="" fullWidth animation="pulse" />
                    </Box>
                    {Array.from(Array(5)).map((item, i) => (
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2 }}>
                            <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                            <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                            <Skeleton variant="text" width="100%" height="" fullWidth animation="pulse" />
                        </Box>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Skeleton variant="reactangle" width="30%" height="" fullWidth animation="pulse" />
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexDirection: { xs: 'column', md: 'row' },mt:{xs:2,md:0} }}>
                        <TextField
                            fullWidth
                            id=""
                            label="EMPLOYMENT STATUS"
                            variant='outlined'
                            name='employment_status'
                            value={personalAddInfo?.employment_status}
                            onChange={handleChangePersonalAdd}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="SOURCE"
                            variant='outlined'
                            name='source'
                            value={personalAddInfo?.source}
                            onChange={handleChangePersonalAdd}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="DESIRED POSITION"
                            variant='outlined'
                            name='desired_position'
                            value={personalAddInfo?.desired_position}
                            onChange={handleChangePersonalAdd}
                        />
                    </Box>
                <Divider />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField
                            fullWidth
                            id=""
                            label="SURNAME"
                            variant='outlined'
                            value={personalInfo.lname}
                            name="lname"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="FIRST NAME"
                            variant='outlined'
                            value={personalInfo.fname}
                            name="fname"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="MIDDLE NAME"
                            variant='outlined'
                            value={personalInfo.mname}
                            name="mname"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="EXTENSION"
                            variant='outlined'
                            value={personalInfo.extname}
                            name="extname"
                            onChange={handleChangePersonal}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField
                            fullWidth
                            id=""
                            label="DATE OF BIRTH"
                            variant='outlined'
                            type='date'
                            value={personalInfo.dob}
                            name="dob"
                            focused
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="PLACE OF BIRTH"
                            variant='outlined'
                            value={personalInfo.baddress}
                            name="baddress"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="SEX"
                            variant='outlined'
                            value={personalInfo.sex}
                            name="sex"
                            onChange={handleChangePersonal}
                            select
                        >
                            <MenuItem value='MALE'>
                                MALE
                            </MenuItem>
                            <MenuItem value='FEMALE'>
                                FEMALE
                            </MenuItem>
                        </TextField>
                        <TextField variant="outlined" label="CIVIL STATUS"
                            fullWidth
                            value={personalInfo.civilstatus}
                            name="civilstatus"
                            onChange={handleChangePersonal}
                            select>
                            <MenuItem value='MARRIED'>
                                MARRIED
                            </MenuItem>
                            <MenuItem value='WIDOWED'>
                                WIDOWED
                            </MenuItem>
                            <MenuItem value='SEPARATED'>
                                SEPARATED
                            </MenuItem>
                            <MenuItem value='DIVORCED'>
                                DIVORCED
                            </MenuItem>
                            <MenuItem value='SINGLE'>
                                SINGLE
                            </MenuItem>
                        </TextField>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField
                            fullWidth
                            id=""
                            label="CITIZENSHIP"
                            variant='outlined'
                            value={personalInfo.citizenship}
                            name="citizenship"
                            onChange={handleChangePersonal}
                            select
                        >
                            <MenuItem value='FILIPINO'>
                                FILIPINO
                            </MenuItem>
                            <MenuItem value='NONE'>
                                NONE
                            </MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            id=""
                            label="DUAL CITIZENSHIP"
                            variant='outlined'
                            value={personalInfo.dual_citizenship}
                            name="dual_citizenship"
                            onChange={handleChangePersonal}
                            select
                        >
                            <MenuItem value='NONE'>
                                NONE
                            </MenuItem>
                            <MenuItem value='BY BIRTH'>
                                BY BIRTH
                            </MenuItem>
                            <MenuItem value='BY NATURALIZATION'>
                                BY NATURALIZATION
                            </MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            id=""
                            label="HEIGHT (m)"
                            type='number'
                            variant='outlined'
                            value={personalInfo.height}
                            name="height"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="WEIGHT (kg)"
                            variant='outlined'
                            type='number'
                            value={personalInfo.weight}
                            name="weight"
                            onChange={handleChangePersonal}
                        />

                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField variant="outlined"
                            label="BLOOD TYPE"
                            value={personalInfo.bloodtype}
                            name="bloodtype"
                            onChange={handleChangePersonal}
                            fullWidth select>
                            <MenuItem value='A+'>
                                A+
                            </MenuItem>
                            <MenuItem value='A-'>
                                A-
                            </MenuItem>
                            <MenuItem value='B+'>
                                B+
                            </MenuItem>
                            <MenuItem value='B-'>
                                B-
                            </MenuItem>
                            <MenuItem value='O+'>
                                O+
                            </MenuItem>
                            <MenuItem value='O-'>
                                O-
                            </MenuItem>
                            <MenuItem value='AB+'>
                                AB+
                            </MenuItem>
                            <MenuItem value='AB-'>
                                AB-
                            </MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            id=""
                            label="GSIS ID NO."
                            variant='outlined'
                            value={personalInfo.gsisno}
                            name="gsisno"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="PAG-IBIG ID NO."
                            variant='outlined'
                            value={personalInfo.pag_ibig}
                            name="pag_ibig"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="PHILHEALTH NO."
                            variant='outlined'
                            value={personalInfo.philhealth}
                            name="philhealth"
                            onChange={handleChangePersonal}
                        />

                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField
                            fullWidth
                            id=""
                            label="SSS NO."
                            variant='outlined'
                            value={personalInfo.sssno}
                            name="sssno"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="TIN NO."
                            variant='outlined'
                            value={personalInfo.tin}
                            name="tin"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="TELEPHONE NO."
                            variant='outlined'
                            value={personalInfo.telno}
                            name="telno"
                            onChange={handleChangePersonal}
                        />
                        <TextField
                            fullWidth
                            id=""
                            label="MOBILE NO."
                            variant='outlined'
                            value={personalInfo.cpno}
                            name="cpno"
                            onChange={handleChangePersonal}
                        />
                    </Box>
                    <Box display='flex' width={{ xs: '100%', md: '49.5%' }}>
                        <TextField
                            id=""
                            fullWidth
                            label="EMAIL ADDRESS (if any)"
                            variant='outlined'
                            value={personalInfo.emailadd}
                            name="emailadd"
                            onChange={handleChangePersonal}
                        />
                    </Box>

                    <Card variant="outlined">
                        <CardContent>
                            <Address
                                addressState={addressState}
                                setAddressState={setAddressState}
                                addressDefault={addressDefault}
                                sameAddress={sameAddress}
                                setSameAddress={setSameAddress}
                                update={update}
                                setUpdate={setUpdate}
                            />
                        </CardContent>
                    </Card>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary" sx={{ borderRadius: '2rem' }} endIcon={<ArrowForward />} onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </>
            )}

        </Box>
    );
};

export default PersonalInformation;