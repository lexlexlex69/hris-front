import React, { useEffect, useState } from 'react'

import { getWorkExperienceUpdates } from './Controller'
import TableUpdates from '../../../../pds/work_experience/TableUpdates'

import SkeletonComponent from '../SkeletonComponent'

function WorkExp({ data, handleCloseUpdates }) {

  const [workExpUpdates, setWorkExpUpdates] = useState([])
  const [workExp, setWorkExp] = useState([])
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
    getWorkExperienceUpdates(data.row.employee_id, setWorkExp, controller, setWorkExpUpdates, setLoader)
  }, [])
  return (
    <>
      {loader ? (
        <TableUpdates handleClose={handleCloseUpdates} workExperience={workExp} setWorkExperience={setWorkExp} workExperienceUpdates={workExpUpdates} setWorkExperienceUpdates={setWorkExpUpdates} pdsParam={pdsParam} />
      ) : (<SkeletonComponent />)}
    </>
  )
}

export default WorkExp