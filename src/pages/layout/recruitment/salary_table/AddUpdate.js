import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ArrowForward from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AddUpdate = ({ data, category, salaryTable, setSalaryTable, setOpenAddUpdate }) => {
    const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })
    const [inputs, setInputs] = useState({
        id: '',
        particulars: '',
        effectivity: '',
        sg: '',
        step1: '',
        step2: '',
        step3: '',
        step4: '',
        step5: '',
        step6: '',
        step7: '',
        step8: '',
    })
    function reverseFormatNumber(val, locale) {
        var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
        var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
        var reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
        reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
        return Number.isNaN(reversedVal) ? 0 : reversedVal;
    }

    const handleChangeInputs = (e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        Swal.fire({
            text: 'Processing please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()
        console.log(category)
        if (category === 'Add') {
            let addRow = await axios.post(`/api/recruitment/salary-grade/addRow`, { inputs })
            console.log(addRow)
            if (addRow.data.status === 200) {

                let addedSalaryGrade = [...salaryTable]

                addedSalaryGrade.push({
                    id: addRow.data.last_inserted_id,
                    Particulars: inputs.particulars,
                    sg: inputs.sg,
                    step1: inputs.step1,
                    step2: inputs.step2,
                    step3: inputs.step3,
                    step4: inputs.step4,
                    step5: inputs.step5,
                    step6: inputs.step6,
                    step7: inputs.step7,
                    step8: inputs.step8,
                }
                );
                toast.success('Salary grade added!')
                setSalaryTable(addedSalaryGrade)
                setOpenAddUpdate(false)
                Swal.close()
            }
            else if (addRow.data.status === 500) {
                toast.error(addRow.data.message)
                Swal.close()
            }
        }
        else if (category === 'update') {
            console.log(inputs)
            let updateRow = await axios.post(`/api/recruitment/salary-grade/updateRow`, { inputs })
            console.log(updateRow)
            if (updateRow.data.status === 200) {

                let updatedSalaryGrade = salaryTable.map((item) => {
                    if (item.id === inputs.id) {
                        return {
                            ...item,
                            Particulars: inputs.particulars,
                            sg: inputs.sg,
                            step1: inputs.step1,
                            step2: inputs.step2,
                            step3: inputs.step3,
                            step4: inputs.step4,
                            step5: inputs.step5,
                            step6: inputs.step6,
                            step7: inputs.step7,
                            step8: inputs.step8,
                        }
                    }
                    else {
                        return item
                    }
                });
                console.log(updatedSalaryGrade)
                toast.success('Salary grade Updated!')
                setSalaryTable(updatedSalaryGrade)
                setOpenAddUpdate(false)
                Swal.close()
            }
            else if (updateRow.data.status === 500) {
                toast.error(updateRow.data.message)
                Swal.close()
            }
        }
    }

    useEffect(() => {
        if (data) {
            setInputs({
                id: data?.id,
                particulars: data?.Particulars,
                effectivity: data?.effectivity,
                sg: data?.sg,
                step1: data?.step1,
                step2: data?.step2,
                step3: data?.step3,
                step4: data?.step4,
                step5: data?.step5,
                step6: data?.step6,
                step7: data?.step7,
                step8: data?.step8,
            })
        }
    }, [data])
    return (
        <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexWrap: 'wrap', ustifyContent: 'flex-start', gap: 5 }}>
            <Box display="flex" width="100%" gap={2}>
                <TextField
                    id=""
                    label="Particulars"
                    value={inputs.particulars}
                    name="particulars"
                    onChange={handleChangeInputs}
                    size="small"
                    fullWidth
                    required
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        // views={['year']}
                        label="Effectvity"
                        value={inputs.effectivity}
                        name="effectvity"
                        onChange={(newValue) => setInputs(prev => ({ ...prev, effectivity: newValue }))}
                        renderInput={(params) => <TextField size='small' required {...params} helperText={null} fullWidth />}
                    />
                </LocalizationProvider>
                <TextField
                    id=""
                    label="Salary grade"
                    value={inputs.sg}
                    name="sg"
                    onChange={handleChangeInputs}
                    size="small"
                    fullWidth
                    required
                />
            </Box>
            <Box display="flex" width="100%" gap={2}>
                <TextField
                    id=""
                    label="Step1"
                    value={inputs.step1}
                    name="step1"
                    onChange={handleChangeInputs}
                    fullWidth
                    size="small"
                    type="number"
                    required
                />
                <TextField
                    id=""
                    label="Step2"
                    value={inputs.step2}
                    type="number"
                    fullWidth
                    name="step2"
                    onChange={handleChangeInputs}
                    size="small"
                    required
                />
                <TextField
                    id=""
                    label="Step3"
                    value={inputs.step3}
                    fullWidth
                    type="number"
                    name="step3"
                    onChange={handleChangeInputs}
                    size="small"
                    required
                />
                <TextField
                    id=""
                    label="Step4"
                    value={inputs.step4}
                    type="number"
                    name="step4"
                    fullWidth
                    onChange={handleChangeInputs}
                    size="small"
                    required
                />

            </Box>
            <Box display="flex" width="100%" gap={2}>
                <TextField
                    id=""
                    label="Step5"
                    value={inputs.step5}
                    fullWidth
                    type="number"
                    name="step5"
                    onChange={handleChangeInputs}
                    size="small"
                    required
                />
                <TextField
                    id=""
                    label="Step6"
                    value={inputs.step6}
                    type="number"
                    name="step6"
                    onChange={handleChangeInputs}
                    fullWidth
                    size="small"
                    required
                />
                <TextField
                    id=""
                    label="Step7"
                    value={inputs.step7}
                    type="number"
                    fullWidth
                    name="step7"
                    onChange={handleChangeInputs}
                    size="small"
                    required
                />
                <TextField
                    id=""
                    label="Step8"
                    value={inputs.step8}
                    fullWidth
                    type="number"
                    name="step8"
                    onChange={handleChangeInputs}
                    size="small"
                    required
                />
            </Box>
            <Box display="flex" justifyContent="flex-end" width="100%" mt={1}>
                <Button type='submit' variant='contained' startIcon={category === 'Add' ? <ArrowForward /> : <EditIcon />} sx={{ borderRadius: '2rem' }} color={category === 'Add' ? 'primary' : 'warning'}>{category === 'Add' ? 'Submit' : 'Update'}</Button>
            </Box>
        </form>
    );
};

export default AddUpdate;