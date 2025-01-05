import React, { useEffect, useState } from 'react'

import { getEmployeeWithUpdates } from './Controller'
import TableUpdates2 from '../../../../pds/family_background/TableUpdates2'

import SkeletonComponent from '../SkeletonComponent'

function Children({ data, handleCloseUpdates }) {
    const [childrenUpdates, setChildrenUpdates] = useState([])
    const [familyState, setFamilyState] = useState([])
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
        getEmployeeWithUpdates(data.row.employee_id, setFamilyState, setChildrenUpdates, setLoader, controller)
    }, [])
    return (
        <>
            {loader ? (
                <TableUpdates2 familyState={familyState || ''} setFamilyState={setFamilyState} children={familyState.children || ''} childrenwithUpdates={childrenUpdates} setChildrenwithUpdates={setChildrenUpdates} pdsParam={pdsParam} />
            ) : (<SkeletonComponent/>)}
        </>
    )
}

export default Children