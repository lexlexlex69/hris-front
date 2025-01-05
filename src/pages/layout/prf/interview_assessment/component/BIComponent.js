import { Box, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";


export function BIHeader({ applicantData }) {
  return (
    <>
      <Grid2 item xs={12} lg={12}>
        <FormControl fullWidth sx={{ borderBottom: "1px solid rgb(211,211,211)", textDecoration: "none !important", }}>
          <FormLabel> Candidate Name </FormLabel>
          <Box sx={{ padding: "16.5px 14px", borderRadius: "2px" }}>
            <Typography variant="body1">
              {applicantData.lname + ", " + applicantData.fname + " " + applicantData.mname[1] + "."}
            </Typography>
          </Box>
        </FormControl>
      </Grid2>
      <Grid2 item xs={12} lg={12}>
        <FormControl fullWidth sx={{ borderBottom: "1px solid rgb(211,211,211)", }}>
          <FormLabel> Position Applied For </FormLabel>
          <Box sx={{ padding: "16.5px 14px", borderRadius: "2px" }}>
            <Typography variant="body1"> {applicantData.position_title} </Typography>
          </Box>
        </FormControl>
      </Grid2>
      <Grid2 item xs={12} lg={12}>
        <FormControl fullWidth sx={{ borderBottom: "1px solid rgb(211,211,211)", }}>
          <FormLabel> Area of Assignment </FormLabel>
          <Box sx={{ padding: "16.5px 14px", borderRadius: "2px" }}>
            <ul style={{ margin: '0' }}>
              <li> {applicantData.office_dept} </li>
              <li> {applicantData.div_name} </li>
              <li> {applicantData.sec_name} </li>
              <li> {applicantData.unit_name} </li>
            </ul>
          </Box>
        </FormControl>
      </Grid2>
    </>
  )
}

export function BIPotentialStrengths({ potentialData, handleChange, disabledTog, }) {
  return (
    <Grid2 item xs={12} lg={12}>
      <FormControl fullWidth>
        <FormLabel required> Potential Strengths </FormLabel>
        <TextField margin="normal" variant="outlined" multiline={true} rows={5} maxRows={5} name="potential_strengths" id="potential-strengths"
          value={potentialData || ''} onChange={handleChange} disabled={disabledTog}
        />
      </FormControl>
    </Grid2>
  )
}

export function BIRedFlags({ redFlagsData, handleChange, disabledTog, }) {
  return (
    <Grid2 item xs={12} lg={12}>
      <FormControl fullWidth>
        <FormLabel required> Red Flags / Concerns </FormLabel>
        <TextField margin="normal" variant="outlined" multiline={true} rows={5} maxRows={5} name="red_flags_concerns" id="red-flags-concerns"
          value={redFlagsData || ''} onChange={handleChange} disabled={disabledTog}
        />
      </FormControl>
    </Grid2>
  )
}

export function BIOtherRemarks({ otherData, setOtherData, disabledTog, }) {
  return (
    <>
      <Grid2 item xs={12} lg={12}>
        <Stack spacing={2}>
          <Box>
            <FormLabel required> Other Remarks </FormLabel>
            <Stack spacing={1}>
              <FormControl sx={{ flexDirection: "row", alignItems: "center", gap: "0.25rem" }}>
                <input style={{ width: "20px", height: "20px", padding: "4px" }} value="passed" checked={String(otherData.other_remarks) === 'passed'} name="radio_bi" type="radio"
                  onClick={(ev) => setOtherData({ ...otherData, other_remarks: ev.target.value })} disabled={disabledTog} />
                <Typography variant="subtitle2"> Passed, For Hiring/Next level Interview </Typography>
              </FormControl>
              <FormControl sx={{ flexDirection: "row", alignItems: "center", gap: "0.25rem" }}>
                <input style={{ width: "20px", height: "20px", padding: "4px" }} value="pooling" checked={String(otherData.other_remarks) === 'pooling'} name="radio_bi" type="radio"
                  onClick={(ev) => setOtherData({ ...otherData, other_remarks: ev.target.value })} disabled={disabledTog} />
                <Typography variant="subtitle2"> For Pooling / Comparison </Typography>
              </FormControl>
              <FormControl sx={{ flexDirection: "row", alignItems: "center", gap: "0.25rem" }}>
                <input style={{ width: "20px", height: "20px", padding: "4px" }} value="failed" checked={String(otherData.other_remarks) === 'failed'} name="radio_bi" type="radio"
                  onClick={(ev) => setOtherData({ ...otherData, other_remarks: ev.target.value })} disabled={disabledTog} />
                <Typography variant="subtitle2"> Failed Assessment </Typography>
              </FormControl>
              <FormControl sx={{ flexDirection: "row", alignItems: "center", gap: "0.25rem" }}>
                <input style={{ width: "20px", height: "20px", padding: "4px" }} value="other" checked={String(otherData.other_remarks) === 'other'} name="radio_bi" type="radio"
                  onClick={(ev) => setOtherData({ ...otherData, other_remarks: ev.target.value })} disabled={disabledTog} />
                <Typography variant="caption" fontStyle={"italic"}> Other Remarks </Typography>
              </FormControl>
            </Stack>
          </Box>
          {String(otherData.other_remarks) === 'other' ? (
            <>
              <TextField margin="normal" variant="outlined" multiline={true} rows={4} maxRows={4} name="other_remarks" id="other-remarks"
                value={otherData.remark || ''} onChange={(ev) => setOtherData({ ...otherData, remark: ev.target.value })} disabled={disabledTog}
              />
            </>
          ) : (<></>)}
        </Stack>
      </Grid2>
    </>
  )
}