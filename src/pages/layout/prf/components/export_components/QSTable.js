import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useEffect } from 'react'


function QSTable(props) {
  let colDataQS = props.colDataQS
  let reqDataForm = props.requestDataForm
  let dataQs = props.dataQs
  let children = props.children

  return (
    <>
      <Paper sx={{ overflow: 'hidden', }}>
        <TableContainer sx={{ height: "380px" }}>
          <Table stickyHeader aria-label="sticky table" sx={{ display: 'block' }}>
            <TableHead>
              <TableRow>
                {colDataQS.map((column, index) => (
                  <TableCell key={column.headerName + index} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: column.width, backgroundColor: "#1565C0 !important", width: "100vw" }}>
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{ display: 'block' }}>
              {reqDataForm.map((item) => (
                dataQs.filter(obj => obj.id === item.id).map((filtered, index) => (
                  <TableRow key={filtered.category + '-' + index} sx={{ display: 'block' }}>
                    <TableCell sx={{ display: 'block' }}>{filtered.category}</TableCell>
                  </TableRow>
                ))
              ))}
              <TableCell sx={{ display: 'block' }}>
                {children}
              </TableCell>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper >
    </>
  )
}

export default QSTable