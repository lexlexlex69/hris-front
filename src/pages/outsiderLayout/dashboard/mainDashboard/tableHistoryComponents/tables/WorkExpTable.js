import React, { useState, useRef, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Skeleton from '@mui/material/Skeleton'
import Fade from '@mui/material/Fade'


const WorkExpTable = ({ data, loader, setCollectedStates, collectTrigger, setCollectTrigger }) => {
    const [checker, setChecker] = useState([])
    const firstRender = useRef(true)

    const handleChecker = (e, value) => {
        if (e.target.checked) {
            if (value.isChecked) {
                let filterOutCheckedValue = checker.filter(item => item.id !== value.id)
                setChecker(filterOutCheckedValue)
            }
            else
                setChecker(prev => [...prev, { id: value.id, checkedValue: true }])
        }
        else {
            let filterChecker = data.filter(item => item.id === value.id).map(obj => {
                return {
                    id: obj.id,
                    checkedValue: false
                }
            })
            setChecker(prev => [...prev, filterChecker[0]])
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        }
        else {
            console.log('collectTrigger', collectTrigger)
            if (collectTrigger) {
                setCollectedStates(prev => ({ ...prev, workExp: checker }))
                setCollectTrigger(false)
            }
        }

    }, [collectTrigger])
    return (
        <>
            <TableContainer component={Paper} sx={{ maxHeight: '20rem' }}>
                <Table aria-label="education table" size='small' stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">No.</TableCell>
                            <TableCell align="left">
                                {/* <FormControlLabel
                                    label="select all"
                                    control={
                                        <Checkbox
                                            value=""
                                            color="primary"
                                        />
                                    }
                                /> */}
                            </TableCell>
                            <TableCell align="left">Position title</TableCell>
                            <TableCell align="left">Date from</TableCell>
                            <TableCell align="left">Date to</TableCell>
                            <TableCell align="left">Agency</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(5)).map((item, i) => (
                                    <TableCell align="left" key={i}>
                                        <Skeleton variant="text" width="" height="" animation="pulse" />
                                    </TableCell>
                                ))}
                            </>
                        ) : (
                            <>
                                {data && data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell align="left">{index + 1}</TableCell>
                                        <TableCell align="left">
                                            <FormControlLabel
                                                label=""
                                                control={
                                                    <Checkbox
                                                        defaultChecked={item.isChecked}
                                                        value=""
                                                        color="primary"
                                                    />
                                                }
                                                onChange={e => handleChecker(e, item)}
                                            />
                                        </TableCell>
                                        <TableCell align="left">{item.positiontitle}</TableCell>
                                        <TableCell align="left">{item.datefrom}</TableCell>
                                        <TableCell align="left">{item.dateto}</TableCell>
                                        <TableCell align="left">{item.agency}</TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default React.memo(WorkExpTable);