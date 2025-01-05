import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import DocumentHeader from "../component/DocumentHeader";
import DocumentFooter from "../component/DocumentFooter";
import { getAcronym } from "../../components/export_components/ExportComp";
import { PrfStateContext } from "../../PrfProvider";
import { isEmptyObject } from "jquery";


<style jsx> {`
    .endorsement-section {
      margin: 1rem 0;
    }
    .field-label {
      width: 50px;
      font-weight: bold;
    }
    .field-value {
      padding-left: 10px;
    }
    table {
      width: 100%;
    }
    .ql-align-justify {
      margin: 0px;
    }
    .ql-indent-1 {
      padding-left: 3em;
    }
    .ql-indent-2 {
      padding-left: 6em;
    }
    .ql-indent-3 {
      padding-left: 9em;
    }
    .ql-indent-4 {
      padding-left: 12em;
    }
    @media print {
      .page-break {
        page-break-before: always;
      }
      .no-page-break {
        page-break-inside: avoid;
      }
    }
  `}</style>;

export const IndorsementDoc = React.forwardRef(({ headSignatory, componentRef, data }, ref) => {
  return (
    <>
      <Box ref={componentRef} sx={{ position: 'relative', fontSize: '14px', display: 'none', '@media print': { display: 'block' } }}>
        {!isEmptyObject(data) && (
          <Box className="no-page-break" sx={{ position: 'relative', '@media print': { pageBreakBefore: 'auto' } }}>
            <Box sx={{ width: '100%', paddingBottom: '6rem', height: '100%', position: 'relative' }}>
              <Box sx={{ padding: '0px 3rem 0px 4rem', '@media print': { position: 'fixed', top: '0', zIndex: '9999', marginTop: '1.5rem', width: '100%', pageBreakBefore: 'auto', pageBreakAfter: 'auto' } }}>
                <DocumentHeader />
              </Box>

              <Box sx={{ padding: '0px 6rem 0px 5rem', fontFamily: 'Cambria', '@media print': { marginTop: '7.75rem', position: 'relative' } }} >
                <Box sx={{ fontFamily: "Cambria" }}>
                  <p style={{ margin: 0, fontSize: `calc(${'14px'} + 2px)` }}>
                    <strong>1<sup>ST</sup> INDORSEMENT</strong>
                  </p>
                  <p style={{ margin: '1.75rem 0px' }}></p>
                  <p style={{ margin: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '6rem 1fr', gap: '0.75rem', fontSize: '14px' }}>
                      <div> TO: </div>
                      {headSignatory.dh_signatory.filter((it) => (it.dept_code === 1)).map((f, index) => (
                        <div key={index}>
                          <div style={{ fontWeight: 'bold' }}> {`Engr. ${f.fname} ${f.mname[0]}. ${f.lname}`} </div>
                          <div> {f.position_name} </div>
                        </div>
                      ))}
                      <div> FROM: </div> <div style={{ fontWeight: 'bold' }}> {"This Office"} </div>
                      <div> DATE: </div> <div style={{ fontWeight: 'bold' }}> {moment().format("MMMM DD, YYYY")} </div>
                      <div> SUBJECT: </div> <div style={{ fontWeight: 'bold' }}> {`MANPOWER REQUEST FORM – ${getAcronym(data.prf.office_dept)}`} </div>
                    </div>
                  </p>
                </Box>

                <div style={{ lineHeight: '17px' }}>
                  <div style={{ borderTop: '1px solid black', borderBottom: '1px solid black', padding: '1px', margin: '1rem 0rem 1rem 0rem' }} ></div>
                  <div style={{ textAlign: 'justify' }}>
                    This is to respectfully endorse herein the following Manpower Request Form of the {data.prf.office_dept} with the following details, viz:&nbsp;
                  </div>
                  <div style={{ margin: '0.5rem 1.5rem' }}>
                    <TableContent data={data} />
                  </div>
                  <div style={{ textAlign: 'justify' }}>
                    Please note that the said requests are assessed and reviewed by the CHRMD and CBD to ensure the availability of appropriation.&nbsp;
                  </div>
                  <br />
                  <div style={{ textAlign: 'justify' }}>
                    For your signature and approval. Thank you very much.
                  </div>
                  <br />
                  <div style={{ textAlign: 'justify' }}>
                    Respectfully yours,
                  </div>
                  <br />
                </div>
                <br />
                {headSignatory.dh_signatory.filter((it) => (it.dept_code === 12)).map((f, index) => (
                  <div style={{ margin: '0', lineHeight: '17px', }}>
                    <div style={{ fontWeight: "bold" }}>
                      {`${f.fname} ${f.mname[0]}. ${f.lname}, MPA`}
                    </div>
                    <div style={{ fontStyle: "italic" }}>
                      {f.position_name.split('(')[0]}
                    </div>
                    <div style={{ fontStyle: "italic" }}>
                      {f.description}
                    </div>
                  </div>
                ))}
              </Box>
            </Box >
            <Box sx={{ width: '100%', padding: '0px 0px 0px 5rem', '@media print': { position: 'fixed', bottom: '0', zIndex: '9999', marginBottom: '1rem', pageBreakBefore: 'auto', pageBreakAfter: 'auto' } }}>
              <DocumentFooter />
            </Box>
          </Box>
        )}
      </Box >
    </>
  );
})

export default IndorsementDoc

const indorsementTable = [
  // { id: 1, headerName: 'Office/Department', width: '100px' },
  { id: 2, headerName: 'MPR NO.', width: '100px' },
  { id: 3, headerName: 'HEAD COUNT', width: '100px' },
  { id: 4, headerName: 'STATUS', width: '100px' },
  { id: 5, headerName: 'MONTHLY RATE', width: '100px' },
  { id: 6, headerName: 'REMARKS', width: '300px' },
]

function TableContent({ data }) {
  const { natureReq } = useContext(PrfStateContext)

  const getValueSalaryGrade = (sg) => {
    if (sg !== undefined || sg !== null) {
      if (sg > 30) {
        return sg
      } else {
        return '27,000.00'
      }
    }
  }

  const getNatureReq = (item) => {
    if (item) {
      let f = natureReq.filter(opt => JSON.parse(item).includes(opt.id))
      return f
    } else {
      return ''
    }
  }

  let test = getNatureReq(data.prf.nature_req)

  return (
    <>
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              {indorsementTable.map((item, index) => (
                <TableCell style={{ width: item.width, fontSize: '12px', fontFamily: 'Cambria', padding: '4px', backgroundColor: 'rgb(31, 78, 121)', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', lineHeight: '17px' }}> {item.headerName} </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isEmptyObject(data) && (
              <TableRow>
                <TableCell sx={{ fontSize: '12px', lineHeight: '17px', fontFamily: 'Cambria', border: '1px solid black', textAlign: 'center', }}> {data.prf.prf_no} </TableCell>
                <TableCell sx={{ fontSize: '12px', lineHeight: '17px', fontFamily: 'Cambria', border: '1px solid black', textAlign: 'center', }}> {data.prf.head_cnt} </TableCell>
                <TableCell sx={{ fontSize: '12px', lineHeight: '17px', fontFamily: 'Cambria', border: '1px solid black', textAlign: 'center', }}> {data.prf.emp_stat} </TableCell>
                <TableCell sx={{ fontSize: '12px', lineHeight: '17px', fontFamily: 'Cambria', border: '1px solid black', textAlign: 'center', }}> SG {data.prf.pay_sal} ({getValueSalaryGrade(data.prf.pay_sal)}) </TableCell>
                <TableCell sx={{ fontSize: '12px', lineHeight: '17px', fontFamily: 'Cambria', border: '1px solid black', textAlign: 'left', }}>
                  <div style={{ fontWeight: 'bold' }}>
                    {test.map((i, indx) => (
                      indx === 0 ? i.category_name : ', ' + i.category_name
                    ))}
                  </div>
                  <div style={{ fontWeight: 'bold' }}> &emsp;&ensp;- {data.prf.position_title} </div>
                  <div style={{ fontStyle: 'italic' }}> {data.prf.office_dept} </div>
                  <div style={{ fontStyle: 'italic' }}>
                    {data.prf.div_name && (data.prf.div_name)}
                    {data.prf.sec_name && (' - ' + data.prf.sec_name)}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}