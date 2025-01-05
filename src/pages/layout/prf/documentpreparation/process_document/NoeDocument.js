import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import moment from "moment";
import { isEmptyObject } from "jquery";
import { useReactToPrint } from "react-to-print";
import { Print as PrintIcon } from '@mui/icons-material';
import { autoCapitalizeFirstLetter, formatName } from "../../../customstring/CustomString";
import axios from "axios";
import { CheckLetterHF } from "./component";

export const NoeDocument = React.forwardRef((props, ref) => {
  const [editToggler, setEditToggler] = useState(false)
  const testphpFormatComma = new Intl.NumberFormat("en-us", { currency: 'PHP' });
  const date = moment().format("DD MMMM YYYY");
  const [signatories, setSignatories] = useState(null)
  const [result, setResult] = useState({})
  const [loading, setLoading] = useState(true)
  const [editableContent, setEditableContent] = useState({})


  useEffect(() => {
    console.log(result)
  }, [result])
  useEffect(() => {
    let requestCount = 0;
    let successCount = 0;
    let failedCount = 0;
    const newResult = { successData: [], failedData: [] };

    props.data.applicantList.forEach((i, ix) => {
      axios.post(`/api/pds/print/getPersonalInformation${i.prf_applicant_id ? `?id=${i.prf_applicant_id}&&category=${i.is_employee === 1 ? 'employee' : 'applicant'}` : ''}`)
        .then(res => {
          newResult.successData.push(res.data.personal_information);
          successCount++;
        })
        .catch(err => {
          newResult.failedData.push(i);
          failedCount++;
        })
        .finally(() => {
          requestCount++;
          if (requestCount === props.data.applicantList.length) {
            setResult(newResult);
            setLoading(false);
          }
        });
    });

    console.log(props, ref)
    setSignatories({
      city_mayor_name: props.data.signatories.mayor.auth_name,
      city_mayor_pos: props.data.signatories.mayor.position,
      city_admin_name: props.data.signatories.admin.assigned_by,
      city_admin_pos: props.data.signatories.admin.position,
    })
  }, [])

  console.log(props, ref)

  const handleSave = () => {
    setEditToggler(false)
    setResult(prev => ({
      ...prev,
      successData: prev.successData.map((item, index) => ({
        ...item,
        fname: editableContent[index].fname,
        mname: editableContent[index].mname,
        lname: editableContent[index].lname,
        extname: editableContent[index].extname,
        rAddress: editableContent[index].rAddress,
        paddress: editableContent[index].paddress,
        tname: editableContent[index].tname,
      }))
    }))
  }

  const handleCancel = () => {
    setEditToggler(!editToggler)
  }

  const handleEdit = () => {
    setEditToggler(!editToggler)

    setEditableContent(result.successData.map(item => ({
      fname: item.fname,
      mname: item.mname,
      lname: item.lname,
      extname: item.extname,
      rAddress: item.rAddress,
      paddress: item.paddress,
      tname: item.tname
    })))
  }

  const handleContentChange = (index, field, value) => {
    setEditableContent(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value
      }
    }))
  }

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <>
      {loading ?
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size="30px" />
        </Box>
        : <>
          {editToggler && (
            <Box sx={{ display: 'flex', margin: '1rem 0', gap: '0.5rem' }}>
              <Button variant="contained" color="primary" onClick={handleSave}> Save </Button>
              <Button variant="contained" color="error" onClick={handleCancel} sx={{ marginLeft: '0.5rem' }}> Cancel </Button>
            </Box>
          )}

          {!editToggler && (
            <Box sx={{ display: 'flex', margin: '1rem 0', gap: '0.5rem' }}>
              <Button variant="contained" color="primary" onClick={handleEdit}> Edit </Button>
              <Button startIcon={<PrintIcon />} variant="contained" color="warning" onClick={handlePrint}> Print </Button>
            </Box>
          )}

          <Box ref={ref} sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            'media print': {
              display: 'block',
            },
          }}>
            {!isEmptyObject(props.data.applicantList) && result.successData.map((item, ix) => (
              <Box sx={{
                position: 'relative',
                fontFamily: 'Cambria',
                lineHeight: '1',
                borderRadius: '4px',
                boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                '@media print': {
                  pageBreakBefore: ix === 0 ? 'auto' : 'always',
                  borderRadius: '0',
                  boxShadow: 'none',
                }
              }}>
                {/* <Box sx={{ margin: '0rem 2rem 0rem', position: 'relative' }}> */}
                {/* <Box sx={{
                  // position: 'relative',
                  // margin: '0.5rem 0rem 0rem 1rem',
                  // height: '7rem',
                  // '@media print': { position: 'fixed', top: '0', left: '0', zIndex: '-1', marginLeft: '1.25rem', height: '9.45rem' }
                }}
                >
                  <img src={props.letterhead} style={{ width: '100%' }} alt="Letter head" />
                </Box> */}
                <CheckLetterHF letterData={props.letterhead} classname={'header'} imgstyle={{ width: '100%' }} letterName={'Letter Head'} />

                <Box className="body" sx={{
                  fontSize: '12px',
                  margin: '2rem 4rem',
                  position: 'relative',
                  '@media print': {
                    margin: '0 4rem 0',
                    zIndex: '9999'
                  }
                }}
                >
                  <Box>
                    <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>
                      NOTICE OF EMPLOYMENT
                    </div>
                    <div>
                      {date}
                    </div>
                  </Box>

                  {editToggler ?
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: '1rem' }}>
                      <TextField
                        value={editableContent[ix].fname}
                        onChange={(e) => handleContentChange(ix, 'fname', e.target.value)}
                        sx={{ '& .MuiInputBase-input': {} }}
                        variant="outlined"
                        label={<Typography variant="caption">First Name</Typography>}
                        size="small"
                      />

                      <TextField
                        value={editableContent[ix].mname}
                        onChange={(e) => handleContentChange(ix, 'mname', e.target.value)}
                        sx={{ '& .MuiInputBase-input': {} }}
                        variant="outlined"
                        label={<Typography variant="caption">Middle Name</Typography>}
                        size="small"
                      />

                      <TextField
                        value={editableContent[ix].lname}
                        onChange={(e) => handleContentChange(ix, 'lname', e.target.value)}
                        sx={{ '& .MuiInputBase-input': {} }}
                        variant="outlined"
                        label={<Typography variant="caption">Middle Name</Typography>}
                        size="small"
                      />

                      <TextField
                        value={editableContent[ix].extname}
                        onChange={(e) => handleContentChange(ix, 'extname', e.target.value)}
                        sx={{ '& .MuiInputBase-input': {} }}
                        variant="outlined"
                        label={<Typography variant="caption">Extension Name</Typography>}
                        size="small"
                      />
                      <TextField
                        value={editableContent[ix].rAddress}
                        onChange={(e) => handleContentChange(ix, 'rAddress', e.target.value)}
                        sx={{ '& .MuiInputBase-input': {} }}
                        variant="outlined"
                        label={<Typography variant="caption">Residential Address</Typography>}
                        size="small"
                      />
                      <TextField
                        value={editableContent[ix].paddress}
                        onChange={(e) => handleContentChange(ix, 'paddress', e.target.value)}
                        sx={{ '& .MuiInputBase-input': {} }}
                        variant="outlined"
                        label={<Typography variant="caption">Permanent Address</Typography>}
                        size="small"
                      />
                    </Box>
                    :
                    <>
                      <Box sx={{ textTransform: 'uppercase', margin: "2rem 0rem" }}>
                        <Box>
                          {formatName(item.fname, item.mname, item.lname, item.extname, 0) || 'APPLICANT NAME NOT FOUND'}
                        </Box>
                        <Box sx={{ fontWeight: 'bold' }}>
                          {item.rAddress ? item.rAddress : item.paddress ? item.paddress : ''}
                        </Box>
                      </Box>
                      <Box sx={{ marginBottom: "1rem" }}>
                        {/* Dear {item.sex === 'MALE' ? 'Mr.' : 'Ms.'} {item.lname}: */}
                        Dear Mr./Ms.: {item.lname}
                      </Box>
                      <Box sx={{ marginBottom: '1rem' }}>
                        Greetings!
                      </Box>
                      <Box sx={{ marginBottom: '1rem' }}>
                        We are happy to inform that you have been selected for the position of {autoCapitalizeFirstLetter(props.data.prfData['position_title'])} under the {autoCapitalizeFirstLetter(props.data.prfData['office_dept'])}. The said position shall be under a {props.data.prfData['emp_stat']} status with a gross monthly compensation of Php{testphpFormatComma.format(props.data.salaryData['sgValue'])} effective after compliance of the pre-employment requirements:
                      </Box>
                      {/* TABLE */}
                      <table style={{ borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'center', fontWeight: 'bold', verticalAlign: 'top', border: '1px solid black', width: '50%' }}> ORIGINAL </th>
                            <th style={{ textAlign: 'center', fontWeight: 'bold', verticalAlign: 'top', border: '1px solid black', width: '50%' }}> PHOTOCOPY </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ border: '1px solid black', verticalAlign: 'top', padding: '0.3rem' }}>
                              <ol style={{ textAlign: 'left', paddingLeft: '20px', marginBottom: '0px' }}>
                                {props.checkList.map((it, itx) => (
                                  it.type === 'original' && (
                                    <li>{it.label}</li>
                                  )
                                ))}
                              </ol>
                            </td>
                            <td style={{ border: '1px solid black', verticalAlign: 'top', padding: '0.3rem' }}>
                              <ol style={{ textAlign: 'left', paddingLeft: '20px', marginBottom: '0px' }}>
                                {props.checkList.map((it, itx) => (
                                  it.type === 'photocopy' && (
                                    <li>
                                      {it.label}
                                    </li>
                                  )
                                ))}
                              </ol>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Typography sx={{ fontSize: '10px', fontStyle: 'italic' }}>
                        *Professionals who are subject to the professional tax imposition pursuant to Section 139 of the Local Government Code are exempt from paying this fee
                      </Typography>
                      <Typography sx={{ fontSize: '10px', fontStyle: 'italic' }}>
                        **Shall be complied upon receipt of approved Contract and Indorsement signed by the City Treasurer’s Department
                      </Typography>

                      <Box sx={{ margin: '1rem 0' }}>
                        Kindly <strong>submit your complete requirements inside a white long folder with plastic cover</strong> to the Talent Acquisition Section - City Human Resource Management Department (CHRMD).
                      </Box>

                      <Box sx={{ marginBottom: '1rem' }}>
                        We are looking forward to having you on our team.
                      </Box>

                      <Box sx={{ marginBottom: '2rem' }}>
                        <Box>
                          <strong>{signatories.city_mayor_name}</strong>
                        </Box>
                        <Box>
                          {signatories.city_mayor_pos}
                        </Box>
                      </Box>

                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '50%' }}>
                              <Box sx={{ fontStyle: 'italic' }}>
                                For the Mayor:
                              </Box>
                            </th>
                            <th style={{ width: '50%' }}>
                              <Box sx={{ fontStyle: 'italic', textAlign: 'end' }}>
                                Acknowledged by:
                              </Box>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>&nbsp;</tr>
                          <tr>
                            <td>
                              <Box> &nbsp; </Box>
                              <Box sx={{ textTransform: 'uppercase' }}>
                                <strong>{signatories.city_admin_name}</strong>
                              </Box>
                              <Box>
                                {signatories.city_admin_pos}
                              </Box>
                            </td>

                            <td style={{ textAlign: 'end' }}>
                              <Box> _______________________________________________________ </Box>
                              <Box>
                                Signature over Printed Name of Candidate
                              </Box>
                              <Box>
                                Date: _______________________________________________
                              </Box>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <Box sx={{ fontStyle: 'italic', textAlign: 'start', marginRight: '2rem', fontSize: '8px' }}>
                        {/* MPR No. 1234-12 */}
                        PRF No. {props.data.prfData['prf_no']}
                      </Box>
                    </>
                  }

                </Box>

                <Box className="footer" sx={{
                  '@media print': { position: 'fixed', bottom: '0', left: '0', zIndex: '-1' }
                }}
                >
                  <img src={props.letterfoot} style={{ width: '100%' }} alt="Letter foot" />
                </Box>
                <CheckLetterHF letterData={props.letterfoot} classname={'footer'} boxstyle={{ '@media print': { position: 'fixed', bottom: '0', left: '0', zIndex: '-1' } }} imgstyle={{ width: '100%' }} letterName={'Letter Foot'} />
              </Box>
            ))}
          </Box>
        </>
      }


    </>
  )
})

export default NoeDocument
