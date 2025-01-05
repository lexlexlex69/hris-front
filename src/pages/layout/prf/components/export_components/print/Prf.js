import { useParams } from 'react-router-dom'

function Prf() {
  const { id } = useParams()
  return (
    <>
      <Box sx={{ maxWidth: '796.80px', margin: "auto" }}>
        <Stack direction="row" justifyContent="space-between" sx={{ padding: "4px 14px" }}>
          <Stack direction="row" alignItems="center">
            <div style={{ height: "100px", width: "116px", padding: "1rem", backgroundColor: "#FF0", borderRadius: "50%" }}>
              <div style={{ height: "100%", width: "100%" }}>
                logo
              </div>
            </div>
            <ul style={{ listStyle: "none", margin: "0 0 0 4px", padding: "0" }}>
              <li style={{ fontSize: "12px" }}>REPUBLIC OF THE PHILIPPINES</li>
              <li style={{ fontSize: "12px" }}>CITY GOVERNMENT OF BUTUAN</li>
              <li style={{ fontSize: "12px" }}><b> PERSONNEL REQUEST FORM (PRF) </b></li>
            </ul>
          </Stack>
          <Stack alignItems="center" justifyContent="center">
            <Box sx={{ border: "1px solid black", height: "75px", width: "154px" }}>
              <Box sx={{ lineHeight: "14px", textAlign: "center", padding: '3px 9px', backgroundColor: "rgb(165,165,165)", borderBottom: "1px solid black" }}>
                <div style={{ fontSize: "12px" }}>
                  <b>PRF Number</b>
                </div>
                <div style={{ fontSize: "10px" }}>
                  <em> (For CHRMD Use Only) </em>
                </div>
              </Box>
              <Box >
                <Box>24-000</Box>
              </Box>
            </Box>
          </Stack>
          {/* <img src="../../../../../assets/img/bl.svg" sx={{ height: "40px", width: "40px" }} /> */}
        </Stack>
        <TableContainer sx={{ overflowX: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ color: "transparent", opacity: "0" }}>
                {/* FOR SCALING */}
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>A</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>B</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>C</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>D</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>E</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>F</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>G</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>H</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>I</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>J</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>K</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>L</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>M</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>N</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>O</TableCell>
                <TableCell sx={{ paddingTop: "0px", paddingBottom: "0px", fontSize: "1px", lineHeight: '2px' }}>P</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: "1px solid black" }}>
              <TableRow sx={{ backgroundColor: "rgb(63,63,63)", border: "1px solid black" }}>
                <TableCell colSpan={16} sx={{ fontSize: "12px", padding: "1px", textAlign: "center" }}>
                  <Box sx={{ color: "white" }}> REQUEST DETAILS </Box>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(217, 217, 217)" }}>
                <TableCell colSpan={4} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Office/Department </TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Division </TableCell>
                <TableCell colSpan={7} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Section </TableCell>
              </TableRow>
              <TableRow sx={{ height: "55px" }}>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Sample </TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Sample </TableCell>
                <TableCell colSpan={7} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Sample </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(217, 217, 217)" }}>
                <TableCell colSpan={4} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Unit </TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Position/Functional Title </TableCell>
                <TableCell colSpan={4} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Head Count(HC) </TableCell>
                <TableCell colSpan={3} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Pay/Salary Grade </TableCell>
              </TableRow>
              <TableRow sx={{ height: "55px" }}>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Unit </TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Position/Functional Title </TableCell>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Head Count(HC) </TableCell>
                <TableCell colSpan={3} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Pay/Salary Grade </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(217, 217, 217)" }}>
                <TableCell colSpan={4} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Nature of Request </TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Employment Status </TableCell>
                <TableCell colSpan={4} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Date Requested </TableCell>
                <TableCell colSpan={3} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Date Needed </TableCell>
              </TableRow>
              <TableRow sx={{ height: "55px" }}>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Vacant, New Position, Position Upgrade, Additional Headcount, Replacement, Reliever </TableCell>
                <TableCell colSpan={5} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Casual, Contract of Service, COS - Honorarium, Job Order </TableCell>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> mm/dd/yyyy </TableCell>
                <TableCell colSpan={3} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> mm/dd/yyyy </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(217, 217, 217)" }}>
                <TableCell colSpan={16} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Justification/Purpose<em style={{ fontWeight: "normal" }}>(Please attach supporting documents if necessary)</em> </TableCell>
              </TableRow>
              <TableRow sx={{ height: "90px" }}>
                <TableCell colSpan={16} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}>
                  lorem400
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(217, 217, 217)" }}>
                <TableCell colSpan={16} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> Job Summary </TableCell>
              </TableRow>
              <TableRow sx={{ height: "110px" }}>
                <TableCell colSpan={16} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}>
                  lorem500
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(63,63,63)", border: "1px solid black" }}>
                <TableCell colSpan={16} sx={{ fontSize: "12px", padding: "1px", textAlign: "center" }}>
                  <Box sx={{ color: "white" }}>  QUALIFICATIONS STANDARDS </Box>
                </TableCell>
              </TableRow>
              <TableRow sx={{ height: "40px" }}>
                <TableCell colSpan={2} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Education </TableCell>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}></TableCell>
                <TableCell colSpan={3} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Eligibility </TableCell>
                <TableCell colSpan={7} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}></TableCell>
              </TableRow>
              <TableRow sx={{ height: "40px" }}>
                <TableCell colSpan={2} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Experience </TableCell>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}></TableCell>
                <TableCell colSpan={3} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Technical Skills </TableCell>
                <TableCell colSpan={7} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}></TableCell>
              </TableRow>
              <TableRow sx={{ height: "40px" }}>
                <TableCell colSpan={2} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Training </TableCell>
                <TableCell colSpan={4} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}></TableCell>
                <TableCell colSpan={3} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}> Other Requirements </TableCell>
                <TableCell colSpan={7} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}></TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(63,63,63)", border: "1px solid black" }}>
                <TableCell colSpan={16} sx={{ fontSize: "12px", padding: "1px", textAlign: "center" }}>
                  <Box sx={{ color: "white" }}>  REVIEW AND APPROVAL </Box>
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: "rgb(217, 217, 217)" }}>
                <TableCell colSpan={6} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> <em> (1) Requested by </em> </TableCell>
                <TableCell colSpan={10} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> <em> (2) Availability of Appropriation </em> </TableCell>
              </TableRow>
              <TableRow sx={{ height: "100px" }}>
                <TableCell colSpan={6} sx={{ fontSize: "10px", padding: "1px", border: "1px solid black", padding: "0" }}>
                  <Stack justifyContent="end" alignItems="center" sx={{ height: "100px" }}>
                    <Box></Box>
                    <Box sx={{ fontSize: "9px", lineHeight: "10px" }}> (Signature over Printed Name/Date) </Box>
                  </Stack>
                </TableCell>
                <TableCell colSpan={10} sx={{ fontSize: "10px", padding: "1px", border: "1px solid black", padding: "0" }}>
                  <Stack justifyContent="end" alignItems="center" sx={{ height: "100px" }}>
                    <Box></Box>
                    <Box sx={{ fontSize: "9px", lineHeight: "10px" }}> (Signature over Printed Name/Date) </Box>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow sx={{ height: '30px', backgroundColor: 'rgb(189, 189, 189)' }}>
                <TableCell colSpan={6} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}>
                  <Stack justifyContent="center" alignItems="center">
                    <Box sx={{ fontWeight: "bold", fontSize: "12px" }}>
                      HEAD OF THE REQUESTING OFFICE / DEPARTMENT
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell colSpan={10} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}>
                  <Stack justifyContent="center" alignItems="center">
                    <Box sx={{ fontWeight: "bold", fontSize: "12px" }}>
                      CITY BUDGET OFFICER
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow sx={{ backgroundColor: "rgb(217, 217, 217)" }}>
                <TableCell colSpan={6} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> <em> (3) Reviewed by </em> </TableCell>
                <TableCell colSpan={10} sx={{ fontSize: "10px", fontWeight: "bold", padding: "1px", textAlign: "left", border: "1px solid black" }}> <em> (4) Approval </em> </TableCell>
              </TableRow>
              <TableRow sx={{ height: "30px" }}>
                <TableCell colSpan={6} rowSpan={2} sx={{ fontSize: "10px", padding: "1px", border: "1px solid black", padding: "0" }}>
                  <Stack justifyContent="end" alignItems="center" sx={{ height: "100px" }}>
                    <Box></Box>
                    <Box sx={{ fontSize: "9px", lineHeight: "10px" }}> (Signature over Printed Name/Date) </Box>
                  </Stack>
                </TableCell>
                <TableCell colSpan={10} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}>
                  <Stack direction="row" spacing={8} justifyContent="center" alignItems="center">
                    <Stack direction="row" justifyContent="center" alignItems="center">
                      <CheckBox />
                      <Box> Approved </Box>
                    </Stack>
                    <Stack direction="row" justifyContent="center" alignItems="center">
                      <CheckBox />
                      <Box> Disapproved </Box>
                    </Stack>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow sx={{ height: "70px" }}>
                <TableCell colSpan={10} sx={{ fontSize: "10px", padding: "1px", border: "1px solid black", padding: "0" }}>
                  <Stack justifyContent="end" alignItems="center" sx={{ height: "70px" }}>
                    <Box></Box>
                    <Box sx={{ fontSize: "9px", lineHeight: "10px" }}> (Signature over Printed Name/Date) </Box>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow sx={{ height: '30px', backgroundColor: 'rgb(189, 189, 189)' }}>
                <TableCell colSpan={6} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}>
                  <Stack justifyContent="center" alignItems="center" sx={{ lineHeight: "13px", padding: "4px 0px" }}>
                    <Box sx={{ fontWeight: "bold", fontSize: "12px" }}>
                      CITY HUMAN RESOURCE MANAGEMENT OFFICER
                    </Box>
                    <Box>
                      City Human Resource Management Department (CHRMD)
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell colSpan={10} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black" }}>
                  <Stack justifyContent="center" alignItems="center" sx={{ lineHeight: "13px", padding: "4px 0px" }}>
                    <Box sx={{ fontWeight: "bold", fontSize: "12px" }}>
                      CITY MAYOR / CITY VICE MAYOR
                    </Box>
                    <Box>
                      Office of the City Mayor (OCM) / Office of the City Vice Mayor (OCVM)
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow sx={{ backgroundColor: "rgb(63,63,63)", border: "1px solid black" }}>
                <TableCell colSpan={16} sx={{ fontSize: "12px", padding: "1px", textAlign: "center" }}>
                  <Box sx={{ color: "white" }}>  For CHRMD - TAS USE ONLY </Box>
                </TableCell>
              </TableRow>
              <TableRow sx={{ height: '30px', backgroundColor: 'rgb(189, 189, 189)' }}>
                <TableCell colSpan={2} sx={{ fontSize: "12px", padding: "1px", textAlign: "center", border: "1px solid black", fontWeight: "bold" }}> Status </TableCell>
                <TableCell colSpan={2} sx={{ fontSize: "12px", padding: "1px", textAlign: "center", border: "1px solid black", fontWeight: "bold" }}> Date </TableCell>
                <TableCell colSpan={6} sx={{ fontSize: "12px", padding: "1px", textAlign: "center", border: "1px solid black", fontWeight: "bold" }}> Remarks </TableCell>
                <TableCell colSpan={6} sx={{ fontSize: "12px", padding: "1px", textAlign: "center", border: "1px solid black", fontWeight: "bold" }}> HRMO In-Charge </TableCell>
              </TableRow>
              <TableRow sx={{ height: "20px" }}>
                <TableCell colSpan={1} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
                <TableCell colSpan={1} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}>On-Hold</TableCell>
                <TableCell colSpan={2} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
                <TableCell colSpan={6} rowSpan={3} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
                <TableCell colSpan={6} rowSpan={2} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
              </TableRow>

              <TableRow sx={{ height: "20px" }}>
                <TableCell colSpan={1} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
                <TableCell colSpan={1} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}>Closed</TableCell>
                <TableCell colSpan={2} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
              </TableRow>
              <TableRow sx={{ height: "20px" }}>
                <TableCell colSpan={1} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
                <TableCell colSpan={1} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}>Cancelled</TableCell>
                <TableCell colSpan={2} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "left", border: "1px solid black", fontWeight: "bold" }}></TableCell>
                <TableCell colSpan={6} rowSpan={1} sx={{ fontSize: "10px", padding: "1px", textAlign: "center", border: "1px solid black", fontWeight: "bold" }}> Signaure over Printed Name/Date </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}

export default Prf