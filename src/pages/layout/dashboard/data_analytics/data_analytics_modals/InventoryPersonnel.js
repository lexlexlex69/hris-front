import React, { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useReactToPrint } from 'react-to-print';
import { blue, green, red, yellow, purple } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import PrintIcon from '@mui/icons-material/Print';

import axios from 'axios'

// components
import Permanent from './data_inventory_tables/Permanent'
import Cotermino from './data_inventory_tables/CoTermino'
import Elective from './data_inventory_tables/Elective'
import Casual from './data_inventory_tables/Casual'
import Cos from './data_inventory_tables/Cos'
import Jo from './data_inventory_tables/Jo'
import Honorarium from './data_inventory_tables/Honorarium'
import Total from './data_inventory_tables/Total'
import Tooltip from '@mui/material/Tooltip'

function InventoryPersonnel() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [category, setCategory] = useState(1);
    const [inventoryPersonnelState, setInventoryPersonnelState] = useState([])
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        axios.get(`/api/dashboard/data_analytics/InventoryPersonnel`)
            .then(res => {
                console.log(res)
                setInventoryPersonnelState(res.data)
                // if (res.data.status === 200) {
                //     setInventoryPersonnelState(res.data.data)
                //     console.log(res)
                // }

            })
            .catch(err => console.log(err))
    }, [])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Button variant={category === 1 ? 'contained' : 'outlined'} size={matches ? 'small' : ''} sx={{ borderRadius: '2rem', fontSize: matches ? '.6rem' : '1rem' }} onClick={() => setCategory(1)}>Mother office</Button>
                <Button variant={category === 2 ? 'contained' : 'outlined'} size={matches ? 'small' : ''} sx={{ borderRadius: '2rem', fontSize: matches ? '.6rem' : '1rem' }} onClick={() => setCategory(2)}>Re-assigned office</Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
                    <Tooltip title="print">
                        <Button variant='contained' sx={{ borderRadius: '1rem', fontSize: matches ? '.6rem' : '1rem' }} size={matches ? 'small' : ''} onClick={handlePrint}><PrintIcon /></Button>
                    </Tooltip>
                </Box>
            </Box>
            {category === 1 ? (
                <Box>
                    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 20vh)' }}>
                        <Table
                            sx={{
                                [`& .${tableCellClasses.root}`]: {
                                    borderBottom: "none"
                                }
                            }}
                            aria-label="simple table" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">OFFICE</TableCell>
                                    <TableCell align="center" sx={{ color: blue[500] }}>
                                        PERMANENT
                                        <Table
                                            size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ color: green[500] }}>FILLED
                                                        <Table

                                                            size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>1st Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>2nd Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ color: green[500] }}>VACANT
                                                        <Table

                                                            size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>1st Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>2nd Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: blue[500] }}>
                                        CO-TERMINOS
                                        <Table

                                            size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ color: green[500] }}>FILLED
                                                        <Table
                                                            size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ color: red[500] }} align="center">1st Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table></TableCell>
                                                                    <TableCell sx={{ color: red[500] }} align="center">2nd Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ color: green[500], verticalAlign: 'top' }}>VACANT
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        ELECTIVE
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        CASUAL
                                        <Table size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: red[500] }} align="center">1st Level
                                                        <Table
                                                            sx={{
                                                                [`& .${tableCellClasses.root}`]: {
                                                                    borderBottom: "1px solid black"
                                                                }
                                                            }}
                                                            size="small" >
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>M</TableCell>
                                                                    <TableCell>F</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                    <TableCell sx={{ color: red[500] }} align="center">2nd Level
                                                        <Table
                                                            sx={{
                                                                [`& .${tableCellClasses.root}`]: {
                                                                    borderBottom: "1px solid black"
                                                                }
                                                            }}
                                                            size="small" >
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>M</TableCell>
                                                                    <TableCell>F</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        CONTRACT OF SERVICE
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        JOB ORDERS
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        HONORARIUM
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        TOTAL MAN POWER
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inventoryPersonnelState && inventoryPersonnelState.length > 0 ? (
                                    <React.Fragment>
                                        {inventoryPersonnelState && inventoryPersonnelState.map((row,index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">{row.dept_title}</TableCell>
                                                <TableCell align="center">
                                                    <Permanent data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Cotermino data={row} />
                                                </TableCell>
                                                {/* <TableCell align="right">
                                                    <Elective data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Casual data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Cos data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Jo data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Honorarium data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Total data={row} />
                                                </TableCell> */}
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ) : (
                                    <>
                                        {Array.from(Array(10)).map((row, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                            </TableRow>
                                        ))}

                                    </>
                                )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Box>
                    {/* <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
                        <Table
                            sx={{
                                [`& .${tableCellClasses.root}`]: {
                                    borderBottom: "none"
                                }
                            }}
                            aria-label="simple table" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">OFFICE</TableCell>
                                    <TableCell align="center" sx={{ color: blue[500] }}>
                                        PERMANENT
                                        <Table

                                            size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ color: green[500] }}>FILLED
                                                        <Table

                                                            size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>1st Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>2nd Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ color: green[500] }}>VACANT
                                                        <Table

                                                            size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>1st Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ color: red[500] }}>2nd Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: blue[500] }}>
                                        CO-TERMINOS
                                        <Table

                                            size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ color: green[500] }}>FILLED
                                                        <Table
                                                            size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell sx={{ color: red[500] }} align="center">1st Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table></TableCell>
                                                                    <TableCell sx={{ color: red[500] }} align="center">2nd Level
                                                                        <Table
                                                                            sx={{
                                                                                [`& .${tableCellClasses.root}`]: {
                                                                                    borderBottom: "1px solid black"
                                                                                }
                                                                            }}
                                                                            size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>M</TableCell>
                                                                                    <TableCell>F</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                        </Table>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ color: green[500], verticalAlign: 'top' }}>VACANT
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        ELECTIVE
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        CASUAL
                                        <Table size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: red[500] }} align="center">1st Level
                                                        <Table
                                                            sx={{
                                                                [`& .${tableCellClasses.root}`]: {
                                                                    borderBottom: "1px solid black"
                                                                }
                                                            }}
                                                            size="small" >
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>M</TableCell>
                                                                    <TableCell>F</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                    <TableCell sx={{ color: red[500] }} align="center">2nd Level
                                                        <Table
                                                            sx={{
                                                                [`& .${tableCellClasses.root}`]: {
                                                                    borderBottom: "1px solid black"
                                                                }
                                                            }}
                                                            size="small" >
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>M</TableCell>
                                                                    <TableCell>F</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        CONTRACT OF SERVICE
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        JOB ORDERS
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        HONORARIUM
                                        <Table
                                            sx={{
                                                [`& .${tableCellClasses.root}`]: {
                                                    borderBottom: "1px solid black"
                                                }
                                            }}
                                            size="small" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>M</TableCell>
                                                    <TableCell>F</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ color: blue[500], verticalAlign: 'top' }} align="center">
                                        TOTAL MAN POWER
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inventoryPersonnelState.length > 0 ? (
                                    <React.Fragment>
                                        {inventoryPersonnelState && inventoryPersonnelState.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left">{row.dept_title}</TableCell>
                                                <TableCell align="center">
                                                    <Permanent data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Cotermino data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Elective data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Casual data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Cos data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Jo data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Honorarium data={row} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Total data={row} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ) : (
                                    <>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((row, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                                <TableCell align="right"><Skeleton variant="text" width="100%" height="2rem" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                </Box>
            )}
        </Box>
    )
}

export default InventoryPersonnel