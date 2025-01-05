import axios from "axios";
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

export function updateUserPassword(data) {
    return axios.request({
        method: 'POST',
        url: '/api/updateUserPassword',
        data: {
            data: data
        }
    })
}

export const getUserProfile = (setProfile, setLoader) => {
    axios.post(`/api/userprofile/getUserProfile`)
        .then(res => {
            if (res.data.status === 200) {
                setProfile(res.data.profile)
                setLoader(false)
            }
        })
        .catch(err => {
            setLoader(false)
        })
}
export const convertTo64 = (file) => { // converter for file to base 64 string
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = error => reject(error);
    });
}

export const getPic = (setPic) => {
    axios.post(`/api/userprofile/getProfilePic`, {}, { responseType: 'blob' })
        .then(res => {
            if (res.data.size === 1 && res.data.type === 'text/html') {
                toast.warning('Profile Picture not found!')
            }
            else if (res.data.status === 500) {
            }
            else if (res.data.type === 'application/json') {
                toast.warning('Profile Picture not found!')
            }
            else {
                const url = URL.createObjectURL(res.data);
                setPic(url)
            }
        })
        .catch(err => {
            toast.warning('Profile Picture not found!')
        })
}

export const handleUpdatePicture = async (file, setPic, setFile) => {
    let formData = new FormData()
    formData.append('profile_pic', file)
    Swal.fire({
        text: 'Updating profile picture . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/userprofile/updateProfilePicture`, formData, {
        responseType: 'blob'
    })
        .then((res) => {
            Swal.close()
            if (res.status === 200) {
                toast.success('Profile picture updated!')
                const url = URL.createObjectURL(res.data);
                setPic(url)
                setFile('')
            }
            if (res.status === 500) {
                toast.error(res.data)
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

