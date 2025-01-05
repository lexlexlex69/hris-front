import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, } from "@mui/material"
import { useContext, useState } from "react"
import { PrfStateContext } from "../PrfProvider"
import { AppliedInfo } from "../components/pooling_indorsement/component/ExportComponent"
import RequestStatModal from "../components/export_components/RequestStatModal"
import ButtonViewPRF from "../requestdetails/view/ButtonViewPRF"
import Swal from "sweetalert2"
import { updatePRF } from "../axios/prfTracker"
import { toast } from "react-toastify"

function TasRequestStatus({ requestLogsList, setRequestLogsList }) {
  const { tempReq, deptData, userId } = useContext(PrfStateContext)
  const [newRequestStat, setNewRequestStat] = useState()
  const [openViewprf, setOpenViewprf] = useState(false)
  const [additionalRemark, setAdditionalRemark] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    const latestSigning = requestLogsList[requestLogsList.length - 1];

    if (!newRequestStat) {
      toast.error('Please select a request status');
      return;
    }

    if (newRequestStat === latestSigning.request_stat) {
      toast.error('Current request status is active');
      return;
    }

    const t_data = {
      signings: requestLogsList,
      new_request_stat: newRequestStat,
      prf_data: tempReq,
      user_id: userId,
    };

    Swal.fire({
      title: "Click submit to continue?",
      icon: "info",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Submit",
    }).then((result) => {
      if (result.isConfirmed) {
        updatePRF(t_data)
          .then(({ data }) => {
            data.status === 200
              ? toast.success(data.message)
              : toast.error(data.message);
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.message);
          });
      }
    });
  };


  return (
    <Box >
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <AppliedInfo tempReq={tempReq} />
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              <ButtonViewPRF open={openViewprf} handleClickOpen={() => setOpenViewprf(true)} handleClose={() => setOpenViewprf(false)} id={'pc-id'} minWidth={'65%'} />
            </Box>
            <hr />
            <Box>
              <RequestStatModal deptData={deptData} items={tempReq} signings={requestLogsList} display={true} />
            </Box>
            <hr />
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}> FOR CHRMD - TAS USE ONLY </Typography>
              <Box>
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    label="Additional Remark"
                    multiline
                    value={additionalRemark}
                    onChange={(ev) => setAdditionalRemark(ev.target.value)}
                    rows={5}
                    maxRows={10}
                  />
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <FormControl sx={{ width: '20rem' }}>
                  <InputLabel id="training-type-ld-id" size="small" required>Status</InputLabel>
                  <Select
                    name={'training_type_ld'}
                    labelId={'training-type-ld-id'}
                    variant="outlined"
                    required
                    value={newRequestStat}
                    onChange={(ev) => setNewRequestStat(ev.target.value)}
                    size={'small'}
                    sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
                  >
                    <MenuItem value=''> <em>None</em> </MenuItem>
                    <MenuItem value={'SEE ME'}>SEE ME</MenuItem>
                    <MenuItem value={'CLOSED'}>CLOSED</MenuItem>
                    <MenuItem value={'ON-HOLD'}>ON-HOLD</MenuItem>
                    <MenuItem value={'CANCELLED'}>CANCELLED</MenuItem>
                    <MenuItem value={'FOR TALENT SOURCING'}>FOR TALENT SOURCING</MenuItem>
                    <MenuItem value={"FOR HR CONSULTANT'S INITIAL"}>FOR HR CONSULTANT'S INITIAL</MenuItem>
                    <MenuItem value={"CONTINUE"}>CONTINUE</MenuItem>
                  </Select>
                </FormControl>
                <Button type="submit" variant="contained" size="small" sx={{ padding: '0 2.75rem' }}> Submit </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}

export default TasRequestStatus