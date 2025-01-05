import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { LinearProgress, Typography } from '@mui/material';
import UnderDevWrapper from '../../UnderDevWrapper';

import axios from 'axios'
import moment from 'moment';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const WorkExp = ({ arr, setState }) => {
    const [loader, setLoader] = useState(true)
    const [added, setAdded] = useState(arr.filter(item => item.status === 2))
    const [deleted, setDeleted] = useState(arr.filter(item => item.status === 3))
    const [updated, setUpdated] = useState(arr.filter(item => item.status === 0))
    const [toAdd, setToAdd] = useState({})
    const [toUpdated, setToUpdate] = useState({})
    const [toUpdatedBackend, setToUpdateBackend] = useState({})
    const [toDelete, setToDelete] = useState([])
    const [choice, setChoice] = useState('')
    const checkEducUpdatedDeleted = async (controller) => {
        let res = await axios.post(`/api/pds/decline-updates/fetchUpdatedDeleted`, {
            updated: updated,
            deleted: deleted,
            category: 'work_experience'
        }, { signal: controller.abort() })
        let deletedArr = res.data.deleted.map((item) => {
            let remain = deleted.filter((x) => Number(x.row_index) === item.id)
            // console.log('remain', remain)
            return { ...item, decline_id: remain[0]?.id, uid: remain[0]?.uid, reason: remain[0]?.reason }
        })
        // console.log(deletedArr)
        setToDelete(deletedArr)
        let arrayToSortUpdated = groupBy(updated, 'uid')
        let sortedListUpdated = sortObj(arrayToSortUpdated)
        setToUpdate(sortedListUpdated)
        // console.log('updates', arrayToSortUpdated)
        // console.log('res', res.data.updated)
        setToUpdateBackend(res.data.updated)
        setLoader(false)
    }

    function groupBy(array, property) {
        var hash = {};
        for (var i = 0; i < array.length; i++) {
            if (!hash[array[i][property]]) hash[array[i][property]] = [];
            hash[array[i][property]].push(array[i]);
        }
        return hash;
    }

    const sortObj = (obj) => {
        Object.keys(obj).map((item, index) => { // arrange the object array base on the value of table_field
            obj[item].sort((a, b) => {
                let fa = a.table_field.toLowerCase(), fb = b.table_field.toLowerCase();
                if (fa < fb) {
                    return -1
                }
                if (fa > fb) {
                    return 1
                }
                return 0
            })
        })
        return obj
    }

    const handleMarkAsRead = async (category, data) => {
        Swal.fire('Processing request . . .')
        Swal.showLoading()
        if (category === 'added') {
            let newObj = {}
            Object.assign(newObj, toAdd)
            let res = await axios.post(`/api/pds/decline-updates/markReadAdded`, { uid: newObj[data][0].uid })
            Swal.close()
            // console.log(res)
            if (res.data.status === 200) {
                delete newObj[data]
                setToAdd(newObj)
                let newAlteredAdd = arr.filter(x => x.uid !== data)
                setState(newAlteredAdd)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
        else if (category === 'updated') {
            let newObjUpdated = {}
            Object.assign(newObjUpdated, toUpdated)
            let res = await axios.post(`/api/pds/decline-updates/markReadUpdated`, { uid: data })
            Swal.close()
            if (res.data.status === 200) {
                delete newObjUpdated[data]
                setToUpdate(newObjUpdated)
                let newAlteredUpdated = arr.filter(x => x.uid !== data)
                setState(newAlteredUpdated)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
        }
        else if (category === 'deleted') {
            // console.log(data)
            let res = await axios.post(`/api/pds/decline-updates/markReadDeleted`, { employee_id: data.employee_id, row_index: data.id })
            if (res.data.status === 200) {
                let newDel = toDelete.filter(x => x.id !== data.id)
                setToDelete(newDel)
                let newAlteredDel = arr.filter(x => x.uid !== data.uid)
                setState(newAlteredDel)
            }
            else if (res.data.status === 500) {
                toast.error(res.data.message)
            }
            Swal.close()

        }
    }


    useEffect(async () => {
        const controller = new AbortController()
        checkEducUpdatedDeleted(controller)
        let arrayToSort = groupBy(added, 'uid')
        let sortedList = sortObj(arrayToSort)
        setToAdd(sortedList)
        // console.log('sorted', sortedList)
        return (() => controller.abort())
    }, [])

    return (
        <>
            {loader ? (
                <LinearProgress />
            )
                : (
                    <>
                        <Box display='flex' justifyContent='space-between' mb={1}>
                            <Button disabled={added.length > 0 ? false : true} onClick={() => setChoice(1)} variant={choice === 1 ? 'contained' : 'outlined'} color='error' size='small'>Declined [Added]</Button>
                            <Button disabled={toUpdated ? false : true} onClick={() => setChoice(2)} variant={choice === 2 ? 'contained' : 'outlined'} color='error' size='small'>Declined [UPDATED]</Button>
                            <Button disabled={toDelete.length > 0 ? false : true} onClick={() => setChoice(3)} variant={choice === 3 ? 'contained' : 'outlined'} color='error' size='small'>Declined [DELETED]</Button>
                        </Box>
                        {choice === 1 && (
                            <TableContainer >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>DECLINE REASON</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>FROM</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>TO</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>POSITION TITLE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>DEPARTMENT/AGENCY/OFFICE/COMPANY</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>MONTHLY SALARY</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>SALARY/JOB/PAY GRADE(if applicable) & STEP</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>STATUS OF APPOINTMENT</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>WORK EXPERIENCE SHEET</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>GOV'T SERVICE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>ATTACHED FILE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(toAdd).map((items, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][0].reason ? toAdd[items][0].reason : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][1].new_value ? toAdd[items][1].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][2].new_value ? toAdd[items][2].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][5].new_value ? toAdd[items][5].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][0].new_value ? toAdd[items][0].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][6].new_value ? toAdd[items][6].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][7].new_value ? toAdd[items][7].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][8].new_value ? toAdd[items][8].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][9].new_value ? Object.keys(JSON.parse(toAdd[items][9].new_value)).map(item => (
                                                        <>
                                                            <Typography fontSize='8px'>{item?.toUpperCase()}: {JSON.parse(toAdd[items][9].new_value)[item]}</Typography>
                                                        </>
                                                    )) : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][4].new_value ? toAdd[items][4].new_value === '1' ? 'Y' : 'N' : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Button variant='contained' color="warning" size='small' onClick={() => handleMarkAsRead('added', items)}>MARK AS READ</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {choice === 2 && (
                            <TableContainer >
                                <Table sx={{ minWidth: 650 }} size='small' aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>DECLINE REASON</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>FROM</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>TO</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }} width="20%">POSITION TITLE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>DEPARTMENT/AGENCY/OFFICE/COMPANY</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>MONTHLY SALARY</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>SALARY/JOB/PAY GRADE(if applicable) & STEP</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>STATUS OF APPOINTMENT</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>WORK EXPERIENCE SHEET</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>GOV'T SERVICE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>ATTACHED FILE</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(toUpdated).map((items, index) => (
                                            <>
                                                <TableRow display='flex' sx={{ bgcolor: 'warning.main' }}>
                                                    <TableCell>
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.datefrom}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.dateto}
                                                    </TableCell>
                                                    <TableCell display='flex' width="20%">
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.positiontitle}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.agency}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.salary}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.salgrade}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.status}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdated[items][index]?.row_index[0]?.work_experience_sheet && Object.keys(JSON.parse(toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.work_experience_sheet)).map(item => (
                                                            <>
                                                                <Typography fontSize='8px'>{item?.toUpperCase()}: {JSON.parse(toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.work_experience_sheet)[item]}</Typography>
                                                            </>
                                                        ))}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index]?.row_index))[0]?.govt === 1 ? 'Y' : 'N'}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow display='flex'>
                                                    {toUpdated[items]?.map((x, i) => (
                                                        <>
                                                            {i === 0 && (
                                                                <TableCell width="20%" sx={{ verticalAlign: 'top' }}>
                                                                    <Box display='flex' flexDirection='column' gap={1}>
                                                                        <Button size='small' variant='contained' color="warning" onClick={() => handleMarkAsRead('updated', x?.uid)}>mark as read</Button>
                                                                        {x?.reason}
                                                                    </Box>
                                                                </TableCell>
                                                            )}

                                                            <TableCell sx={{ verticalAlign: 'top' }}>
                                                                <Typography variant="body2" color="warning.main">[{x.table_field === 'datefrom' ? "FROM" : x.table_field === 'dateto' ? 'TO' : x.table_field === 'positiontitle' ? 'POSITION TITLE' : x.table_field === 'agency' ? 'DEPARTMENT/AGENCY/OFFICE/COMPANY' : x.table_field === 'salary' ? 'MONTHLY SALARY' : x.table_field === 'salgrade' ? 'SALARY/JOB/PAY GRADE' : x.table_field === 'status' ? 'STATUS OF APPOINTMENT' : x.table_field === 'work_experience_sheet' ? 'WORK EXPERIENCE SHEET' : x.table_field === 'govt' ? "GOV'T SERVICE" : ''}]</Typography>
                                                                <Typography variant="body1" color="initial">{x.table_field === 'work_experience_sheet' ? (
                                                                    <>
                                                                        {Object.keys(JSON.parse(x?.new_value)).map(item => (
                                                                            <>
                                                                                <Typography fontSize='8px'>{item?.toUpperCase()}: {JSON.parse(x?.new_value)[item]}</Typography>
                                                                            </>
                                                                        ))}
                                                                    </>
                                                                ) : x.table_field === 'govt' ? (
                                                                    <>
                                                                        {x.new_value?.split('*_*')[1] === '1' ? 'Y' : 'N'}
                                                                    </>
                                                                ) : x.new_value}

                                                                </Typography>
                                                            </TableCell>
                                                        </>
                                                    ))}
                                                </TableRow>
                                            </>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        {choice === 3 && (
                            <TableContainer >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>DECLINE REASON</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>FROM</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>TO</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>POSITION TITLE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>DEPARTMENT/AGENCY/OFFICE/COMPANY</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>MONTHLY SALARY</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>SALARY/JOB/PAY GRADE(if applicable) & STEP</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>STATUS OF APPOINTMENT</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>WORK EXPERIENCE SHEET</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>GOV'T SERVICE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}>ATTACHED FILE</TableCell>
                                            <TableCell align="left" className='cgb-color-table table-font-size' sx={{ color: '#fff' }}></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {toDelete && toDelete.map((items, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {items?.reason}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.datefrom}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.dateto}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.positiontitle}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.agency}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.salary}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.salgrade}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.status}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {Object.keys(JSON.parse(items?.work_experience_sheet)).map(item => (
                                                        <>
                                                            <Typography fontSize='8px'>{item?.toUpperCase()}: {JSON.parse(items?.work_experience_sheet)[item]}</Typography>
                                                        </>
                                                    ))}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.govt === 1 ? 'Y' : 'N'}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Button variant='contained' color="warning" size='small' onClick={() => handleMarkAsRead('deleted', items)}>MARK AS READ</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                    </>

                )}

        </>

    );
};

export default WorkExp;