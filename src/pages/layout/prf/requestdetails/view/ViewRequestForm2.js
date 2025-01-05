import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PrfProvider, { PrfStateContext } from '../../PrfProvider';
import { getOnePRF } from '../../axios/prfRequest';

import Swal from 'sweetalert2';
import { Box, Card, CardContent, Container, FormControl, FormLabel, Grid, TextField, Typography } from '@mui/material';
import { TableJobSumm, TableQS } from '../add/RequestForm';
import PageLoader from '../../components/export_components/PageLoader';




const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const skele = [
  { id: 1, variant: "rectangular", width: 0, height: 50, sizing: 3 },
  { id: 2, variant: "rectangular", width: 0, height: 50, sizing: 9 },
  { id: 3, variant: "rectangular", width: 0, height: 50, sizing: 12 },
  { id: 4, variant: "rectangular", width: 0, height: 50, sizing: 6 },
  { id: 5, variant: "rectangular", width: 0, height: 50, sizing: 6 },
  { id: 6, variant: "rectangular", width: 0, height: 50, sizing: 8 },
  { id: 7, variant: "rectangular", width: 0, height: 50, sizing: 4 },
  { id: 8, variant: "rectangular", width: 0, height: 50, sizing: 3 },
  { id: 9, variant: "rectangular", width: 0, height: 50, sizing: 3 },
  { id: 10, variant: "rectangular", width: 0, height: 50, sizing: 6 },
  { id: 11, variant: "rectangular", width: 0, height: 50, sizing: 3 },
  { id: 12, variant: "rectangular", width: 0, height: 50, sizing: 3 },
  { id: 13, variant: "rectangular", width: 0, height: 50, sizing: 7 },
  { id: 14, variant: "rectangular", width: 0, height: 50, sizing: 5 },
  { id: 14, variant: "rectangular", width: 0, height: 160, sizing: 12 },
  { id: 14, variant: "rectangular", width: 0, height: 160, sizing: 12 },
]

function ViewRequestForm2() {
  return (
    <PrfProvider>
      <ViewRequestFormPage />
    </PrfProvider>
  )
}

export default ViewRequestForm2


function ViewRequestFormPage() {
  const prfId = useParams();
  const { tempSign, tempReq, posTitle, natureReq, colDataQS, } = useContext(PrfStateContext)

  let id = prfId.id || tempReq.id;

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      Swal.fire({
        title: 'Loading...',
        icon: "info",
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });
      try {
        var [response1] = await Promise.all([
          getOnePRF(Number(id)),
        ])
        console.log(response1)

        let positionFilter = posTitle.position_builder.filter(opt => { if (Number(response1.data.data.position) === Number(opt.id)) { return opt } });
        console.log(positionFilter, posTitle)

        // Parse fields that are JSON-encoded strings
        let parsedData = {
          ...response1.data.data,
          position: positionFilter[0].position_title,
          job_summary: posTitle.categories.job_summary.filter(o => JSON.parse(response1.data.data.job_summary).includes(o.id)),
          nature_req: natureReq.filter(opt => JSON.parse(response1.data.data.nature_req).includes(opt.id)),
          qs_educ_id: posTitle.categories.education.filter(opt => JSON.parse(response1.data.data.qs_educ_id).includes(opt.id)),
          qs_elig_id: posTitle.categories.eligibility.filter(opt => JSON.parse(response1.data.data.qs_elig_id).includes(opt.id)),
          qs_expe_id: posTitle.categories.experience.filter(opt => JSON.parse(response1.data.data.qs_expe_id).includes(opt.id)),
          qs_tech_skll_id: posTitle.categories.technical_skills.filter(opt => JSON.parse(response1.data.data.qs_tech_skll_id).includes(opt.id)),
          qs_train_id: posTitle.categories.training.filter(opt => JSON.parse(response1.data.data.qs_train_id).includes(opt.id)),
        };

        setRequestData(parsedData);
        console.log(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error fetching the data.',
          allowOutsideClick: true,
          showCancelButton: true,
          showConfirmButton: true,
        });
      } finally {
        // setLoading(false);
        Swal.close();
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {!loading ? (
        <Box sx={{ margin: "0 10px 10px 10px" }}>
          <Card>
            <Typography variant="h6" fontWeight={700} sx={{ p: 1, }} textAlign="center"> Personnel Request Form </Typography>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} lg={3}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="PRF Number" variant="outlined" placeholder="(For CHRMD Use Only)"
                      value={requestData.prf_no}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={9}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Office/Department" variant="outlined"
                      value={requestData.office_dept}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Division" variant="outlined"
                      value={requestData.div_name}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Section" variant="outlined"
                      value={requestData.sec_name}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Unit" variant="outlined"
                      value={requestData.unit_name}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Head Count(HC)" variant="outlined" type="number"
                      value={requestData.head_cnt}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Pay/Salary Grade" variant="outlined" type="number"
                      value={requestData.pay_sal}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Date Requested" variant="outlined"
                      value={requestData.date_requested}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Date Needed" variant="outlined" type="date"
                      value={requestData.date_needed}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={1} sx={{ marginTop: "16px", marginBottom: "16px" }}>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Employment Status" variant="outlined"
                      value={requestData.emp_stat}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Position/Functional Title" variant="outlined"
                      value={requestData.position}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    {/* {console.log(requestData.nature_req, requestData)} */}
                    {/* <TextField inputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                      label="Nature of Request" variant="outlined"
                      value={requestData.nature_req.map(ob => { return ob.category_name })}
                    /> */}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>If new applicant does it have available laptop or computer to use?</Typography> */}
                  {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>Others</Typography> */}
                  {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>How many devices needed?</Typography> */}
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <FormLabel>
                      Justification/Purpose(Please attach supporting documents if
                      necessary)
                    </FormLabel>
                    <TextField margin="normal" variant="outlined" multiline={true} rows={3} maxRows={3} inputProps={{ readOnly: true }}
                      value={requestData.justification} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  {/* <TableJobSumm data={requestData.job_summary}></TableJobSumm> */}
                </Grid>

                {/* <Grid item xs={12} lg={12}>
                  <FormLabel>Education</FormLabel>
                  <TableQS colDataQS={colDataQS} data={requestData.qs_educ_id}></TableQS>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel>Eligibility</FormLabel>
                  <TableQS colDataQS={colDataQS} data={requestData.qs_elig_id}></TableQS>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel>Experience</FormLabel>
                  <TableQS colDataQS={colDataQS} data={requestData.qs_expe_id}></TableQS>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel>Technical Skill</FormLabel>
                  <TableQS colDataQS={colDataQS} data={requestData.qs_tech_skll_id}></TableQS>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <FormLabel>Training</FormLabel>
                  <TableQS colDataQS={colDataQS} data={requestData.qs_train_id}></TableQS>
                </Grid> */}
                <Grid item xs={12} lg={12}>
                  <FormControl fullWidth>
                    <FormLabel>Other Requirements</FormLabel>
                    <TextField margin="normal" variant="outlined" multiline={true} rows={3} maxRows={3} inputProps={{ readOnly: true }}
                      value={requestData.qs_other_id} disabled sx={{ backgroundColor: "rgb(240,240,240)" }}
                    />
                  </FormControl>
                </Grid>
              </Grid >
            </CardContent>
          </Card>
        </Box >
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", margin: "2rem 0rem", width: "100%" }}>
          <Container>
            <PageLoader skele={skele} spacing={1} />
          </Container>
        </Box>
      )}
    </>
  )
}