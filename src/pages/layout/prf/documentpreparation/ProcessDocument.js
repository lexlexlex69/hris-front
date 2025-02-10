import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PrfStateContext } from "../PrfProvider";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Input,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  ExpandMore as ExpandMoreIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  InfoOutlined as InfoOutlinedIcon,
  Send,
  Doorbell,
  NotificationsActive,
} from "@mui/icons-material";

import ButtonViewPRF from "../requestdetails/view/ButtonViewPRF";
import {
  ArrowForward as ArrowForwardIcon,
  Print as PrintIcon,
  Settings as SettingsIcon,
  Cached as CachedIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { isEmptyObject } from "jquery";

import { toWords } from "number-to-words";
import { AppliedInfo } from "../components/pooling_indorsement/component/ExportComponent";
import { CustomCenterModal } from "../components/export_components/ExportComp";

import {
  getEquivalentSGValue,
  getEquivalentSGValueByStep,
  getSelectedApplicant,
  insertUpdateRequirement,
  sendRequirement,
  setAppointmentDate,
  uploadLetterhead,
} from "./DocRequest";
import { autoCapitalizeFirstLetter } from "../../customstring/CustomString";
import JobOrder from "./EmployeeStatusComponent/JobOrder";
import ContractOfService from "./EmployeeStatusComponent/ContractOfService";
import Casual from "./EmployeeStatusComponent/Casual";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import PrintPreviewButton from "../../../../components/prf/PrintPreviewButton";

export const tableHeadD = [
  { id: 1, headerName: "Appoint date", width: "20px" },
  { id: 2, headerName: "name", width: "140px" },
  { id: 3, headerName: "email address", width: "100px" },
  { id: 4, headerName: "cell./tel. #", width: "50px" },
  { id: 5, headerName: "action", width: "100px" },
];

export const casualCheckList = [
  {
    id: 1,
    value: 0,
    shortname: "Personal Data Sheet",
    label:
      "3 Copies – Duly Notarized Personal Data Sheet (CSC Form 212 Revised 2017)",
    slug: "duly-notarized-personal-data-sheet",
  },
  {
    id: 2,
    value: 0,
    shortname: "Work Experience Sheet",
    label: "3 Copies – Work Experience Sheet (CSC Form 212 Attachment)",
    slug: "work-experience-sheet",
  },
  {
    id: 3,
    value: 0,
    shortname: "Training Certificate",
    label: "1 Photocopy – Certificate of Trainings (Indicated in the PDS)",
    slug: "certificate-of-trainings",
  },
  {
    id: 4,
    value: 0,
    shortname: "Employment Certificate",
    label: "1 Photocopy – Certificate of Employment (Indicated in the PDS)",
    slug: "certificate-of-employment",
  },
  {
    id: 5,
    value: 0,
    shortname: "Eligibility",
    label: "Original and 1 Photocopy – Eligibility (if there’s any)",
    slug: "eligibility",
  },
  {
    id: 6,
    value: 0,
    shortname: "PRC ID / Board Passer Certificate",
    label:
      "Two (2) Colored Photocopies – PRC ID; Certificate of Board Passer (if applicable)",
    slug: "prc-id-board-passer",
  },
  {
    id: 7,
    value: 0,
    shortname: "Good Standing Ceritificate",
    label: "Original and Colored Photocopy – Certificate of Good Standing",
    slug: "certificate-of-good-standing",
  },
  {
    id: 8,
    value: 0,
    shortname: "Birth Certificate",
    label:
      "2 Photocopies – Birth Certificate (PSA/NSO/Authenticated by the Civil Registrar)",
    slug: "birth-certificate",
  },
  {
    id: 9,
    value: 0,
    shortname: "Marriage Certificate",
    label:
      "2 Photocopies – Marriage Certificate (PSA/NSO/Authenticated by the Civil Registrar)",
    slug: "marriage-certificate",
  },
  {
    id: 10,
    value: 0,
    shortname: "Transcript of Records",
    label: "1 Photocopy – Transcript of Records (TOR)",
    slug: "transcript-of-records",
  },
  {
    id: 11,
    value: 0,
    shortname: "Barangay Clearance",
    label: "Barangay Clearance",
    slug: "barangay-clearance",
  },
  {
    id: 12,
    value: 0,
    shortname: "NBI Clearance",
    label: "NBI Clearance",
    slug: "nbi-clearance",
  },
  {
    id: 13,
    value: 0,
    shortname: "Drug Test Result",
    label: "Drug Test Result",
    slug: "drug-test-result",
  },
  {
    id: 14,
    value: 0,
    shortname: "Resignation Letter / Clearance",
    label:
      "Approved Resignation Letter and Clearance from former Agency (if applicable)",
    slug: "resignation-letter-clearance",
  },
  {
    id: 15,
    value: 0,
    shortname: "DBP ATM Account",
    label:
      "DBP ATM Account (Shall be complied upon receipt of approved casual appointment and Indorsement signed by City Treasurer’s Department)",
    slug: "dbp-atm-account",
  },
];

export const cosCheckList = [
  {
    id: 1,
    value: 0,
    shortname: "Drug Test Result",
    type: "original",
    label: "Drug Test Result ",
    slug: "drug-test-result",
  },
  {
    id: 2,
    value: 0,
    shortname: "Barangay Clearance",
    type: "original",
    label: "Barangay Clearance ",
    slug: "barangay-clearance",
  },
  {
    id: 3,
    value: 0,
    shortname: "NBI Clearance",
    type: "original",
    label: "NBI Clearance ",
    slug: "nbi-clearance",
  },
  {
    id: 4,
    value: 0,
    shortname: "Personal Data Sheet",
    type: "original",
    label:
      "Duly filled-out Personal Data Sheet with Passport Size latest ID picture (from online)",
    slug: "personal-data-sheet",
  },
  {
    id: 5,
    value: 0,
    shortname: "PRC ID",
    type: "original",
    label: "PRC (if applicable)",
    slug: "prc",
  },

  {
    id: 6,
    value: 0,
    shortname: "Transcript of Records",
    type: "photocopy",
    label: "Transcript of Records",
    slug: "transcript-of-records",
  },
  {
    id: 7,
    value: 0,
    shortname: "PhilHealth Number",
    type: "photocopy",
    label: "PhilHealth ID / PhilHealth Number",
    slug: "philhealth-id",
  },
  {
    id: 8,
    value: 0,
    shortname: "SSS Number",
    type: "photocopy",
    label: "SSS UMID / SSS Number",
    slug: "sss-umid",
  },
  {
    id: 9,
    value: 0,
    shortname: "Pag-IBIG Number",
    type: "photocopy",
    label: "Pag-IBIG ID / Pag-IBIG Number",
    slug: "pag-ibig-id",
  },
  {
    id: 10,
    value: 0,
    shortname: "TIN Number",
    type: "photocopy",
    label: "TIN ID / Tax Identification Number",
    slug: "tin-id",
  },
  {
    id: 11,
    value: 0,
    shortname: "Occupational Permit*",
    type: "photocopy",
    label: "Occupational Permit*",
    slug: "occupational-permit",
  },
  {
    id: 12,
    value: 0,
    shortname: "DBP ATM Payroll Account**",
    type: "photocopy",
    label: "DBP ATM Payroll Account**",
    slug: "dbp-atm-payroll-account",
  },
];

/**
 * @function
 * @description Prompts user to confirm if they want to continue with the process, and if confirmed, calls insertUpdateRequirement with the given data.
 * @param {object} t_data - The data to be passed to the insertUpdateRequirement function.
 * @returns {void}
 */
export const saveChecklistFunction = (t_data, setAppList) => {
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
      Swal.fire("Processing request . . .");
      Swal.showLoading();
      insertUpdateRequirement(t_data)
        .then((r) => {
          if (r.data.status === 500) {
            toast.error(r.data.message);
            return;
          }
          if (r.data.status === 404) {
            if (!isEmptyObject(r.data.not_found_applicant)) {
              console.log(r.data.not_found_applicant);
              toast.error(r.data.message);
              return;
            }
          }
          if (r.data.status === 200) {
            toast.success(r.data.message);
            setAppList(r.data.data);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          Swal.close();
        });
    }
  });
};

/**
 * Displays a confirmation dialog to user before saving the uploaded letterhead.
 * If user confirms, it will call the uploadLetterhead function to save the uploaded letterhead.
 * @param {Object} t_data - The uploaded letterhead data, which includes the file and the user who uploaded it.
 */
export const saveLetterheadFunction = (t_data) => {
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
      Swal.fire("Processing request . . .");
      Swal.showLoading();
      uploadLetterhead(t_data)
        .then((r) => {
          console.log(r);
          toast.success(r.data.message);
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          Swal.close();
        });
    }
  });
};

export const convertToWord = (tempReq, setState) => {
  console.log("tempReq", tempReq);
  // console.log(tempReq.sal_value, !tempReq.sal_value, tempReq.sal_value !== null, !tempReq.sal_value || tempReq.sal_value !== null, tempReq.pay_sal, tempReq.pay_sal > 30, tempReq.pay_sal < 1000)

  if (tempReq.pay_sal > 30) {
    // equivalentValue => getValue by getting the value from salary grade tranche
    let sgValueT = null;

    if (tempReq.pay_sal < 1000) {
      // JO
      setState((prev) => ({ ...prev, joSGValue: tempReq.pay_sal }));
    } else {
      // CASUAL || COS
      if (tempReq.sal_value !== null) {
        sgValueT = tempReq.sal_value;
      }

      getEquivalentSGValueByStep({ sg_value: tempReq.pay_sal })
        .then((res) => {
          setState((prev) => ({
            ...prev,
            salaryData: res.data,
            step1: res.data.step1,
            sg: res.data.sg,
            sgValue: sgValueT ?? tempReq.pay_sal,
            formattedWords: autoCapitalizeFirstLetter(
              `${toWords(sgValueT ?? res.data.step1)} pesos`
            ),
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    // equivalentValue => getValue of the salary grade
    let sgValueT = null;

    if (tempReq.sal_value !== null) {
      sgValueT = tempReq.sal_value;
    }
    setState((prev) => ({ ...prev, sg: tempReq.pay_sal }));

    getEquivalentSGValue({ sg: tempReq.pay_sal })
      .then((res) => {
        setState((prev) => ({
          ...prev,
          salaryData: res.data,
          step1: res.data.step1,
          sgValue: sgValueT ?? res.data.step1,
          formattedWords: autoCapitalizeFirstLetter(
            `${toWords(sgValueT ?? res.data.step1)} pesos`
          ),
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

/**
 * Main component that renders the ProcessDocument page
 */
function ProcessDocument({ closeModal, data }) {
  const { tempReq, applicantData, setApplicantData, deptData, openedPR } =
    useContext(PrfStateContext);
  const [open, setOpen] = useState(0);
  const [loader, setLoader] = useState(true);
  const [applicantList, setApplicantList] = useState([]);

  useEffect(() => {
    if (Object.keys(tempReq).length > 0) {
      handleReloadData();
    } else {
      return closeModal();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await getSelectedApplicant({ prf_id: tempReq.id });
      setApplicantList(res1.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoader(false);
    }
  };

  const handleReloadData = () => {
    setLoader(true);
    fetchData();
  };

  const handleSubmitCompletedProDoc = () => {
    Swal.fire({
      title: "Click submit to continue?",
      text: "",
      icon: "info",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Submit",
    }).then((res) => {
      if (res.isConfirmed) {
        // Add audit trailing code here
        // process data before sending to server
        // throw success message if success
        // throw error message if failed
      }
    });
  };

  return (
    <>
      {loader ? (
        <>
          <Box
            sx={{
              inset: "0px",
              width: "1rem",
              height: "5rem",
              maxWidth: "100vw",
              maxHeight: "100dvh",
              margin: "auto",
              position: "absolute",
            }}
          >
            <CircularProgress />
          </Box>
        </>
      ) : (
        <>
          <Card>
            <CardContent>
              <Stack gap={2}>
                <Stack spacing={1}>
                  <AppliedInfo tempReq={tempReq} />
                  <Box sx={{ display: "flex" }}>
                    <ButtonViewPRF
                      open={open === 100}
                      handleClickOpen={() => setOpen(100)}
                      handleClose={() => setOpen(0)}
                      id={"pd-id"}
                      minWidth={"65%"}
                    />
                    <Box sx={{ flex: "1 1 auto" }} />
                    <IconButton
                      className="custom-iconbutton"
                      color="primary"
                      aria-label="reload table data"
                      onClick={handleReloadData}
                      size="small"
                    >
                      <CachedIcon />
                    </IconButton>
                  </Box>
                </Stack>

                <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />

                {/* ///dri focus */}
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{ margin: "0.5rem 0" }}
                  >
                    {" "}
                    Preparation of Documents for {openedPR}{" "}
                  </Typography>
                </Box>

                <>
                  <PrintPreviewButton />
                </>
                {/* {openedPR === "Casual" && (
                  <>
                    <Casual
                      applicantList={applicantList}
                      setApplicantList={setApplicantList}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  </>
                )}
                {openedPR === "Job Order" && (
                  <>
                    <JobOrder
                      applicantList={applicantList}
                      setApplicantList={setApplicantList}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  </>
                )}
                {(openedPR === "Contract of Service" ||
                  openedPR === "COS - Honorarium") && (
                  <>
                    <ContractOfService
                      applicantList={applicantList}
                      setApplicantList={setApplicantList}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  </>
                )} */}

                <Stack sx={{ gap: "0.5rem" }}>
                  <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                    Upon completion of document process, it will be proceed to
                    Planning and Data Management officer for adding information
                    to HRIS and verifications.
                  </Alert>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleSubmitCompletedProDoc()}
                    >
                      {" "}
                      PRF No.: {tempReq.prf_no} - Complete{" "}
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}

export default ProcessDocument;

export const SendSetRequirement = ({
  type,
  date,
  setDate,
  closeModal,
  prfData,
  appData,
  setAppList,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const handleSendRequirement = (ev, type) => {
    ev.preventDefault();

    if (!isValidDate(type, date)) {
      return toast.error("Ops, please fill in the required date(s)");
    }

    var datetype = "";
    if (type === "casual") {
      datetype = "date";
    } else {
      datetype = "range";
    }

    const t_data = {
      appoint_date: date,
      type: datetype,
      appData,
      prfData,
    };

    if (!date || date === "" || date === null)
      return toast.error("Please fill in the required date(s)");

    sendData(t_data);
  };

  const isValidDate = (type, date) => {
    if (type === "casual") return date !== "";
    return date.startDate !== "" && date.endDate !== "";
  };

  const sendData = (data) => {
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
        setAppointmentDate(data)
          .then((r) => {
            if (r.data.status === 500) toast.error(r.data.message);
            if (r.data.status === 400) toast.error(r.data.message);
            if (r.data.status === 200) {
              toast.success(r.data.message);
              setAppList(r.data.list);
            }
          })
          .catch((error) => toast.error(error.message));
      }
    });
  };

  const handleDateChange = (event, dateType) => {
    const newDate = event.target.value;
    setDate((prev) => {
      if (type === "casual") return newDate;
      return {
        ...prev,
        [dateType]: newDate,
        [dateType === "startDate" ? "endDate" : "startDate"]:
          dateType === "startDate"
            ? prev.endDate < newDate
              ? newDate
              : prev.endDate
            : prev.startDate > newDate
            ? newDate
            : prev.startDate,
      };
    });
  };

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12}> */}
      {/* <Typography variant="body1">Appointment date setting:</Typography> */}
      {/* </Grid> */}
      <Grid item xs={12}>
        <FormControl fullWidth sx={{ gap: "1rem" }}>
          {type === "casual" ? (
            <TextField
              value={date}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              label="Date"
              onChange={(ev) => handleDateChange(ev, "date")}
              type="date"
              size="small"
              inputProps={{ min: today }}
            />
          ) : type === "cos" ? (
            <>
              <TextField
                value={date.startDate}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                label="Start Date"
                onChange={(ev) => handleDateChange(ev, "startDate")}
                type="date"
                size="small"
                inputProps={{ min: today, max: date.endDate }}
              />
              <TextField
                value={date.endDate}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                label="End Date"
                onChange={(ev) => handleDateChange(ev, "endDate")}
                type="date"
                size="small"
                inputProps={{ min: date.startDate }}
              />
            </>
          ) : type === "jo" ? (
            <>
              <TextField
                value={date.startDate}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                label="Start Date"
                onChange={(ev) => handleDateChange(ev, "startDate")}
                type="date"
                size="small"
                inputProps={{ min: today, max: date.endDate }}
              />

              <TextField
                value={date.endDate}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                label="End Date"
                onChange={(ev) => handleDateChange(ev, "endDate")}
                type="date"
                size="small"
                inputProps={{ min: date.startDate }}
              />
            </>
          ) : (
            <></>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "end", gap: "1rem" }}
      >
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={(ev) => handleSendRequirement(ev, type)}
        >
          Save
        </Button>

        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={closeModal}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export const Letterhead = React.memo(
  ({ letterHeadFile, handleSaveLetterHead, handleCloseLetterHead, type }) => {
    const [letterheadFileName, setLetterheadFileName] = useState(null);
    const [letterheads, setLetterheads] = useState(null);

    const handleFile = (e, type) => {
      var file = e.target.files[0];
      setLetterheadFileName(file.name);
      var extension = file.name.split(".").pop().toLowerCase();
      if (["pdf", "png", "jpg", "jpeg"].includes(extension)) {
        handleFileUpload(type, file);
      } else {
        setLetterheads("");
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          html: "Please upload Image file.",
        });
      }
    };

    const handleFileUpload = (type, file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLetterheads(event.target.result);
      };
      reader.readAsDataURL(file);
    };

    return (
      <>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span>{letterheadFileName}</span>
            <label
              htmlFor={"contained-button-file"}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Input
                accept="image/*,.pdf"
                id={"contained-button-file"}
                hidden
                type="file"
                onChange={(value) => handleFile(value, type)}
              />
              <Tooltip title="Upload Letter Head">
                <IconButton
                  color="primary"
                  className="custom-iconbutton"
                  component="span"
                >
                  <UploadIcon />
                </IconButton>
              </Tooltip>
            </label>
          </Grid>
          <Grid item xs={12}>
            <img
              src={!letterheads ? letterHeadFile : letterheads}
              width="100%"
              height="100%"
              alt="Image file"
            />
          </Grid>
          <Grid item xs={12}>
            <hr />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button
              variant="contained"
              color="success"
              className="custom-roundbutton"
              size="small"
              onClick={(ev) => handleSaveLetterHead(ev, letterheads, type)}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              className="custom-roundbutton"
              size="small"
              onClick={handleCloseLetterHead}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
);

export const CheckList = React.memo(
  ({ checkList, type, handleClickSave, data, compiledData }) => {
    const [listCB, setListCB] = useState([]);

    useEffect(() => {
      if (
        typeof data.doc_requirement === "object" &&
        data.doc_requirement !== null
      ) {
        setListCB(data.doc_requirement);
      } else {
        if (data.doc_requirement !== null) {
          const t_data = JSON.parse(data.doc_requirement);
          // test.forEach(element1 => {
          //   checkList.forEach(element2 => {
          //     if (element1.id === element2.id)
          //       element2.value = element1.value
          //   });
          // });
          setListCB(t_data);
        } else {
          setListCB([]);
        }
      }
    }, []);

    const handleSelectCB = (ev, ids, index, data) => {
      ev.preventDefault();
      const { id, checked } = ev.target;

      if (checked) {
        setListCB((prev) => [...prev, { id: Number(id), value: data }]);
      } else {
        const updatedList = listCB.filter(
          (tid, idx) => Number(tid.id) !== Number(ids)
        );
        console.log(updatedList);
        setListCB(updatedList);
      }
    };

    const handleNotify = (ev, list) => {
      ev.preventDefault();
      let t_data = [];

      console.log(list, data);

      // processed checklist to be sent to applicant and set checked to true
      // t_data = listCB.map((item) => {
      //   const t_item = checkList.find((element) => element.id === item.id);
      //   return { id: item.id, value: t_item ? 1 : 0 };
      // });

      checkList.forEach((item) => {
        const t_item = list.find((element) => element.id === item.id);
        t_data.push({ id: item.id, value: t_item ? 1 : 0, data: item });
      });

      console.log(t_data);

      /**
    Check for the appointment date if empty return error throw toast error message to set appointment date
     */
      if (
        data.appoint_date === null ||
        !data.appoint_date ||
        data.appoint_date === ""
      ) {
        return toast.error("Please set appointment date first!");
      }

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
          Swal.fire("Processing request . . .");
          Swal.showLoading();

          sendRequirement({ data: t_data, app_type: type, compiledData })
            .then((res) => {})
            .catch((err) => {
              toast.error(err.message);
            })
            .finally(() => {
              Swal.close();
            });
        }
      });
    };

    return (
      <>
        <Box sx={{ margin: "1.5rem 1rem 1rem 1rem" }}>
          <Typography variant="body1" fontWeight={"600"}>
            Requirement:
          </Typography>
        </Box>
        <Box
          sx={{
            overflowY: "scroll",
            maxHeight: "340px",
            margin: "0px 1rem",
            padding: "0.75rem",
            border: "1px solid rgb(210, 210, 210)",
            borderRadius: "5px",
          }}
        >
          {type === "casual" ? (
            <>
              <Grid2 container>
                <Grid2 item xs={12} lg={12}>
                  {checkList.map((i, index) => (
                    <>
                      <Box sx={{ display: "flex", gap: "5px" }}>
                        <Box sx={{ marginTop: "2px" }}>
                          <input
                            checked={listCB.some((r) => r.id === i.id)}
                            type="checkbox"
                            name="checkbox-id"
                            id={i.id}
                            onChange={(ev) =>
                              handleSelectCB(ev, i.id, index, i)
                            }
                            style={{ width: "15px", height: "15px" }}
                          />
                        </Box>
                        <span> {i.label} </span>
                      </Box>
                    </>
                  ))}
                </Grid2>
              </Grid2>
            </>
          ) : type === "cos" ? (
            <>
              <Grid2 container>
                <Grid2 item xs={12} md={6} lg={6}>
                  <Typography variant="body1" fontWeight={"600"}>
                    {" "}
                    Original:{" "}
                  </Typography>
                  <Box sx={{ padding: "0" }}>
                    {checkList.map((i, index) => (
                      <Box key={`original-${index}`}>
                        {i.type === "original" && (
                          <>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Box sx={{ marginTop: "2px" }}>
                                <input
                                  checked={listCB.some((r) => r.id === i.id)}
                                  type="checkbox"
                                  name="checkbox-id"
                                  id={i.id}
                                  onChange={(ev) =>
                                    handleSelectCB(ev, i.id, index, i)
                                  }
                                  style={{ width: "15px", height: "15px" }}
                                />
                              </Box>
                              <span> {i.label} </span>
                            </Box>
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid2>
                <Grid2 item xs={12} md={6} lg={6}>
                  <Typography variant="body1" fontWeight={"600"}>
                    {" "}
                    Photocopy:{" "}
                  </Typography>
                  <Box sx={{ padding: "0" }}>
                    {checkList.map((i, index) => (
                      <Box key={`photocopy-${index}`}>
                        {i.type === "photocopy" && (
                          <>
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Box sx={{ marginTop: "2px" }}>
                                <input
                                  checked={listCB.some((r) => r.id === i.id)}
                                  type="checkbox"
                                  name="checkbox-id"
                                  id={i.id}
                                  onChange={(ev) =>
                                    handleSelectCB(ev, i.id, index, i)
                                  }
                                  style={{ width: "15px", height: "15px" }}
                                />
                              </Box>
                              <span> {i.label} </span>
                            </Box>
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid2>
              </Grid2>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box sx={{ padding: "1rem", display: "flex" }}>
          <Button
            variant="contained"
            size="small"
            color="warning"
            startIcon={<NotificationsActive />}
            onClick={(ev) => {
              handleNotify(ev, listCB);
            }}
          >
            {" "}
            Notify{" "}
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            variant="contained"
            size="small"
            onClick={(ev) => {
              handleClickSave(ev, listCB);
            }}
          >
            {" "}
            Save{" "}
          </Button>
        </Box>
      </>
    );
  }
);
