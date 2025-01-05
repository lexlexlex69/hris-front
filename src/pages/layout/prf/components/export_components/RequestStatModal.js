import React, { useState } from 'react'
import CommonModal from '../../../../../common/Modal'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { Box, Container, Stack, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import { blue } from '@mui/material/colors';
import { TableContainerComp } from './ExportComp';
import { isEmptyObject } from 'jquery';
const colorBlue = blue[500];

const requestStatHeader = [
  { id: 1, headerName: 'office/department', width: "50px" },
  { id: 2, headerName: 'request status', width: "100px" },
  { id: 3, headerName: 'req. remarks', width: "100px" },
  { id: 4, headerName: 'date', width: "100px" },
  { id: 5, headerName: 'time', width: "110px" }
]

const requestExcludedStatus = ['FOR CBD APPROVAL', 'FOR CHRMD APPROVAL', 'FOR OCM APPROVAL', 'FOR OCVM APPROVAL', 'POOLED COMPLETE', 'ASSESSMENT COMPLETE', 'SELECTION COMPLETE', 'INDORSEMENT COMPLETE']


function RequestStatModal({ deptData, signings, items, display = false }) {
  const [open, setOpen] = useState(false);

  const handleDoubleClick = () => {
    setOpen(!open);
  };

  // Function to determine the next signer based on request status
  const getNextSigner = (signings, items, deptData) => {
    const latestSigning = signings.filter(o => o.id_pr_form === items.id).reverse()[0];
    const { req_by_id, avail_app_id, rev_by_id, approval_id } = items;

    if (!latestSigning) {
      return {
        department: '',
        requestStat: 'Signatory for the Head of Requesting Department/Office',
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      };
    }

    const excludedStatuses = ['RETURNED FOR REVISION', 'SEE ME', 'CANCELLED', 'DISAPPROVED'];
    if (excludedStatuses.includes(latestSigning.request_stat)) {
      const test = deptData.find(d => d.dept_code === latestSigning.dept_code).dept_title
      return {
        department: test,
        requestStat: latestSigning.request_stat,
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      };
    }

    const approvedReturn = ['FOR CBD APPROVAL', 'FOR CHRMD APPROVAL', 'FOR OCM APPROVAL', 'FOR OCVM APPROVAL'];
    if (approvedReturn.includes(latestSigning.request_stat)) {
      // const test = deptData.find(d => d.dept_code === latestSigning.dept_code).dept_title
      return {
        department: 'FROM REQUESTING DEPARTMENT',
        requestStat: latestSigning.request_stat,
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      }
    }

    if (latestSigning.request_stat === 'POOLED COMPLETE') {
      const test = deptData.find(d => d.dept_code === latestSigning.dept_code).dept_title
      return (
        {
          department: test,
          requestStat: 'ASSESSMENT PENDING',
          add_remarks: latestSigning.add_remarks,
          date: latestSigning.date,
          time: latestSigning.time
        }
      )
    }

    if (latestSigning.request_stat === 'ASSESSMENT COMPLETE') {
      return (
        {
          department: 'REQUESTING DEPARTMENT',
          requestStat: 'SELECTION PENDING',
          add_remarks: latestSigning.add_remarks,
          date: latestSigning.date,
          time: latestSigning.time
        }
      )
    }

    if (latestSigning.request_stat === 'SELECTION COMPLETE') {
      const test = deptData.find(d => d.dept_code === latestSigning.dept_code).dept_title
      return (
        {
          department: test,
          requestStat: 'INDORSEMENT PENDING',
          add_remarks: latestSigning.add_remarks,
          date: latestSigning.date,
          time: latestSigning.time
        }
      )
    }

    if (latestSigning.request_stat === 'INDORSEMENT COMPLETE') {
      const test = deptData.find(d => d.dept_code === latestSigning.dept_code).dept_title
      return (
        {
          department: test,
          requestStat: 'DOCUMENT PROCESS PENDING',
          add_remarks: latestSigning.add_remarks,
          date: latestSigning.date,
          time: latestSigning.time
        }
      )
    }

    if (latestSigning.request_stat === 'ON-HOLD') {
      const test = deptData.find(d => d.dept_code === latestSigning.dept_code).dept_title
      return (
        {
          department: test,
          requestStat: latestSigning.request_stat,
          add_remarks: latestSigning.add_remarks,
          date: latestSigning.date,
          time: latestSigning.time
        }
      )
    }

    // DONE or REQUEST COMPLETED
    // if (latestSigning.request_stat === 'REQUEST COMPLETED') {
    //   return (
    //     {
    //       department: '',
    //       requestStat: 'CLOSE PENDING',
    //       remarks: latestSigning.remarks,
    //       date: latestSigning.date,
    //       time: latestSigning.time
    //     }
    //   )
    // }


    if (!latestSigning.req_by_id && !latestSigning.avail_app_id && !latestSigning.rev_by_id && !latestSigning.approval_id) {
      return {
        department: '',
        requestStat: 'Signatory for the Head of Requesting Department/Office',
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      };
    }

    if (latestSigning.req_by_id && !latestSigning.avail_app_id && !latestSigning.rev_by_id && !latestSigning.approval_id) {
      return {
        department: 'CITY BUDGET DEPARTMENT',
        requestStat: 'PENDING',
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      };
    }

    if (latestSigning.avail_app_id && !latestSigning.rev_by_id && !latestSigning.approval_id) {
      return {
        department: 'CITY HUMAN RESOURCE MANAGEMENT DEPARTMENT',
        requestStat: 'PENDING',
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      };
    }

    if (latestSigning.rev_by_id && !latestSigning.approval_id) {
      if (req_by_id && avail_app_id && rev_by_id) {
        const getIdRev = signings.find(i => i.id === rev_by_id)
        const getIdReq = signings.find(i => i.id === req_by_id)

        const execLegisSigner = deptData.find(d => d.dept_code === getIdReq.dept_code);
        if (execLegisSigner && getIdRev) {
          const nextSigner = execLegisSigner.execs_legis === 1 ? 'OFFICE OF THE CITY MAYOR' : 'OFFICE OF THE CITY VICE MAYOR';
          return {
            department: nextSigner,
            requestStat: 'PENDING',
            add_remarks: latestSigning.add_remarks,
            date: latestSigning.date,
            time: latestSigning.time
          };
        }
      }
    }


    if (latestSigning.avail_app_id) {
      if (req_by_id && avail_app_id && rev_by_id, approval_id) {
        const getIdApp = signings.find(i => i.id === approval_id)
        const execLegisSigner = deptData.find(d => d.dept_code === getIdApp.dept_code);
        return (
          {
            department: execLegisSigner.execs_legis === 1 ? 'OFFICE OF THE CITY MAYOR' : 'OFFICE OF THE CITY VICE MAYOR',
            requestStat: 'POOLING APPLICANTS PENDING',
            add_remarks: latestSigning.add_remarks,
            date: latestSigning.date,
            time: latestSigning.time
          }
        )
      }
    }

    if (!latestSigning.dept_code) {
      return {
        department: '',
        requestStat: latestSigning.request_stat,
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      };
    } else {
      const office_title = deptData.find(d => d.dept_code === latestSigning.dept_code).dept_title
      // Default case
      return {
        department: office_title,
        requestStat: latestSigning.request_stat,
        add_remarks: latestSigning.add_remarks,
        date: latestSigning.date,
        time: latestSigning.time
      };
    }
  };

  const nextSigner = getNextSigner(signings, items, deptData);

  return (
    <>
      {display === true && (
        <Container py={3} px={1}>
          <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ padding: "1rem 0" }}> REQUEST STATUS LOGS </Typography>
          <TableContainerComp maxHeight="400px">
            <TableHead>
              <TableRow>
                {requestStatHeader.map((o, indx) => (
                  <TableCell size="small" key={o.headerName + "-" + indx} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: o.width, fontSize: "14px", backgroundColor: "#1565C0 !important" }} >
                    {o.headerName.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {signings.filter(obj => obj.id_pr_form === items.id).reverse().map((f, index) => (
                <TableRow key={f.id + '-' + index}>
                  {(f.request_stat === "Signatory for the Head of Requesting Department/Office") ? (
                    <>
                      <TableCell align="center">
                        -
                      </TableCell>
                      <TableCell>
                        {f.request_stat}
                      </TableCell>
                      <TableCell>
                        {f.add_remarks}
                      </TableCell>
                      <TableCell>
                        {f.date}
                      </TableCell>
                      <TableCell>
                        {f.time}
                      </TableCell>
                    </>
                  ) : requestExcludedStatus.includes(f.request_stat) ?
                    (
                      <>
                        <TableCell align="center">
                          {nextSigner.department}
                        </TableCell>
                        <TableCell>
                          {f.request_stat}
                        </TableCell>
                        <TableCell>
                          {f.add_remarks}
                        </TableCell>
                        <TableCell>
                          {f.date}
                        </TableCell>
                        <TableCell>
                          {f.time}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell align="center">
                          {deptData.filter(o => o.dept_code === f.dept_code).map(f => f.dept_title)}
                        </TableCell>
                        <TableCell>
                          {f.request_stat}
                        </TableCell>
                        <TableCell>
                          {f.add_remarks}
                        </TableCell>
                        <TableCell>
                          {f.date}
                        </TableCell>
                        <TableCell>
                          {f.time}
                        </TableCell>
                      </>
                    )}
                </TableRow>
              ))}
            </TableBody>
          </TableContainerComp>
        </Container >
      )}

      {display === false && (
        <>
          <Grid2 container spacing={1} onDoubleClick={handleDoubleClick} alignItems="center" sx={{ cursor: "pointer" }}>
            {nextSigner.requestStat === "Signatory for the Head of Requesting Department/Office" ? (
              <>
                <Grid2 item xs={12} lg={12}>
                  <Typography variant="subtitle2" sx={{ fontSize: "12px", textAlign: 'center' }}>
                    {nextSigner.requestStat}
                  </Typography>
                </Grid2>
              </>
            ) : (
              <>
                <Grid2 item xs={12} lg={6}>
                  <Typography variant="subtitle2" sx={{ fontSize: "12px" }} color={colorBlue}>
                    {nextSigner.department}:
                  </Typography>
                </Grid2 >
                <Grid2 item xs={12} lg={6} sx={{ whiteSpace: 'normal' }}>
                  <Typography variant="subtitle2" sx={{ fontSize: "12px", textDecoration: "underline", whiteSpace: 'normal' }} color={colorBlue}>
                    {nextSigner.requestStat}
                  </Typography>
                </Grid2>
              </>
            )
            }
          </Grid2 >

          <CommonModal open={open} setOpen={setOpen} customWidth={'60%'}>
            <Container py={3} px={1}>
              <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ padding: "1rem 0" }}> REQUEST STATUS LOGS </Typography>
              <TableContainerComp maxHeight="400px">
                <TableHead>
                  <TableRow>
                    {requestStatHeader.map((o, indx) => (
                      <TableCell size="small" key={o.headerName + "-" + indx} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: o.width, fontSize: "14px", backgroundColor: "#1565C0 !important" }} >
                        {o.headerName.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {signings.filter(obj => obj.id_pr_form === items.id).reverse().map((f, index) => (
                    <TableRow key={f.id + '-' + index}>
                      {(f.request_stat === "Signatory for the Head of Requesting Department/Office") ? (
                        <>
                          <TableCell align="center">
                            -
                          </TableCell>
                          <TableCell>
                            {f.request_stat}
                          </TableCell>
                          <TableCell>
                            {f.add_remarks}
                          </TableCell>
                          <TableCell>
                            {f.date}
                          </TableCell>
                          <TableCell>
                            {f.time}
                          </TableCell>
                        </>
                      ) : requestExcludedStatus.includes(f.request_stat) ?
                        (
                          <>
                            <TableCell align="center">
                              {nextSigner.department}
                            </TableCell>
                            <TableCell>
                              {f.request_stat}
                            </TableCell>
                            <TableCell>
                              {f.add_remarks}
                            </TableCell>
                            <TableCell>
                              {f.date}
                            </TableCell>
                            <TableCell>
                              {f.time}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell align="center">
                              {deptData.filter(o => o.dept_code === f.dept_code).map(f => f.dept_title)}
                            </TableCell>
                            <TableCell>
                              {f.request_stat}
                            </TableCell>
                            <TableCell>
                              {f.add_remarks}
                            </TableCell>
                            <TableCell>
                              {f.date}
                            </TableCell>
                            <TableCell>
                              {f.time}
                            </TableCell>
                          </>
                        )}
                    </TableRow>
                  ))}
                </TableBody>
              </TableContainerComp>
            </Container >
          </CommonModal >
        </>
      )}
    </>
  );
}


export default RequestStatModal
