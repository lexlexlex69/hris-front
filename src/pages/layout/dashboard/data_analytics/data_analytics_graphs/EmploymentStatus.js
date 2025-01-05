import React, { useEffect, useState } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from "highcharts/modules/drilldown.js";
import exporting from "highcharts/modules/exporting.js";
import exportData from "highcharts/modules/export-data.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { red, green, blue, yellow } from '@mui/material/colors'
import axios from 'axios'

import { getEmployeeStatus, getEmployeeStatusInfoPerOffice } from '../Controller'
import DataAnalyticsSkeleton from './DataAnalyticsSkeleton'

drilldown(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

function EmploymentStatus(props) {
    const [offices, setOffices] = useState('')
    const [loader, setLoader] = useState(true)
    const [options, setOptions] = useState('')


    const [category, setCategory] = useState('')
    const [tableState, setTableState] = useState('')

    // pagination
    const [count, setCount] = useState(0)
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
        getEmployeeStatusInfoPerOffice(category, setTableState, setLoader, setCount, value, setPage, props.category)
    };

    useEffect(() => {
        let cat = props.category === 'PERMANENT' ? 'RE' : props.category === 'TEMPORARY' ? 'TE' : props.category === 'PRESIDENTIAL APPOINTEES' ? 'PA' : props.category === 'CO-TERMINOS' ? 'CT' : props.category === 'CONTRACTUAL' ? 'CN' : props.category === 'CASUAL' ? 'CS' : props.category === 'JOB ORDER' ? 'JO' : props.category === 'CONSULTANT' ? 'CO' : props.category === 'CONTRACT OF SERVICE' ? 'COS' : 0
        console.log(cat)
        axios.post(`/api/dashboard/data_analytics/getEmployeeStatusByCat`, {
            category: cat
        })
            .then(res => {
                console.log(res)
                let categories = []
                let count = []
                res.data.map(item => {
                    categories.push(item.title)
                    count.push(item.count)
                })
                setOptions({
                    chart: {
                        type: 'bar',
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: 'Total ' + props.category + ' per offices'
                    },
                    xAxis: {
                        categories: categories,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Number of employees',
                            align: 'high'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    tooltip: {
                        valueSuffix: ' employees'
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true
                            },
                        },
                        series: {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: (e) => {
                                        setCategory(e.point.category)
                                        getEmployeeStatusInfoPerOffice(e.point.category, setTableState, setLoader, setCount, '', setPage, props.category)
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -40,
                        y: -10,
                        floating: true,
                        borderWidth: 1,
                        borderRadius: 5,
                        backgroundColor:
                            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                        shadow: true
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        // name: '',
                        data: count,
                    }
                    ]
                })
            })
            .catch(err => console.log(err))
    }, [])
    return (
        <div>
            {options ? (
                <>
                    <Box sx={{ maxHeight: '45vh', overflowY: 'scroll' }}>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options}
                        />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>Office: <span style={{ color: blue[500] }}>{category}</span></Typography>
                            <Typography sx={{ mr: 2 }}>total rows: <span style={{ color: blue[500] }}>{count}</span></Typography>
                        </Box>
                        <hr />
                        {loader ? null : <LinearProgress />}
                        <TableContainer component={Paper} sx={{ maxHeight: '34vh' }}>
                            <Table size="small" aria-label="simple table" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="cgb-color-table" sx={{ color: '#fff' }}>NAME</TableCell>
                                        <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="left">BIO ID</TableCell>
                                        <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="left">EMPLOYMENT STATUS</TableCell>
                                        <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="right">ACTL SALARY</TableCell>
                                        <TableCell className="cgb-color-table" sx={{ color: '#fff' }} align="right">AUTH SALARY</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableState && tableState.map((row, index) => (
                                        <Fade key={index} in>
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.emp_fname} {row.emp_mname} {row.emp_lname}
                                                </TableCell>
                                                <TableCell align="left">{row.bio_id}</TableCell>
                                                <TableCell align="left">{row.emp_type}</TableCell>
                                                <TableCell align="right">{row.actl_salary}</TableCell>
                                                <TableCell align="right">{row.auth_salary}</TableCell>
                                            </TableRow>
                                        </Fade>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {tableState ? (
                            <Stack spacing={1} sx={{ pl: 1, mt: 1 }}>
                                {/* <Typography>page: {page}</Typography> */}
                                <Pagination count={Math.ceil(count / 5)} page={page} onChange={handleChange} />
                            </Stack>
                        ) : null}
                    </Box>
                </>
            ) : (
                <DataAnalyticsSkeleton />
            )}

        </div>
    )
}

export default EmploymentStatus