import React, { useEffect, useState } from 'react'

import { getVoluntaryUpdates } from './Controller'
import TableUpdates from '../../../../pds/voluntary_work/TableUpdates'

import SkeletonComponent from '../SkeletonComponent'

function Voluntary({ data, handleCloseUpdates }) {

  const [voluntaryUpdates, setVoluntaryUpdates] = useState([])
  const [voluntary, setVoluntary] = useState([])
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
    getVoluntaryUpdates(data.row.employee_id, setVoluntary, controller, setVoluntaryUpdates, setLoader)
  }, [])
  return (
    <>
      {loader ? (
            <TableUpdates handleClose={handleCloseUpdates} voluntary={voluntary} setVoluntary={setVoluntary} voluntaryUpdates={voluntaryUpdates} setVoluntaryUpdates={setVoluntaryUpdates} pdsParam={pdsParam} />
      ) : (<SkeletonComponent/>)}
    </>
  )
}

export default Voluntary