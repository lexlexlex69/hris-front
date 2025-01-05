import axios from 'axios'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'

export const getEmployeeReferences = (id,setState,controller,setDefaultState,setLoader) => {
    axios.post(`api/pds/others/getEmployeeReferences`,{id:id})
    .then( res => {
        setLoader(true)
        Swal.close()
        if(res.data.status === 200)
        {
            setState(res.data.references)
            setDefaultState(res.data.references)
        }
    })
    .catch(err => {
        toast.error(err.message)
    })
}

export const getReferencesUpdates = (id,setState,controller,setUpdates,setDefaultState,setLoader,setCounter) => 
{
    axios.post(`/api/pds/others/getReferencesUpdates`,{id:id},{signal:controller.signal})
    .then(res => {
        setLoader(true)
        Swal.close()
        setState(res.data.references)
        setCounter(res.data.references.length)
        setDefaultState(res.data.references)
        setUpdates(res.data.updates)
    })
    .catch(err => {
        toast.error(err.message)
    })
}


export const handleDeleteLocal = (row, index, record, setRecord, data, setData,setCounter) => {
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
            let newRecord = record.map(item => item)
            newRecord.push({
                id: row.id,
                rowId: row.id,
                status: 3,
            })
            setData(newData)
            setRecord(newRecord)
            setCounter(prev => prev - 1)
        }
    })
}

export const handleUpdate = (id, record, setRecord,setState,defaultState) => {
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
    axios.post(`/api/pds/others/updateEmployeeReferences`, {
        id: id,
        record: recordArray
    })
        .then(res => {
            Swal.close()
            // console.log(res)
            if (res.data.status === 200) {
                toast.success('Changes added! please wait for the confirmation.')
                setState(defaultState)
                setRecord([])
            }
        })
        .catch(err => {
            Swal.close()
            toast.error('Something went wrong.')
            //console.log(err)
        })
} 


export const handleUndo = (item, state, setState, record, setRecord,defaultState,setCounter) => {
    if (item.isNew) {
        let undoState = state.filter(stateItem => stateItem.rowId ? stateItem.rowId !== item.rowId : stateItem.id !== item.rowId)
        let removeRecord = record.filter((recordItem) => item.rowId !== recordItem.rowId)
        setState(undoState)
        setRecord(removeRecord)
        setCounter(prev => prev - 1)
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
        let removeRecord = record.filter((recordItem) => item.id !== recordItem.id)
        setState(undoState)
        // setTableData(undoTableData)
        setRecord(removeRecord)
        setCounter(prev => prev + 1)
    }
    else if (item.isUpdated) {
        let nRecord = record.filter(x => x.rowId !== item.id) // filter the record, take out the data with the id of current item
        setRecord(nRecord)
        let nDefault = defaultState.filter(x => x.id === item.id) // filter only the of that item
        let nState = state.map(x => {
            if (x.id === item.id) {
                return {
                    ...x,
                    RefAddress: nDefault[0].RefAddress,
                    RefName: nDefault[0].RefName,
                    RefTel: nDefault[0].RefTel,
                    isUpdated: false
                }

            }
            return x
        })
        setState(nState)
    }
}