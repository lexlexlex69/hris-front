import axios from "axios";
import Swal from "sweetalert2";
import { encryptFile } from "../pages/layout/fileencrypt/FileEncrypt";
export const viewFileAPI = async (id,name) =>{
    // var file_id = data;
    var data2 = {
        id:encryptFile(id)
    }
    Swal.fire({
        icon:'info',
        title:'Loading file',
        html:'Please wait...'
    })
    Swal.showLoading();
    return await axios({
        // url: 'api/fileupload/viewFile/'+file_id, //your url
        url: 'api/fileupload/viewFile', //your url
        method: 'POST',
        data:data2,
        responseType: 'blob', // important
    }).then((response) => {
        // console.log(response.data)
        Swal.close();
        // console.log(response.data)
        const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
        const link = document.createElement('a');
        link.href = url;
        if(response.data.type === 'application/pdf' || response.data.type === 'image/jpeg'){
            // link.download = name;
        }else{
            link.download = name;
        }
        link.setAttribute('target', '_BLANK'); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }).catch(err=>{
        Swal.close();
        console.log(err)
    });
}
// export const preViewFileAPI = (id) =>{
//     var file_id = id;
//     axios({
//         url: 'api/fileupload/viewFile/'+file_id, //your url
//         method: 'GET',
//         responseType: 'blob', // important
//     }).then((response) => {
//         const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
//         // document.querySelector('#previewpdf').src = url;
//         return url;
//     }).catch(err=>{
//         console.log(err)
//     });
// }
export const preViewFileAPI = async (id)=>{
    // var file_id = data;
    var data2 = {
        id:encryptFile(id)
    }
    Swal.fire({
        icon:'info',
        title:'Loading file',
        html:'Please wait...'
    })
    Swal.showLoading();
    return await axios.request({
        // url: 'api/fileupload/viewFile/'+file_id, //your url
        url: 'api/fileupload/viewFile', //your url
        method: 'POST',
        data:data2,
        responseType: 'blob', // important
    }).then((response) => {
        Swal.close();
        // console.log(response.data)
        const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
        return url;

    }).catch(err=>{
        Swal.close();
        console.log(err)
    });
}
export const newPreViewFileAPI = async (id)=>{
    // var file_id = data;
    var data2 = {
        id:encryptFile(id)
    }
    Swal.fire({
        icon:'info',
        title:'Loading file',
        html:'Please wait...'
    })
    Swal.showLoading();
    return await axios.request({
        // url: 'api/fileupload/viewFile/'+file_id, //your url
        url: 'api/fileupload/viewFile', //your url
        method: 'POST',
        data:data2,
        responseType: 'blob', // important
    }).then((response) => {
        Swal.close();
        console.log(response.data)
        const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
        var t_data = {
            url:url,
            type:response.data.type
        }
        return t_data;

    }).catch(err=>{
        Swal.close();
        console.log(err)
    });
}
export const getFileAPI = async (id)=>{
    // var file_id = data;
    var data2 = {
        id:encryptFile(id)
    }
    // Swal.fire({
    //     icon:'info',
    //     title:'Loading file',
    //     html:'Please wait...'
    // })
    // Swal.showLoading();
    return await axios.request({
        // url: 'api/fileupload/viewFile/'+file_id, //your url
        url: 'api/fileupload/viewFile', //your url
        method: 'POST',
        data:data2,
        responseType: 'blob', // important
    }).then((response) => {
        Swal.close();
        // console.log(response.data)
        const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
        return url;

    }).catch(err=>{
        Swal.close();
        console.log(err)
    });
}