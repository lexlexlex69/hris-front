import React, { useEffect, useState } from 'react';
import { addNewPayGroup, getNewPayGroup } from '../../SetupPayrollRequests';
import { Autocomplete, Button, Grid, TextField } from '@mui/material';
export const PayGroupNew = ({selectedPaySetup,cat}) => {
    const [paygroupList,setPaygroupList] = useState([])
    const [deptcodeList,setDeptcodeList] = useState([])
    const [paygroupListData,setDeptcodeListData] = useState([])
    const [selectedDept,setSelectedDept] = useState(null)
    const [selectedPayDept,setSelectedPayDept] = useState(null)
    useEffect(()=>{
        _getNewPayGroup();
    },[])
    const _getNewPayGroup = async () => {
        let t_data = {
                category:cat,
                pay_no:selectedPaySetup.payroll_no
        }
        const res = await getNewPayGroup(t_data)
        // const unique = [...new Set(res.data.data.map(item=>item.dept_code))];
        var seen = Object.create(null);

        var result = res.data.data.filter(o => {
            var key = ['dept_code'].map(k => o[k]).join('|');
            if (!seen[key]) {
                seen[key] = true;
                return true;
            }
        });
        setDeptcodeList(result)
        console.log(res.data)
        setPaygroupList(res.data.data)
    }
    useEffect(()=>{
        if(selectedDept){
            let filter = paygroupList.filter(el=>el.dept_code === selectedDept.dept_code)
            setDeptcodeListData(filter);
        }else{
            setDeptcodeListData([])
        }
    },[selectedDept])
    const handleSave = async () => {
        let t_data = {
            dept_code:selectedPayDept.dept_code,
            group_no:selectedPayDept.group_no,
            pay_no:selectedPaySetup.payroll_no,
            category:cat
        }
        const res = await addNewPayGroup(t_data)
        console.log(res.data)
    }
    return (
        <Grid container sx={{p:1}} spacing={1}>
            <Grid item xs={4}>
                <Autocomplete
                    disablePortal
                    id="combo-box-deptcodelist"
                    options={deptcodeList}
                    isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code }

                    // sx={{ width: 300 }}
                    value={selectedDept}
                    getOptionLabel={(option) => option.dept_desc}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                    onChange={(e,newVal)=>{
                        setSelectedDept(newVal)
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <Autocomplete
                    disablePortal
                    id="combo-box-paygrouplist"
                    options={paygroupListData}
                    value={selectedPayDept}
                    // sx={{ width: 300 }}
                    isOptionEqualToValue={(option, value) => option.dept_code === value.dept_code }
                    getOptionLabel={(option) => option.group_desc}
                    renderInput={(params) => <TextField {...params} label="Payroll Group" />}
                    onChange={(e,newVal)=>{
                        setSelectedPayDept(newVal)
                    }}
                />
            </Grid>
            <Grid item xs={4}>
                <Button variant='contained' onClick={handleSave}>Save</Button>
            </Grid>
        </Grid>    
    )
}