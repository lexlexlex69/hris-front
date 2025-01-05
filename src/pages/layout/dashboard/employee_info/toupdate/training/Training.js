import React, { useEffect, useState } from 'react'

import { getTrainingsUpdates } from './Controller'
import TableUpdates from '../../../../pds/trainings/TableUpdates'

import SkeletonComponent from '../SkeletonComponent'

function Training({ data, handleCloseUpdates }) {

    const [trainingUpdates, setTrainingUpdates] = useState([])
    const [training, setTraining] = useState([])
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
        getTrainingsUpdates(data.row.employee_id, setTraining, controller, setTrainingUpdates, setLoader)
    }, [])
    return (
        <>
            {loader ? (
                <TableUpdates handleClose={handleCloseUpdates} trainings={training} setTrainings={setTraining} trainingsUpdates={trainingUpdates} setTrainingsUpdates={setTrainingUpdates} pdsParam={pdsParam} />
            ) : (<SkeletonComponent/>)}
        </>
    )
}

export default Training