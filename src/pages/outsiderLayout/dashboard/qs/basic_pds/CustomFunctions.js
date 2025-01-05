import axios from "axios";
import { toast } from 'react-toastify'
import Swal from "sweetalert2";

export const handleViewFile = (id, url) => { // when view attach file is clicked,
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/recruitment/${url}`, {
        id: id
    },
        {
            responseType: 'blob'
        }
    )
        .then(res => {
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const handleViewFileTest = (id, url) => { // when view attach file is clicked,
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/recruitment/${url}`, {
        id: id
    },
    )
        .then(res => {
            // const url = URL.createObjectURL(fileBlob);
            const link = document.createElement('a');
            link.href = res.data;
            link.setAttribute('target', res.data); //or any other extension
            document.body.appendChild(link);
            link.click();
            return
            Swal.close()
            if (res.data.type === 'image/png' || res.data.type === 'image/jpg' || res.data.type === 'image/jpeg') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: res.data.type === 'image/png' ? 'image/png' : res.data.type === 'image/jpg' ? 'image/jpg' : res.data.type === 'image/jpeg' ? 'image/jpeg' : '' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }
            else if (res.data.type === 'application/pdf') {
                const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('target', res.data.name); //or any other extension
                document.body.appendChild(link);
                link.click();
            }

        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}