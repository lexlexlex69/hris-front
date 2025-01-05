import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { filterFalsyValues, checkChangedInputs } from '../customFunctions/CustomFunctions'

// controller for main functions of family background

export const getFamilyBackground = (id, setState, setLoader) => { // fetch family background
    axios.post(`/api/pds/getEmployeeFamily`, { id: id })
        .then(res => {
            if (res.data.status === 200) {
                setLoader(true)
                setState(res.data.family)
            }
        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
        })
}

export const getEmployeeWithUpdates = (id, setFamilyState, setUpdateState, setChildrenwithUpdates, setChildrenDefault, setDefaultState, setLoader, controller) => { // fetch family info with updates available
    axios.post(`/api/pds/getEmployeeWithUpdates`, { id: id }, { signal: controller.signal })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                setLoader(true)
                setFamilyState(res.data.family)
                setDefaultState(res.data.family)
                setUpdateState(res.data.updates)
                setChildrenwithUpdates(res.data.children)
                setChildrenDefault(res.data.family.children)
            }
        })
        .catch(err => {
            Swal.close()
            setLoader(false)
            toast.error(err.message)
        })
}

export const deleteChildLocal = (row, index, state, seState, children, setChildren) => { // mark deleted child as red
    Swal.fire({
        title: 'Mark as deleted',
        text: "This row will be marked as deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'continue'
    }).then((result) => {
        if (result.isConfirmed) {
            let newDelete = state.children.map(item => {
                if (item.id === row.id) {
                    return { ...item, isDelete: true }
                }
                else {
                    return { ...item }
                }
            })
            seState({ ...state, children: newDelete })

            let childToUpdate = children.map(item => item)
            childToUpdate.push({
                id: row.id,
                rowId: row.id,
                status: 3,
            })
            setChildren(childToUpdate)
        }
    })
}

export const handleSubmit = (id, toUpdate, setToUpdate, children, setChildren, familyState, setFamilyState, childrenDefault, defaultState, handleReloadTable) => {

    // 
    let tempFamilyState = Object.assign({}, defaultState)
    delete tempFamilyState.children
    let filterFalsyValuesObj = {
        spouse_surname: checkChangedInputs(tempFamilyState.spouse_surname, toUpdate.spouse_surname ? toUpdate.spouse_surname : tempFamilyState.spouse_surname),
        spouse_fname: checkChangedInputs(tempFamilyState.spouse_fname, toUpdate.spouse_fname ? toUpdate.spouse_fname : tempFamilyState.spouse_fname),
        spouse_mname: checkChangedInputs(tempFamilyState.spouse_mname, toUpdate.spouse_mname ? toUpdate.spouse_mname : tempFamilyState.spouse_mname),
        spouse_extn: checkChangedInputs(tempFamilyState.spouse_extn, toUpdate.spouse_extn ? toUpdate.spouse_extn : tempFamilyState.spouse_extn),
        // 
        occupation: checkChangedInputs(tempFamilyState.occupation, toUpdate.occupation ? toUpdate.occupation : tempFamilyState.occupation),
        employeer_name: checkChangedInputs(tempFamilyState.employeer_name, toUpdate.employeer_name ? toUpdate.employeer_name : tempFamilyState.employeer_name),
        emp_address: checkChangedInputs(tempFamilyState.emp_address, toUpdate.emp_address ? toUpdate.emp_address : tempFamilyState.emp_address),
        tel_no: checkChangedInputs(tempFamilyState.tel_no, toUpdate.tel_no ? toUpdate.tel_no : tempFamilyState.tel_no),
        // 
        father_mname: checkChangedInputs(tempFamilyState.father_mname, toUpdate.father_mname ? toUpdate.father_mname : tempFamilyState.father_mname),
        father_fname: checkChangedInputs(tempFamilyState.father_fname, toUpdate.father_fname ? toUpdate.father_fname : tempFamilyState.father_fname),
        father_surname: checkChangedInputs(tempFamilyState.father_surname, toUpdate.father_surname ? toUpdate.father_surname : tempFamilyState.father_surname),
        father_extn: checkChangedInputs(tempFamilyState.father_extn, toUpdate.father_extn ? toUpdate.father_extn : tempFamilyState.father_extn),
        mother_maiden: checkChangedInputs(tempFamilyState.mother_maiden, toUpdate.mother_maiden ? toUpdate.mother_maiden : tempFamilyState.mother_maiden),
        mother_lname: checkChangedInputs(tempFamilyState.mother_lname, toUpdate.mother_lname ? toUpdate.mother_lname : tempFamilyState.mother_lname),
        mother_fname: checkChangedInputs(tempFamilyState.mother_fname, toUpdate.mother_fname ? toUpdate.mother_fname : tempFamilyState.mother_fname),
        mother_mname: checkChangedInputs(tempFamilyState.mother_mname, toUpdate.mother_mname ? toUpdate.mother_mname : tempFamilyState.mother_mname),
    }
    let filteredInputs = filterFalsyValues(filterFalsyValuesObj)
    if (Object.keys(filteredInputs).length === 0 && children.length === 0) { // check if there are changes in inputs and children table
        toast.warning('Nothing to update!')
        return
    }
    Swal.fire({
        text: 'Submitting update . . . ',
        icon: 'info',
        // allowOutsideClick: false,
        // showCancelButton: true,
    })
    Swal.showLoading()
    let childrenArray = []
    if (children.length > 0) {
        children.map((item) => {
            for (let [key, value] of Object.entries(item)) {
                if (key === 'status' || key === 'rowId') {
                    continue
                }
                else {
                    if (item.status === 0) {
                        if (key === 'child_name') {
                            childrenArray.push({
                                table_field: key,
                                value: value,
                                rowId: item.rowId,
                                status: item.status,
                                old_value: item.child_old_value ? item.child_old_value : null
                            })
                        }
                        else if (key === 'dob') {
                            childrenArray.push({
                                table_field: key,
                                value: value.toString(),
                                rowId: item.rowId,
                                status: item.status,
                                old_value: item.dob_old_value ? item.dob_old_value : null
                            })
                        }
                    }
                    else {
                        childrenArray.push({
                            table_field: key,
                            value: value,
                            rowId: item.rowId,
                            status: item.status,
                        })
                    }

                }
            }
        })
    }

    let covertObjectToArray = []
    if (Object.keys(filteredInputs).length > 0) {
        for (let [key, value] of Object.entries(filteredInputs)) {
            covertObjectToArray.push({
                table_field: key,
                value: value
            })
        }
    }

    axios.post(`/api/pds/employeeFamilyUpdate`, {
        id: id,
        toUpdate: covertObjectToArray,
        children: childrenArray
    })
        .then(res => {
            if (res.data.status === 200) {
                Swal.close()
                toast.success('Update added, please wait for it to be approve!')
                setFamilyState({
                    children: [],
                    father_extn: '',
                    father_fname: '',
                    father_mname: '',
                    father_surname: '',
                    mother_surname: '',
                    mother_fname: '',
                    mother_lname: '',
                    mother_maiden: '',
                    mother_mname: '',
                    mother_extn: '',
                    spouse_extn: '',
                    spouse_fname: '',
                    spouse_mname: '',
                    spouse_surname: '',
                    occupation: '',
                    employeer_name: '',
                    emp_address: '',
                    tel_no: '',
                })
                setToUpdate({})
                handleReloadTable()
                setChildren([])
            }
        })
        .catch(err => {
            toast.error(err.message)
        })
}

export const confirmUpdate = (toConfirm, familyState, setFamilyState, withUpdates, setWithUpdates, handleClose) => {
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/family/employeeConfirmUpdate2`, toConfirm)
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                setFamilyState({ ...familyState, [toConfirm.table_field]: toConfirm.new_value })
                setWithUpdates({ ...withUpdates, [toConfirm.table_field]: null })
                toast.success('Field Updated!')
                handleClose()
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const handleUndo = (item, children, setChildren, familyState, setFamilyState, defaultState) => {
    if (item.isNew) {
        let removeChildren = familyState.children.filter(itemChildrenState => itemChildrenState.rowId ? itemChildrenState.rowId !== item.rowId : itemChildrenState.id !== item.rowId)
        let removeChildren2 = children.filter((itemChildren) => item.rowId !== itemChildren.rowId)
        setFamilyState({ ...familyState, children: removeChildren })
        setChildren(removeChildren2)
    }
    else if (item.isDelete) {
        let removeChildren = familyState.children.map(itemChildrenState => {
            if (itemChildrenState.id === item.id) {
                return { ...itemChildrenState, isDelete: false }
            }
            else {
                return { ...itemChildrenState }
            }
        })
        let removeChildren2 = children.filter((itemChildren) => item.id !== itemChildren.rowId)
        setFamilyState({ ...familyState, children: removeChildren })
        setChildren(removeChildren2)
    }
    else if (item.isUpdated) {
        let nDefault = defaultState.filter(x => x.id === item.id)
        let nChidren = children.filter(x => x.rowId !== item.id)
        let nFamilyChildren = familyState.children.map(x => {
            if (x.id === item.id) {
                return {
                    ...x,
                    child_name: nDefault[0].child_name,
                    dob: nDefault[0].dob,
                    isUpdated: false
                }
            }
            return x
        })
        setChildren(nChidren)
        setFamilyState({ ...familyState, children: nFamilyChildren })
    }
}
