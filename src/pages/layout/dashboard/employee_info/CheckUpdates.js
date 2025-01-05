import React from 'react'
import EducationalBackground from './toupdate/education/EducationalBackground';
import Eligibility from './toupdate/eligibility/Eligibility';
import WorkExp from './toupdate/workexp/WorkExp';
import Voluntary from './toupdate/voluntary/Voluntary';
import Training from './toupdate/training/Training';
import Skills from './toupdate/skills/Skills';
import References from './toupdate/references/References';
import _34_40 from './toupdate/_34_40/_34_40';
import Children from './toupdate/children/Children';
import PersonalInfo from './toupdate/personal/PersonalInfo';
import Family from './toupdate/family/Family';
import PersonalAddress from './toupdate/personal_address/PersonalAddress';
import Govid from './toupdate/govid/Govid';

function CheckUpdates({ data, handleCloseUpdates }) {
  return (
    <>
      {data && data.tableName === 'hris_employee_education' ? (<EducationalBackground data={data} handleCloseUpdates={handleCloseUpdates} />) :
        data && data.tableName === 'hris_employee_eligibility' ? (<Eligibility data={data} handleCloseUpdates={handleCloseUpdates} />) :
          data && data.tableName === 'hris_employee_employment' ? (<WorkExp data={data} handleCloseUpdates={handleCloseUpdates} />) :
            data && data.tableName === 'hris_employee_voluntary' ? (<Voluntary data={data} handleCloseUpdates={handleCloseUpdates} />) :
              data && data.tableName === 'hris_employee_training' ? (<Training data={data} handleCloseUpdates={handleCloseUpdates} />) :
                data && data.tableName === 'hris_employee_others' ? (<Skills data={data} handleCloseUpdates={handleCloseUpdates} />) :
                  data && data.tableName === 'hris_employee_reference' ? (<References data={data} handleCloseUpdates={handleCloseUpdates} />) :
                  data && data.tableName === 'hris_employee_34_40' ? (<_34_40 data={data} handleCloseUpdates={handleCloseUpdates} />) :
                  data && data.tableName === 'hris_employee_children' ? (<Children data={data} handleCloseUpdates={handleCloseUpdates} />) :
                  data && data.tableName === 'hris_employee' ? (<PersonalInfo data={data} handleCloseUpdates={handleCloseUpdates} />) :
                  data && data.tableName === 'hris_employee_family' ? (<Family data={data} handleCloseUpdates={handleCloseUpdates} />) : 
                  data && data.tableName === 'hris_employee_address' ? (<PersonalAddress data={data} handleCloseUpdates={handleCloseUpdates} />) :
                  data && data.tableName === 'hris_employee_govid' ? (<Govid data={data} handleCloseUpdates={handleCloseUpdates} />) : null}
    </>
  )
}

export default React.memo(CheckUpdates)