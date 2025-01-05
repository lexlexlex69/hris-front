import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import SaveSvg from '../../../../../assets/img/savesvg.svg'

export const getSpecialSkillsOthers = (id, setSpecialSkills, setRecognition, setOrganization, setLoader, controller, setSpecialSkillsDefault, setRecognitionDefault, setOrganizationDefault) => {
    axios.post(`/api/pds/others/getEmployeeOthers`, { id: id }, { signal: controller.signal })
        .then(res => {
            if (res.data.status === 200) {
                setLoader(true)
                let specialSkills = res.data.others.filter(item => item.typeid === 1)
                let recognition = res.data.others.filter(item => item.typeid === 2)
                let organization = res.data.others.filter(item => item.typeid === 3)
                setSpecialSkills(specialSkills)
                setSpecialSkillsDefault(specialSkills)
                setRecognition(recognition)
                setRecognitionDefault(recognition)
                setOrganization(organization)
                setOrganizationDefault(organization)
            }
        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
        })
}

export const getSpecialSkillsOthersUpdates = (id, setSpecialSkills, setRecognition, setOrganization, setLoader, controller, setUpdates, setSpecialSkillsDefault, setRecognitionDefault, setOrganizationDefault, setSpecialSkillsRecord, setRecognitionRecord, setOrganizationRecord) => {
    axios.post(`/api/pds/others/getEmployeeOthersUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                setLoader(true)
                let specialSkills = res.data.others.filter(item => item.typeid === 1)
                let recognition = res.data.others.filter(item => item.typeid === 2)
                let organization = res.data.others.filter(item => item.typeid === 3)
                setSpecialSkills(specialSkills)
                setSpecialSkillsDefault(specialSkills)
                setRecognition(recognition)
                setRecognitionDefault(recognition)
                setOrganization(organization)
                setOrganizationDefault(organization)
                setSpecialSkillsRecord([])
                setRecognitionRecord([])
                setOrganizationRecord([])
                setUpdates(res.data.updates)
            }
        })
        .catch(err => {
            Swal.close()
            setLoader(false)
            toast.error(err.message)
        })
}

export const handleUpdate = (id, record, setRecord, category, setState, defaultState) => {
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
                    type_id: category
                })
            }
        }
    })

    //console.log(recordArray)
    axios.post(`/api/pds/others/updateOthersTable`, {
        id: id,
        record: recordArray,
        category: category
    })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                toast.success('Changes added! please wait for the confirmation.')
                setState(defaultState)
                setRecord([])
            }
        })
        .catch(err => {
            Swal.close()
            toast.error('Something went wrong.')
        })
}

export const handleDeleteLocal = (row, index, record, setRecord, data, setData) => {
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
        }
    })
}

export const handleUndo = (item, state, setState, record, setRecord, defaultState) => {
    if (item.isNew) {
        let undoState = state.filter(stateItem => stateItem.rowId ? stateItem.rowId !== item.rowId : stateItem.id !== item.rowId)
        let removeRecord = record.filter((recordItem) => item.rowId !== recordItem.rowId)
        setState(undoState)
        setRecord(removeRecord)
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
        setRecord(removeRecord)
    }
    else if (item.isUpdated) {
        let nDefault = defaultState.filter(x => x.id === item.id)
        let nRecord = record.filter(x => x.rowId !== item.id)
        let nState = state.map(x => {
            if (x.id === item.id) {
                return {
                    ...x,
                    description: nDefault[0].description,
                    isUpdated: false
                }
            }
            return x
        })
        setRecord(nRecord)
        setState(nState)

    }
}