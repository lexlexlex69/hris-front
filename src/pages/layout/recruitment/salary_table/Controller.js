import axios from "axios";
import Swal from "sweetalert2";
import { Toast, toast } from "react-toastify";

export const fetchSalaryTable = async (controller, setSalaryTable, year, setLoader) => {
    if (!year) {
        year = new Date().getFullYear()
    }
    setSalaryTable([])
    setLoader(true)
    try {
        const res = await axios.post(`/api/recruitment/salary-grade/fetchSalaryTable`, { year }, { signal: controller.signal })
        console.log(res)
        setLoader(false)
        setSalaryTable(res.data)
    }
    catch (err) {
        toast.error(err)
    }

}

export const filterYear = async (year, setYear, controller, setSalaryTable, setLoader) => {
    console.log(year)
    fetchSalaryTable(controller, setSalaryTable, year, setLoader)
    setYear(year)
}