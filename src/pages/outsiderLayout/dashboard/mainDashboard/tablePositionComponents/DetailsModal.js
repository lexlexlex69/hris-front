import React, { useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import moment from 'moment'
import Bl from '../../../../../assets/img/bl.png'

const f = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })

function DetailsModal({ data }) {
  return (
    <Box sx={{ height: '80vh', overflowY: 'scroll' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: .5, alignItems: 'center' }}>
        <img src={Bl} alt="" width="75px" />
        <Typography>
          City Goverment of Butuan
        </Typography>
      </Box>
      <hr />
      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>Place of Assignment:</TableCell>
              <TableCell>{data?.dept_title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Position Title:</TableCell>
              <TableCell>{data?.position_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plantilla No:</TableCell>
              <TableCell>{data?.plantilla_id ? data?.plantilla_item : data?.mpr_no}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Salary/Job/Pay Grade:</TableCell>
              <TableCell>{data?.emp_status === 'RE' ? data?.plantilla_sg : data?.emp_status === 'CS' ? data?.plantilla_casual_sg : data?.emp_status === 'JO' || data?.emp_status === 'COS' ? 'NONE' : ''}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>monthly Salary:</TableCell>
              <TableCell>{data?.plantilla_id ? isNaN(data?.monthly_salary) ? '' : f.format(data?.monthly_salary) : isNaN(data?.proposed_rate) ? '' : f.format(data?.proposed_rate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Eligibilty:</TableCell>
              <TableCell>{data?.qs?.eligibility}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Education:</TableCell>
              <TableCell>{data?.qs?.education}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Training:</TableCell>
              <TableCell>{data?.qs?.training}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Work Experience:</TableCell>
              <TableCell>{data?.qs?.experience}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Competency:</TableCell>
              <TableCell>{data?.qs?.competency}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography sx={{ mt: 3 }}>Instructions/Remarks: </Typography>
      <Typography sx={{ ml: 2 }}>Interested and qualified applicants should signify their interest in writing. Attach the following documentsto the application letter and send to the address below not later than {moment(data.closing_date).format('MMM DD,YYYY')}.</Typography>
      <Typography sx={{ mt: .5 }}>1. Fully accomplished Personal Data Sheet (PDS) with recent passport-sized picture (CS Form No. 212,Revised 2017) which can be downloaded at www.csc.gov.ph;</Typography>
      <Typography sx={{ mt: .5 }}>2. Performance rating in the last 3 rating periods (if applicable);</Typography>
      <Typography sx={{ mt: .5 }}>3. Photocopy of certificate of eligibility/rating/license;</Typography>
      <Typography sx={{ mt: .5 }}>4. Photocopy of Transcript of Records;</Typography>
      <Typography sx={{ mt: .5 }}>5. Omnibus certification of authenticity and veracity of all documents submitted;</Typography>
      <Typography sx={{ mt: .5 }}>6. Other documents per DepEd Order # 7 and 22 s. 2015.</Typography>
      <Typography sx={{ mt: 3 }}><b>QUALIFIED APPLICANTS </b> are advised to hand in or send through courier/email their application to :  </Typography>
      <Typography sx={{ mt: .5 }}><b>Name</b></Typography>
      <Typography sx={{ mt: 2 }}><b>HRMO</b></Typography>
      <Typography sx={{ mt: .5 }}>Jose Rosales Ave, Butuan City, 8600 Agusan Del Norte</Typography>
      <Typography sx={{ mt: .5 }}><b>N/A</b></Typography>
      <Typography sx={{ color: 'error.main', mt: 2 }}><b>APPLICATIONS WITH INCOMPLETE DOCUMENTS SHALL NOT BE ENTERTAINED.</b></Typography>
      <Typography sx={{ color: 'primary.main', mt: 2 }}><b>POSTING DATE : {moment(data.posting_date).format('MMM DD, YYYY')}</b></Typography>
      <Typography sx={{ color: 'error.main' }}><b>CLOSING DATE : {moment(data.closing_date).format('MMM DD, YYYY')}</b></Typography>
    </Box>
  )
}

export default React.memo(DetailsModal)