import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { checkChangedInputs, filterFalsyValues } from '../../customFunctions/CustomFunctions'
import ProcessSvg from '../../../../../assets/img/processsvg.svg'

export const getEmployeeGovId = (id, setState, controller, setLoader) => {
    axios.post(`/api/pds/others/getEmployeeGovId`, { id: id })
        .then(res => {
            if (res.data.status === 200) {
                if (res.data.govid.length > 0) {
                    setState(res.data.govid[0])
                }
                setLoader(true)
            }
        })
        .catch(err => {
            setLoader(false)
            toast.error(err.message)
            // console.log(err)
        })
}

export const getGidUpdates = (id, setGid, setToCompare, setLoader) => {
    axios.post(`/api/pds/others/getGidUpdates`, { id: id })
        .then(res => {
            // console.log('gid',res)
            if (res.data.status === 200) {
                if (res.data.govid.length > 0) {
                    setGid(res.data.govid[0])
                }
                setToCompare(res.data.updates)
                setLoader(true)
            }

        })
        .catch(err => {
            // console.log(err)
            setLoader(false)
            toast.error(err.message)
        })
}

export const handleUpdate = (id, reffs, defaults, setGid, setToCompare, setLoader) => {

    let filterFalsyValuesObj = {
        gov_id: checkChangedInputs(defaults.gov_id ? defaults.gov_id : '', reffs.gov_id.current.value),
        id_no: checkChangedInputs(defaults.id_no ? defaults.id_no : '', reffs.id_no.current.value),
        date_place_issuance: checkChangedInputs(defaults.date_place_issuance ? defaults.date_place_issuance : '', reffs.date_place_issuance.current.value)
    }
    let filteredInputs = filterFalsyValues(filterFalsyValuesObj)
    if (Object.keys(filteredInputs).length === 0) {
        toast.warning('Nothing to update')
        return
    }
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info',
        allowOutsideClick: false,
    })
    Swal.showLoading()
    let covertObjectToArray = []
    for (let [key, value] of Object.entries(filteredInputs)) {
        covertObjectToArray.push({
            table_field: key,
            value: value,
            status: 0
        })
    }

    axios.post(`/api/pds/others/updateEmployeeGid`, {
        id: id,
        gid: covertObjectToArray
    })
        .then(res => {
            Swal.close()
            //console.log(res)
            if (res.data.status === 200) {
                toast.success('Changes added! please wait for the confirmation.')
                reffs.gov_id.current.value = defaults.gov_id ? defaults.gov_id : ''
                reffs.id_no.current.value = defaults.id_no ? defaults.id_no : ''
                reffs.date_place_issuance.current.value = defaults.date_place_issuance ? defaults.date_place_issuance : ''

                // call get updates using params  [setGid,setToCompare,setLoader]
                getGidUpdates('', setGid, setToCompare, setLoader)
            }
            if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
    //console.log(covertObjectToArray)
}

export const handleConfirmUpdate = (toUpdate, handleClose, toCompare, setTCompare) => {
    Swal.fire({
        text: 'Updating Field . . .'
    })
    Swal.showLoading()
    axios.post(`/api/pds/others/confirmGidUpdates`, {
        data: toUpdate.new
    })
        .then(res => {
            Swal.close()
            // console.log(res)
            if (res.data.status === 200) {
                toast.success('Field Updated')
                toUpdate.reff.current.value = toUpdate.new.new_value
                let newObj = {}
                Object.assign(newObj, toCompare)
                delete newObj[toUpdate.new.table_field]
                setTCompare(newObj)
                Swal.close()
                handleClose()
            }
            else if (res.data.status === 500) {
                toast.success(res.data.message)
            }
        })
        .catch(err => {
            Swal.close()
            toast.error('Something went wrong!')
        })
}