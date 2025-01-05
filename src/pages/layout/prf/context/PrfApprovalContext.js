import React, { createContext, useState } from 'react'
// import { reqAppUserAuthority, reqApprovalData, reqStatusApi } from '../axios/prfRequest';
// import { toast } from 'react-toastify';
// import { isEmptyObject } from 'jquery';
// import { tableHeadColumns } from '../components/TableHeadAtt';

const ApprovalContext = createContext(null);

const PrfApprovalContext = ({ children }) => {
    const [step1Ref, setStep1Ref] = useState({
        prfNoRef: "",
        officeDeptRef: "",
        divSelRef: "",
        secSelRef: "",
        unitRef: "",
        headCntRef: "",
        paySalRef: "",
        posRef: "",
        dateReqRef: "",
        dateNdRef: "",
        natReqRef: "",
        empStatRef: "",
        justiRef: "",
        jobSumRef: "",
    });
    const [step2Ref, setStep2Ref] = useState({
        qsEdRef: "None Required",
        qsElRef: "None Required",
        qsExRef: "None Required",
        qsTechRef: "None Required",
        qsTrngRef: "None Required",
        qsOtRef: "",
    });
    const [step3SignRef, setStep3SignRef] = useState({
        req_by: false,
        req_by_date: 0,
        req_by_id: 0,
        avail_app: false,
        avail_app_date: 0,
        avail_app_id: 0,
        rev_by: false,
        rev_by_date: 0,
        rev_by_id: 0,
        approval: false,
        approval_date: 0,
        approval_id: 0,
        choices: {
            approved: false,
            disapproved: false,
        },
        remarks: "",
        request_stat: "",
    });
    // const [refReadOnly, setRefReadOnly] = useState({
    //     prfNo_read_only: true,
    //     officeDept_read_only: true,
    //     divSel_read_only: true,
    //     secSel_read_only: true,
    //     unit_read_only: true,
    //     headCnt_read_only: true,
    //     paySal_read_only: true,
    //     pos_read_only: true,
    //     dateReq_read_only: true,
    //     dateNd_read_only: true,
    //     natReq_read_only: true,
    //     empStat_read_only: true,
    //     justi_read_only: true,
    //     jobSum_read_only: true,
    //     qsEd_read_only: true,
    //     qsEl_read_only: true,
    //     qsEx_read_only: true,
    //     qsTech_read_only: true,
    //     qsTrng_read_only: true,
    //     qsOt_read_only: true,
    // });
    const [step3Ref, setStep3Ref] = useState({
        req_by: true,
        avail_app: true,
        rev_by: true,
        approval: true,
    });

    return (
        <ApprovalContext.Provider value={{ step1Ref, step2Ref, step3SignRef, refReadOnly, step3Ref, setStep1Ref, setStep2Ref, setStep3Ref, setStep3SignRef }}>
            {children}
        </ApprovalContext.Provider>
    )
}

// export { ApprovalContext, PrfApprovalContext }