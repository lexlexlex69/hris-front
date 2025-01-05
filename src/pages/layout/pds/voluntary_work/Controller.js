import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import SaveSvg from '../../../../assets/img/savesvg.svg'


export const getEmployeeVoluntary = (id, setState, controller, setPageTotal, perPage, setTableData, setDefaultState, setLoader) => {
    axios.post(`/api/pds/voluntary/getEmployeeVoluntary`, { id: id }, { signal: controller.signal })
        .then(res => {
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

export const getVoluntaryUpdates = (id, setState, controller, setPageTotal, perPage, setTableData, setUpdates, setDefaultState, setLoader) => {
    axios.post(`/api/pds/voluntary/getVoluntaryUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            setLoader(true)
            Swal.close()
            if (res.status === 200) {
                setState(res.data.voluntary)
                setDefaultState(res.data.voluntary)
                let newArr = res.data.voluntary.slice(0, perPage)
                setTableData(newArr)
                setUpdates(res.data.updates)
                setPageTotal(res.data.voluntary.length)
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const handleDeleteLocal = (row, index, record, setRecord, data, setData, tableData, setTableData) => {
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
                status: 3,
            })
            setTableData(newTableData)
            setData(newData)
            setRecord(newRecord)
        }
    })
}

export const handleUpdate = (id, record, setRecord, setState, defaultState, setTableData, perPage, setPage,setPageTotal) => {
    //console.log('adasd')
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

    //console.log(recordArray)
    axios.post(`/api/pds/voluntary/updateEmployeeVoluntary`, {
        id: id,
        record: recordArray
    })
        .then(res => {
            Swal.close()
            //console.log(res)
            if (res.data.status === 200) {
                toast.success('Changes added! please wait for the confirmation.')
                setState(defaultState)
                let newTableData = defaultState.slice(0, perPage)
                setPage(1)
                setPageTotal(defaultState.length)
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

export const handleUndo = (item, state, setState, record, setRecord, tableData, setTableData, defaultState,setPageTotal) => {
    //console.log('rerender handleUndo')
    if (item.isNew) {
        //console.log(item, state, record, tableData)
        let undoState = state.filter(stateItem => stateItem.rowId ? stateItem.rowId !== item.rowId : stateItem.id !== item.rowId)
        let undoTableData = tableData.filter(tableItem => tableItem.rowId ? tableItem.rowId !== item.rowId : tableItem.id !== item.rowId)
        let newArr = undoState.slice(0, 10)
        let removeRecord = record.filter((recordItem) => item.rowId !== recordItem.rowId)
        setPageTotal(prev => prev - 1)
        setState(undoState)
        setTableData(newArr)
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
                    file_path: nDefault[0].file_path,
                    nohrs: nDefault[0].nohrs,
                    organization: nDefault[0].organization,
                    positionwork: nDefault[0].positionwork,
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
                    file_path: nDefault[0].file_path,
                    nohrs: nDefault[0].nohrs,
                    organization: nDefault[0].organization,
                    positionwork: nDefault[0].positionwork,
                }

            }
            return x
        })
        setState(nState)
    }
}