import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";
import SmallestModal from "../../../../custommodal/SmallestModal";





export function ProcessType({ openProcessType, setOpenProcessType, handleProcessDTR, processType, setProcessType }) {
    return (
        <>
            <SmallestModal open={openProcessType} close={setOpenProcessType} title='Process Options'>
                <Grid container spacing={2} sx={{ p: 1 }}>
                    <Grid item xs={12}>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={processType}
                                name="radio-buttons-group"
                                onChange={(val) => setProcessType(val.target.value)}
                            >
                                <FormControlLabel value={0} control={<Radio />} label="Selected Department" />
                                <FormControlLabel value={1} control={<Radio />} label="Selected Employee" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="contained" color="success" size='small' className="custom-roundbutton" onClick={handleProcessDTR}>Proceed</Button>
                        <Button variant="contained" color="error" size='small' className="custom-roundbutton" onClick={setOpenProcessType}>cancel</Button>
                    </Grid>
                </Grid>
            </SmallestModal>
        </>
    )
}

