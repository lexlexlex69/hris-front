import React, { useEffect, useState } from 'react'

import { getSpecialSkillsOthersUpdates } from './Controller'
import TableUpdates from '../../../../pds/other_info/skillsOthers/TableUpdates'

import SkeletonComponent from '../SkeletonComponent'

function Training({ data, handleCloseUpdates }) {

    const [updates, setUpdates] = useState([])
    const [skills, setSkills] = useState([])
    const [recognition, setRecognition] = useState(false)
    const [organization, setOrganization] = useState(false)
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
        getSpecialSkillsOthersUpdates(data.row.employee_id, setSkills, setRecognition, setOrganization, setLoader, controller, setUpdates)
    }, [])
    return (
        <>
            {loader ? (
                <TableUpdates handleClose={handleCloseUpdates} updates={updates} setUpdates={setUpdates} specialSkills={skills} recognition={recognition} organization={organization} pdsParam={pdsParam.id} />
            ) : (<SkeletonComponent />)}
        </>
    )
}

export default Training