import { useContext, useEffect, useState } from "react";
import { PrfStateContext } from "../../PrfProvider";
import { Autocomplete, Box, Button, Card, CardContent, Chip, Divider, Fab, FormControl, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Popover, Select, Stack, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { TableJobSumm, TableQS } from "../add/RequestForm";
import { toast } from "react-toastify";
import { fetchPrDetails, fetchSearchPositions } from "../RequestDetails";
import { data, isEmptyObject } from "jquery";
import Swal from "sweetalert2";
import { getOnePRF, updateOnePRF } from "../../axios/prfRequest";
import { CustomAutocomplete, SearchCreateAutocomplete, SelectFieldRD, SimpleAutocomplete, SimpleAutocompleteChip, TextAreaRD, TextFieldRD } from "../component/RequestDetailsComponent";
const color = red[500];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function EditRequestForm({ handleEditC }) {
    const { requestDataForm, setRequestDataForm, empStat, natureReq, errors, deptOrg, colDataQS, posTitle, setPosTitle, qsState, postsPerPage, offSet, searchValue, setSearchValue, tempReq, setTempReq, matches, setErrors, userId, setRowData, tempSign, deptData } = useContext(PrfStateContext)
    const [requestQueue, setRequestQueue] = useState([]);
    const [processingQueue, setProcessingQueue] = useState(false);
    const [loading, setLoading] = useState(true)
    const [requestData, setRequestData] = useState({})
    const [secFilter, setSecFilter] = useState([])
    const [uniFilter, setUniFilter] = useState([])

    const [tempData, setTempData] = useState({})
    const [inputValue, setInputValue] = useState("")

    let stepErrors = []
    let educQS = []
    let eligQS = []
    let expeQS = []
    let trainQS = []
    let techQS = []
    let jobSummaryArr = []
    const [educQSValue, setEducQSValue] = useState([...educQS])
    const [eligQSValue, setEligQSValue] = useState([...eligQS])
    const [expeQSValue, setExpeQSValue] = useState([...expeQS])
    const [trainQSValue, setTrainQSValue] = useState([...trainQS])
    const [techQSValue, setTechQSValue] = useState([...techQS])
    const [jobSummValue, setJobSummValue] = useState([...jobSummaryArr])
    // const [openTrigger, setOpenTrigger] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
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
                const [response1] = await Promise.all([
                    getOnePRF(tempReq.id),
                ])

                let positionFilter = posTitle.position_builder.filter(opt => Number(response1.data.data.position) === Number(opt.id));

                let res2 = filterSections(response1.data.data.div_id);
                setSecFilter(res2);
                let res1 = filterUnits(response1.data.data.sec_id);
                setUniFilter(res1);

                // Parse fields that are JSON-encoded strings
                let parsedData = {
                    ...response1.data.data,
                    position: positionFilter[0],
                    nature_req: natureReq.filter(opt => JSON.parse(response1.data.data.nature_req).includes(opt.id)),
                    job_summary: posTitle.categories.job_summary.filter(o => JSON.parse(response1.data.data.job_summary).includes(o.id)),
                    qs_educ_id: posTitle.categories.education.filter(opt => JSON.parse(response1.data.data.qs_educ_id).includes(opt.id)),
                    qs_elig_id: posTitle.categories.eligibility.filter(opt => JSON.parse(response1.data.data.qs_elig_id).includes(opt.id)),
                    qs_expe_id: posTitle.categories.experience.filter(opt => JSON.parse(response1.data.data.qs_expe_id).includes(opt.id)),
                    qs_tech_skll_id: posTitle.categories.technical_skills.filter(opt => JSON.parse(response1.data.data.qs_tech_skll_id).includes(opt.id)),
                    qs_train_id: posTitle.categories.training.filter(opt => JSON.parse(response1.data.data.qs_train_id).includes(opt.id)),
                };

                // console.log(parsedData)
                setRequestData(parsedData);
                setTempData(parsedData);

                educQS = posTitle.categories.education.filter(opt => JSON.parse(response1.data.data.qs_educ_id).includes(opt.id))
                eligQS = posTitle.categories.eligibility.filter(opt => JSON.parse(response1.data.data.qs_elig_id).includes(opt.id))
                expeQS = posTitle.categories.experience.filter(opt => JSON.parse(response1.data.data.qs_expe_id).includes(opt.id))
                techQS = posTitle.categories.technical_skills.filter(opt => JSON.parse(response1.data.data.qs_tech_skll_id).includes(opt.id))
                trainQS = posTitle.categories.training.filter(opt => JSON.parse(response1.data.data.qs_train_id).includes(opt.id))
                jobSummaryArr = posTitle.categories.job_summary.filter(o => JSON.parse(response1.data.data.job_summary).includes(o.id))
                setEducQSValue(posTitle.categories.education.filter(opt => JSON.parse(response1.data.data.qs_educ_id).includes(opt.id)))
                setEligQSValue(posTitle.categories.eligibility.filter(opt => JSON.parse(response1.data.data.qs_elig_id).includes(opt.id)));
                setExpeQSValue(posTitle.categories.experience.filter(opt => JSON.parse(response1.data.data.qs_expe_id).includes(opt.id)));
                setTrainQSValue(posTitle.categories.training.filter(opt => JSON.parse(response1.data.data.qs_train_id).includes(opt.id)));
                setTechQSValue(posTitle.categories.technical_skills.filter(opt => JSON.parse(response1.data.data.qs_tech_skll_id).includes(opt.id)));
                setJobSummValue(posTitle.categories.job_summary.filter(o => JSON.parse(response1.data.data.job_summary).includes(o.id)))
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error fetching the data.',
                    allowOutsideClick: true,
                    showCancelButton: true,
                    showConfirmButton: true,
                });
            } finally {
                setLoading(false);
                Swal.close();
            }
        }
        fetchData()
    }, [tempReq.id])

    // Function to filter sections based on division ID
    const filterSections = (divID) => {
        return deptOrg.sections.filter((ob) => ob.fr_key === divID);
    };
    // Function to filter units based on section ID
    const filterUnits = (secID) => {
        return deptOrg.units.filter((ob) => ob.fr_key === secID);
    };

    const processQueue = async () => {
        if (processingQueue || requestQueue.length === 0) return;
        setProcessingQueue(true);
        const currentRequest = requestQueue[0];
        try {
            await currentRequest();
        } catch (error) {
            console.error('Error processing request:', error);
        } finally {
            setRequestQueue(prevQueue => prevQueue.slice(1));
            setProcessingQueue(false);
        }
    };
    useEffect(() => {
        if (!processingQueue) {
            processQueue();
        }
    }, [requestQueue, processingQueue]);
    const enqueueRequest = (requestFn) => {
        setRequestQueue(prevQueue => [...prevQueue, requestFn]);
    };


    useEffect(() => {
        console.log(requestData.position)
        if (isEmptyObject(requestData.position) || requestData.position === undefined || !requestData.position) {
            educQS = [];
            eligQS = [];
            expeQS = [];
            techQS = [];
            trainQS = [];
            jobSummaryArr = [];
            setEducQSValue(educQS);
            setEligQSValue(eligQS);
            setExpeQSValue(expeQS);
            setTrainQSValue(trainQS);
            setTechQSValue(techQS);
            setJobSummValue(jobSummaryArr);
        } else {
            educQS = posTitle.categories.education.filter(o => o.category === requestData.position['education'])
            eligQS = posTitle.categories.eligibility.filter(o => o.category === requestData.position['eligibility'])
            expeQS = posTitle.categories.experience.filter(o => o.category === requestData.position['experience'])
            techQS = posTitle.categories.technical_skills.filter(o => o.category === requestData.position['technical_skills'])
            trainQS = posTitle.categories.training.filter(o => o.category === requestData.position['training'])
            jobSummaryArr = posTitle.categories.job_summary.filter(o => o.job_summ === requestData.position['job_summary'])
            setEducQSValue(posTitle.categories.education.filter(o => o.category === requestData.position['education']));
            setEligQSValue(posTitle.categories.eligibility.filter(o => o.category === requestData.position['eligibility']));
            setExpeQSValue(posTitle.categories.experience.filter(o => o.category === requestData.position['experience']));
            setTrainQSValue(posTitle.categories.training.filter(o => o.category === requestData.position['training']));
            setTechQSValue(posTitle.categories.technical_skills.filter(o => o.category === requestData.position['technical_skills']));
            setJobSummValue(posTitle.categories.job_summary.filter(o => o.job_summ === requestData.position['job_summary']))
        }
    }, [requestData.position])


    useEffect(() => {
        if (Object.keys(educQSValue).length > 0) { setRequestData({ ...requestData, qs_educ_id: educQSValue }) }
        else { setRequestData({ ...requestData, qs_educ_id: [] }) }
        if (Object.keys(eligQSValue).length > 0) { setRequestData({ ...requestData, qs_elig_id: eligQSValue }) }
        else { setRequestData({ ...requestData, qs_elig_id: [] }) }
        if (Object.keys(expeQSValue).length > 0) { setRequestData({ ...requestData, qs_expe_id: expeQSValue }) }
        else { setRequestData({ ...requestData, qs_expe_id: [] }) }
        if (Object.keys(techQSValue).length > 0) { setRequestData({ ...requestData, qs_tech_skll_id: techQSValue }) }
        else { setRequestData({ ...requestData, qs_tech_skll_id: [] }) }
        if (Object.keys(trainQSValue).length > 0) { setRequestData({ ...requestData, qs_train_id: trainQSValue }) }
        else { setRequestData({ ...requestData, qs_train_id: [] }) }

        if (Object.keys(jobSummValue).length > 0) { setRequestData({ ...requestData, job_summary: jobSummValue }) }
        else { setRequestData({ ...requestData, job_summary: [] }) }

    }, [educQSValue, eligQSValue, expeQSValue, techQSValue, trainQSValue, jobSummValue])

    useEffect(() => {
        if (!tempReq) {
            toast.warning('Ops, Something went wrong!');
            handleEditC();
        }
    }, [])

    useEffect(() => {
        console.log(requestData)
    }, [requestData.div_id, requestData.sec_id, requestData.unit_id])

    const handleFilterSection = (ev) => {
        if (requestData.sec_id !== ev.target.value) {
            setRequestData((prevRD) => ({ ...prevRD, unit_id: '' }));
        }

        const res1 = filterUnits(ev.target.value);
        setUniFilter(res1);
        setRequestData((prevRD) => ({ ...prevRD, sec_id: ev.target.value }))
    }
    const handleFilterDivision = (ev) => {
        if (requestData.div_id !== ev.target.value) {
            setRequestData((prevRD) => ({ ...prevRD, sec_id: '', unit_id: '' }));
        }

        const res2 = filterSections(ev.target.value);
        setSecFilter(res2);
        setRequestData((prevRD) => ({ ...prevRD, div_id: ev.target.value }));
    }

    const handleReset = () => {
        setRequestData({});
        setRequestData(tempData);

        educQS = tempData.qs_educ_id;
        eligQS = tempData.qs_elig_id;
        expeQS = tempData.qs_expe_id;
        techQS = tempData.qs_train_id;
        trainQS = tempData.qs_tech_skll_id;
        jobSummaryArr = tempData.job_summary;

        setEducQSValue(tempData.qs_educ_id);
        setEligQSValue(tempData.qs_elig_id);
        setExpeQSValue(tempData.qs_expe_id);
        setTrainQSValue(tempData.qs_train_id);
        setTechQSValue(tempData.qs_tech_skll_id);
        setJobSummValue(tempData.job_summary);

        console.log(tempData, tempData.qs_educ_id)


        // Reset section and unit filters based on tempData.div_id and tempData.sec_id
        if (tempData.div_id) {
            const res2 = deptOrg.sections.filter((ob) => ob.fr_key === tempData.div_id);
            setSecFilter(res2);
        } else {
            setSecFilter([]);
        }

        if (tempData.sec_id) {
            const res1 = deptOrg.units.filter((ob) => ob.fr_key === tempData.sec_id);
            setUniFilter(res1);
        } else {
            setUniFilter([]);
        }
    };


    const handleEditSubmit = () => {
        if (JSON.stringify(tempData) === JSON.stringify(requestData)) { return toast.error("Ops, You have no changes."); }

        var payload = {}
        if (!requestData.div_id) { stepErrors.errDiv = "Division is required"; }
        if (!requestData.sec_id || requestData.sec_id === '') { stepErrors.errSect = "Section is required"; }
        if (!requestData.unit_id || requestData.unit_id === '') { stepErrors.errUnit = "Unit is required"; }
        if (!requestData.head_cnt) { stepErrors.errHead = "Head Count is required"; }
        if (!requestData.pay_sal) { stepErrors.errPay = "Pay/Salary Grade is required"; }
        if (!requestData.position) { stepErrors.errPosTitle = "Position/Functional Title is required"; }
        if (!requestData.date_needed) { stepErrors.errDateNd = "Date Needed is required"; }
        if (!requestData.emp_stat) { stepErrors.errEmpStat = "Employment Status is required"; }
        if (requestData.nature_req.length === 0 || requestData.nature_req === undefined) { stepErrors.errNat = "Nature of Request is required"; }
        if (requestData.qs_educ_id.length === 0 || requestData.qs_educ_id === undefined) { stepErrors.errQSEd = "Education is required"; }
        if (requestData.qs_elig_id.length === 0 || requestData.qs_elig_id === undefined) { stepErrors.errQSEl = "Eligibility is required"; }
        if (requestData.qs_expe_id.length === 0 || requestData.qs_expe_id === undefined) { stepErrors.errQSEx = "Experience is required"; }
        if (requestData.qs_tech_skll_id.length === 0 || requestData.qs_tech_skll_id === undefined) { stepErrors.errQSTech = "Technical Skills is required"; }
        if (requestData.qs_train_id.length === 0 || requestData.qs_train_id === undefined) { stepErrors.errQSTrng = "Training is required"; }

        if (Object.keys(stepErrors).length > 0) {
            toast.error("Please fill in the fields that are required")
            return setErrors(stepErrors);
        }

        payload.prf_no = requestData.prf_no
        payload.office_dept = requestData.office_dept
        payload.div_id = requestData.div_id
        payload.sec_id = requestData.sec_id
        payload.unit_id = requestData.unit_id
        payload.head_cnt = requestData.head_cnt
        payload.pay_sal = requestData.pay_sal
        payload.position = requestData.position
        payload.date_requested = requestData.date_requested
        payload.date_needed = requestData.date_needed
        payload.nature_req = requestData.nature_req
        payload.emp_stat = requestData.emp_stat
        payload.justification = requestData.justification
        payload.job_summary = jobSummValue
        payload.qs_educ_id = educQSValue
        payload.qs_elig_id = eligQSValue
        payload.qs_expe_id = expeQSValue
        payload.qs_tech_skll_id = techQSValue
        payload.qs_train_id = trainQSValue
        payload.qs_other_id = requestData.qs_other_id
        payload.user_id = userId

        // console.log(requestData)
        // console.log(payload)

        // Submission
        Swal.fire({
            title: "Click submit to continue?",
            text: "",
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                enqueueRequest(async () => {
                    try {
                        const response = await updateOnePRF(requestData.id, payload)
                        if (response.data.status === 200 || response.data.status === 201) {
                            const resPRDet = fetchPrDetails({ user_id: userId });
                            resPRDet.then((result) => { setRowData(result.data.data); }).catch((error) => { toast.error(error.message); })
                            handleEditC();
                            // handleEditC(ev)
                            // setDataToNull();
                            // const resPRDet = await fetchPrDetails({ user_id: userId });
                            // setRowData(resPRDet.data.data);
                            toast.success(response.data.message);
                        } else {
                            toast.error(response.data.message);
                        }
                    } catch (error) {
                        toast.error(error.message);
                    }
                });
            }
        });
    }

    if (loading) {
        return null
    }

    return (
        <Card>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} lg={3}>
                        <FormControl fullWidth>
                            <TextFieldRD readOnly={true} shrinkInput={true} name={'prf_no'} label={'PRF Number'} placeholder={'(For CHRMD use only)'} value={requestData.prf_no || ''} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <FormControl fullWidth>
                            <TextFieldRD readOnly={true} shrinkInput={true} name={'office_dept'} label={'Office/Department'} value={requestData.office_dept || ''} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <SelectFieldRD name={"div_id"} id={"div-id"} label={'Division'} error={errors.errDiv} value={requestData.div_id || ''} onchange={(ev) => handleFilterDivision(ev)} color={color} >
                            {deptOrg.divisions.map((item, index) => (
                                <MenuItem key={"div-" + item.id + index} value={item.id}>
                                    {item.div_name}
                                </MenuItem>
                            ))}
                        </SelectFieldRD>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <SelectFieldRD name={"sec_id"} id={"sec-id"} label={'Section'} error={errors.errSect} value={requestData.sec_id !== undefined ? requestData.sec_id : 0} onchange={(ev) => handleFilterSection(ev)} color={color} >
                            <MenuItem value=''> <em>None</em> </MenuItem>
                            {secFilter.map((item, index) => (
                                <MenuItem key={"sect-" + item.id + index} value={item.id}>
                                    {item.sec_name}
                                </MenuItem>
                            ))}
                        </SelectFieldRD>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <SelectFieldRD name={"unit_id"} id={"unit-id"} label={'Unit'} error={errors.errUnit} value={requestData.unit_id !== undefined ? requestData.unit_id : 0} onchange={(ev) => setRequestData({ ...requestData, unit_id: ev.target.value })} color={color} >
                            <MenuItem value=''> <em>None</em> </MenuItem>
                            {uniFilter.map((item, index) => (
                                <MenuItem key={"unit-" + item.id + index} value={item.id}>
                                    {item.unit_name}
                                </MenuItem>
                            ))}
                        </SelectFieldRD>
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <TextFieldRD readOnly={false} shrinkInput={true} name={'head_cnt'} label={'Head Count(HC)'} placeholder={''} type={'number'} error={errors.errHead}
                            value={requestData.head_cnt || ''} onchange={(ev) => setRequestData({ ...requestData, head_cnt: ev.target.value })} required={true} />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <TextFieldRD readOnly={false} shrinkInput={true} name={'pay_sal'} label={'Pay/Salary Grade'} type={'number'} error={errors.errPay}
                            value={requestData.pay_sal || ''} onchange={(ev) => setRequestData({ ...requestData, pay_sal: ev.target.value })} required={true} />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <TextFieldRD readOnly={true} shrinkInput={true} name={'date_requested'} label={'Date Requested'} type={'text'}
                            value={requestData.date_requested || ''} onchange={(ev) => setRequestData({ ...requestData, date_requested: ev.target.value })} required={true} />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <TextFieldRD readOnly={false} shrinkInput={true} name={'date_needed'} label={'Date Needed'} type={'date'}
                            value={requestData.date_needed || ''} onchange={(ev) => setRequestData({ ...requestData, date_needed: ev.target.value })} required={true} />
                    </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ marginTop: "16px", marginBottom: "16px" }}>
                    <Grid item xs={12} lg={6}>
                        <SelectFieldRD name={"emp_stat_id"} id={"emp_stat-id"} label={'Employment Status'} error={errors.errEmpStat}
                            value={requestData.emp_stat} onchange={(ev) => setRequestData({ ...requestData, emp_stat: ev.target.value })} color={color} >
                            {empStat.map((item, index) => (
                                <MenuItem key={"emp-" + item.id} value={item.emp_stat}>
                                    {item.emp_stat}
                                </MenuItem>
                            ))}
                        </SelectFieldRD>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <SimpleAutocomplete error={errors.errPosTitle} id={'prf-position'} value={requestData.position} oninputchange={(event, newInputValue) => { setInputValue(newInputValue); }}
                            onchange={(event, newValue) => { setRequestData({ ...requestData, position: newValue }) }} getoptionlabel={(opt) => opt.position_title} inputvalue={inputValue}
                            option={posTitle.position_builder} renderinput={(params) => <TextField {...params} label="Position/Functional Title" />}
                            renderoption={(props, option) => {
                                return (
                                    <li {...props} key={option.id + "-" + option.position_name}>
                                        {option.position_title}
                                    </li>
                                )
                            }} color={color} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <SimpleAutocompleteChip options={natureReq} getoptionlabel={(data) => data.category_name} getoptionkey={(data) => data.id}
                            onchange={(ev, newValue) => setRequestData({ ...requestData, nature_req: newValue })} value={requestData.nature_req}
                            renderinput={(params) => <TextField {...params} label="Nature of Request" />} error={errors.errNat} />
                    </Grid>

                    <Grid item xs={12}>
                        {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>If new applicant does it have available laptop or computer to use?</Typography> */}
                        {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>Others</Typography> */}
                        {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>How many devices needed?</Typography> */}
                    </Grid>

                    <Grid item xs={12}>
                        <TextAreaRD label={'Justification/Purpose(Please attach supporting documents if necessary)'} value={requestData.justification || ''}
                            onchange={(ev) => setRequestData({ ...requestData, justification: ev.target.value })} rows={3} maxRows={3} />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack gap={1}>
                            <FormLabel> Job summary </FormLabel>
                            <SearchCreateAutocomplete
                                id='job_summ'
                                label='Job Summary'
                                value={jobSummValue}
                                setValue={setJobSummValue}
                                option={posTitle.categories.job_summary}
                                disabled={requestData.position === null || requestData.position === undefined || requestData.position === ""}
                                name={'job_summ'}
                            // error={errors.errQSTech}
                            // helperText={errors.errQSTech}
                            />
                        </Stack>
                        <Stack gap={1}>
                            <FormLabel> Education </FormLabel>
                            <CustomAutocomplete
                                id='qs_educ_id'
                                label='Education'
                                options={posTitle.categories.education}
                                value={educQSValue}
                                onChange={(ev, newValue) => { setEducQSValue([...educQS, ...newValue.filter((option) => educQS.indexOf(option) === -1),]); }}
                                disabled={requestData.position === null || requestData.position === undefined || requestData.position === ""}
                                error={errors.errQSEd}
                                helperText={errors.errQSEd}
                            />
                        </Stack>
                        <Stack gap={1}>
                            <FormLabel> Eligibility </FormLabel>
                            <CustomAutocomplete
                                id='qs_elig_id'
                                label='Eligibility'
                                options={posTitle.categories.eligibility}
                                value={eligQSValue}
                                onChange={(ev, newValue) => { setEligQSValue([...eligQS, ...newValue.filter((option) => eligQS.indexOf(option) === -1),]); }}
                                disabled={requestData.position === null || requestData.position === undefined || requestData.position === ""}
                                error={errors.errQSEl}
                                helperText={errors.errQSEl}
                            />
                        </Stack>
                        <Stack gap={1}>
                            <FormLabel> Experience </FormLabel>
                            <CustomAutocomplete
                                id='qs_expe_id'
                                label='Experience'
                                options={posTitle.categories.experience}
                                value={expeQSValue}
                                onChange={(ev, newValue) => { setExpeQSValue([...expeQS, ...newValue.filter((option) => expeQS.indexOf(option) === -1),]); }}
                                error={errors.errQSEx}
                                disabled={requestData.position === null || requestData.position === undefined || requestData.position === ""}
                                helperText={errors.errQSEx}
                            />
                        </Stack>
                        <Stack gap={1}>
                            <FormLabel> Technical skills </FormLabel>
                            <SearchCreateAutocomplete
                                id='qs_tech_skll_id'
                                label='Technical Skills'
                                value={techQSValue}
                                setValue={setTechQSValue}
                                option={posTitle.categories.technical_skills}
                                disabled={requestData.position === null || requestData.position === undefined || requestData.position === ""}
                                name={'category'}
                                error={errors.errQSTech}
                                helperText={errors.errQSTech}
                            />
                        </Stack>
                        <Stack gap={1}>
                            <FormLabel> Training </FormLabel>
                            <CustomAutocomplete
                                id='qs_train_id'
                                label='Training'
                                options={posTitle.categories.training}
                                value={trainQSValue}
                                onChange={(ev, newValue) => { setTrainQSValue([...trainQS, ...newValue,]); }}
                                error={errors.errQSTrng}
                                disabled={requestData.position === null || requestData.position === undefined || requestData.position === ""}
                                helperText={errors.errQSTrng}
                            />
                        </Stack>
                    </Grid>

                    {/* <Grid item xs={12} lg={12}>
                        <FormLabel> Job summary </FormLabel>
                        <TableJobSumm data={jobSummValue}>
                            <TableRow sx={{ display: 'block' }}>
                                <TableCell sx={{ display: 'block', paddingTop: "16px", paddingBottom: "16px" }}>
                                </TableCell>
                            </TableRow>
                        </TableJobSumm>
                    </Grid>

                    <Grid item xs={12} lg={12}>
                        <FormLabel>Education</FormLabel>
                        <TableQS colDataQS={colDataQS} data={educQSValue}>
                            <TableRow sx={{ display: 'block' }}>
                                <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                                </TableCell>
                            </TableRow>
                        </TableQS>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <FormLabel>Eligibility</FormLabel>
                        <TableQS colDataQS={colDataQS} data={eligQSValue}>
                            <TableRow sx={{ display: 'block' }}>
                                <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                                </TableCell>
                            </TableRow>
                        </TableQS>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <FormLabel>Experience</FormLabel>
                        <TableQS colDataQS={colDataQS} data={expeQSValue}>
                            <TableRow sx={{ display: 'block' }}>
                                <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                                </TableCell>
                            </TableRow>
                        </TableQS>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <FormLabel>Technical Skills</FormLabel>
                        <TableQS colDataQS={colDataQS} data={techQSValue}>
                            <TableRow sx={{ display: 'block' }}>
                                <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                                </TableCell>
                            </TableRow>
                        </TableQS>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <FormControl fullWidth>
                            <FormLabel>Training</FormLabel>
                            <TableQS colDataQS={colDataQS} data={trainQSValue}>
                                <TableRow sx={{ display: 'block' }}>
                                    <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                                    </TableCell>
                                </TableRow>
                            </TableQS>
                        </FormControl>
                    </Grid> */}

                    <Grid item xs={12} lg={12}>
                        <TextAreaRD label={'Other Requirements'} value={requestData.qs_other_id || ''}
                            onchange={(ev) => setRequestData({ ...requestData, qs_other_id: ev.target.value })} rows={3} maxRows={3} />
                    </Grid>
                </Grid >

                <Stack direction="row" spacing={2} justifyContent="end">
                    <Button variant="contained" color="secondary" type="reset" onClick={handleReset}> Reset </Button>
                    <Button variant="contained" type="submit" onClick={handleEditSubmit}> Update </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default EditRequestForm