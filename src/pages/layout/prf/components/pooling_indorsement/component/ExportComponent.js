import { Box, Button, Container, Divider, FormControl, IconButton, Popper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useMediaQuery } from "@mui/material";
import { Close as CloseIcon, } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ViewRequestForm from "../../../requestdetails/view/ViewRequestForm";

export function CustomDialog({ open, id, anchorEl, closeModal, customWidth, children }) {
  const matches = useMediaQuery('(min-width:600px)');

  // useEffect(() => {
  //   console.log(matches)
  // }, [matches])

  return (
    <Popper id={id} open={open} anchorEl={anchorEl} sx={{ width: matches ? "35vw!important" : "100vw!important", zIndex: 1300, position: "fixed !important", transform: "none!important", marginLeft: matches ? "61vw!important" : "0!important", marginTop: matches ? "1rem!important" : "0rem!important" }} >
      <Container sx={{ border: "1px solid #ADADAD", borderRadius: "5px", p: 1, bgcolor: 'background.paper', height: matches ? "95vh" : "100vh" }}>
        <Box sx={{ padding: "0rem 1rem" }}>
          <IconButton edge="start" color="inherit" onClick={closeModal} aria-label="close">  <CloseIcon /> </IconButton>
        </Box>
        <Divider sx={{ marginBottom: "1rem" }} />
        <Box sx={{ overflowY: "auto", height: "85%" }}>
          {children}
        </Box>
      </Container>
    </Popper>
  )
}

export function AppliedInfo({ tempReq }) {
  // const [open, setOpen] = useState(false)
  // const matches = useMediaQuery('(min-width:600px)');

  return (
    <Box>
      <Grid2 container spacing={1}>
        <Grid2 item xs={12} lg={4}>
          <Typography variant="body1" fontWeight={700}> PRF Number: </Typography>
        </Grid2>
        <Grid2 item xs={12} lg={8}>
          {tempReq.prf_no}
        </Grid2>
      </Grid2>
      <Grid2 container spacing={1}>
        <Grid2 item xs={12} lg={4}>
          <Typography variant="body1" fontWeight={700}> Position Applied For: </Typography>
        </Grid2>
        <Grid2 item xs={12} lg={8}>
          {tempReq.position_title}
        </Grid2>
      </Grid2>
      <Grid2 container spacing={1}>
        <Grid2 item xs={12} lg={4}>
          <Typography variant="body1" fontWeight={700}> Area of Assignment: </Typography>
        </Grid2>
        <Grid2 item xs={12} lg={8}>
          <ul>
            <li> {tempReq.office_dept} </li>
            <li> {tempReq.div_name} </li>
            <li> {tempReq.sec_name} </li>
            <li> {tempReq.unit_name} </li>
          </ul>
        </Grid2>
      </Grid2>
      {/* <Box>
        <Button variant="contained" color="info" onClick={(e) => setOpen(true)}> View PRF </Button>
      </Box>
      <CustomDialog matches={matches} openner={open} handleCloseBTN={() => { setOpen(false) }} >
        <ViewRequestForm />
      </CustomDialog> */}
    </Box>
  )
}

export function InputFieldPoolingApplicant({ value, setValue, list, selectValue, setSelectValue, name }) {
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Box>
        <FormControl fullWidth>
          <TextField type="text" variant="outlined" id="qs_educ_id3" value={value} onChange={(ev) => setValue(ev.target.value)} size="small" />
        </FormControl>
      </Box>
      <Box>
        <FormControl fullWidth>
          {list.length > 0 &&
            <Select size="small" native value={selectValue} onChange={(ev) => setSelectValue(ev.target.value)} >
              {list.map((res, index) => (
                <option key={res[name] + '-' + index} value={res[name]}>
                  {res[name]}
                </option>
              ))}
            </Select>
          }
        </FormControl>
      </Box>
    </Stack>
  )
}