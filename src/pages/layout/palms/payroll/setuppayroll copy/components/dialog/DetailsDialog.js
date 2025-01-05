import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box, Grid, Paper, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { formatName, formatWithCommas } from '../../../../../customstring/CustomString';
import { grey } from '@mui/material/colors';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const DetailsDialog = ({empData,open,close,title,theme}) =>{
    const [data,setData] = useState(empData)
    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={close}
                TransitionComponent={Transition}
                sx={{width:'60%',height:'100%',right:0,left:'auto'}}
            >
                <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={close}
                    aria-label="close"
                    >
                    <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    {title}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={close}>
                    Save
                    </Button>
                </Toolbar>
                </AppBar>
                <Grid container>
                    <Grid item xs={12}>
                        <Paper>
                            <Grid item xs={7}>
                                <ThemeProvider theme={theme}>
                                <Paper sx={{display:'flex',flexDirection:'column',gap:2,p:2,background:grey[100]}}>
                                {/* <Typography sx={{color:blue[900],fontWeight:'bold',mb:1}}>Regular Payroll</Typography> */}
                                <Box sx={{display:'flex',gap:1}}>
                                    {/* <p><strong>Employee No. :</strong><span>{empData?.emp_no}</span></p>
                                    <p><strong>Employee Name :</strong><span>{empData?formatName(empData.fname,empData.mname,empData.lname,empData.extname):''} </span></p> */}
                                    <TextField label='Employee No' color="primary" size="small" value = {empData?.emp_no} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}}/>

                                    <TextField label='Employee Name' size="small" value = {empData?formatName(empData.fname,empData.mname,empData.lname,empData.extname):''} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth  />

                                </Box>
                                {/* <p><strong>Department :</strong> <span>{empData?.dept_name}</span></p>
                                <p><strong>Position :</strong> <span>{empData?.position_name}</span></p> */}
                                
                                <TextField label='Department' size="small" value = {empData?.dept_name} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                <TextField label='Position Name' size="small" value = {empData?.position_name} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                <Grid container item xs={12} sx={{display:'flex',flexDirection:'row'}}>
                                    <Grid item xs={6} sx={{display:'flex',flexDirection:'column',gap:2}}>
                                        {/* <p><strong>Monthly Rate :</strong> <span>{empData?.m_rate}</span></p> */}
                                        <TextField label='Monthly Rate' size="small" value = {formatWithCommas(empData?.m_rate)}InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='Number of Days (15)' size="small" value = {11} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='Number of Days (30)' size="small" value = {11} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                        </Box>

                                        <TextField label='Amount Accrued' size="small" value = {formatWithCommas(empData?.accrued)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                        <TextField label='PERA' size="small" value = {empData?.pera} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                        <TextField label='Rice Subsidy' size="small" value = {empData?.pera} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        
                                        <TextField label='Quarterly Allowance' size="small" value = {empData?.pera} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                        <TextField label='Subsistence Allowance' size="small" value = {empData?.pera} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                        <TextField label='Laundry Allowance' size="small" value = {empData?.pera} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />

                                        <Box>
                                            <Paper>
                                                <TableContainer sx={{height:200,overflow:'auto'}}>
                                                    <Table stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{background:grey[300]}}>
                                                                    Loan Type
                                                                </TableCell>
                                                                <TableCell sx={{background:grey[300]}}>
                                                                </TableCell>
                                                                <TableCell align="right" sx={{background:grey[300]}}>
                                                                    Amount
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                empData&&empData.loan
                                                                    ?
                                                                    JSON.parse(empData.loan).map((item)=>{
                                                                        return (
                                                                            <TableRow key={item.loan_dtl_id} hover>
                                                                                <TableCell>
                                                                                    {item.loan_abbr}
                                                                                </TableCell>
                                                                                <TableCell>15&30</TableCell>
                                                                                <TableCell align="right">
                                                                                    {formatWithCommas(item.amount)}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                :
                                                                <TableRow>
                                                                    <TableCell></TableCell>
                                                                </TableRow>

                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>
                                        </Box>

                                    </Grid>
                                    <Grid item xs={6} sx={{display:'flex',flexDirection:'column',gap:2}}>
                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='Absences Day' size="small" value = {11} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='Absences Amount' size="small" value = {11} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>

                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='Adjustment (15)' size="small" value = '' InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='Adjustment (30)' size="small" value = '' InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>

                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='Representation' size="small" value = '' InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='Travelling' size="small" value = '' InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>

                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='Provident (PS)' size="small" value = {formatWithCommas(empData?.provident)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='Provident (GS)' size="small" value = '' InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>

                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='PagIbig (PS)' size="small" value = {formatWithCommas(empData?.pagibig_per)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='PagIbig (GS)' size="small" value = {formatWithCommas(empData?.pagibig_gov)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>

                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='PHIC (PS)' size="small" value = {formatWithCommas(empData?.philhealth_per)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='PHIC (GS)' size="small" value = {formatWithCommas(empData?.philhealth_gov)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>

                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='Withholding Tax' size="small" value = {empData?.w_tax} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='ECC' size="small" value = {empData?.ecc} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>

                                        <TextField label='Total Salary' size="small" value = {formatWithCommas(empData?.m_rate)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth/>

                                        <TextField label='Additional Earning' size="small" value = {formatWithCommas(empData?.pera)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth/>

                                        <TextField label='Total Deduction' size="small" value = {formatWithCommas(empData?.total_deduction)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth/>

                                        <TextField label='Net Salary' size="small" value = {formatWithCommas(parseFloat(empData?.amount_15)+parseFloat(empData?.amount_30))} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth/>

                                        <Box sx={{display:'flex',gap:1,justifyContent:'space-between'}}>
                                            <TextField label='15th' size="small" value = {formatWithCommas(empData?.amount_15)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                            <TextField label='30th' size="small" value = {formatWithCommas(empData?.amount_30)} InputLabelProps={{shrink:true}} InputProps={{readOnly:true}} fullWidth />
                                        </Box>
                                    </Grid>
                                </Grid>
                                </Paper>
                                </ThemeProvider>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Dialog>
            </React.Fragment>
    )
}