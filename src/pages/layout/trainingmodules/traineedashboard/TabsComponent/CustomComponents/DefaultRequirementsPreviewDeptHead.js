import React, { useRef, useState } from "react";
import {Box,Grid,IconButton,Tooltip,Typography,Button,TextField} from '@mui/material';
import LetterHeadHR from "../../../../forms/letterhead/LetterHeadHR";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../.././TraineeDashboard.css';
import FormFooter from "../../../../forms/footer/FormFooter";
import FormFooter2 from "../../../../forms/footer/FormFooter2";
import { jsPDF } from "jspdf";
import ReactToPrint,{useReactToPrint} from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import { formatDefaultPositionName, formatExtName, formatManualInputPosition, formatMiddlename, formatPositionName } from "../../../../customstring/CustomString";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Popover from '@mui/material/Popover';
import { viewFileAPI } from "../../../../../../viewfile/ViewFileRequest";
const DefaultRequirementsPreviewDeptHead = (props) =>{
    const themeHeader = createTheme({
        typography: {
            fontFamily: 'cambria',
        }
    });
    const themeTableHead = createTheme({
        typography: {
            fontFamily: 'cambria',
            fontSize:13
        }
    });
    const printRef = useRef();
    const reactToPrint  = useReactToPrint({
        content: () => printRef.current,
        documentTitle: props.reqData.name+' - '+props.reqData.type

    });
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event,ids) => {
        setAnchorEl(event.currentTarget);
        setFileIDs(ids)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [fileIDs,setFileIDs] = useState([])
    return (
        <Box sx={{overflow:'scroll'}}>
        {
            props.printable
            ?
            <Box sx={{position: 'fixed',top: '50%',zIndex: 1,right: '30px'}}>
                <Tooltip title='Print'><Button variant="outlined" color="primary" startIcon={<PrintIcon/>} onClick={reactToPrint}>Print</Button></Tooltip>
            </Box>
            :
            ''
        }
        
        <Box sx={{m:2,maxHeight:'70vh',overflowY:'scroll'}}>
           
            <ThemeProvider theme={themeHeader}>
            <Grid container>
                <Grid item xs={12}>
                    <LetterHeadHR/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'center',mt:1,mb:1}}>
                    <Typography sx={{fontWeight:600}}>LEARNING/SKILLS ACTION PLAN</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{pl:10,pr:10}}>
                <Grid item xs={12}>
                    <Typography><strong>Training Title:</strong> <span className="custom-underline">{props.reqData.training_title}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Training Date:</strong> <span className="custom-underline">{props.reqData.training_date}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Name:</strong> <span className="custom-underline">{`${props.reqData.fname} ${formatMiddlename(props.reqData.mname)} ${props.reqData.lname} ${formatExtName(props.reqData.extname)}`}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Position/Designation:</strong> <span className="custom-underline">{props.reqData.position_designation}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Office:</strong> <span className="custom-underline">{props.reqData.office}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Specific Competency to develop/enhance:</strong> <span className="custom-underline">{props.reqData.to_enhance_develop}</span></Typography>
                </Grid>

                <Grid item xs={12} sx={{mt:2}}>
                    <ThemeProvider theme={themeTableHead}>
                    <div id='training-app-div'>
                        <table className = 'training-app-table'>
                            <thead>
                                <tr>
                                    <th>
                                        <Typography><strong>LEARNINGS ACQUIRED</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>PLANS AND/OR ACTIVITIES</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>TARGET DATE/TIMELINE <br/>(within 3 months after the conduct of intervention)</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>MEANS OF VERIFICATION <br/>(MOV)</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>ACTUAL ACCOMPLISHMENT</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>DATE OF ACCOMPLISHMENT</strong></Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    JSON.parse(props.reqData.details).map((item,key)=>
                                        <tr key={key}>
                                            <td>
                                                <Typography>{item.learning_acquired}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.plans_activities}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.target_date}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.mov}</Typography>
                                                {
                                                    item.file_ids?.length>0
                                                    ?
                                                    <Button aria-describedby={`id-${key}`} variant="contained" onClick={(e)=>handleClick(e,item.file_ids)} fullWidth>
                                                        Uploaded MOV's
                                                    </Button>
                                                    :
                                                    ''
                                                }
                                                
                                            </td>
                                            <td>
                                                <Typography>{item.actual_accomplishment}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.date_accomplishment}</Typography>
                                            </td>
                                        </tr>
                                    )
                                }
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                >
                                    <Box sx={{p:1,display:'flex',flexDirection:'column',gap:1}}>
                                    {
                                        fileIDs.map((item,key)=>
                                            <Button key={key} variant="outlined" fullWidth onClick={()=>viewFileAPI(item)}>{`File # ${key+1}`}</Button>
                                        )
                                    }
                                    </Box>
                                </Popover>
                            </tbody>
                        </table>
                    </div>
                    </ThemeProvider>
                </Grid>
                <Grid item xs={12} sx={{mt:2}}>
                    {
                        props.reqData.comments_suggestions
                        ?
                        <Typography>Immediate Supervisor’s Remarks/Comments/Suggestions: <u>{props.reqData.comments_suggestions}</u></Typography>
                        :
                        <>
                        <Typography>Immediate Supervisor’s Remarks/Comments/Suggestions:</Typography>
                        <hr className="hr-black"/>
                        <hr className="hr-black"/>
                        </>
                    }
                </Grid>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:20,mt:2}}>
                    {/* <Box>
                        <Typography>Prepared By:</Typography>
                        <Typography><u>{props.reqData.prepared_by}</u></Typography>
                        <Typography>{formatPositionName(props.reqData.position_designation)}</Typography>

                    </Box>

                    <Box>
                        <Typography>Reviewed by:</Typography>
                        <Typography><u>{props.reqData.reviewed_by}</u></Typography>
                        <Typography>(Immediate Supervisor)</Typography>
                    </Box>

                    <Box>
                        <Typography>Noted by:</Typography>
                        <Typography><u>{props.reqData.noted_by}</u></Typography>
                        <Typography>(Department Head)</Typography>
                    </Box> */}
                    <Box>
                        <Typography>Prepared By:</Typography>
                        <Box sx={{textAlign:'center',mt:2}}>
                        <Typography><u><strong>{props.reqData.prepared_by}</strong></u></Typography>
                        <Typography>{formatDefaultPositionName(props.reqData.position_designation)}</Typography>
                        </Box>
                        

                    </Box>

                    <Box>
                        <Typography>Reviewed by:</Typography>
                        <Typography sx={{textAlign:'center',mt:2}}>{formatManualInputPosition(props.reqData.reviewed_by)}</Typography>
                        {/* <Typography>(Immediate Supervisor)</Typography> */}
                    </Box>

                    <Box>
                        <Typography>Noted by:</Typography>
                        <Box sx={{textAlign:'center',mt:2}}>
                        <Typography><u><strong>{props.reqData.noted_by}</strong></u></Typography>
                        <Typography>{formatDefaultPositionName(props.reqData.noted_by_position)}</Typography>
                        </Box>
                        
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{mt:2}}>
                    <FormFooter2 email='chrmoadmbutuan@gmail.com' website='http://www.butuan.gov.ph' version='CGB.PL.013.REV00'/>
                </Grid>
                
            </Grid>
            </ThemeProvider>
            {/* <Grid container sx={{mt:1,mb:1}}>
                <Grid item xs={12}>
                    <Box sx={{display:'flex',justifyContent:'flex-end',gap:1}}>
                        <Button variant="contained" color="success" startIcon={<ThumbUpIcon/>}>Approved</Button>
                        <Button variant="contained" color="error" startIcon={<ThumbDownIcon/>}>Disapproved</Button>
                    </Box>
                </Grid>
            </Grid> */}
        </Box>
        {/* Print Div */}
        <div style={{display:'none'}}>
            <div ref={printRef}>
            <Box sx={{m:2}}>
           
            <ThemeProvider theme={themeHeader}>
            <Grid container>
                <Grid item xs={12}>
                    <LetterHeadHR/>
                </Grid>
                <Grid item xs={12} sx={{display:'flex',justifyContent:'center',mt:1,mb:1}}>
                    <Typography sx={{fontWeight:600}}>LEARNING/SKILLS ACTION PLAN</Typography>
                </Grid>
            </Grid>
            <Grid container sx={{pl:10,pr:10}}>
                <Grid item xs={12}>
                    <Typography><strong>Training Title:</strong> <span className="custom-underline">{props.reqData.training_title}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Training Date:</strong> <span className="custom-underline">{props.reqData.training_date}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Name:</strong> <span className="custom-underline">{props.reqData.name}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Position/Designation:</strong> <span className="custom-underline">{props.reqData.position_designation}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Office:</strong> <span className="custom-underline">{props.reqData.office}</span></Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography><strong>Specific Competency to develop/enhance:</strong> <span className="custom-underline">{props.reqData.to_enhance_develop}</span></Typography>
                </Grid>

                <Grid item xs={12} sx={{mt:2}}>
                    <ThemeProvider theme={themeTableHead}>
                    <div id='training-app-div'>
                        <table className = 'training-app-table'>
                            <thead>
                                <tr>
                                    <th>
                                        <Typography><strong>LEARNINGS ACQUIRED</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>PLANS AND/OR ACTIVITIES</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>TARGET DATE/TIMELINE <br/>(within 3 months after the conduct of intervention)</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>MEANS OF VERIFICATION <br/>(MOV)</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>ACTUAL ACCOMPLISHMENT</strong></Typography>
                                    </th>
                                    <th>
                                        <Typography><strong>DATE OF ACCOMPLISHMENT</strong></Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    JSON.parse(props.reqData.details).map((item,key)=>
                                        <tr key={key}>
                                            <td>
                                                <Typography>{item.learning_acquired}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.plans_activities}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.target_date}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.mov}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.actual_accomplishment}</Typography>
                                            </td>
                                            <td>
                                                <Typography>{item.date_accomplishment}</Typography>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    </ThemeProvider>
                </Grid>
                <Grid item xs={12} sx={{mt:2}}>
                    {
                        props.reqData.comments_suggestions
                        ?
                        <Typography>Immediate Supervisor’s Remarks/Comments/Suggestions: <u>{props.reqData.comments_suggestions}</u></Typography>
                        :
                        <>
                        <Typography>Immediate Supervisor’s Remarks/Comments/Suggestions:</Typography>
                        <hr className="hr-black"/>
                        <hr className="hr-black"/>
                        </>
                    }
                </Grid>
                <Grid item xs={12} sx={{display:'flex',flexDirection:'row',gap:10,mt:2}}>
                    <Box>
                        <Typography>Prepared By:</Typography>
                        <Box sx={{textAlign:'center',mt:2}}>
                        <Typography><u><strong>{props.reqData.prepared_by}</strong></u></Typography>
                        <Typography>{formatDefaultPositionName(props.reqData.position_designation)}</Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Typography>Reviewed by:</Typography>
                        <Typography sx={{textAlign:'center',mt:2}}>{formatManualInputPosition(props.reqData.reviewed_by)}</Typography>
                        {/* <Typography>(Immediate Supervisor)</Typography> */}
                    </Box>

                    <Box>
                        <Typography>Noted by:</Typography>
                        <Box sx={{textAlign:'center',mt:2}}>
                        <Typography><u><strong>{props.reqData.noted_by}</strong></u></Typography>
                        <Typography>{formatDefaultPositionName(props.reqData.noted_by_position)}</Typography>
                        </Box>
                        
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{mt:2}}>
                    <FormFooter2 email='chrmoadmbutuan@gmail.com' website='http://www.butuan.gov.ph' version='CGB.PL.013.REV00'/>
                </Grid>
            </Grid>
            </ThemeProvider>
        </Box>
        </div>
        </div>
        </Box>
    )
}
export default DefaultRequirementsPreviewDeptHead;