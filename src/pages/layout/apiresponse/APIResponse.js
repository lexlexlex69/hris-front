import Swal from "sweetalert2";

export function APIresult(res){
    if(res.data.status === 200){
        Swal.fire({
            icon:'success',
            title:res.data.message
        })
    }else{
        Swal.fire({
            icon:'error',
            title:res.data.message
        })
    }
}
export function APILoading(icon,title,html){
    Swal.fire({
        icon:icon,
        title:title,
        html:html,
        showConfirmButton:false,
    })
    Swal.showLoading();
}