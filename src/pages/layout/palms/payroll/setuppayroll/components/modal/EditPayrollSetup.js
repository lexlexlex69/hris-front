import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import { Autocomplete, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import moment from "moment";

import SmallModal from "../../../../../custommodal/SmallModal";
import { APILoading } from "../../../../../apiresponse/APIResponse";
import { APIError, APISuccess } from "../../../../../customstring/CustomString";
import { postPaySetup } from "../../SetupPayrollRequests";


export function EditPayrollSetup({ tabValue, close, tempDetails, data }) {
    const [filterPayType, setFilterPayType] = useState([])
    const [tempData, setTempData] = useState({
        pay_type: null,
        p_from: '',
        p_to: '',
        w_day: 0,
        d_15: 11,
        d_30: 11,
        title: '',
        clerk: null
    })
    const [openAddAllowance, setOpenAddAllowance] = useState(false)
    const [selAllowance, setSelAllowance] = useState([])
    const [tempSelAllowance, setTempSelAllowance] = useState([])
    console.log(data)

    console.log(tempDetails)

    const handleFilterPayType = async () => {
        let filter;
        switch (tabValue) {
            case 0:
                filter = tempDetails.payType.filter(el => el.tran_category == 1);
                setFilterPayType(filter)
                break;
            case 1:
                filter = tempDetails.payType.filter(el => el.tran_category == 2);
                setFilterPayType(filter)
                break;
            case 2:
                filter = tempDetails.payType.filter(el => el.tran_category == 3);
                setFilterPayType(filter)
                break;
            case 3:
                filter = tempDetails.payType.filter(el => el.tran_category == 5);
                setFilterPayType(filter)
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        _init()
    }, [])
    useEffect(() => {
        setTempData((prev) => ({ ...prev, w_day: parseFloat(tempData.d_15) + parseFloat(tempData.d_30) }))
    }, [tempData.d_15, tempData.d_30])
    useEffect(() => {
        console.log(tempData)
    }, [tempData])
    const _init = () => {
        handleFilterPayType()
        if (data) {
            var tempPayType = tempDetails.payType.find(el => el.payroll_type_id === data.pay_type)
            var tempPayClerk = tempDetails.payAllowance.find(el => el.clerk_code === data.clerk_code)
            console.log(tempPayType)

            // setTempData((prev) => ({
            //     pay_type: data.pay_type,
            //     p_from: data.period_from,
            //     p_to: data.period_to,
            //     w_day: parseFloat(data.no_15) + parseFloat(data.no_30),
            //     d_15: data.no_15,
            //     d_30: data.no_30,
            //     title: data.description,
            //     clerk: data.clerk_code
            // }))
        }
    }
    const handleSelectPayType = (e, newValue) => {
        console.log(newValue)
        setTempData((prev) => ({ ...prev, pay_type: newValue }))
    }
    const handleSelectClerk = (e, newValue) => {
        setTempData((prev) => ({ ...prev, clerk: newValue }))
    }
    const handleAddAllowance = () => {
        setSelAllowance(tempSelAllowance)
        setOpenAddAllowance(false)
    }
    const handleDelAllowance = (item) => {
        let temp = [...selAllowance];
        let index = selAllowance.findIndex(el => el.earn_code === item.earn_code);
        temp.splice(index, 1);
        setSelAllowance(temp);
    }
    const handleSave = async () => {
        try {
            APILoading('info', 'Saving data', 'Please wait...')
            let cat;
            switch (tabValue) {
                //regular
                case 0:
                    cat = 1;
                    break;
                //casual
                case 1:
                    cat = 2;
                    break;
                //COS
                case 2:
                    cat = 3;
                    break;
                case 3:
                    cat = 5;
                    break;
                case 4:
                    cat = 4;
                    break;
            }
            let t_data = {
                category: cat,
                pay_clerk: tempData.clerk.clerk_code,
                date_one: moment(tempData.p_from).format('MM/DD/YYYY'),
                date_two: moment(tempData.p_to).format('MM/DD/YYYY'),
                p_from: moment(tempData.p_from).format('YYYY-MM-DD'),
                p_to: moment(tempData.p_to).format('YYYY-MM-DD'),
                days_one: tempData.d_15,
                days_two: tempData.d_30,
                pay_type: tempData.pay_type.tran_type,
                title: tempData.title,
                year: moment(tempData.p_from).format('YYYY'),
                month: moment(tempData.p_from).format('MM'),
                allowance_included: selAllowance,
                // key:'b9e1f8a0553623f1:639a3e:17f68ea536b'
            }
            console.log(t_data)
            return;
            const res = await postPaySetup(t_data);
            if (res.data.status === 200) {
                APISuccess(res.data.message)
            } else {
                APIError(res.data.message)
            }
            console.log(res.data)
        } catch (err) {
            APIError(err)
        }
    }
    const handleOpenAllowance = () => {
        // console.log(selAllowance)
        setTempSelAllowance(selAllowance)
        setOpenAddAllowance(true)
    }
    return (<>
        <Grid container spacing={2} sx={{ p: 1 }}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={filterPayType}
                    getOptionLabel={(option) => option.tran_type_desc}
                    isOptionEqualToValue={(option, value) => option.tran_type === value.tran_type}
                    fullWidth
                    size="small"
                    value={tempData.pay_type}
                    onChange={handleSelectPayType}
                    renderInput={(params) => <TextField {...params} label="Payroll Type" required variant='standard' />}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField label='Period From' type='date' size='small' InputLabelProps={{ shrink: true }} value={tempData.p_from ?? ''} onChange={(val) => setTempData({ ...tempData, p_from: val.target.value })} fullWidth variant='standard' />
            </Grid>
            <Grid item xs={6}>
                <TextField label='Period To' type='date' size='small' InputLabelProps={{ shrink: true }} value={tempData.p_to ?? ''} onChange={(val) => setTempData({ ...tempData, p_to: val.target.value })} fullWidth variant='standard' />
            </Grid>
            <Grid item xs={4}>
                <TextField label='No. of Days 1-15' type='number' size='small' value={tempData.d_15 ?? ''} InputLabelProps={{ shrink: true }} onChange={(val) => setTempData({ ...tempData, d_15: val.target.value })} fullWidth variant='standard' />
            </Grid>
            <Grid item xs={4}>
                <TextField label='No. of Days 16-30' type='number' size='small' value={tempData.d_30 ?? ''} InputLabelProps={{ shrink: true }} onChange={(val) => setTempData({ ...tempData, d_30: val.target.value })} fullWidth variant='standard' />
            </Grid>
            <Grid item xs={4}>
                <TextField label='Working Day/s' size='small' value={tempData.w_day ?? ''} InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} fullWidth variant='standard' />
            </Grid>
            <Grid item xs={12}>
                <TextField label='Title' size='small' value={tempData.title ?? ''} onChange={(val) => setTempData({ ...tempData, title: val.target.value })} fullWidth variant='standard' />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="combo-box-clerk"
                    options={tempDetails.payClerk}
                    getOptionLabel={(option) => option.clerk_name}
                    isOptionEqualToValue={(option, value) => option.clerk_code === value.clerk_code}
                    // sx={{ width: 300 }}
                    fullWidth
                    size="small"
                    value={tempData.clerk}
                    onChange={handleSelectClerk}
                    renderInput={(params) => <TextField {...params} label="Pay Clerk" required variant='standard' />}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{ fontSize: '.7rem', textAlign: 'right', fontStyle: 'italic' }}>Allowances included in this Payroll Transaction</Typography>
                <Paper>
                    <TableContainer sx={{ maxHeight: '20vh' }}>
                        <Table>
                            <TableBody>
                                {
                                    selAllowance.map((item) => {
                                        return (
                                            <TableRow key={item.earn_code}>
                                                <TableCell>
                                                    {item.earn_desc}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title='Delete'>
                                                        <IconButton size='small' className='custom-iconbutton' color='error' onClick={() => handleDelAllowance(item)}><DeleteIcon /></IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                            <TableFooter sx={{ position: 'sticky', bottom: 0, background: '#fff' }}>
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <Button size='small' variant='outlined' className='custom-roundbutton' onClick={handleOpenAllowance} startIcon={<AddIcon />}>Add</Button>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button className='custom-roundbutton' variant='contained' color='success' onClick={handleSave}>Save</Button>
                <Button className='custom-roundbutton' variant='contained' color='error' onClick={close}>Cancel</Button>
            </Grid>
        </Grid>

        <Fragment>
            <SmallModal open={openAddAllowance} close={() => setOpenAddAllowance(false)} title='Choose Allowance'>
                <Grid container sx={{ p: 1 }} spacing={3}>
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-desc"
                            options={tempDetails.payAllowance}
                            getOptionLabel={(option) => option.earn_desc}
                            isOptionEqualToValue={(option, value) => option.earn_code === value.earn_code}
                            // sx={{ width: 300 }}
                            fullWidth
                            size="small"
                            multiple
                            value={tempSelAllowance}
                            onChange={(e, newVal) => setTempSelAllowance(newVal)}
                            renderInput={(params) => <TextField {...params} label="Description" required variant='standard' />}
                        // disableCloseOnSelect
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={handleAddAllowance} variant='contained' className='custom-roundbutton' color='success'>Save It</Button>
                        <Button onClick={() => setOpenAddAllowance(false)} variant='contained' color='error' className='custom-roundbutton'>Cancel</Button>
                    </Grid>
                </Grid>
            </SmallModal>
        </Fragment>
    </>
    )
}