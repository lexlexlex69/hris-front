import React,{useState,useEffect} from 'react';
import { Grid,Typography,TextField,Box,Select,MenuItem,FormControl,InputLabel,Table,TableHead,TableContainer,TableRow,TableBody,IconButton,Dialog,Button,Tooltip} from '@mui/material';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import File from './cert.pdf';
import Sig1 from './sig1.png';
import Sig2 from './sig2.png';
//icons
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import SettingsIcon from '@mui/icons-material/Settings';

import { getCompletedTrainee, getFinishedTrainings } from './CertificateRequest';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import {blue,red,green,orange} from '@mui/material/colors'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Preview from './Dialog/Preview';
import ManageTemplate from './Dialog/ManageTemplate';
import Swal from 'sweetalert2';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: blue[800],
      color: theme.palette.common.white,
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
    },
  }));
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
export default function ManageCertificate(){
    const [trainingData,setTrainingData] = useState([]);
    const [traineeNames,setTraineeNames] = useState([]);
    const [compRqmt,setCompRqmt] = useState([]);
    const [compEvaluation,setCompEvaluation] = useState([]);
    const [traineeIds,setTraineeIds] = useState([]);
    const [pdfUri,setPdfUri] = useState('');
    const [fileSelected,setFileSelected] = useState();
    const [colorSelected,setColorSelected] = useState([]);
    const [nameFontSize,setNameFontSize] = useState(18);
    const [namePosX,setNamePosX] = useState(0);
    const [namePosY,setNamePosY] = useState(0);
    const [openPrintInfoDialog,setOpenPrintInfoDialog] = useState(false)
    const [openManageTemplateDialog,setOpenManageTemplateDialog] = useState(false)
    useEffect(()=>{
        getFinishedTrainings()
        .then(res=>{
            console.log(res.data)
            setTrainingData(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    useEffect(()=>{
        
        // setPdfUri(generatePDF())
        cusotomPDF()
    },[namePosX,namePosY,nameFontSize])
    const generatePDF = async (name)=>{
        // const {PDFDocument,rgb} = PDFLib;
        const names = ['John Doe','Jane Fritz','Joan Nahh','Jean Blue'];
        // const exBytes = await fetch(File).then((res)=> {
        //     return res.arrayBuffer()
        // });
        const firstSig = await fetch(Sig1).then((res)=> {
            return res.arrayBuffer()
        });
        const secondSig = await fetch(Sig2).then((res)=> {
            return res.arrayBuffer()
        });
        const firstPage = await PDFDocument.load(fileSelected)

        const pdfDoc = await PDFDocument.create();

        const pngImage1 = await pdfDoc.embedPng(firstSig)
        const pngImage2 = await pdfDoc.embedPng(secondSig)
        const pngDims1 = pngImage1.scale(0.5)
        const pngDims2 = pngImage2.scale(0.5)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        console.log(names.length)
        for(var i = 0; i<names.length;i++){
            const [firstDonorPage] = await pdfDoc.copyPages(firstPage, [0])
            const { width, height } = firstDonorPage.getSize()
            firstDonorPage.drawText(names[i]+i, {
                x: parseInt(namePosX),
                y: parseInt(namePosY),
                size: 50,
                font: helveticaFont,
                // color:rgb(parseInt(colorSelected[0]),parseInt(colorSelected[1]),parseInt(colorSelected[2]))
            })
            
            firstDonorPage.drawImage(pngImage1, {
                x: 110,
                y: 60,
                width: pngDims1.width,
                height: pngDims1.height,
            })
            firstDonorPage.drawImage(pngImage2, {
                x: 400,
                y: 60,
                width: pngDims2.width,
                height: pngDims2.height,
            })
            pdfDoc.addPage(firstDonorPage)

            // pdfDoc.insertPage(i, firstDonorPage)
        }
       
        const uri = await pdfDoc.saveAsBase64({dataUri:true})
        // console.log(uri)
        document.querySelector('#mypdf').src = uri;
    }
    const cusotomPDF = async (name)=>{
        // const existingPdfBytes  = await fetch(File).then((res)=> {
        //     return res.arrayBuffer()
        // });
        const pdfDoc = await PDFDocument.load(fileSelected)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const { width, height } = firstPage.getSize()
        firstPage.drawText('This text was added with JavaScript!', {
            x: parseInt(namePosX),
            y: parseInt(namePosY),
            size: 50,
            font: helveticaFont,
            size:parseInt(nameFontSize),
            // color:rgb(parseInt(colorSelected[0]),parseInt(colorSelected[1]),parseInt(colorSelected[2]))

        })

        // const pdfBytes = await pdfDoc.save()
        const uri = await pdfDoc.saveAsBase64({dataUri:true})
        document.querySelector('#mypdf').src = uri;
    }
    const handleSetFile =  (e)=>{
        
        let fileReader = new FileReader();
        let fileData;
        // let fileData = new Blob(e.target.files[0]);
        // var promise = new Promise(getBuffer(fileData));
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = async (event) => {
        // fileData = fileReader.result;
        setFileSelected(fileReader.result)
        const pdfDoc = await PDFDocument.load(fileReader.result)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const { width, height } = firstPage.getSize()
        firstPage.drawText('This text was added with JavaScript!', {
            x: parseInt(namePosX),
            y: parseInt(namePosY),
            size: 50,
            font: helveticaFont,
            size:parseInt(nameFontSize),
            // color:rgb(parseInt(colorSelected[0]),parseInt(colorSelected[1]),parseInt(colorSelected[2]))
        })
        // const pdfBytes = await pdfDoc.save()
        const uri = await pdfDoc.saveAsBase64({dataUri:true})
        document.querySelector('#mypdf').src = uri;
        }
    }
    const handleSetColor = (value)=>{
        const hex = value.target.value;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        // return {r, g, b} 
        return  setColorSelected([r,g,b]);
    }
    // const hex2rgb = (hex) => {
    //     const r = parseInt(hex.slice(1, 3), 16);
    //     const g = parseInt(hex.slice(3, 5), 16);
    //     const b = parseInt(hex.slice(5, 7), 16);
        
    //     // return {r, g, b} 
    //     return  [r,g,b];
    // }
    const handlePreviewPrint = (data)=>{
        Swal.fire({
            icon:'info',
            title:'Loading data',
            html:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading();
        var data2 = {
            training_details_id:data.training_details_id,
            training_rqmts:data.training_rqmts,
            trainer_ids:data.trainer_ids,
        }
        console.log(data2)
        getCompletedTrainee(data2)
        .then(res=>{
            // setTraineeList(res.data)
            setTraineeNames(res.data.list)
            setTraineeIds(res.data.comp_ids)
            setCompRqmt(res.data.comp_rqmt)
            setCompEvaluation(res.data.comp_evaluation)
            Swal.close();
            setOpenPrintInfoDialog(true)
        }).catch(err=>{
            Swal.close();
            console.log(err)
        })
    }
    const handleClosePrintInfoDialog = () =>{
        setOpenPrintInfoDialog(false)
    }
    return(
        <Grid container spacing={1} sx={{p:2}}>
            <Grid item xs={12}>
                <Typography sx={{padding:'10px',background:'#008756',color:'#fff'}} variant='h5'>Manage Certificate</Typography>
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <IconButton onClick={()=>setOpenManageTemplateDialog(true)}><SettingsIcon/></IconButton>
            </Grid>
            <Grid item xs={12}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Training Name</StyledTableCell>
                                <StyledTableCell>Period From</StyledTableCell>
                                <StyledTableCell>Period To</StyledTableCell>
                                <StyledTableCell>Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                trainingData.map((row,key)=>
                                    <TableRow key={key} hover>
                                        <TableCell>{row.training_name}</TableCell>
                                        <TableCell>{row.period_from}</TableCell>
                                        <TableCell>{row.period_to}</TableCell>
                                        <TableCell><Tooltip title='Preview Trainee List'><IconButton onClick = {()=>handlePreviewPrint(row)} color='primary'><PrintIcon/></IconButton></Tooltip></TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            
            <Dialog
                fullScreen
                open={openPrintInfoDialog}

                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'sticky',top:0 }}>
                <Toolbar>
                    <PrintIcon/>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Preview Trainee List Info
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleClosePrintInfoDialog}>
                    close
                    </Button>
                </Toolbar>
                </AppBar>
                <Box sx={{m:2}}>
                    <Preview traineeNames = {traineeNames} traineeIds = {traineeIds} compRqmt = {compRqmt} compEvaluation = {compEvaluation}/>
                </Box>

            </Dialog>
            <Dialog
                fullScreen
                open={openManageTemplateDialog}
                // sx={{width:matches?'100%':'50vw',height:'100%',right:0,left:'auto'}}

                // onClose={handleCloseDialog}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'sticky',top:0 }}>
                <Toolbar>
                    <WallpaperIcon/>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Manage Template
                    </Typography>
                    <Button autoFocus color="inherit" onClick={()=>setOpenManageTemplateDialog(false)}>
                    close
                    </Button>
                </Toolbar>
                </AppBar>
                <Box sx={{m:2}}>
                    <ManageTemplate/>
                </Box>

            </Dialog>
        </Grid>
    )
}