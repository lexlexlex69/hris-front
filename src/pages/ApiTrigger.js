import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { CircularProgress } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import * as XLSX from 'xlsx';
import { checkPermission, checkRolePermission } from './layout/permissionrequest/permissionRequest'
import { DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function ApiTrigger() {
  const [receivedData, setReceivedData] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [testData, setTestData] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  // const [selectedColumn, setSelectedColumn] = useState('all')
  const [selectedRows, setSelectedRows] = useState([])
  const [existedData, setExistedData] = useState([])
  const [notExistedData, setNotExistedData] = useState([])
  const navigate = useNavigate()
  const [dataPerPage, setDataPerPage] = useState(10)

  useEffect(() => {
    // check permission
    checkPermission(1)
      .then(res => {
        if (res.data) {
          axios.get(`https://test.butuan.gov.ph/hris-api/api/getEmpActive/b9e1f8a0553623f1:639a3e:17f68ea536b`)
            .then(res => {
              // after fetch save lyxs data to mysql database
              console.log(res)
              // console.log(res.data.response.filter(x => x.emp_no === '10006'))
              setTestData(res.data.response)

              // Save lyxs data to mysql database 
              // return axios.post(`/api/saveLyxsToDb`, { data: res.data.response })
              return axios.post(`/api/getAlreadySavedLyxs`, { data: res.data.response })
            })
            .then(res => {
              if (res.status === 200) {
                setStatus(true)
                // exportToExcel(res.data)
                setNotExistedData(res.data.not_existed_data)
                setExistedData(res.data.existed_data)
              }
              else {
                setStatus(false)
              }
            })
            .catch(err => {
              setStatus(false)
            })
        } else {
          navigate(`/${process.env.REACT_APP_HOST}`)
        }
      })
      .catch(err => {
        navigate(`/${process.env.REACT_APP_HOST}`)
      })

  }, [])

  useEffect(() => {
    console.log(notExistedData)
  }, [notExistedData])

  const exportToExcel = (data) => {
    console.log(data)
    // returns data with two sheets one for existed_data and one for not_existed_data
    const workbook = XLSX.utils.book_new();
    const sheet1 = XLSX.utils.json_to_sheet(data.existed_data);
    const sheet2 = XLSX.utils.json_to_sheet(data.not_existed_data);
    XLSX.utils.book_append_sheet(workbook, sheet1, "existed_data");
    XLSX.utils.book_append_sheet(workbook, sheet2, "not_existed_data");
    XLSX.writeFile(workbook, "lyxs_data.xlsx");

    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    // XLSX.writeFile(workbook, "employee_data.xlsx");
  };

  // const filteredData = testData?.filter(item => {
  //   if (!searchTerm) return true;

  //   if (selectedColumn === 'all') {
  //     return Object.values(item).some(value =>
  //       value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   return item[selectedColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  // });
  // Get dynamic columns from the first data item
  const columns = testData && testData.length > 0
    ? Object.keys(testData[0])
    : []

  // Format column header text
  const formatColumnHeader = (column) => {
    return column
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const handleAddRow = (e) => {
    e.preventDefault();

    const selectedData = notExistedData.filter((row, index) =>
      selectedRows.includes(index)
    );

    axios.post('/api/saveLyxsToDb', { data: selectedData })
      .then(res => {
        if (res.status === 200) {
          toast.success('Successfully added to database!');

          return
        } else {
          toast.error('Failed to add to database!');
        }
      })
      .catch(err => {
        toast.error(err.message);
      })
  }

  const fetchExistedInLexes = () => {
    axios.post(`/api/getAlreadySavedLyxs`, { data: testData })
      .then(res => {
        if (res.status === 200) {
          setNotExistedData(res.data.not_existed_data)
          setExistedData(res.data.existed_data)
        } else {
          console.log(res)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      {!status ?
        <Typography textAlign="center" variant='h3'>
          Obtaining Employee Data from LEXES
        </Typography>
        :
        <></>
      }

      {status === true ? (
        <Stack spacing={1} sx={{ width: '100%', padding: 2 }}>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 5 }}>
            <CheckIcon sx={{ fontSize: 40 }} />
            <Typography>Personnel for Lexes table updated!</Typography>
          </Box> */}

          <Typography variant='caption'> Select rows to add to database </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" onClick={handleAddRow} disabled={selectedRows.length === 0}> Add to Database </Button>
            <Button variant='outlined' onClick={fetchExistedInLexes} color='primary'> Sync to DB </Button>
          </Box>
          <Box sx={{ width: '100%', height: '50%' }}>
            {/* <DataGrid
              rows={notExistedData.map((row, index) => ({
                id: index,
                ...row
              }))}
              columns={columns.map((column) => ({
                field: column,
                headerName: formatColumnHeader(column),
                width: 150,
                editable: true,
              }))}
              sx={{ height: 300, width: '100%' }}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
              onSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
                // Access selected data like this:
                const selectedData = notExistedData.filter((row, index) =>
                  newSelection.includes(index)
                );
                console.log('Selected data:', selectedData);
              }}
              onCellEditCommit={(params) => {
                const updatedData = notExistedData.map((row, index) => {
                  if (index === params.id) {
                    return { ...row, [params.field]: params.value };
                  }
                  return row;
                });
                setNotExistedData(updatedData);
              }}
            /> */}
            <DataGrid
              rows={notExistedData.map((row, index) => ({
                id: index,
                ...row
              }))}
              columns={columns.map((column) => ({
                field: column,
                headerName: formatColumnHeader(column),
                width: 150,
                editable: true,
              }))}
              sx={{ height: '100vh', width: '100%' }}
              pageSize={dataPerPage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              checkboxSelection
              disableRowSelectionOnClick
              onSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
              }}
              onPageSizeChange={(newPageSize) => {
                setDataPerPage(newPageSize);
              }}
              onCellEditCommit={(params) => {
                const updatedData = notExistedData.map((row, index) => {
                  if (index === params.id) {
                    return { ...row, [params.field]: params.value };
                  }
                  return row;
                });
                setNotExistedData(updatedData);
              }}
            />
          </Box>
        </Stack>
      ) : status === false ? (
        <>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 5 }}>
            <CloseIcon sx={{ fontSize: 40 }} />
            <Typography>Something  went wrong!</Typography>
          </Box>
          {/* <Box sx={{ width: '0%', padding: '1rem' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                select
                label="Search in"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                sx={{ minWidth: 200 }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="all">All Columns</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {formatColumnHeader(column)}
                  </option>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>

            <TableContainer component={Paper} sx={{ height: '60vh', overflowY: 'scroll' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {formatColumnHeader(column)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData?.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column}>
                          {row[column]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box> */}
        </>
      ) : (
        <CircularProgress size={74} sx={{ mt: 5 }} />
      )}
    </Box>
  )
}

export default ApiTrigger