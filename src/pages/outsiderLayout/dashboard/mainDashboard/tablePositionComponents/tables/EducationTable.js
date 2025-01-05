import React, { useEffect, useRef, useState } from 'react';
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
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import ArrowForward from '@mui/icons-material/ArrowForward';


const EducationTable = ({ data, loader, setCollectedStates, collectTrigger, setCollectTrigger }) => {

    const [checker, setChecker] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const firstRender = useRef(true)
    const selectAllRef = useRef(true)

    // functions
    const handleChecker = (e, index, value) => {
        if (e.target.checked) {
            setChecker(prev => [...prev, { id: value.id }])
        }
        else {
            let filterChecker = checker.filter(item => item.id !== value.id)
            setChecker(filterChecker)
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
        }
        else {
            console.log('collectTrigger', collectTrigger)
            if (collectTrigger) {
                setCollectedStates(prev => ({ ...prev, education: checker }))
                setCollectTrigger(false)
            }
        }

    }, [collectTrigger])

    // useEffect(() => {
    //     if (selectAllRef.current) {
    //         selectAllRef.current = false
    //     }
    //     else {
    //         if (selectAll) {
    //             let selectAllItem = data.map(item => {
    //                 return { id: item.id, index: item.id }
    //             })
    //             setChecker(selectAllItem)
    //             console.log(selectAllItem)
    //         }
    //         else {
    //             setChecker([])
    //         }
    //     }
    // }, [selectAll])

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
                                            color="primary"
                                            checked={selectAll}
                                            onChange={() => setSelectAll(prev => !prev)}
                                        />
                                    }
                                /> */}
                            </TableCell>
                            <TableCell align="left">Degree/Course</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loader ? (
                            <>
                                {Array.from(Array(2)).map((item, i) => (
                                    <TableCell align="left" key={i}>
                                        <Skeleton variant="text" width="" height="" animation="pulse" />
                                    </TableCell>
                                ))}
                            </>
                        ) : (
                            <>
                                {data && data.map((item, index) => (
                                    <Fade in key={item.id}>
                                        <TableRow>
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell align="left">
                                                <FormControlLabel
                                                    label=""
                                                    control={
                                                        <Checkbox
                                                            onChange={(e) => handleChecker(e, index, item)}
                                                            color="primary"
                                                        />
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="left">{item.degreecourse}</TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default React.memo(EducationTable);