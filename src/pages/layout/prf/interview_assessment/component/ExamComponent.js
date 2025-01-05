import { Box, FormLabel, Stack, TextField, Typography } from "@mui/material";



export function ExamOption({ examSelector, handleChange, disabledTog }) {
  return (
    <>
      <FormLabel required> Result: </FormLabel>
      <Stack direction="row" gap={2}>
        <Box sx={{ display: 'flex', gap: "4px" }}>
          <input type="radio" name={'radio-exam-option'} id={'radio-exam-option-passed'} value='passed' checked={String(examSelector) === 'passed'} disabled={disabledTog}
            onChange={
              // (ev) => setExamSelector(ev.target.value)
              handleChange
            } style={{ width: '26px', height: "26px" }} />
          <Typography variant="subtitle1" > Passed </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: "4px" }}>
          <input type="radio" name={'radio-exam-option'} id={'radio-exam-option-failed'} value='failed' checked={String(examSelector) === 'failed'} disabled={disabledTog}
            onChange={
              // (ev) => setExamSelector(ev.target.value)
              handleChange
            } style={{ width: '26px', height: "26px" }} />
          <Typography variant="subtitle1" > Failed </Typography>
        </Box>
      </Stack>
    </>
  )
}

export function ExamRemark({ examRemark, handleChange, disabledTog, }) {
  return (
    <>
      <FormLabel required> Remarks: </FormLabel>
      <TextField required variant="outlined" id='exam-remark' name='input-exam-remark' multiline="true" rows={5} maxRows={7}
        value={examRemark} disabled={disabledTog}
        onChange={
          // (ev) => setExamRemark(ev.target.value)
          handleChange
        }
        sx={{ minWidth: '400px' }} />
    </>
  )
}