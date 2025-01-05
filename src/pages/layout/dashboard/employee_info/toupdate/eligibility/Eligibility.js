import React, { useEffect, useState } from 'react'

import { getEligibilityUpdates } from './Controller'
import TableUpdates from '../../../../pds/eligibility/TableUpdates'
import SkeletonComponent from '../SkeletonComponent'

function Eligibility({ data, handleCloseUpdates }) {

  const [eligibilityUpdates, setEligibilityUpdates] = useState([])
  const [eligibility, setEligibility] = useState([])
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
    getEligibilityUpdates(data.row.employee_id, setEligibility, controller, setEligibilityUpdates, setLoader)
  }, [])
  return (
    <>
      {loader ? (
              <TableUpdates handleClose={handleCloseUpdates} eligibility={eligibility} setEligibility={setEligibility} eligibilityUpdates={eligibilityUpdates} setEligibilityUpdates={setEligibilityUpdates} pdsParam={pdsParam || ''} />
      ) : (<SkeletonComponent/>)}
    </>
  )
}

export default Eligibility