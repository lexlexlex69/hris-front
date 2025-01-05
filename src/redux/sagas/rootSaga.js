import { takeLatest } from 'redux-saga/effects'
// actions
import { getEmployee, employeeUpdate } from '../slice/employeeSlice'
import { getEmployees } from '../slice/employeesSlice'

// pds common
import { pdsConfirm } from '../slice/pdsCommon'
// personal
import { getPdsPersonal, PdsPersonalUpdate, getPdsPersonalWithUpdate } from '../slice/pdsPersonal'
// family background
import { getPdsFamilyBackground, getFamilyBackgroundWithUpdate } from '../slice/pdsFamilyBackground'
import { getLogin } from '../slice/login'
import { getPdsEducation } from '../slice/pdsEducation'
import { getPdsEligibility } from '../slice/pdsEligibility'
import { getPdsWorkExp } from '../slice/pdsWorkExp'
import { getPdsVoluntary } from '../slice/pdsVoluntarty'
import { getPdsTrainings } from '../slice/pdsTrainings'
import { getPdsOthers } from '../slice/pdsOthers'
import { getPdsOthersChecklist } from '../slice/pdsOthersChecklist'
// employee route param
import { employeeRouteParamCall } from '../slice/employeeRouteParam'
// 
// handlers
import { employeeHandler, employeeUpdateHandler } from './handlers/employeeHandler'
import { employeesHandler } from './handlers/employeesHandler'
// 
import { confirmChanges } from './handlers/pdsCommonHandler'
import { loginHandler } from './handlers/loginHandler'
import { pdsPersonalHandler, pdsPersonalUpdateHandler, pdsPersonalWithUpdateHandler } from './handlers/pdsPersonalHandler'
import { pdsFamilyBackgroundHandler } from './handlers/pdsFamilyBackgroundHandler'
import { pdsEducationHandler } from './handlers/pdsEducationHandler'
import { pdsEligibilityHandler } from './handlers/pdsEligibilityHandler'
import { pdsWorkExpHandler } from './handlers/pdsWorkExpHandler'
import { pdsVoluntartyHander } from './handlers/pdsVoluntaryHandler'
import { pdsTrainingsHandler } from './handlers/pdsTrainingsHandler'
import { pdsOthersHandler, pdsOthersChecklistHandler } from './handlers/pdsOthersHandler'
import { employeeRouteParamHandler } from './handlers/routeParam/employeeRouteParamHandler'
import { profileHandler } from './handlers/profileHandler'
import { getProfile } from '../slice/profileSlice'
import { getLoginVerified } from '../slice/emailVerificationSlice'
import { emailVerificationHandler } from './handlers/emailVerificationHandler'
import { getInfo,getHasPDS,getPDS,updateUserPassword } from '../slice/userInformationSlice'
import { userInformationhandler,hasPDSHandler,getPDShandler,updateUserPasswordHandler } from './handlers/userInformationHandler'
import { getLogout } from '../slice/logout'
import { logoutHandler } from './handlers/logoutHandler'
export function* watcherSaga() {

    // login
    yield takeLatest(getLogin.type, loginHandler)

    // employee
    yield takeLatest(getEmployee.type, employeeHandler)
    yield takeLatest(employeeUpdate.type, employeeUpdateHandler)
    // employees
    yield takeLatest(getEmployees.type, employeesHandler)

    // route param
    yield takeLatest(employeeRouteParamCall.type, employeeRouteParamHandler)
    // pds personal
    yield takeLatest(getPdsPersonal.type, pdsPersonalHandler)
    yield takeLatest(getPdsPersonalWithUpdate.type,pdsPersonalWithUpdateHandler )
    yield takeLatest(PdsPersonalUpdate.type, pdsPersonalUpdateHandler)
    // pds family background
    yield takeLatest(getPdsFamilyBackground.type, pdsFamilyBackgroundHandler)
    // education
    yield takeLatest(getPdsEducation.type, pdsEducationHandler)
    // eligibility
    yield takeLatest(getPdsEligibility.type, pdsEligibilityHandler)
    // work Exp
    yield takeLatest(getPdsWorkExp.type, pdsWorkExpHandler)
    // voluntary
    yield takeLatest(getPdsVoluntary.type, pdsVoluntartyHander)
    // trainings
    yield takeLatest(getPdsTrainings.type, pdsTrainingsHandler)
    // others
    yield takeLatest(getPdsOthers.type, pdsOthersHandler)
    // others - checklist
    yield takeLatest(getPdsOthersChecklist.type, pdsOthersChecklistHandler)
    // my profile
    yield takeLatest(getProfile.type,profileHandler)
    yield takeLatest(getLoginVerified.type,emailVerificationHandler)
    // get user infor
    yield takeLatest(getInfo.type,userInformationhandler)
    //logout user
    yield takeLatest(getLogout.type,logoutHandler)
    //check if user applicant has PDS
    yield takeLatest(getHasPDS.type,hasPDSHandler)
    // update user password
    yield takeLatest(updateUserPassword.type,updateUserPasswordHandler)


}