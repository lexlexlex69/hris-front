import axios from "axios";
import Swal from "sweetalert2";
import { toast } from 'react-toastify'

export const handleChangeStatus = async (obj, status, vacancyId, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop, setTransferReadyModal, appointed) => {
    if (status === 'RANKING') {
        if (status !== 'RANKING') {
            setStatusBackdrop(true)
        }
        let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
        if (status !== 'RANKING') {
            setStatusBackdrop(false)
        }
        if (res.status === 200) {
            handleVacancyStatusContext(vacancyId, status)
            if (status !== 'RANKING') {
                closeDialog()
            }
        }
        else if (res.status === 500) {
            closeDialog()
        }
    }
    // if status is for receiving of applicants
    else if (status === 'RECEIVING') {
        let emp = obj.empArr.filter((x) => x?.fname && x?.emailadd)
        let app = obj.appArr.filter((x) => x?.fname && x?.emailadd)
        let totalApplicants = emp.length + app?.length
        let toNotif = emp.length > 0 ? emp : app.length > 0 ? app : null

        if (toNotif?.length > 0)
            Swal.fire({
                title: 'Continue to next step',
                html: "<p> Some short listed applicants where not able to notify in this step : <br/>" + toNotif[0]?.fname + ' ' + toNotif[0]?.mname + ' ' + toNotif[0]?.lname + " and " + (totalApplicants - 1) + " other(s)...</p>",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setStatusBackdrop(true)
                    let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
                    handleVacancyStatusContext(vacancyId, status)
                    setStatusBackdrop(false)
                    closeDialog()
                }
            })
        else {
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
            handleVacancyStatusContext(vacancyId, status)
            setStatusBackdrop(false)
            closeDialog()
        }
    }

    // if status is for setting of examination
    else if (status === 'SET-EXAM') {
        let totalApplicants = obj.empArr?.length + obj.appArr?.length
        let toNotif = obj.empArr.filter((x) => x.review_notif === 0).length > 0 ? obj.empArr.filter((x) => x.review_notif === 0) : obj.appArr.filter((x) => x.review_notif === 0).length > 0 ? obj.appArr.filter((x) => x.review_notif === 0) : null
        let toNotifTotal = obj.empArr.filter((x) => x.review_notif === 0).length + obj.appArr.filter((x) => x.review_notif === 0).length
        let empRel = obj.empArr.filter((x) => !x.eval_education && !x.eval_experience && !x.eval_training)
        let appRel = obj.appArr.filter((x) => !x.eval_education && !x.eval_experience && !x.eval_training)
        let applicantRelevant = empRel.concat(appRel)
        if (toNotif?.length > 0 || applicantRelevant?.length > 0)
            Swal.fire({
                title: 'Continue to next step',
                html: toNotif?.length > 0 && applicantRelevant?.length > 0 ? "<p> Some short listed applicants where not able to notify in this step : <br/>" + toNotif[0]?.fname + ' ' + toNotif[0]?.mname + ' ' + toNotif[0]?.lname + " and " + (toNotifTotal - 1) + " other(s)... <br/></p>" + "<br/> <span style='color:'red''> Some applicants related to fitness are not set: </span> <br/> <br/>" + applicantRelevant?.map((item) => ('<span>' + item['fname'] + item['mname'] + item['lname'] + '<br/></span>')) : toNotif?.length > 0 ? "<p> Some short listed applicants where not able to notify in this step : <br/>" + toNotif[0]?.fname + ' ' + toNotif[0]?.mname + ' ' + toNotif[0]?.lname + " and " + (totalApplicants - 1) + " other(s)... " : applicantRelevant?.length > 0 ? "Some applicant's 'related to fitness' are not set: </span> <br/> <br/>" + applicantRelevant?.map((item) => ('<span>' + item['fname'] + item['mname'] + item['lname'] + '<br/></span>')) : null,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setStatusBackdrop(true)
                    let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
                    handleVacancyStatusContext(vacancyId, status)
                    setStatusBackdrop(false)
                    closeDialog()
                }
            })
        else {
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
            handleVacancyStatusContext(vacancyId, status)
            setStatusBackdrop(false)
            closeDialog()
        }
    }

    else if (status === 'EXAM-SHORTLIST') {
        if (obj?.applicant?.length > 0) {
            Swal.fire({
                title: 'Continue to next step',
                html: "<p> Some short listed applicants where not able to notify in this step. <br/> " + obj?.applicant[0]['fname']?.toLowerCase() + ' ' + obj?.applicant[0]['mname']?.toLowerCase() + ' ' + obj?.applicant[0]['lname']?.toLowerCase() + ' and ' + (obj?.defaultList.length - 1) + ' other(s)...',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setStatusBackdrop(true)
                    let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
                    handleVacancyStatusContext(vacancyId, status)
                    setStatusBackdrop(false)
                    closeDialog()
                }
            })
        }
        else {
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
            handleVacancyStatusContext(vacancyId, status)
            setStatusBackdrop(false)
            closeDialog()
        }

    }
    else if (status === 'INTERVIEW-RESULT') {
        if (obj?.applicant?.length > 0) {
            Swal.fire({
                title: 'Continue to next step',
                html: "<p> Some short listed applicants where not able to notify in this step. <br/> " + obj?.applicant[0]['fname']?.toLowerCase() + ' ' + obj?.applicant[0]['mname']?.toLowerCase() + ' ' + obj?.applicant[0]['lname']?.toLowerCase() + ' and ' + (obj?.defaultList.length - 1) + ' other(s)...',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setStatusBackdrop(true)
                    let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
                    handleVacancyStatusContext(vacancyId, status)
                    setStatusBackdrop(false)
                    closeDialog()
                }
            })
        }
        else {
            setStatusBackdrop(true)
            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
            handleVacancyStatusContext(vacancyId, status)
            setStatusBackdrop(false)
            closeDialog()
        }
    }

    else if (status === 'ISSUANCE-SHORTLIST') {
        let newList = obj.list.filter((item, index) => {
            if (item?.interview_total)
                return item
        })
        // check for applicants unrated applicants
        let excludedList = obj.list.filter((x) => !newList.some(y => y.profile_id === x.profile_id) ? x : false)
        if (newList?.length === 0) {
            toast.warning('Nothing to submit!')
            return
        }
        Swal.fire({
            title: 'Continue?',
            html: excludedList.length > 0 ? "<p> Some short listed applicants where not able to notify in this step. </p> <br/> " + excludedList[0].fname?.toLowerCase() + ' ' + excludedList[0].mname?.toLowerCase() + ' ' + excludedList[0].lname?.toLowerCase() + " and " + (excludedList.length - 1) + " other(s)" : "Rated applicants will proceed to Issuance of appointment",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continue'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setStatusBackdrop(true)
                let res = await axios.post(`/api/recruitment/jobPosting/status/interview-result/sendNotifInterviewResult`, { data: newList })
                if (res.data.status === 200) {
                    let idsArr = res.data.sent_ids
                    let res2 = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
                    handleVacancyStatusContext(vacancyId, status)
                    setStatusBackdrop(false)
                    closeDialog()
                    // let newDefaultList = defaultList.filter(item => !idsArr.includes(item.profile_id))
                    // console.log(newDefaultList)
                    // setDefaultList(newDefaultList.slice(0, perPage))
                    // setList(newDefaultList.slice(0, perPage))
                }
                if (res.data.status === 500) {
                    toast.error('Ops! Something went wrong!', { autoClose: 1000 })
                }
            }
        })
    }

    else if (status === 'CLOSED') {
        if (appointed?.employee_id) {
            Swal.fire({
                title: 'CLOSE POSITION',
                text: "This will transfer info of applicant to employees table!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setStatusBackdrop(true)
                    let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: 'CLOSED', vacancyId: vacancyId, appointed: appointed }, { signal: controller.signal })
                    console.log(res)
                    handleVacancyStatusContext(vacancyId, 'CLOSED')
                    setStatusBackdrop(false)
                    closeDialog()
                }
            })

        }
        else if (appointed?.applicant_id) {
            Swal.fire({
                title: 'CLOSE POSITION',
                text: "This will transfer info of applicant to employees table!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continue'
            }).then((result) => {
                if (result.isConfirmed) {
                    setTransferReadyModal(true)
                }
            })
        }
    }
    else {
        Swal.fire({
            text: status === "TO-CLOSE" ? "CLOSE THIS POSITION?" : "Proceed to next status?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (status !== 'RANKING') {
                    setStatusBackdrop(true)
                }
                let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId }, { signal: controller.signal })
                if (status !== 'RANKING') {
                    setStatusBackdrop(false)
                }
                if (res.status === 200) {
                    handleVacancyStatusContext(vacancyId, status === 'TO-CLOSE' ? 'CLOSED' : status)
                    if (status !== 'RANKING') {
                        closeDialog()
                    }
                }
                else if (res.status === 500) {
                    closeDialog()
                }
            }
        })
    }

}

// handling changes to status for mpr
export const handleChangeStatusMpr = async (obj, status, prevStatus, vacancyId, closeDialog, controller, handleVacancyStatusContext, setStatusBackdrop) => {
    if (status === 'RECEIVING') {
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId, is_mpr: '1' }, { signal: controller.signal })
        console.log('Res', res)
        handleVacancyStatusContext(vacancyId, status)
        setStatusBackdrop(false)
        closeDialog()
    }
    else if (status === 'SET-EXAM') {
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId, is_mpr: '1' }, { signal: controller.signal })
        console.log('Res', res)
        handleVacancyStatusContext(vacancyId, status)
        setStatusBackdrop(false)
        closeDialog()
    }
    else if (status === 'EXAM-RESULT') {
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId, is_mpr: '1' }, { signal: controller.signal })
        console.log('Res', res)
        handleVacancyStatusContext(vacancyId, status)
        setStatusBackdrop(false)
        closeDialog()
    }
    else if (status === 'SET-INTERVIEW') {
        setStatusBackdrop(true)
        if (prevStatus !== 'EXAM-RESULT') {

            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatusNonPermanentSkip`, { status: status, vacancyId: vacancyId, prevStatus: prevStatus }, { signal: controller.signal })
            console.log(res)
            if (res.data.status === 200) {
                handleVacancyStatusContext(vacancyId, status)
                closeDialog()
            }
            else if (res.data.status === 203) {
                handleVacancyStatusContext(vacancyId, status)
                closeDialog()
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            setStatusBackdrop(false)
        }
        else {
            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId, is_mpr: '1' }, { signal: controller.signal })
            console.log('Res', res)
            if (res.data.status === 200) {
                handleVacancyStatusContext(vacancyId, status)
                setStatusBackdrop(false)
                closeDialog()
            }
        }


    }
    else if (status === 'INTERVIEW-RESULT') {
        setStatusBackdrop(true)
        let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId, is_mpr: '1' }, { signal: controller.signal })
        console.log('Res', res)
        handleVacancyStatusContext(vacancyId, status)
        setStatusBackdrop(false)
        closeDialog()
    }
    else if (status === 'ISSUANCE-APPOINTMENT') {
        setStatusBackdrop(true)
        if (prevStatus !== 'INTERVIEW-RESULT') {

            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatusNonPermanentSkip`, { status: status, vacancyId: vacancyId, prevStatus: prevStatus }, { signal: controller.signal })
            console.log(res)
            if (res.data.status === 200) {
                handleVacancyStatusContext(vacancyId, status)
                closeDialog()
            }
            else if (res.data.status === 203) {
                handleVacancyStatusContext(vacancyId, status)
                closeDialog()
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            setStatusBackdrop(false)
        }
        else {
            let res = await axios.post(`/api/recruitment/jobPosting/changeJobStatus`, { status: status, vacancyId: vacancyId, is_mpr: '1' }, { signal: controller.signal })
            console.log('Res', res)
            if (res.data.status === 200) {
                handleVacancyStatusContext(vacancyId, status)
                setStatusBackdrop(false)
                closeDialog()
            }
        }
       
    }
}

// num to word
const ones = (num) => {
    if (num === 0)
        return ''
    if (num === 1)
        return 'ONE'
    if (num === 2)
        return 'TWO'
    if (num === 3)
        return 'THREE'
    if (num === 4)
        return 'FOUR'
    if (num === 5)
        return 'FIVE'
    if (num === 6)
        return 'SIX'
    if (num === 7)
        return 'SEVEN'
    if (num === 8)
        return 'EIGTH'
    if (num === 9)
        return 'NINE'
}

const tens = (num) => {
    if (num === 0)
        return ''
    if (num === 1)
        return 'ONE'
    if (num === 2)
        return 'TWENTY'
    if (num === 3)
        return 'THIRTY'
    if (num === 4)
        return 'FOURTY'
    if (num === 5)
        return 'FIFTY'
    if (num === 6)
        return 'SIXTY'
    if (num === 7)
        return 'SEVENTY'
    if (num === 8)
        return 'EIGHTY'
    if (num === 9)
        return 'NINETY'
}

const teenths = (num) => {
    num = Number(num)
    if (num < 10) {
        return ones(num)
    }
    else if (num === 10) {
        return 'TEN'
    }
    else if (num > 10 && num < 20) {
        if (num === 11)
            return 'ELEVEN'
        if (num === 12)
            return 'TWELVE'
        if (num === 13)
            return 'THIRTEEN'
        if (num === 14)
            return 'FOURTEEN'
        if (num === 15)
            return 'FIFTEEN'
        if (num === 16)
            return 'SIXTEEN'
        if (num === 17)
            return 'SEVENTEEN'
        if (num === 18)
            return 'EIGHTEEN'
        if (num === 19)
            return 'NINETEEN'
    }
    else if (num > 19) {
        let newNum = num.toString()
        return tens(Number(newNum[0])) + ' ' + ones(Number(newNum[1]))
    }
}

export const NumToWord = (number = '') => {
    let digit_count = 0
    let modulo = [];
    let word = []
    while (number !== 0) {
        modulo.push(number % 10)
        number = parseInt(number / 10)
        digit_count = digit_count + 1
    }
    modulo.forEach((item, i) => {
        if (i === 6) {
            word.push(ones(item) + ' MILLION ')
        }
        if (i === 5) {
            word.push(ones(item) + ' HUNDRED ')
        }
        if (i === 4) {
            word.push(teenths(modulo[4].toString() + modulo[3].toString()) + ' THOUSAND ')
        }
        if (i === 2) {
            if (item !== 0) {
                word.push(ones(item) + ' HUNDRED ')
            }
        }
        if (i === 1) {
            word.push(teenths(modulo[1].toString() + modulo[0].toString()))
        }

    })

    return word.reverse()
}

export const commaSeparatedBill = (bill) => {
    if (bill > 0) {
        let billString = bill?.toString()
        // split whole numbers from decimals
        let splitter = billString?.split(".")
        let wholeNumbers = splitter[0]
        wholeNumbers = wholeNumbers.toString()
        let reverseValue = []
        let newArr = []
        // first reverse the value so if value = 1231234 ,then it will become 4321321
        for (let i = wholeNumbers.length - 1; i >= 0; i--) {
            reverseValue.push(wholeNumbers[i])
        }
        // check if index + 1 is divisble by 3, if so, add comma before the array value, if index (5) + 1 = 6 % 3 , so arr[5] = 4 will become, ',4'
        for (let i = 0; i < reverseValue.length; i++) {
            if ((i + 1) % 3 === 0) {
                let withComma = ',' + reverseValue[i].toString()
                newArr.push(withComma)
            }
            else {
                newArr.push(reverseValue[i])
            }
        }
        let finalValue = []
        // lastly store the values in reverse order, so if original value is 432,132,1; this will become 1,231,234
        for (let i = newArr.length - 1; i >= 0; i--) {
            finalValue.push(newArr[i])
        }
        return finalValue
    }

}