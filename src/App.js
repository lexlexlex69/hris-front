import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import css from "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// components
import Loginpage from "./pages/login/Loginpage";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/layout/dashboard/Dashboard";
import Myprofile from "./pages/layout/myprofile/Myprofile";
import ViewPds from "./pages/layout/pds/my_pds/ViewPds";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import PersonalInfo from "./pages/layout/pds/personal_info/PersonalInfo";
import ApiTrigger from "./pages/ApiTrigger";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FamilyBackground from "./pages/layout/pds/family_background/FamilyBackground";
import { ToastContainer } from "react-toastify";
import ApplicantPersonalInfo from "./pages/layout/applicantpds/personal_info/ApplicantPersonalInfo";
import UserRegistrationStepper from "./pages/layout/userregistration/stepper/UserRegistrationStepper";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getInfo } from "./redux/slice/userInformationSlice";
import Swal from "sweetalert2";
import {
  Box,
  Skeleton,
  IconButton,
  Tooltip,
  Modal,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { blue } from "@mui/material/colors";
/**
 * verify account
 */
import {
  verifyUserAccountOnLoad,
  resendVerificationCodeOnLoad,
} from "./pages/layout/userregistration/stepper/UserRegistrationRequest";
import $ from "jquery";
import AddCourse from "./pages/layout/dashboard/addcourse/AddCourse";
import JobPosting from "./pages/layout/jobposting/JobPosting";
import NotFound from "./pages/layout/notfound/NotFound";
import ApplicantEducBackground from "./pages/layout/applicantpds/educ_background/ApplicantEducBackground";
import EducBackground from "./pages/layout/pds/educ_background/EducBackground";
import LeaveApplication from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplication";
import PreviewLeaveApplicationForm from "./pages/layout/selfserviceportal/leaveapplication/PreviewLeaveApplicationForm";
import LeaveApplicationVerification from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplicationVerification";
import LeaveApplicationApproval from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplicationApproval";
import LeaveApplicationRecommendation from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplicationRecommendation";
import DTR from "./pages/layout/selfserviceportal/onlinedtr/DTR";
import DTRRectificationReview from "./pages/layout/selfserviceportal/onlinedtr/DRTRectificationReview";
import DTRRectificationApproval from "./pages/layout/selfserviceportal/onlinedtr/DRTRectificationApproval";
import DTRRectification from "./pages/layout/selfserviceportal/onlinedtr/DTRRectification";
import DTRRectificationOBOFT from "./pages/layout/selfserviceportal/onlinedtr/DTRRectificationOBOFT";
import DataAnalyticsMain from "./pages/layout/dashboard/data_analytics/DataAnalyticsMain";
import EmployeeManagementMain from "./pages/layout/dashboard/employee_management/EmployeeManagementMain";
import ViewEmploymentStatus from "./pages/layout/dashboard/employee_management/ViewEmploymentStatus";
import UserRole from "./pages/layout/admin/userrole/UserRole";
import ManageWorkSchedule from "./pages/layout/manageworkschedule/ManageWorkSchedule";
import TypeOfLeaveConfig from "./pages/layout/admin/typeofleave/TypeOfLeaveConfig";
import HeadOfOfficeConfig from "./pages/layout/admin/headofoffice/HeadOfOfficeConfig";
import ManageCOC from "./pages/layout/managecoc/ManageCOC";

// recruitment
import OutsiderLayout from "./pages/outsiderLayout/OutsiderLayout";
import OutsiderDashboard from "./pages/outsiderLayout/dashboard/Dashboard";
import ApplicantPds from "./pages/outsiderLayout/dashboard/applicantPds/ApplicantPds";
import Recruitment from "./pages/recruitmentExternal/Recruitment";
import EvaluateApplicant from "./pages/layout/recruitment/jobPostingManagement/componentsByStatus/receivingApplicants/EvaluateApplicant";
import RecruitmentAdmin from "./pages/layout/recruitment/jobPostingManagement/RecruitmentAdmin";
import ManangePositions from "./pages/layout/recruitment/managePositions/ManangePositions";
import ManagePlantilla from "./pages/layout/recruitment/plantilla/ManagePlantilla";
import Profiling from "./pages/layout/recruitment/profiling/Profiling";
import SalaryTable from "./pages/layout/recruitment/salary_table/SalaryTable";
import Mpr from "./pages/layout/recruitment/mpr/Mpr";
import MprAppointees from "./pages/layout/recruitment/mprAppointess/MprAppointees";
import PlantillaCasual from "./pages/layout/recruitment/plantilla_casual/PlantillaCasual";

// Panelist
import Panel from "./pages/layout/panelist/PanelMain";
import PassSlipUndertimePermit from "./pages/layout/passslipundertimepermit/PassSlipUndertimePermit";
import PassSlipApproval from "./pages/layout/passslipundertimepermit/PassSlipApproval";
import PassSlipReview from "./pages/layout/passslipundertimepermit/PassSlipReview";
import LeaveApplicationRecall from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplicationRecall";
import PaySlip from "./pages/layout/selfserviceportal/payslip/PaySlip";
import LeaveInchargeConfig from "./pages/layout/admin/leaveincharge/LeaveInchargeConfig";
import AuditTrail from "./pages/layout/admin/audittrail/AuditTrail";
import Training from "./pages/layout/trainingmodules/training/Training";
import Trainer from "./pages/layout/trainingmodules/trainer/Trainer";
import TraineeApproval from "./pages/layout/traineeapproval/TraineeApproval";
import TraineeDashboard from "./pages/layout/trainingmodules/traineedashboard/TraineeDashboard";
import TrainingAttendance from "./pages/layout/trainingmodules/trainingattendance/TrainingAttendance";
import ManageCertificate from "./pages/layout/certificate/ManageCertificate";
import CTO from "./pages/layout/selfserviceportal/leaveapplication/CTO";
import TraineeApprover from "./pages/layout/trainingmodules/traineeapprover/TraineeApprover";
import ManageTrainingRequirements from "./pages/layout/trainingrequirements/ManageTrainingRequirements";
import TraineeApprovalHRDC from "./pages/layout/traineeapprovalhrdc/TraineeApprovalHRDC";
import EmployeeTrainings from "./pages/layout/admin/employeetrainings/EmployeeTrainings";
import TraineeApprovalCMO from "./pages/layout/traineeapprovalcmo/TraineeApprovalCMO";
import EmpPaySlip from "./pages/layout/admin/payslip/EmpPaySlip";

// master files route
import MasterFiles from "./pages/layout/masterFiles/MasterFiles";
import ExtendedMaternity from "./pages/layout/selfserviceportal/leaveapplication/ExtendedMaternity";
import Forfeiture from "./pages/layout/selfserviceportal/leaveapplication/FLForfeiture/Forfeiture";
import EarnLeave from "./pages/layout/selfserviceportal/leaveapplication/EarnLeave/EarnLeave";
import MRATU from "./pages/layout/reports/MRATU/MRATU";
import LeaveReports from "./pages/layout/reports/Leave/LeaveReports";
import SRATU from "./pages/layout/reports/SRATU/SRATU";
import EmployeePaySlip from "./pages/layout/employeepayslip/EmployeePaySlip";
import OvertimeMemo from "./pages/layout/overtime/overtimememo/OvertimeMemo";
import EarnCOC from "./pages/layout/overtime/earncoc/EarnCOC";
import TestExcel from "./pages/layout/admin/testexcel/TestExcel";
import VerifyPaySlip from "./pages/layout/verifypayslip/VerifyPaySlip";
import RequestOBRectification from "./pages/layout/selfserviceportal/onlinedtr/obrecrificationrequest/RequestOBRectification";
import Masquerade from "./pages/layout/admin/masquerade/Masquerade";
import ManageWorkScheduleDept from "./pages/layout/manageworkscheduledept/ManageWorkScheduleDept";
import LeaveApplicationViewer from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplicationViewer";
import HRApproval from "./pages/layout/selfserviceportal/leaveapplication/hrapproval/HRApproval";
import MetaTags from "./pages/layout/admin/metatags/MetaTags";
import TrainerDashboard from "./pages/layout/trainingmodules/trainerdashboard/TrainerDashboard";
import LearningMaterials from "./pages/layout/trainingmodules/trainerdashboard/components/LearningMaterials";
import ManageCOCApproval from "./pages/layout/managecoc/ManageCOCApproval";
import Impersonate from "./pages/layout/admin/impersonate/Impersonate";
import ViewEmpDTR from "./pages/layout/selfserviceportal/onlinedtr/ViewEmpDTR/ViewEmpDTR";
import DTRRectificationReviewCMO from "./pages/layout/selfserviceportal/onlinedtr/DRTRectificationReviewCMO";

// calendar config
import { Provider as HolidayMaster } from "./pages/layout/admin/calendarconfig/holidaymaster/Provider";

// media query
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DTRLeaveSurvey from "./pages/layout/survey/DTRLeaveSurvey";
import SurveyReports from "./pages/layout/reports/Survey/Survey";
import UsersReports from "./pages/layout/reports/Users/UsersReports";
import LeaveApplicationVersion2 from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplicationVersion2";
import DTRVersion2 from "./pages/layout/selfserviceportal/onlinedtr/DTRVersion2";
import TraineeEvaluation from "./pages/layout/trainingmodules/traineeevaluation/TraineeEvaluation";
import APCR from "./pages/layout/spms/apcr/APCR";
import { OPCR } from "./pages/layout/spms/opcr/OPCR";
import { TrainingReports } from "./pages/layout/reports/Training/TrainingReports";
import { IndividualDevPlan } from "./pages/layout/trainingmodules/idp/IndividualDevPlan";
import { Scholarship } from "./pages/layout/trainingmodules/scholarship/Scholarship";
import DTRV2 from "./pages/layout/selfserviceportal/onlinedtrv2/DTRV2";
import { Billing } from "./pages/layout/palms/payroll/billing/Billing";
import { DTRManagement } from "./pages/layout/palms/dtr/management/DTRManagement";
import { EmpManagement } from "./pages/layout/admin/employeemanagement/EmpManagement";
import { SetupPayroll } from "./pages/layout/palms/payroll/setuppayroll/SetupPayroll";
import { DTRMgtConfig } from "./pages/layout/admin/dtrmgtconfig/DTRMgtConfig";
import { WorkSchedConfig } from "./pages/layout/admin/worksched/WorkSchedConfig";
import { PayrollTransactions } from "./pages/layout/palms/payroll/payrolltransactions/PayrollTransactions";
import { LeaveLedger } from "./pages/layout/palms/ledger/LeaveLedger";
import { SignatoryConfig } from "./pages/layout/admin/signatory/SignatoryConfig";

// axios.defaults.baseURL = "http://192.168.1.11:8000"

import RequestDetails from "./pages/layout/prf/requestdetails/RequestDetails";
import ReviewForm from "./pages/layout/prf/components/review/ReviewForm";
import ApprovalCMForm from "./pages/layout/prf/components/approval/ApprovalCMForm";
import PrfTracker from "./pages/layout/prf/PrfTracker";
import InterviewAssessment from "./pages/layout/prf/interview_assessment/InterviewAssessment";
import PositionCOSJO from "./pages/layout/prf/editor/PositionCOSJO";
import PoolingPage from "./pages/layout/prf/components/pooling_indorsement/PoolingPage";
import DepartmentOrgStructure from "./pages/layout/department_org_structure/DepartmentOrgStructure";
import View from "./pages/layout/department_org_structure/View";
import ViewRequestForm2 from "./pages/layout/prf/requestdetails/view/ViewRequestForm2";
import PersonnelRequest from "./pages/layout/prf/PersonnelRequest";
import SignatoryPage from "./pages/layout/prf/SignatoryPage";
import RegistrationLog from "./pages/layout/reports/LWOP/RegistrationLog";
import LeaveApplicationFiled from "./pages/layout/selfserviceportal/leaveapplication/LeaveApplicationFiled";
import Testing from "./pages/layout/prf/testing/Testing";
import PrintablesPage from "./pages/layout/prf/printables/PrintablesPage";
import Test_Bio from "./pages/layout/palms/dtr/management/Test_Bio";
import BioManagement from "./pages/layout/palms/dtr/management/BioManagement";

// axios.defaults.baseURL = "http://192.168.1.11:8000"
// axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + '/hris-back-end/public'
// axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + '/hris-back-end-mobile/public'
// axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + '/hris-back-end_develop/public'
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("hris_token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

function App() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDoneSurvey, setIsDoneSurvey] = useState(false);
  const user =
    localStorage.getItem("hris_token") === null
      ? ""
      : localStorage.getItem("hris_token");
  const userInfo = useSelector((state) => state.userInformation.userinfo);
  const dispatch = useDispatch();
  const [resendCode, setResendCode] = React.useState(true);

  // const testAPIFetch = () => {
  //   axios
  //     .get("api/testfetch")
  //     .then((data) => console.log("fetched", data))
  //     .catch((error) => console.log(error));
  // };

  // useEffect(() => {
  //   testAPIFetch();
  //   console.log("useeffect nako");
  // }, []);
  useEffect(() => {
    if (user) {
      /**
      Check if done to survey
      */
      var t_data = {
        survey_id: 1,
      };
      axios.post("/api/survey/checkDoneSurvey", t_data).then((res) => {
        // console.log(res.data)
        // setIsDoneSurvey(res.data.is_done)
        if (res.data.is_done) {
          setIsDoneSurvey(true);
        } else {
          setOpenSurvey(true);
        }
      });
      // setIsDoneSurvey(true)

      /**
       * Check if user was login
       */
      // Swal.fire({
      //   text: 'checking connectivity. . . ',
      //   icon: 'warning',
      //   allowOutsideClick: false,
      // })
      axios
        .post(`/api/checkAuth`)
        .then((res) => {
          if (res.data === 401) {
            Swal.close();
            localStorage.removeItem("hris_roles");
            localStorage.removeItem("hris_stepper");
            localStorage.removeItem("hris_employee_id");
            localStorage.removeItem("hris_name");
            localStorage.removeItem("hris_token");
            window.location.href = `/${process.env.REACT_APP_HOST}`;
          }
          if (res.data === 419) {
            Swal.close();
            localStorage.removeItem("hris_roles");
            localStorage.removeItem("hris_stepper");
            localStorage.removeItem("hris_employee_id");
            localStorage.removeItem("hris_name");
            localStorage.removeItem("hris_token");
            window.location.href = `/${process.env.REACT_APP_HOST}`;
          }
        })
        .catch((err) => {
          Swal.fire({
            text: "Detected: Session Expired. Redirecting to login page.",
            icon: "warning",
          });
          window.location.href = `/${process.env.REACT_APP_HOST}`;
          localStorage.removeItem("hris_roles");
          localStorage.removeItem("hris_stepper");
          localStorage.removeItem("hris_employee_id");
          localStorage.removeItem("hris_name");
          localStorage.removeItem("hris_token");
        });
      if (
        Object.keys(userInfo).length === 0 &&
        userInfo.constructor === Object
      ) {
        /**
         * get user information
         */
        Swal.close();
        dispatch(getInfo());
      }
    }
    /**
     * add event to Swal custom button 'Resend Code'
     */
    $(document).on("click", "#resend", function () {
      Swal.showLoading();
      resendVerificationCodeOnLoad()
        .then((response) => {
          /**
           * show the input code modal
           */
          modalInput();
          setResendCode(false);
        })
        .catch((error) => {
          Swal.showValidationMessage(
            `Request failed. Can't connect to server. ${error}`
          );
        });
    });
  }, [dispatch]);
  /**
   * Modal to input verification code
   */
  const modalInput = () => {
    /**
     * input code
     */
    Swal.fire({
      title: "Enter Verification Code",
      input: "text",
      html: "Please verify your account to proceed",

      inputPlaceholder: "Verification Code",
      inputAttributes: {
        autocapitalize: "off",
      },
      // showCancelButton: true,
      confirmButtonText: "Verify",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      footer: resendCode
        ? '<button id = "resend" class = "resend-btn" >Resend Code </button>'
        : '<button id = "resend" class = "resend-btn-disabled" disabled>Resend Code </button>',
      preConfirm: (code) => {
        /**
         * check if input field was empty
         */
        if (code.length === 0) {
          Swal.showValidationMessage("Please input a valid code");
        } else {
          /**
           * call verifyUserAccountOnLoad request
           */
          return verifyUserAccountOnLoad(code)
            .then((response) => {
              if (response.data.status === "error") {
                Swal.showValidationMessage(`${response.data.message}`);
              }
              return response;
            })
            .catch((error) => {
              Swal.showValidationMessage(`Request failed: ${error}`);
            });
        }
      },
    }).then((response) => {
      if (response.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Successfully verified !",
          html: "Redirecting to dashboard...",
          showConfirmButton: false,
        });
        Swal.showLoading();
        setTimeout(() => {
          window.location.href = `/${process.env.REACT_APP_HOST}/homepage`;
        }, 2000);
      }
    });
  };
  const showDashboard = () => {
    if (isDoneSurvey) {
      /**
       * return route based on user type
       */
      switch (userInfo.user_type) {
        /**
         * Outsider Type
         */
        case 0:
          /**
           * Check if account was verified
           */
          if (userInfo.email_verified_at === null) {
            modalInput();
            return;
          } else {
            return (
              <Route
                path={`/${process.env.REACT_APP_HOST}/homepage`}
                element={
                  <ProtectedRoute user={user}>
                    <OutsiderLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={<OutsiderDashboard name={userInfo.name} />}
                />

                {/* <Route path="my-profile" element={<Myprofile />} /> */}
                <Route path="add-course" element={<AddCourse />} />
                <Route path="applicantPds" element={<ApplicantPds />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            );
          }
          break;
        /**
         * Employee Type
         */
        case 1:
          if (userInfo.email_verified_at === null) {
            modalInput();
            return;
          } else {
            return (
              <Route
                path={`/${process.env.REACT_APP_HOST}/homepage`}
                element={
                  <ProtectedRoute user={user}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard name={userInfo.name} />} />
                <Route path="panel" element={<Panel />} />
                <Route path="master-files" element={<MasterFiles />} />
                <Route path="personal-info" element={<PersonalInfo />} />
                <Route path="my-profile" element={<Myprofile />} />
                <Route path="job-posting" element={<JobPosting />} />
                <Route
                  path="online-leave-application"
                  element={<LeaveApplicationVersion2 />}
                />
                <Route path="cto-application" element={<CTO />} />
                <Route
                  path="passslip-undertime-permit"
                  element={<PassSlipUndertimePermit />}
                />
                <Route
                  path="preview-leave-application"
                  element={<PreviewLeaveApplicationForm />}
                />
                <Route
                  path="leave-application-verification"
                  element={<LeaveApplicationVerification />}
                />
                <Route
                  path="leave-application-approval"
                  element={<LeaveApplicationApproval />}
                />
                <Route
                  path="leave-application-dept-approval"
                  element={<LeaveApplicationRecommendation />}
                />
                <Route
                  path="leave-application-recall"
                  element={<LeaveApplicationRecall />}
                />
                <Route path="daily-time-record" element={<DTRVersion2 />} />
                <Route path="daily-time-record-v2" element={<DTRV2 />} />
                <Route path="dtr-management" element={<DTRManagement />} />
                <Route path="bio-management" element={<BioManagement />} />
                <Route
                  path="rectification-request-verification"
                  element={<DTRRectificationReview />}
                />
                <Route
                  path="rectification-request-verification-cmo"
                  element={<DTRRectificationReviewCMO />}
                />
                <Route
                  path="rectification-request-approval"
                  element={<DTRRectificationApproval />}
                />
                <Route
                  path="dtr-rectification"
                  element={<DTRRectification />}
                />
                <Route path="user-role-configuration" element={<UserRole />} />
                <Route
                  path="manage-work-schedule"
                  element={<ManageWorkSchedule />}
                />
                <Route
                  path="manage-work-schedule-dept"
                  element={<ManageWorkScheduleDept />}
                />
                <Route
                  path="type-of-leave-configuration"
                  element={<TypeOfLeaveConfig />}
                />
                <Route
                  path="head-of-office-configuration"
                  element={<HeadOfOfficeConfig />}
                />
                <Route path="manage-coc" element={<ManageCOC />} />
                <Route
                  path="manage-coc-approval"
                  element={<ManageCOCApproval />}
                />
                <Route path="pass-slip-review" element={<PassSlipReview />} />
                <Route
                  path="pass-slip-approval"
                  element={<PassSlipApproval />}
                />
                <Route path="pay-slip" element={<PaySlip />} />
                <Route path="print-emp-payslip" element={<EmpPaySlip />} />
                <Route
                  path="dtr-rectification-ob-oft"
                  element={<DTRRectificationOBOFT />}
                />
                <Route path="view-employee-dtr" element={<ViewEmpDTR />} />
                <Route
                  path="leave-incharge-configuration"
                  element={<LeaveInchargeConfig />}
                />
                <Route path="leave-reports" element={<LeaveReports />} />
                <Route path="fl-forfeiture" element={<Forfeiture />} />
                <Route path="earn-leave" element={<EarnLeave />} />
                <Route
                  path="extended-maternity"
                  element={<ExtendedMaternity />}
                />
                <Route path="audit-trail" element={<AuditTrail />} />
                <Route path="manage-trainer" element={<Trainer />} />
                <Route path="manage-training-details" element={<Training />} />
                <Route
                  path="manage-trainee-approver"
                  element={<TraineeApprover />}
                />
                <Route
                  path="manage-training-requirements"
                  element={<ManageTrainingRequirements />}
                />
                <Route path="meta-tags-settings" element={<MetaTags />} />
                <Route
                  path="trainee-nom-approval"
                  element={<TraineeApproval />}
                />
                <Route
                  path="trainee-nom-approval-hrdc"
                  element={<TraineeApprovalHRDC />}
                />
                <Route
                  path="trainee-nom-approval-cmo"
                  element={<TraineeApprovalCMO />}
                />
                <Route
                  path="trainee-dashboard"
                  element={<TraineeDashboard />}
                />
                <Route
                  path="training-attendance"
                  element={<TrainingAttendance />}
                />
                <Route
                  path="trainee-evaluation"
                  element={<TraineeEvaluation />}
                />
                <Route
                  path="manage-certificate"
                  element={<ManageCertificate />}
                />
                <Route
                  path="employee-trainings-management"
                  element={<EmployeeTrainings />}
                />
                <Route
                  path="reports-absences-tardiness-undertime"
                  element={<MRATU />}
                />
                <Route
                  path="reports-absences-tardiness-undertime-cos-jo"
                  element={<SRATU />}
                />
                <Route path="reports-survey" element={<SurveyReports />} />
                <Route path="user-reports" element={<UsersReports />} />
                <Route
                  path="training-status-reports"
                  element={<TrainingReports />}
                />
                <Route path="payslip-module" element={<EmployeePaySlip />} />
                <Route path="overtime-memo" element={<OvertimeMemo />} />
                <Route path="earn-coc" element={<EarnCOC />} />
                <Route path="test-excel" element={<TestExcel />} />
                <Route
                  path="online-leave-application-v2"
                  element={<LeaveApplicationVersion2 />}
                />
                <Route
                  path="request-ob-rectification"
                  element={<RequestOBRectification />}
                />
                <Route path="masquerade" element={<Masquerade />} />
                <Route
                  path="leave-application-viewer"
                  element={<LeaveApplicationViewer />}
                />
                <Route
                  path="leave-application-hr-approval"
                  element={<HRApproval />}
                />
                <Route path="spms-apcr" element={<APCR />} />
                <Route path="spms-opcr" element={<OPCR />} />
                <Route path="training-scholarship" element={<Scholarship />} />
                <Route path="emp-management" element={<EmpManagement />} />
                <Route path="billing" element={<Billing />} />
                <Route path="setup-payroll" element={<SetupPayroll />} />
                <Route
                  path="payroll-transactions"
                  element={<PayrollTransactions />}
                />
                <Route path="work-sched-config" element={<WorkSchedConfig />} />
                <Route
                  path="dtr-mgt-configuration"
                  element={<DTRMgtConfig />}
                />
                <Route path="leave-ledger" element={<LeaveLedger />} />
                <Route path="personnel-request-form1" element={<Testing />} />
                <Route path="signatory-config" element={<SignatoryConfig />} />
                <Route
                  path="leave-application-filed"
                  element={<LeaveApplicationFiled />}
                />
                <Route path="holidays-master">
                  <Route index element={<HolidayMaster />} />
                </Route>
                {/* <Route path="individual-development-plan" element={<IndividualDevPlan/>} /> */}
                <Route path="view-pds" element={<ViewPds />}>
                  <Route path=":id" element={<ViewPds />} />
                </Route>
                <Route path="*" element={<NotFound />} />
                <Route path="data-analytics" element={<DataAnalyticsMain />} />
                <Route
                  path="employee-management"
                  element={<EmployeeManagementMain />}
                >
                  <Route path=":id" element={<ViewEmploymentStatus />} />
                </Route>
                <Route path="recruitment">
                  <Route index element={<RecruitmentAdmin />} />
                  <Route path="profiling" element={<Profiling />} />
                  <Route
                    path="evaluate-pds/:id"
                    element={<EvaluateApplicant />}
                  />
                  <Route
                    path="manage_positions"
                    element={<ManangePositions />}
                  />
                  <Route
                    path="manage_plantilla"
                    element={<ManagePlantilla />}
                  />
                  <Route path="salary_table" element={<SalaryTable />} />
                  <Route path="mpr" element={<Mpr />} />
                  <Route path="mpr_appointees" element={<MprAppointees />} />
                  <Route
                    path="plantilla_casual"
                    element={<PlantillaCasual />}
                  />
                </Route>

                {/* <Route path="department-organization" element={<View />} /> */}
                {/* <Route path="department-organization" element={<DepartmentOrgStructure />} /> */}

                <Route
                  path="personnel-request-form"
                  element={<RequestDetails />}
                >
                  <Route path=":id" />
                  {/* <Route path="evaluate_assessment/:id" element={<ViewRequestForm2 />} /> */}
                </Route>
                <Route path="personnel-request">
                  <Route index element={<PersonnelRequest />} />
                  <Route path="view-prf/:id" element={<ViewRequestForm2 />} />
                  <Route
                    path="view-printable/:process/:prf_id"
                    element={<PrintablesPage />}
                  />
                  {/* <Route path='view-prf/assessment/:id' element={ } /> */}
                </Route>
                <Route path="prf-head-signatory" element={<SignatoryPage />} />
                <Route path="prf-review" element={<ReviewForm />} />
                <Route path="prf-approval" element={<ApprovalCMForm />} />
                <Route
                  path="prf-pooling-applicants"
                  element={<PoolingPage />}
                />
                <Route
                  path="prf-assessment"
                  element={<InterviewAssessment />}
                />
                <Route path="prf-tracker" element={<PrfTracker />} />
                <Route path="prf-editor" element={<PositionCOSJO />} />

                <Route
                  path="reports-leave-without-pay-registration-log"
                  element={<RegistrationLog />}
                />
                <Route
                  path={`fetchPersonnelSaveToLxys`}
                  element={<ApiTrigger />}
                />
                <Route path={`testBio`} element={<Test_Bio />} />
              </Route>
            );
          }
          break;
        /**
         * Default Type / Load
         */
        case 2:
          return (
            <Route
              path={`/${process.env.REACT_APP_HOST}/homepage/*`}
              element={
                <ProtectedRoute user={user}>
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            >
              {/* <Route index element={<Dashboard name={userInfo.name} />} /> */}
              <Route
                path="learning-materials"
                element={<LearningMaterials />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          );

        default:
          return (
            <Route
              path={`/${process.env.REACT_APP_HOST}/homepage/*`}
              element={
                <ProtectedRoute user={user}>
                  <Layout />
                </ProtectedRoute>
              }
            ></Route>
          );
          break;
      }
    } else {
      return (
        <Route
          path={`/${process.env.REACT_APP_HOST}/homepage/*`}
          element={
            <ProtectedRoute user={user}>
              <Layout />
            </ProtectedRoute>
          }
        ></Route>
      );
    }
  };
  const [openSurvey, setOpenSurvey] = useState(false);
  const surveyModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: matches ? "100%" : 900,
    bgcolor: "background.paper",
    // border: '0px solid #fff',
    boxShadow: 24,
    // p: 2,
  };
  const handleCloseSurvey = () => {
    setIsDoneSurvey(true);
    setOpenSurvey(false);
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path={`/${process.env.REACT_APP_HOST}`}
            element={
              <IsLogin user={user}>
                <Loginpage />
              </IsLogin>
            }
          />
          {Swal.close()}
          {/* show dashboard dependent to user type || userType === 1 ? Regular employee : Outsider */}
          {showDashboard()}
          {/* routes for recruitment/job vacancies; Api fetcher for all employees from Lyxs system; for User registration */}
          <Route
            path={`/${process.env.REACT_APP_HOST}/recruitment`}
            element={<Recruitment />}
          />
          <Route
            path={`/${process.env.REACT_APP_HOST}/user-registration`}
            element={
              <IsLogin user={user}>
                <UserRegistrationStepper />
              </IsLogin>
            }
          />
          <Route
            path={`/${process.env.REACT_APP_HOST}/verify-payslip`}
            element={<VerifyPaySlip />}
          />
          <Route
            path={`/${process.env.REACT_APP_HOST}/impersonate`}
            element={<Impersonate />}
          />
          {/* <Route path={`/${process.env.REACT_APP_HOST}/trainer-dashboard`} element={<TrainerDashboard />}/> */}
        </Routes>
      </BrowserRouter>
      <Modal
        open={openSurvey}
        onClose={() => setOpenSurvey(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={surveyModalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              background: blue[800],
              p: 1,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "#fff" }}
            >
              Survey{" "}
              <span style={{ fontSize: ".8rem" }}>
                <em>( Please fill out the survey to proceed )</em>
              </span>
            </Typography>
            <Tooltip title="Close survey">
              <IconButton
                color="error"
                size="small"
                sx={{
                  background: "#fff",
                  "&:hover": { background: "#e5e5e5" },
                }}
                onClick={() => setOpenSurvey(false)}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ p: 2, maxHeight: "80vh", overflowY: "scroll" }}>
            <DTRLeaveSurvey
              handleCloseSurvey={handleCloseSurvey}
              close={() => setOpenSurvey(false)}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default App;
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to={`/${process.env.REACT_APP_HOST}`} replace />;
  }
  return children;
}
function IsLogin({ user, userType, children }) {
  if (user) {
    return <Navigate to={`/${process.env.REACT_APP_HOST}/homepage`} replace />;
  }
  return children;
}
