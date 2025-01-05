import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import SaveSvg from '../../../../assets/img/savesvg.svg'

export const getEducationalBackground = (id, setState, controller, setPageTotal, perPage, setTableData, setDefaultState, setLoader) => // get/fetch educational background and initialized the state
{
    axios.post(`/api/pds/education/getEmployeeEducation`, { id: id }, { signal: controller.signal })
        .then(res => {
            setLoader(true)
            Swal.close()
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

export const getEducationUpdates = (id, setState, controller, setPageTotal, perPage, setTableData, setUpdates, setDefaultState, setLoader) => {
    axios.post(`/api/pds/education/getEducationUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            setLoader(true)
            Swal.close()
            if (res.status === 200) {
                setState(res.data.education)
                setDefaultState(res.data.education)
                let newArr = res.data.education.slice(0, perPage)
                setTableData(newArr)
                setUpdates(res.data.updates)
                setPageTotal(res.data.education.length)
            }
        })
        .catch(err => {
            toast.error(err.message)
        })
}

export const deleteChildLocal = (row, index, educationRecord, setEducationRecord, education, setEducation, tableData, setTableData) => { // marked item to be deleted
    Swal.fire({
        title: 'Mark as deleted',
        icon: 'warning',
        html: "This row will be <span style='color:red'>marked as deleted!</span> <br/> click the <span style='color:red'>'submit update'</span>  button to commit changes!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'continue'
    }).then((result) => {
        if (result.isConfirmed) {
            let newEducation = education.map(item => {
                if (item.id === row.id) {
                    return { ...item, isDelete: true }
                }
                else {
                    return item
                }
            })

            let newTableData = tableData.map(item => {
                if (item.id === row.id) {
                    return { ...item, isDelete: true }
                }
                else {
                    return item
                }
            })

            let newEducationRecord = educationRecord.map(item => item)
            newEducationRecord.push({
                id: row.id,
                rowId: row.id,
                status: 3,
            })
            setTableData(newTableData)
            setEducation(newEducation)
            setEducationRecord(newEducationRecord)
        }
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
        allowOutsideClick: false,
    })
    Swal.showLoading()
    let recordArray = []
    record.map((item) => {
        for (let [key, value] of Object.entries(item)) {
            if (key === 'status' || key === 'rowId') {
                continue
            }
            else {
                recordArray.push({
                    table_field: key,
                    value: value,
                    rowId: item.rowId,
                    status: item.status,
                })
            }
        }
    })

    // console.log(recordArray)
    axios.post(`/api/pds/education/updateEmployeeEducation`, {
        id: id,
        record: recordArray
    })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                toast.success('Changes added! please wait for the confirmation.')
                setState(defaultState)
                let newTableData = defaultState.slice(0, perPage)
                setPageTotal(defaultState.length)
                setPage(1)
                setTableData(newTableData)
                setRecord([])
            }
        })
        .catch(err => {
            Swal.close()
            toast.error('Something went wrong.')
            //console.log(err)
        })
}

// educ, education, setEducation, educationRecord, setEducationRecord, tableData, setTableData
export const handleUndo = (item, state, setState, record, setRecord, tableData, setTableData, defaultState,setPageTotal) => {
    //console.log('rerender handleUndo')
    if (item.isNew) {
        //console.log(item, state, record, tableData)
        let undoState = state.filter(stateItem => stateItem.rowId ? stateItem.rowId !== item.rowId : stateItem.id !== item.rowId)
        let undoTableData = tableData.filter(tableItem => tableItem.rowId ? tableItem.rowId !== item.rowId : tableItem.id !== item.rowId)
        // let newArr = undoState.slice(0, 10)
        let removeRecord = record.filter((recordItem) => item.rowId !== recordItem.rowId)
        setPageTotal(prev => prev - 1)
        setState(undoState)
        setTableData(undoTableData)
        setRecord(removeRecord)
    }
    else if (item.isDelete) {
        //console.log('deleted')
        //console.log(item, state)
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
                    datefrom: nDefault[0].datefrom,
                    dateto: nDefault[0].dateto,
                    degreecrouse: nDefault[0].degreecrouse,
                    elevel: nDefault[0].elevel,
                    file_path: nDefault[0].file_path,
                    gradelevel: nDefault[0].gradelevel,
                    honor: nDefault[0].honor,
                    nschool: nDefault[0].nschool,
                    order: nDefault[0].order,
                    yeargrad: nDefault[0].yeargrad,
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
                    datefrom: nDefault[0].datefrom,
                    dateto: nDefault[0].dateto,
                    degreecrouse: nDefault[0].degreecrouse,
                    elevel: nDefault[0].elevel,
                    file_path: nDefault[0].file_path,
                    gradelevel: nDefault[0].gradelevel,
                    honor: nDefault[0].honor,
                    nschool: nDefault[0].nschool,
                    order: nDefault[0].order,
                    yeargrad: nDefault[0].yeargrad
                }

            }
            return x
        })
        setState(nState)
    }
}

// tableUpdates

// export const handleConfirmAdded = (table_name,employee_id, row_index, status,setState) => {
//     //console.log(employee_id, row_index, status)
//     axios.post(`/api/pds/education/confirmAdded`, {
//         table_name: table_name,
//         employee_id: employee_id,
//         row_index: row_index,
//         status: status
//     })
//         .then(res => //console.log(res))
//         .catch(err => //console.log(err.message))
// }