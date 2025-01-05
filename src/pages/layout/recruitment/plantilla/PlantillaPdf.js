import React, { useState, useEffect, useRef } from 'react'
import { red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import ArrowForward from '@mui/icons-material/ArrowForward';
import Skeleton from '@mui/material/Skeleton'

import { useReactToPrint } from 'react-to-print';
import axios from 'axios'

import PrintPdf from './plantillaPdf/PrintPdf';
import PrintIcon from '@mui/icons-material/Print';
import Tooltip from '@mui/material/Tooltip'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';


const PlantillaPdf = ({ plantillaId }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    const [loader, setLoader] = useState(true)
    const [isPlantillaExist, setIsPlantillaExist] = useState(false)
    const [plantillaPdfId, setPlantillaPdfId] = useState('')
    const [plantillaPdfPrint, setPlantillaPdfPrint] = useState('')
    const triggerSubmitRef = useRef(true)
    const [triggerSubmit, setTriggerSubmit] = useState(false)
    const [plantillaPdf, setPlantillaPdf] = useState({
        plantilla_id: plantillaId,
        position_name: '',
        item_number: '',
        sg: '',
        qs: '',
        lgu_type: 0,
        lgu_class: 0,
        agency_name: '',
        dept_id: '',
        dept_title: '',
        dept_branch: '',
        place_of_work: '',
        present_appro_act: '',
        previous_appro_act: '',
        other_compensation: '',
        immediate_visor: '',
        next_higher_visor: '',
        supervised_positions: '',
        supervised_item_no: '',
        machine_equipment: '',
        internal_executive: 0,
        internal_executive_a: false,
        internal_executive_b: false,
        internal_supervisor: 0,
        internal_supervisor_a: false,
        internal_supervisor_b: false,
        internal_non_supervisor: 0,
        internal_non_supervisor_a: false,
        internal_non_supervisor_b: false,
        internal_staff: 0,
        internal_staff_a: false,
        internal_staff_b: false,
        external_gen_public: 0,
        external_gen_public_a: false,
        external_gen_public_b: false,
        external_other_agency: 0,
        external_other_agency_a: false,
        external_other_agency_b: false,
        external_other_specify: '',
        work_office: 0,
        work_office_a: false,
        work_office_b: false,
        work_field: 0,
        work_field_a: false,
        work_field_b: false,
        work_others: '',
        desc_unit_section: '',
        desc_job_summary: '',
        core_competency: '',
        core_level: '',
        leader_competency: '',
        leader_level: '',
        technical_percent: '',
        technical_competency: '',
        technical_level: ''
    })
    const [newPlantillaPdf, setNewPlantillaPdf] = useState({})

    const onChangeInput = (e) => {
        setPlantillaPdf({ ...plantillaPdf, [e.target.name]: e.target.value })
    }

    const onChangeCheckbox = (e) => {
        setPlantillaPdf({ ...plantillaPdf, [e.target.name]: e.target.checked })
    }

    const fetchPlantillaInfo = async (controller) => {
        let fetchPlantilla = await axios.post(`/api/recruitment/plantilla/fetchPlantillaPdf`, { id: plantillaId }, { signal: controller.signal })
        if (fetchPlantilla.data.length > 0) {
            setIsPlantillaExist(true)
        }
        setPlantillaPdfId(fetchPlantilla.data[0].id)
        setPlantillaPdf({
            ...plantillaPdf,
            plantilla_id: fetchPlantilla.data[0].plantillaId,
            position_name: fetchPlantilla.data[0].position_name,
            item_number: fetchPlantilla.data[0].new_item_no,
            sg: fetchPlantilla.data[0].plantilla_sg,
            step: fetchPlantilla.data[0].plantilla_step,
            qs: fetchPlantilla.data[0].qs,
            dept_title: fetchPlantilla.data[0].dept_title,
            lgu_type: fetchPlantilla.data[0].lgu_type,
            lgu_class: fetchPlantilla.data[0].lgu_class,
            agency_name: fetchPlantilla.data[0].agency_name,
            dept_id: fetchPlantilla.data[0].dept_id,
            dept_title: fetchPlantilla.data[0].dept_title,
            dept_branch: fetchPlantilla.data[0].dept_branch,
            place_of_work: fetchPlantilla.data[0].place_of_work,
            present_appro_act: fetchPlantilla.data[0].present_appro_act,
            previous_appro_act: fetchPlantilla.data[0].previous_appro_act,
            other_compensation: fetchPlantilla.data[0].other_compensation,
            immediate_visor: fetchPlantilla.data[0].immediate_visor,
            next_higher_visor: fetchPlantilla.data[0].next_higher_visor,
            supervised_positions: fetchPlantilla.data[0].supervised_positions,
            supervised_item_no: fetchPlantilla.data[0].supervised_item_no,
            machine_equipment: fetchPlantilla.data[0].machine_equipment,
            internal_executive: fetchPlantilla.data[0].internal_executive,
            internal_executive_a: fetchPlantilla.data[0].internal_executive === 1 || fetchPlantilla.data[0].internal_executive === 3 ? true : false,
            internal_executive_b: fetchPlantilla.data[0].internal_executive === 2 || fetchPlantilla.data[0].internal_executive === 3 ? true : false,
            internal_supervisor: fetchPlantilla.data[0].internal_supervisor,
            internal_supervisor_a: fetchPlantilla.data[0].internal_supervisor === 1 || fetchPlantilla.data[0].internal_supervisor === 3 ? true : false,
            internal_supervisor_b: fetchPlantilla.data[0].internal_supervisor === 2 || fetchPlantilla.data[0].internal_supervisor === 3 ? true : false,
            internal_non_supervisor: fetchPlantilla.data[0].internal_non_supervisor,
            internal_non_supervisor_a: fetchPlantilla.data[0].internal_non_supervisor === 1 || fetchPlantilla.data[0].internal_non_supervisor === 3 ? true : false,
            internal_non_supervisor_b: fetchPlantilla.data[0].internal_non_supervisor === 2 || fetchPlantilla.data[0].internal_non_supervisor === 3 ? true : false,
            internal_staff: fetchPlantilla.data[0].internal_staff,
            internal_staff_a: fetchPlantilla.data[0].internal_staff === 1 || fetchPlantilla.data[0].internal_staff === 3 ? true : false,
            internal_staff_b: fetchPlantilla.data[0].internal_staff === 2 || fetchPlantilla.data[0].internal_staff === 3 ? true : false,
            external_gen_public: fetchPlantilla.data[0].external_gen_public,
            external_gen_public_a: fetchPlantilla.data[0].external_gen_public === 1 || fetchPlantilla.data[0].external_gen_public === 3 ? true : false,
            external_gen_public_b: fetchPlantilla.data[0].external_gen_public === 2 || fetchPlantilla.data[0].external_gen_public === 3 ? true : false,
            external_other_agency: fetchPlantilla.data[0].external_other_agency,
            external_other_agency_a: fetchPlantilla.data[0].external_other_agency === 1 || fetchPlantilla.data[0].external_other_agency === 3 ? true : false,
            external_other_agency_b: fetchPlantilla.data[0].external_other_agency === 2 || fetchPlantilla.data[0].external_other_agency === 3 ? true : false,
            external_other_specify: fetchPlantilla.data[0].external_other_specify,
            work_office: fetchPlantilla.data[0].work_office,
            work_office_a: fetchPlantilla.data[0].work_office === 1 || fetchPlantilla.data[0].work_office === 3 ? true : false,
            work_office_b: fetchPlantilla.data[0].work_office === 2 || fetchPlantilla.data[0].work_office === 3 ? true : false,
            work_field: fetchPlantilla.data[0].work_field,
            work_field_a: fetchPlantilla.data[0].work_field === 1 || fetchPlantilla.data[0].work_field === 3 ? true : false,
            work_field_b: fetchPlantilla.data[0].work_field === 2 || fetchPlantilla.data[0].work_field === 3 ? true : false,
            work_others: fetchPlantilla.data[0].work_others,
            desc_unit_section: fetchPlantilla.data[0].desc_unit_section,
            desc_job_summary: fetchPlantilla.data[0].desc_job_summary,
            core_competency: fetchPlantilla.data[0].core_competency,
            core_level: fetchPlantilla.data[0].core_level,
            leader_competency: fetchPlantilla.data[0].leader_competency,
            leader_level: fetchPlantilla.data[0].leader_level,
            technical_percent: fetchPlantilla.data[0].technical_percent,
            technical_competency: fetchPlantilla.data[0].technical_competency,
            technical_level: fetchPlantilla.data[0].technical_level,
        })
        setLoader(false)
    }

    const handleSubmit = async () => {
        let data = { ...plantillaPdf }
        data.internal_executive = plantillaPdf.internal_executive_a && plantillaPdf.internal_executive_b ? 3 : plantillaPdf.internal_executive_a && !plantillaPdf.internal_executive_b ? 1 : !plantillaPdf.internal_executive_a && plantillaPdf.internal_executive_b ? 2 : !plantillaPdf.internal_executive_a && !plantillaPdf.internal_executive_b ? 0 : null
        data.internal_supervisor = plantillaPdf.internal_supervisor_a && plantillaPdf.internal_supervisor_b ? 3 : plantillaPdf.internal_supervisor_a && !plantillaPdf.internal_supervisor_b ? 1 : !plantillaPdf.internal_supervisor_a && plantillaPdf.internal_supervisor_b ? 2 : !plantillaPdf.internal_supervisor_a && !plantillaPdf.internal_supervisor_b ? 0 : null
        data.internal_non_supervisor = plantillaPdf.internal_non_supervisor_a && plantillaPdf.internal_non_supervisor_b ? 3 : plantillaPdf.internal_non_supervisor_a && !plantillaPdf.internal_non_supervisor_b ? 1 : !plantillaPdf.internal_non_supervisor_a && plantillaPdf.internal_non_supervisor_b ? 2 : !plantillaPdf.internal_non_supervisor_a && !plantillaPdf.internal_non_supervisor_b ? 0 : null
        data.internal_staff = plantillaPdf.internal_staff_a && plantillaPdf.internal_staff_b ? 3 : plantillaPdf.internal_staff_a && !plantillaPdf.internal_staff_b ? 1 : !plantillaPdf.internal_staff_a && plantillaPdf.internal_staff_b ? 2 : !plantillaPdf.internal_staff_a && !plantillaPdf.internal_staff_b ? 0 : null
        data.external_gen_public = plantillaPdf.external_gen_public_a && plantillaPdf.external_gen_public_b ? 3 : plantillaPdf.external_gen_public_a && !plantillaPdf.external_gen_public_b ? 1 : !plantillaPdf.external_gen_public_a && plantillaPdf.external_gen_public_b ? 2 : !plantillaPdf.external_gen_public_a && !plantillaPdf.external_gen_public_b ? 0 : null
        data.external_other_agency = plantillaPdf.external_other_agency_a && plantillaPdf.external_other_agency_b ? 3 : plantillaPdf.external_other_agency_a && !plantillaPdf.external_other_agency_b ? 1 : !plantillaPdf.external_other_agency_a && plantillaPdf.external_other_agency_b ? 2 : !plantillaPdf.external_other_agency_a && !plantillaPdf.external_other_agency_b ? 0 : null
        data.work_office = plantillaPdf.work_office_a && plantillaPdf.work_office_b ? 3 : plantillaPdf.work_office_a && !plantillaPdf.work_office_b ? 1 : !plantillaPdf.work_office_a && plantillaPdf.work_office_b ? 2 : !plantillaPdf.work_office_a && !plantillaPdf.work_office_b ? 0 : null
        data.work_field = plantillaPdf.work_field_a && plantillaPdf.work_field_b ? 3 : plantillaPdf.work_field_a && !plantillaPdf.work_field_b ? 1 : !plantillaPdf.work_field_a && plantillaPdf.work_field_b ? 2 : !plantillaPdf.work_field_a && !plantillaPdf.work_field_b ? 0 : null
        delete data.qs
        delete data.internal_executive_a
        delete data.internal_executive_b
        delete data.internal_supervisor_a
        delete data.internal_supervisor_b
        delete data.internal_non_supervisor_a
        delete data.internal_non_supervisor_b
        delete data.internal_staff_a
        delete data.internal_staff_b
        delete data.external_gen_public_a
        delete data.external_gen_public_b
        delete data.external_other_agency_a
        delete data.external_other_agency_b
        delete data.work_office_a
        delete data.work_office_b
        delete data.work_field_a
        delete data.work_field_b
        delete data.item_number
        delete data.position_name
        delete data.new_item_no
        delete data.sg
        delete data.dept_title
        Swal.fire({
            text: 'processing request . . .',
            icon: 'info'
        })
        Swal.showLoading()
        let submitPlantilla = await axios.post(`/api/recruitment/plantilla/submitPlantillaPdf`, { data: data, plantillaId: plantillaId })
        try {
            if (submitPlantilla.data.status === 200) {
                Swal.close()
                setNewPlantillaPdf({})
            }
            if (submitPlantilla.data.status === 500) {
                toast.error(submitPlantilla.data.message)
            }
        }
        catch (err) {
            toast.error(err)
        }
        // setNewPlantillaPdf(plantillaPdf)
        // setTriggerSubmit(prev => !prev)
    }
    const [pdfPrint, setPdfPrint] = useState(false)
    const handlePrinting = () => {
        Swal.fire({
            text: 'Processing, please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()
        setPdfPrint(prev => !prev)
        setPlantillaPdfPrint(plantillaPdf)
    }

    useEffect(() => {
        handlePrint()
        Swal.close()
    }, [pdfPrint])

    useEffect(() => {
        let controller = new AbortController()
        fetchPlantillaInfo(controller)
        return () => controller.abort()
    }, [])

    useEffect(async () => {
        if (triggerSubmitRef.current) {
            triggerSubmitRef.current = false
        }
        else {
            let tempPlantilla = Object.assign({}, newPlantillaPdf)
            delete tempPlantilla.qs
            delete tempPlantilla.internal_executive_a
            delete tempPlantilla.internal_executive_b
            delete tempPlantilla.internal_supervisor_a
            delete tempPlantilla.internal_supervisor_b
            delete tempPlantilla.internal_non_supervisor_a
            delete tempPlantilla.internal_non_supervisor_b
            delete tempPlantilla.internal_staff_a
            delete tempPlantilla.internal_staff_b
            delete tempPlantilla.external_gen_public_a
            delete tempPlantilla.external_gen_public_b
            delete tempPlantilla.external_other_agency_a
            delete tempPlantilla.external_other_agency_b
            delete tempPlantilla.work_office_a
            delete tempPlantilla.work_office_b
            delete tempPlantilla.work_field_a
            delete tempPlantilla.work_field_b
            delete tempPlantilla.item_number
            delete tempPlantilla.position_name
            delete tempPlantilla.new_item_no
            delete tempPlantilla.sg
            delete tempPlantilla.dept_title
            Swal.fire({
                text: 'processing request . . .',
                icon: 'info'
            })
            Swal.showLoading()
            let submitPlantilla = await axios.post(`/api/recruitment/plantilla/submitPlantillaPdf`, { data: tempPlantilla, plantillaId: plantillaId })
            try {
                if (submitPlantilla.data.status === 200) {
                    Swal.close()
                    toast.success('updated')
                    setNewPlantillaPdf({})
                }
                if (submitPlantilla.data.status === 500) {
                    toast.error(submitPlantilla.data.message)
                }
            }
            catch (err) {
                toast.error(err)
            }

        }
    }, [triggerSubmit])
    
    return (
        <Box sx={{ flexGrow: 1, p: 2, px: matches ? 5 : 30 }}>
            {loader ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 5 }}>
                        <Skeleton variant="reactangle" sx={{ flex: 1 }} height={40} animation="pulse" />
                        <Skeleton variant="reactangle" sx={{ flex: 1 }} height={40} animation="pulse" />
                        <Skeleton variant="reactangle" sx={{ flex: 1 }} height={40} animation="pulse" />
                    </Box>
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 5 }}>
                        {Array.from(Array(3)).map(item => (
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 3 }}>
                                <Skeleton variant="text" sx={{ flex: 1 }} height={40} animation="pulse" />
                                <Skeleton variant="text" sx={{ flex: 1 }} height={40} animation="pulse" />
                                <Skeleton variant="text" sx={{ flex: 1 }} height={40} animation="pulse" />
                            </Box>
                        ))}
                    </Box>
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                    <Skeleton variant="text" width="90%" height="" animation="pulse" />
                    <Skeleton variant="text" width="70%" height="" animation="pulse" />
                    <Skeleton variant="text" width="50%" height="" animation="pulse" />
                    <Skeleton variant="text" width="50%" height="" animation="pulse" />
                    <Skeleton variant="text" width="70%" height="" animation="pulse" />
                    <Skeleton variant="text" width="90%" height="" animation="pulse" />
                    <Skeleton variant="text" width="" height="" animation="pulse" />
                </Box>
            ) : (
                <Fade in>
                    <div>
                        <CssBaseline />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                            <div style={{ display: 'none' }}>
                                <div ref={componentRef}>
                                    <PrintPdf data={plantillaPdfPrint} />
                                </div>
                            </div>
                            <Tooltip title="print plantilla pdf">
                                <PrintIcon sx={{ cursor: 'pointer' }} color='primary' onClick={handlePrinting} />
                            </Tooltip>
                        </Box>
                        {isPlantillaExist ? null : <Alert severity='error' sx={{ mb: 1, bgcolor: red[100] }}>This plantilla doesn't have entries for pdf in the database yet. Fill the form and save changes to create new one.</Alert>}
                        <Box sx={{ display: 'flex', gap: matches ? 2 : 5, mb: 1, flexDirection: matches ? 'column' : 'row', pointerEvents: 'none' }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="POSITION TITLE"
                                value={plantillaPdf.position_name}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="ITEM NUMBER"
                                value={plantillaPdf.item_number}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="SALARY GRADE"
                                value={plantillaPdf?.sg + ' - ' + plantillaPdf?.step}
                            />
                        </Box>
                        <Typography variant="body1" color="initial" sx={{ bgcolor: 'primary.main', p: .5, px: 1, color: '#fff' }}>FOR LOCAL GOVERNMENT POSITION, ENUMERATION GOVERNMENTAL UNIT AND CLASS</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexDirection: matches ? 'column' : 'row' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="lgu-type-radio-buttons-group-label"
                                        value={plantillaPdf.lgu_type}
                                        name='lgu_type'
                                        onChange={onChangeInput}
                                    >
                                        <FormControlLabel value={0} control={<Radio />} label="None" />
                                        <FormControlLabel value={1} control={<Radio />} label="Province" />
                                        <FormControlLabel value={2} control={<Radio />} label="City" />
                                        <FormControlLabel value={3} control={<Radio />} label="Municipality" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            {matches ? <Divider /> : null}
                            <Box sx={{ flex: 1 }}>
                                <FormGroup >
                                    <RadioGroup
                                        aria-labelledby="lgu-class-radio-buttons-group-label"
                                        name='lgu_class'
                                        onChange={onChangeInput}
                                        sx={{ display: 'flex', flexDirection: 'row', gap: 5 }}
                                        value={plantillaPdf.lgu_class}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <FormControlLabel value={0} control={<Radio />} label="None" />
                                            <FormControlLabel value={1} control={<Radio />} label="1st Class" />
                                            <FormControlLabel value={2} control={<Radio />} label="2nd Class" />
                                            <FormControlLabel value={3} control={<Radio />} label="3rd Class" />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <FormControlLabel value={4} control={<Radio />} label="4th Class" />
                                            <FormControlLabel value={5} control={<Radio />} label="5th Class" />
                                            <FormControlLabel value={6} control={<Radio />} label="6th Class" />
                                            <FormControlLabel value={7} control={<Radio />} label="Special" />
                                        </Box>
                                    </RadioGroup>
                                </FormGroup>
                            </Box>
                        </Box>
                        <Divider
                            variant="fullWidth"
                            orientation="horizontal"
                        />
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                name='agency_name'
                                value={plantillaPdf.agency_name}
                                onChange={onChangeInput}
                                label="DEPARTMENT, CORPORATION OR AGENCY/ LOCAL GOVERNMENT"
                            />
                            <TextField
                                sx={{ flex: 1, pointerEvents: 'none' }}
                                id=""
                                value={plantillaPdf.dept_title}
                                label="BUREAU OR OFFICE"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                label="DEPARTMENT / BRANCH / DIVISION"
                                name='dept_branch'
                                value={plantillaPdf.dept_branch}
                                onChange={onChangeInput}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                value={plantillaPdf.place_of_work}
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
                                    value={plantillaPdf.present_appro_act}
                                    onChange={onChangeInput}
                                    label="PRESENT APPROP ACT"
                                />
                                <TextField
                                    sx={{ flex: 1 }}
                                    id=""
                                    name='previous_appro_act'
                                    value={plantillaPdf.previous_appro_act}
                                    onChange={onChangeInput}
                                    label="PREVIOUS APPRP ACT"
                                />
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex' }}>
                                <TextField
                                    sx={{ flex: 1 }}
                                    id=""
                                    name='other_compensation'
                                    value={plantillaPdf.other_compensation}
                                    onChange={onChangeInput}
                                    label="OTHER COMPENSATION"
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                name='immediate_visor'
                                value={plantillaPdf.immediate_visor}
                                onChange={onChangeInput}
                                label="POSITION TITLE OF IMMEDIATE SUPERVISOR"
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                name='next_higher_visor'
                                value={plantillaPdf.next_higher_visor}
                                onChange={onChangeInput}
                                label="POSITION TITLE OF NEXT HIGHER SUPERVISOR"
                            />
                        </Box>
                        <Typography variant="body1" color="initial" sx={{ bgcolor: 'primary.main', p: .5, px: 1, color: '#fff' }}>POSITION TITLE, AND ITEM OF THOSE DIRECTLY SUPERVISED</Typography>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                name='supervised_positions'
                                value={plantillaPdf.supervised_positions}
                                onChange={onChangeInput}
                                label="POSITION TITLE"
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                name='supervised_item_no'
                                value={plantillaPdf.supervised_item_no}
                                onChange={onChangeInput}
                                label="ITEM NUBMER"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 5, mt: 2, mb: 2 }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                name='machine_equipment'
                                value={plantillaPdf.machine_equipment}
                                onChange={onChangeInput}
                                label="MACHINE, EQUIPMENT, TOOLS, ETC,. USED REGULARLY IN PERFORMANCE OF WORK"
                            />
                        </Box>
                        {/* <Agency plantillaPdf={plantillaPdf} /> */}
                        <Typography variant="body1" color="initial" sx={{ bgcolor: 'primary.main', p: .5, px: 1, color: '#fff' }}>CONTACTS / CLIENT /STAKEHOLDERS</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: matches ? 'column' : 'row' }}>
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <TableContainer component={Paper}>
                                    <Table aria-label="contacts client table" size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>INTERNAL</TableCell>
                                                <TableCell align="left">Occasional</TableCell>
                                                <TableCell align="left">Frequent</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Executive / Managerial</TableCell>
                                                <TableCell align="left"><Checkbox name='internal_executive_a' checked={plantillaPdf.internal_executive_a} onChange={onChangeCheckbox} /></TableCell>
                                                <TableCell align="left"><Checkbox name='internal_executive_b' checked={plantillaPdf.internal_executive_b} onChange={onChangeCheckbox} /></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Supervisors</TableCell>
                                                <TableCell align="left"><Checkbox name='internal_supervisor_a' checked={plantillaPdf.internal_supervisor_a} onChange={onChangeCheckbox} /></TableCell>
                                                <TableCell align="left"><Checkbox name='internal_supervisor_b' checked={plantillaPdf.internal_supervisor_b} onChange={onChangeCheckbox} /></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Non-Supervisors</TableCell>
                                                <TableCell align="left"><Checkbox name='internal_non_supervisor_a' checked={plantillaPdf.internal_non_supervisor_a} onChange={onChangeCheckbox} /></TableCell>
                                                <TableCell align="left"><Checkbox name='internal_non_supervisor_b' checked={plantillaPdf.internal_non_supervisor_b} onChange={onChangeCheckbox} /></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Staff</TableCell>
                                                <TableCell align="left"><Checkbox name='internal_staff_a' checked={plantillaPdf.internal_staff_a} onChange={onChangeCheckbox} /></TableCell>
                                                <TableCell align="left"><Checkbox name='internal_staff_b' checked={plantillaPdf.internal_staff_b} onChange={onChangeCheckbox} /></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TableContainer component={Paper}>
                                    <Table aria-label="contacts client table" size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>INTERNAL</TableCell>
                                                <TableCell align="left">Occasional</TableCell>
                                                <TableCell align="left">Frequent</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row">General Public</TableCell>
                                                <TableCell align="left"><Checkbox name='external_gen_public_a' checked={plantillaPdf.external_gen_public_a} onChange={onChangeCheckbox} /></TableCell>
                                                <TableCell align="left"><Checkbox name='external_gen_public_b' checked={plantillaPdf.external_gen_public_b} onChange={onChangeCheckbox} /></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Other Agencies</TableCell>
                                                <TableCell align="left"><Checkbox name='external_other_agency_a' checked={plantillaPdf.external_other_agency_a} onChange={onChangeCheckbox} /></TableCell>
                                                <TableCell align="left"><Checkbox name='external_other_agency_b' checked={plantillaPdf.external_other_agency_b} onChange={onChangeCheckbox} /></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TextField
                                    sx={{ mt: 1 }}
                                    fullWidth
                                    id=""
                                    name='external_other_specify'
                                    value={plantillaPdf.external_other_specify}
                                    onChange={onChangeInput}
                                    label="Other/s Please Specify"
                                />
                            </Box>
                        </Box>
                        <Typography variant="body1" color="initial" sx={{ bgcolor: 'primary.main', p: .5, px: 1, color: '#fff' }}>WORKING CONDITION</Typography>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 2 }}>
                            <TableContainer component={Paper}>
                                <Table aria-label="contacts client table" size='small'>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell component="th" scope="row">Office Work</TableCell>
                                            <TableCell align="left"><Checkbox name='work_office_a' checked={plantillaPdf.work_office_a} onChange={onChangeCheckbox} /></TableCell>
                                            <TableCell align="left"><Checkbox name='work_office_b' checked={plantillaPdf.work_office_b} onChange={onChangeCheckbox} /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">Field Work</TableCell>
                                            <TableCell align="left"><Checkbox name='work_field_a' checked={plantillaPdf.work_field_a} onChange={onChangeCheckbox} /></TableCell>
                                            <TableCell align="left"><Checkbox name='work_field_b' checked={plantillaPdf.work_field_b} onChange={onChangeCheckbox} /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TextField
                                id=""
                                label="Other/s Please Specify"
                                name='work_others'
                                value={plantillaPdf.work_others}
                                onChange={onChangeInput}
                                sx={{ mt: 1 }}
                                fullWidth
                            />
                        </Box>
                        <TextField
                            id=""
                            label="BRIEF DESCRIPTION OF THE GENERAL FUNCTION OF THE UNIT OR SECTION"
                            sx={{ mt: 2 }}
                            name='desc_unit_section'
                            value={plantillaPdf.desc_unit_section}
                            onChange={onChangeInput}
                            fullWidth
                        />
                        <TextField
                            id=""
                            label="BRIEF DESCRIPTION OF THE GENERAL FUNCTION OF THE POSITION (Job Summary)"
                            sx={{ mt: 2 }}
                            name='desc_job_summary'
                            value={plantillaPdf.desc_job_summary}
                            onChange={onChangeInput}
                            fullWidth
                        />
                        {plantillaPdf.qs ? null : (<Alert sx={{ my: 1, bgcolor: red[100] }} severity='error'>Quality Standards for this position is not yet set.</Alert>)}
                        <Typography variant="body1" color="initial" sx={{ bgcolor: 'primary.main', p: .5, px: 1, color: '#fff', mt: 1 }}>QUALIFICATION STANDARDS</Typography>
                        <Box sx={{ display: 'flex', mt: 2, gap: 2, pointerEvents: 'none' }}>
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                fullWidth
                                label="Education"
                                value={plantillaPdf.qs?.education}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                fullWidth
                                label="Experience"
                                value={plantillaPdf.qs?.experience}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                fullWidth
                                label="Training"
                                value={plantillaPdf.qs?.training}
                            />
                            <TextField
                                sx={{ flex: 1 }}
                                id=""
                                fullWidth
                                label="Eligibility"
                                value={plantillaPdf.qs?.eligibility}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
                            <Box sx={{ width: '80%' }}>
                                <TextField
                                    id=""
                                    fullWidth
                                    label="Core Competencies"
                                    name='core_competency'
                                    value={plantillaPdf.core_competency}
                                    onChange={onChangeInput}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    id=""
                                    fullWidth
                                    name='core_level'
                                    value={plantillaPdf.core_level}
                                    onChange={onChangeInput}
                                    label="Competency Level"
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
                            <Box sx={{ width: '80%' }}>
                                <TextField
                                    id=""
                                    fullWidth
                                    name='leader_competency'
                                    value={plantillaPdf.leader_competency}
                                    onChange={onChangeInput}
                                    label="Leadership Competencies"
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    id=""
                                    fullWidth
                                    name='leader_level'
                                    value={plantillaPdf.leader_level}
                                    onChange={onChangeInput}
                                    label="Competency Level"
                                />
                            </Box>
                        </Box>
                        <Typography variant="body1" color="initial" sx={{ bgcolor: 'primary.main', p: .5, px: 1, color: '#fff', mt: 1 }}>STATEMENT OF DUTIES AND RESPONSIBILITIES (Technical Competencies)</Typography>

                        <Box sx={{ display: 'flex', mt: 2, gap: 2, alignItems: matches ? null : 'flex-start', flexDirection: matches ? 'column' : 'row' }}>
                            <Box sx={{ width: matches ? '100%' : '80%', display: 'flex' }}>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Percentage of Working</TableCell>
                                                <TableCell align="left">(State the duties and responsibilties here)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    <TextField
                                                        fullWidth
                                                        id=""
                                                        label="technical_percent (comma separated)"
                                                        name='technical_percent'
                                                        value={plantillaPdf.technical_percent}
                                                        onChange={onChangeInput}
                                                        multiline
                                                        rows={4}

                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextField
                                                        fullWidth
                                                        id=""
                                                        label="technical_percent (comma separated)"
                                                        name='technical_competency'
                                                        value={plantillaPdf.technical_competency}
                                                        onChange={onChangeInput}
                                                        multiline
                                                        rows={4}

                                                    />
                                                </TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    id=""
                                    sx={{ flex: 1 }}
                                    fullWidth
                                    label="Competency Level"
                                    name='technical_level'
                                    value={plantillaPdf.technical_level}
                                    onChange={onChangeInput}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" sx={{ mt: 2, borderRadius: '2rem' }} endIcon={<ArrowForward />} onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        </Box>
                    </div>
                </Fade>
            )}
        </Box>
    );
};

export default PlantillaPdf;