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
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const Voluntary = ({ arr, setState }) => {
    const [loader, setLoader] = useState(true)
    const [added, setAdded] = useState(arr.filter(item => item.status === 2))
    const [deleted, setDeleted] = useState(arr.filter(item => item.status === 3))
    const [updated, setUpdated] = useState(arr.filter(item => item.status === 0))
    const [toAdd, setToAdd] = useState({})
    const [toUpdated, setToUpdate] = useState({})
    const [toUpdatedBackend, setToUpdateBackend] = useState({})
    const [toDelete, setToDelete] = useState([])
    const [choice, setChoice] = useState('')

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

    const checkEducUpdatedDeleted = async (controller) => {
        let res = await axios.post(`/api/pds/decline-updates/fetchUpdatedDeleted`, {
            updated: updated,
            deleted: deleted,
            category: 'voluntary'
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
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    DECLINE REASON
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    NAME AND ADDRESS OF ORGANIZATION
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    FROM
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    TO
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    NUMBER OF HOURS
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    POSITION / NATURE OF WORK
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    Attached File
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                </Typography>
                                            </TableCell>
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
                                                    {toAdd[items][4].new_value ? toAdd[items][4].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][0].new_value ? toAdd[items][0].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][1].new_value ? toAdd[items][1].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][3].new_value ? toAdd[items][3].new_value : ''}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {toAdd[items][5].new_value ? toAdd[items][5].new_value : ''}
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
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    DECLINE REASON
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    NAME AND ADDRESS OF ORGANIZATION
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    FROM
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    TO
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    NUMBER OF HOURS
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    POSITION / NATURE OF WORK
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    Attached File
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(toUpdated).map((items, index) => (
                                            <>
                                                <TableRow display='flex' sx={{ bgcolor: 'warning.main' }}>
                                                    <TableCell>
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index].row_index))[0]?.organization}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index].row_index))[0]?.datefrom}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index].row_index))[0]?.dateto}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index].row_index))[0]?.nohrs}
                                                    </TableCell>
                                                    <TableCell display='flex'>
                                                        {toUpdatedBackend.filter(y => parseInt(y.id) === parseInt(toUpdated[items][index].row_index))[0]?.positionwork}
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
                                                                <Typography variant="body2" color="warning.main">[{x.table_field === 'organization' ? "NAME AND ADDRESS OF ORGANIZATION" : x.table_field === 'datefrom' ? 'FROM' : x.table_field === 'dateto' ? 'TO' : x.table_field === 'nohrs' ? 'NUMBER OF HOURS' : x.table_field === 'positionwork' ? 'POSITION / NATURE OF WORK' : ''}]</Typography>
                                                                <Typography variant="body1" color="initial">{x.new_value}</Typography>
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
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    DECLINE REASON
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    NAME AND ADDRESS OF ORGANIZATION
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    FROM
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    TO
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    NUMBER OF HOURS
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    POSITION / NATURE OF WORK
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                    Attached File
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="cgb-color-table">
                                                <Typography className="pds-update-text-color">
                                                </Typography>
                                            </TableCell>
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
                                                    {items?.organization}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.datefrom}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.dateto}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.nohrs}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {items?.positionwork}
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

export default Voluntary;