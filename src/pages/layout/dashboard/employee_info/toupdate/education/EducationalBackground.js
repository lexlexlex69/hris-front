import React, { useEffect, useState } from 'react'

import { getEducationUpdates } from './Controller'
import TableUpdates from '../../../../pds/educ_background/TableUpdates'

import SkeletonComponent from '../SkeletonComponent'

function EducationalBackground({ data, handleCloseUpdates }) {

  const [educationUpdates, setEducationUpdates] = useState([])
  const [education, setEducation] = useState([])
  const [loader, setLoader] = useState(false)
  const [pdsParam, setPdsParam] = useState({
    id: ''
  })

  useEffect(() => {
    // console.log(data)
    setPdsParam({
      id: data.row.employee_id
    })
    let controller = new AbortController()
    getEducationUpdates(data.row.employee_id, setEducation, controller, setEducationUpdates, setLoader)
  }, [])
  return (
    <>
      {loader ? (
        <TableUpdates handleClose={handleCloseUpdates} education={education} setEducation={setEducation} educationUpdates={educationUpdates} setEducationUpdates={setEducationUpdates} pdsParam={pdsParam} />
      ) : (<SkeletonComponent/>)}
    </>
  )
}

export default EducationalBackground