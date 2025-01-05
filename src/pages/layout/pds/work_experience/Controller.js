import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import React, { useCallback, useMemo } from 'react'
import SaveSvg from '../../../../assets/img/savesvg.svg'

// fetch data
export const getWorkExperience = (id, setState, controller, setPageTotal, perPage, setTableData, setDefaultState, setLoader) => {
    axios.post(`/api/pds/workexperience/getEmployeeWorkExp`, { id: id }, { signal: controller.signal })
        .then(res => {
            //console.log(res)
            setLoader(true)
            if (res.status === 200) {
                setState(res.data)
                setDefaultState(res.data)
                let newArr = res.data.slice(0, perPage)
                setTableData(newArr)
                setPageTotal(res.data.length)
            }
        })
        .catch(err => {
            toast.error(err.message)
        })
}

export const getWorkExperienceUpdates = (id, setState, controller, setPageTotal, perPage, setTableData, setUpdates, setDefaultState, setLoader) => {
    axios.post(`/api/pds/workexperience/getWorkExperienceUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            Swal.close()
            setLoader(true)
            if (res.status === 200) {
                setState(res.data.work_experience)
                setDefaultState(res.data.work_experience)
                let newArr = res.data.work_experience.slice(0, perPage)
                setTableData(newArr)
                setUpdates(res.data.updates)
                setPageTotal(res.data.work_experience.length)
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const handleUpdate = (id, record, setRecord, setState, defaultState, setTableData, perPage, setPage,setPageTotal) => { // update button clicked, to add the changes to hris info update table
    if (record.length === 0) {
        toast.warning('No Changes found!')
        return
    }
    Swal.fire({
        title: 'Submitting update . . .',
        icon: 'info',
        // allowOutsideClick: false,
    })
    Swal.showLoading()
    let recordArray = []
    record.map((item) => {
        for (let [key, value] of Object.entries(item)) {
            if (key === '_status' || key === 'rowId') {
                continue
            }
            else {
                recordArray.push({
                    table_field: key,
                    value: value,
                    rowId: item.rowId,
                    _status: item._status,
                })
            }
        }
    })

    axios.post(`/api/pds/workexperience/updateEmployeeWorkExperience`, {
        id: id,
        record: recordArray
    })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                toast.success('Changes added! please wait for the confirmation.')
                setState(defaultState)
                let newTableData = defaultState.slice(0, perPage)
                setPage(1)
                setTableData(newTableData)
                setRecord([])
                setPageTotal(defaultState.length)
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const handleDeleteLocal = (row, index, record, setRecord, data, setData, tableData, setTableData) => { // marked item to be deleted
    Swal.fire({
        title: 'Mark as deleted',
        html: "This row will be <span style='color:red'>marked as deleted!</span> <br/> click the <span style='color:red'>'submit update'</span>  button to commit changes!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'continue'
    }).then((result) => {
        if (result.isConfirmed) {
            let newData = data.map(item => {
                if (item.id === row.id) {
                    return { ...item, isDelete: true }
                }
                else {
                    return item
                }
            })
            let newTableData = tableData.map((item) => {
                if (item.id === row.id) {
                    return { ...item, isDelete: true }
                }
                else {
                    return item
                }
            })

            let newRecord = record.map(item => item)
            newRecord.push({
                id: row.id,
                rowId: row.id,
                _status: 3,
            })
            setData(newData)
            setTableData(newTableData)
            setRecord(newRecord)
        }
    })
}


export const handleUndo = (item, state, setState, record, setRecord, tableData, setTableData, defaultState, setPageTotal) => {
    if (item.isNew) {
        
        let undoState = state.filter(stateItem => stateItem.rowId ? stateItem.rowId !== item.rowId : stateItem.id !== item.rowId)
        let undoTableData = tableData.filter(tableItem => tableItem.rowId ? tableItem.rowId !== item.rowId : tableItem.id !== item.rowId)
        // let newArr = undoState.slice(0, 10)
        let removeRecord = record.filter((recordItem) => item.rowId !== recordItem.rowId)

        // console.log(undoState)
        // return
        setState(undoState)
        setTableData(undoTableData)
        setRecord(removeRecord)
        setPageTotal(prev => prev - 1)
    }
    else if (item.isDelete) {
        let undoState = state.map(itemState => {
            if (itemState.id === item.id) {
                return { ...itemState, isDelete: false }
            }
            else {
                return { ...itemState }
            }
        })

        let undoTableData = tableData.map(tableDataState => {
            if (tableDataState.id === item.id) {
                return { ...tableDataState, isDelete: false }
            }
            else {
                return { ...tableDataState }
            }
        })
        let removeRecord = record.filter((recordItem) => item.id !== recordItem.id)
        setState(undoState)
        setTableData(undoTableData)
        setRecord(removeRecord)
    }
    else if (item.isUpdated) {
        let nRecord = record.filter(x => x.rowId !== item.id) // filter the record, take out the data with the id of current item
        setRecord(nRecord)
        let nDefault = defaultState.filter(x => x.id === item.id) // filter only the of that item
        let nTableData = tableData.map(x => { // change table isUpdated object, to get rid of the yellow background
            if (x.id === item.id) {
                return {
                    ...x,
                    agency: nDefault[0].agency,
                    datefrom: nDefault[0].datefrom,
                    dateto: nDefault[0].dateto,
                    file_path: nDefault[0].file_path,
                    govt: nDefault[0].govt,
                    positiontitle: nDefault[0].positiontitle,
                    salary: nDefault[0].salary,
                    salgrade: nDefault[0].salgrade,
                    status: nDefault[0].status,
                    work_experience_sheet: nDefault[0].work_experience_sheet,
                    isUpdated: false
                }
            }
            return x
        })

        setTableData(nTableData)
        let nState = state.map(x => {
            if (x.id === item.id) {
                return {
                    ...x,
                    agency: nDefault[0].agency,
                    datefrom: nDefault[0].datefrom,
                    dateto: nDefault[0].dateto,
                    file_path: nDefault[0].file_path,
                    govt: nDefault[0].govt,
                    positiontitle: nDefault[0].positiontitle,
                    salary: nDefault[0].salary,
                    salgrade: nDefault[0].salgrade,
                    status: nDefault[0].status,
                }

            }
            return x
        })
        setState(nState)
    }
}