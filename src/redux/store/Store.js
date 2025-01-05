import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'
import { watcherSaga } from '../sagas/rootSaga'

// reducers
import login from '../slice/login'
import darkmodeSlice from '../slice/darkmodeSlice'
import employeeSlice from '../slice/employeeSlice'
import employeesSlice from '../slice/employeesSlice'

// employee route param
import employeeRouteParam from '../slice/employeeRouteParam'
// 
import pdsCommon from '../slice/pdsCommon'
// 
import pdsPersonal from '../slice/pdsPersonal'
import pdsFamilyBackground from '../slice/pdsFamilyBackground'
import pdsEducation from '../slice/pdsEducation'
import pdsEligibility from '../slice/pdsEligibility'
import pdsWorkExp from '../slice/pdsWorkExp'
import pdsVoluntarty from '../slice/pdsVoluntarty'
import pdsTrainings from '../slice/pdsTrainings'
import pdsOthers from '../slice/pdsOthers'
import pdsOthersChecklist from '../slice/pdsOthersChecklist'
import profileSlice  from '../slice/profileSlice'
import emailVerificationSlice from '../slice/emailVerificationSlice'
import userRegistrationSlice from '../slice/userRegistrationSlice'
import userInformationSlice from '../slice/userInformationSlice'
const sagaMiddleware = createSagaMiddleware()

const Store = configureStore({
    reducer: {
        login: login,
        darkmode: darkmodeSlice,
        employee: employeeSlice,
        employees: employeesSlice,
        personal: pdsPersonal,
        family: pdsFamilyBackground,
        education: pdsEducation,
        eligibility: pdsEligibility,
        workExp: pdsWorkExp,
        voluntary: pdsVoluntarty,
        trainings: pdsTrainings,
        others: pdsOthers,
        othersChecklist: pdsOthersChecklist,
        routeParam: employeeRouteParam,
        pdsCommon: pdsCommon,
        profile:profileSlice,
        emailVerification:emailVerificationSlice,
        userRegistration:userRegistrationSlice,
        userInformation:userInformationSlice
    },
    middleware: [sagaMiddleware]
})
sagaMiddleware.run(watcherSaga)

export default Store