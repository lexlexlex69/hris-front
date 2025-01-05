import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { convertTo64 } from '../../customFunctions/CustomFunctions'

export const getEmployeeEsig = (id, setState, controller) => {
    axios.post(`/api/pds/others/getEmployeeEsig`, { id: id })
        .then(res => {
            //console.log(res)
            if (res.data.status === 200) {
                setState(res.data)
                // img.current.src = 'data:' + res.data.mimeType + ';base64,' + res.data.path
            }
            if (res.data.status === 500) {
                setState({
                    file: '',
                    path: ''
                })
            }

            // let reader = new FileReader()
            // reader.readAsDataURL(res.data)
            // reader.onload = function () {
            //     img.current.src = reader.result
            // };

        })
        .catch(err => console.log(err))
}

export const handleUpdate = async (id, file, fileId, category,setFile) => {

    let to64 = ''
    let ext = ''
    if (file) {
        Swal.fire({
            title: 'Updating . . . ',
            icon: 'info'
        })
        Swal.showLoading()
        to64 = await convertTo64(file)
        ext = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1)
        let fileObj = {
            file_path: to64,
            ext: ext,
        }
        let recordArray = []
        for (let [key, value] of Object.entries(fileObj)) {
            if (key === 'status' || key === 'rowId') {
                continue
            }
            else {
                recordArray.push({
                    table_field: key,
                    value: value,
                    status: 0,
                    rowId: fileId ? fileId : 0
                })
            }
        }
        axios.post(`/api/pds/others/updateEmployeeEsig`, {
            id: id,
            category: category,
            fileObj: recordArray,
            fileId: fileId
        })
            .then(res => {
                Swal.close()
                //console.log(res)
                if (res.data.status === 200) {
                    toast.success('Changes added! please wait for the confirmation.')
                    setFile('')
                }
                if (res.data.status === 500) {
                    toast.error('Error.')
                }
            })
            .catch(err => {
                Swal.close()
                toast.error(err.message)
            })
    }
    else {
        toast.warning('No changes found!')
        Swal.close()
    }

}