import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

let controller = new AbortController();

export const handleSendNotif = (listCandidates, prfData, closeModal, url) => {
    if (listCandidates.length === 0) {
        toast.warning('Please select applicant as recepient!')
        return
    }

    sendingNotif(listCandidates, prfData, closeModal, url);
}

const sendingNotif = async (list, prfData, closeModal, url) => {
    Swal.fire({
        title: 'Loading...',
        icon: "info",
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });
    try {
        let res = await axios.post(url, { candidates: list, prf_data: prfData }, { signal: controller.signal })
        if (res.data.status === 500) {
            return toast.error(res.data.message)
        }

        if (res.data.status === 500) { toast.error(res.data.message) }
        if (res.data.status === 200) {
            // let toFilter = [...defaultEmployee]
            // res.data.sent_ids.forEach(element => {
            //     let index = toFilter.findIndex(x => x.applicant_id === element)
            //     toFilter.splice(index, 1)
            // });
            // let newEmp = employee.map((x) => res.data.sent_ids.some(y => x.applicant_id === y) ? ({ ...x, review_notif: 1 }) : x)
            // setEmployee(newEmp)
            // if (res.data.failed_ids.length > 0) {
            //     toast.error('Some notification were not sent!')
            // }

            // closeModal(); // → close or handle actions
        }
    } catch (error) {
        console.error("Error sending notification to candidates:", error);
    } finally {
        Swal.close();
    }
}