import React,{useEffect, useState} from 'react';
import {Grid,TextField,Typography} from '@mui/material'
import { getTemplate } from '../CertificateRequest';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function ManageTemplate(props){
    const [previewURL,setPreviewURL] = useState('');
    const [fileSelected,setFileSelected] = useState('');
    const [xPos,setXPos] = useState(0);
    const [yPos,setYPos] = useState(0);
    const [fontTempSize,setFontTempSize] = useState(18);
    useEffect(()=>{
        cusotomPDF()
    },[xPos,yPos,fontTempSize])
    const cusotomPDF = async (name)=>{
       
        const pdfDoc = await PDFDocument.load(fileSelected)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const { width, height } = firstPage.getSize()
        firstPage.drawText('John Dela Cruz', {
            x: parseInt(xPos),
            y: parseInt(yPos),
            font: helveticaFont,
            size:parseInt(fontTempSize),

        })

        const uri = await pdfDoc.saveAsBase64({dataUri:true})
        setPreviewURL(uri);
    }
    useEffect(()=>{
        getTemplate()
        .then(res=>{
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
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
        firstPage.drawText('John Dela Cruz', {
            x: parseInt(xPos),
            y: parseInt(yPos),
            font: helveticaFont,
            size:parseInt(fontTempSize),
            // color:rgb(parseInt(colorSelected[0]),parseInt(colorSelected[1]),parseInt(colorSelected[2]))
        })
        // const pdfBytes = await pdfDoc.save()
        const uri = await pdfDoc.saveAsBase64({dataUri:true})
        // document.querySelector('#previewURL').src = uri;
        setPreviewURL(uri)
        }
    }
    return(
        <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={4}>
                <Grid item container spacing={2}>
                    <Grid item xs={12}>
                        <TextField type ='file' label='PDF template' InputLabelProps={{shrink:true}} fullWidth onChange={handleSetFile}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type ='text' label='Template Name' InputLabelProps={{shrink:true}} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type ='text' label='Sample Name' InputLabelProps={{shrink:true}} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type ='number' label='Font Size' InputLabelProps={{shrink:true}} fullWidth value = {fontTempSize} onChange={(value)=>setFontTempSize(value.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type ='number' label='X Position' InputLabelProps={{shrink:true}} fullWidth value = {xPos} onChange={(value)=>setXPos(value.target.value)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type ='number' label='Y Position' InputLabelProps={{shrink:true}} fullWidth value = {yPos} onChange={(value)=>setYPos(value.target.value)}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
                <Typography align='center'>Preview</Typography>
                <iframe src={previewURL} id='previewURL' height=' 500px' width = '100%'>
                    
                </iframe>
            </Grid>
        </Grid>
    )
}