import axios from 'axios'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import ProcessSvg from '../../../../assets/img/processsvg.svg'
import { APILoading } from '../../apiresponse/APIResponse'

export const getEmployeePersonal = (id, setState) => {
    axios.post(`/api/pds/personal/getEmployeePersonal`, { id: id })
        .then(res => {
            setState(res.data)
        })
        .catch(err => {
            toast.error(err.message)
        })
}

export const handleUpdate = (id, toUpdate, personal, reffs, handleReload) => {
    Swal.fire({
        text: 'Submitting updates, please wait . . . ',
        icon: 'info',
        allowOutsideClick: false,
    })
    Swal.showLoading()
    let covertObjectToArray = []
    for (let [key, value] of Object.entries(toUpdate)) {
        covertObjectToArray.push({
            table_field: key,
            value: value,
            status: 0
        })
    }
    // console.log(covertObjectToArray)
    axios.post(`/api/pds/personal/employeePersonalUpdate`, {
        id: id,
        personalInfo: covertObjectToArray
    })
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                toast.success('Changes submitted, please wait for approval of changes!')
                Swal.fire(
                    {
                        text: 'Fetching updates, please wait . . . ',
                        icon: 'info',
                        allowOutsideClick: false,
                    }
                )
                Swal.showLoading()
                handleReload()
                reffs.lname.current.value = personal.lname
                reffs.fname.current.value = personal.fname
                reffs.mname.current.value = personal.mname
                reffs.extname.current.value = personal.extname
                reffs.dob.current.value = personal.dob
                reffs.baddress.current.value = personal.baddress
                reffs.sex.current.value = personal.sex
                reffs.civilstatus.current.value = personal.civilstatus
                reffs.citizenship.current.value = personal.citizenship
                reffs.height.current.value = personal.height
                reffs.weight.current.value = personal.weight
                reffs.bloodtype.current.value = personal.bloodtype
                reffs.gsisno.current.value = personal.gsisno
                reffs.pag_ibig.current.value = personal.pag_ibig
                reffs.tin.current.value = personal.tin
                reffs.philhealth.current.value = personal.philhealth
                reffs.sssno.current.value = personal.sssno
                reffs.telno.current.value = personal.telno
                reffs.cpno.current.value = personal.cpno
                reffs.emailadd.current.value = personal.emailadd
                // utrohonon 
                // reffs.radProvince.current.value = personal.radProvince
                // reffs.radCity.current.value = personal.radCity
                // reffs.radBrgy.current.value = personal.radBrgy
                reffs.radVillage.current.value = personal.radVillage
                reffs.radStreet.current.value = personal.radStreet
                reffs.radUnit.current.value = personal.radUnit
                reffs.radZip.current.value = personal.radZip
                // reffs.padProvince.current.value = personal.padProvince
                // reffs.padCity.current.value = personal.padCity
                // reffs.padBrgy.current.value = personal.padBrgy
                // reffs.padVillage.current.value = personal.padVillage
                // reffs.padStreet.current.value = personal.padStreet
                // reffs.padUnit.current.value = personal.padUnit
                // reffs.padZip.current.value = personal.padZip
            }
        })
        .catch(err => {
            Swal.close()
            toast.error(err.message)
        })
}

export const employeePersonalwithUpdate = (id, setState, setPersonalWithUpdates, controller) => {
    axios.post(`/api/pds/personal/employeePersonalwithUpdate`, { id: id }, { signal: controller.signal })
        .then(res => {
            if (res.data.status === 200) {
                Swal.close()
                setState(res.data.personalInfo)
                setPersonalWithUpdates(res.data.updates)
            }
        })
        .catch(err => {
            toast.error(err.message)
            Swal.close()

        })
}

// function to get data from lyxs table and hris_employee
export const getEmploymentStatus = (id, setState) => {
    axios.post(`/api/pds/personal/getJointTableForEmploymentStatus`, { id: id })
        .then(res => {
            if (res.data.status === 200) {
                setState(res.data.employee_employment_info)
            }
        })
        .catch(err => {
            toast.error(err.message)
        })
}

export const confirmUpdate = (toUpdateState, toCompare, setToCompare, handleCloseModal, personal, setPersonal) => {
    // console.log(typeof(toUpdateState.reff))
    // return
    Swal.fire({
        title: 'Processing request . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`/api/pds/personal/employeePersonalConfirmUpdate2`, toUpdateState.data)
        .then(res => {
            Swal.close()
            if (res.data.status === 200) {
                // bag o g add
                if (typeof (toUpdateState.reff) === 'function') { // check if the reff passed is function, means from address
                    toUpdateState.reff(toUpdateState.data.new_value)
                    setPersonal({ ...personal, [toUpdateState.data.table_field]: toUpdateState.data.new_value })
                }
                else {
                        toUpdateState.reff.current.value = toUpdateState.data.new_value
                }

                // 
                let newToCompare = Object.assign({}, toCompare)
                delete newToCompare[toUpdateState.data.table_field]
                setToCompare(newToCompare)
                toast.success('Field confirmed and updated!')
                handleCloseModal()
            }
        })
        .catch(err => {
            Swal.close()
            // console.log(err.message)
            toast.success('Error' + err.message)
        })
}

export const continueUpdateToLyxs = (data) => {
    let params = {
        key: "b9e1f8a0553623f1:639a3e:17f68ea536b",
        empNo: data.emp_no,
        firstName: data.fname,
        middleName: data.mname,
        lastName: data.mname,
        dateHired: data.date_hired,
        birthDate: data.dob,
        birthPlace: data.baddress,
        sex: data.sex,
        civilStatus: data.civilstatus,
        resAdd: data.radUnit + ',' + data.radStreet + ',' + data.radVillage + ',' + data.radBrgy + ',' + data.radCity + '' + data.radProvince,
        perAdd: data.padUnit + ',' + data.padStreet + ',' + data.padVillage + ',' + data.padBrgy + ',' + data.padCity + '' + data.padProvince,
        TIN: data.tin,
        pagibigNo: data.pagibig_no,
        phicNo: data.philhealth,
        emailAdd: data.emailadd,
        mobileNo: data.cpno
    }
    Swal.fire({
        text: 'Connecting to Lyxs Server, Please wait . . .',
        icon: 'info'
    })
    Swal.showLoading()
    axios.post(`https://test.butuan.gov.ph/joe_test_api/HRIS/api/procUpdEmp`, params)
        .then(res => {
            Swal.close()
        })
        .catch(err => {
            Swal.close()
        })
}
export const fetchMetaTags = (setMetaTagsData, setMetaTags, setDefaultMetaTags,id) => {
    axios.get('/api/metatags/getMetaTagsData')
    .then(res=>{
        setMetaTagsData(res.data)
        let data = {
            id:id
        }
        axios.post('/api/metatags/getEmpMetaTagsData',data)
        .then(res2=>{
            setMetaTags(res2.data.data.meta_tags)
            let temp = res2.data.data.meta_tags.split(',');
            let arr = res.data.filter(el=>temp.includes(el.meta_name))
            setDefaultMetaTags(arr)
        })
    }).catch(err=>{
        console.log(err)
    })
}

export const submitUpdateMetaTags = (selectedMetaTags,setMetaTags,handleCloseUpdateMetaTags,metaTagsData, setDefaultMetaTags) => {
    if(selectedMetaTags.length>0){
        APILoading('info','Submitting update','Please wait...')
        /**
        convert array to text
        */
        let m_text = '';
        selectedMetaTags.forEach((el,index)=>{
            m_text=m_text+el.meta_name+',';
        })
        let new_m_text = m_text.slice(0,-1)
        let params = {
            data:new_m_text
        }
        axios.post('/api/metatags/updateEmpMetaTags',params)
        .then(res=>{
            console.log(res.data)
            if(res.data.status === 200){
                setMetaTags(m_text.slice(0,-1))
                handleCloseUpdateMetaTags()
                let temp = new_m_text.split(',');
                let arr = metaTagsData.filter(el=>temp.includes(el.meta_name))
                setDefaultMetaTags(arr)
                Swal.fire({
                    icon:'success',
                    title:res.data.message
                })
            }else if(res.data.status === 300){
                Swal.fire({
                    icon:'warning',
                    title:res.data.message
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:res.data.message
                })
            }
        }).catch(err=>{
            console.log(err)
            Swal.close()
        })
    }else{
      Swal.fire({
        icon:'warning',
        title:'Oops...',
        html:'Please select atleast 1 meta tags'
      })
    }
}
