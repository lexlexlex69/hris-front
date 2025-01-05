import { Box, Card, CardContent, FormControl, FormGroup, FormLabel, TextField, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

function ViewHiRe({ data, setData, children, disabled }) {
  const handleChange = (ev) => {
    const { value } = ev.target
    setData({ ...data, overall_recom: value })
  }
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} md={6} lg={8}>
              <FormGroup>
                <FormLabel required> Hiring Recommendation </FormLabel>
                <FormControl>
                  <TextField disabled={disabled} sx={{ backgroundColor: disabled ? 'rgb(0, 0, 0, 0.1)' : '', color: disabled ? 'rgb(0, 0, 0)!important' : '' }} variant="outlined" multiline={true} rows={4} maxRows={6} margin="normal" value={data.hiring_recom} onChange={(ev) => setData({ ...data, hiring_recom: ev.target.value })} />
                </FormControl>
              </FormGroup>
            </Grid2>
            <Grid2 item xs={12} md={6} lg={4}>
              <FormGroup>
                <FormLabel required> <em> Overall Recommendation </em> </FormLabel>
                <Box sx={{ paddingTop: '16px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                    <input disabled={disabled} style={{ width: '18px', height: '18px', backgroundColor: disabled ? 'rgb(0, 0, 0, 0.1)' : '', color: disabled ? 'rgb(0, 0, 0)!important' : '' }} id="overall-recomm-passed" type='radio' name="overall_recom" value="passed, for hiring" checked={String(data.overall_recom) === 'passed, for hiring'} onChange={handleChange} />
                    <Typography variant="subtitle2"> Passed, For Hiring </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                    <input disabled={disabled} style={{ width: '18px', height: '18px', backgroundColor: disabled ? 'rgb(0, 0, 0, 0.1)' : '', color: disabled ? 'rgb(0, 0, 0)!important' : '' }} id="overall-recomm-pooling" type='radio' name="overall_recom" value="for pooling/comparison" checked={String(data.overall_recom) === 'for pooling/comparison'} onChange={handleChange} />
                    <Typography variant="subtitle2"> For Pooling/Comparison </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                    <input disabled={disabled} style={{ width: '18px', height: '18px', backgroundColor: disabled ? 'rgb(0, 0, 0, 0.1)' : '', color: disabled ? 'rgb(0, 0, 0)!important' : '' }} id="overall-recomm-failed" type='radio' name="overall_recom" value="failed assessment" checked={String(data.overall_recom) === 'failed assessment'} onChange={handleChange} />
                    <Typography variant="subtitle2"> Failed Assessment </Typography>
                  </Box>
                </Box>
              </FormGroup>
            </Grid2>
            {!disabled && (
              <Grid2 item xs={12} lg={12}>
                {children}
              </Grid2>
            )}
          </Grid2>
        </CardContent>
      </Card>
    </>
  )
}

export default ViewHiRe