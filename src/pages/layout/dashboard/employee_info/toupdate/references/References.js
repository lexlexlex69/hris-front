import React, { useEffect, useState } from 'react'

import { getReferencesUpdates } from './Controller'
import TableUpdates from '../../../../pds/other_info/references/TableUpdates'

import SkeletonComponent from '../SkeletonComponent'

function References({ data, handleCloseUpdates }) {

    const [referencesUpdates, setReferencesUpdates] = useState([])
    const [references, setReferences] = useState([])
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
        getReferencesUpdates(data.row.employee_id, setReferences, controller, setReferencesUpdates, setLoader)
    }, [])
    return (
        <>
            {loader ? (
                <TableUpdates handleClose={handleCloseUpdates} references={references} setReferences={setReferences} referencesUpdates={referencesUpdates} setReferencesUpdates={setReferencesUpdates} pdsParam={pdsParam} />
            ) : (<SkeletonComponent />)}
        </>
    )
}

export default References