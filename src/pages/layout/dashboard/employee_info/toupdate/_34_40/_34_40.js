import React, { useEffect, useState } from 'react'

import { getOtherItemsUpdates } from './Controller'
import Updates from '../../../../pds/other_info/34_40/Updates'
import SkeletonComponent from '../SkeletonComponent'

function _34_40({ data, handleCloseUpdates }) {

  const [updates, setUpdates] = useState([])
  const [loader, setLoader] = useState(false)
  const [items, setItems] = useState({
    _34_a: '',
    _34_b: '',
    _35_a: '',
    _35_b: '',
    _36_a: '',
    _37_a: '',
    _38_a: '',
    _38_b: '',
    _39_a: '',
    _40_a: '',
    _40_b: '',
    _40_c: ''
  })
  const [pdsParam, setPdsParam] = useState({
    id: ''
  })

  useEffect(() => {
    // console.log(data)
    setPdsParam({
      id: data.row.employee_id
    })
    let controller = new AbortController()
    getOtherItemsUpdates(data.row.employee_id,items,setItems, setUpdates, setLoader, controller)
  }, [])
  return (
    <>
      {loader ? (
        <Updates updates={updates} setUpdates={setUpdates} handleClose={handleCloseUpdates} />
      ) : (<SkeletonComponent/>)}
    </>
  )
}

export default _34_40