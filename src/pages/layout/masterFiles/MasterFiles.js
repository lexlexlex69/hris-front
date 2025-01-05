import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import axios from 'axios';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CommonBackdrop from '../../../common/Backdrop';
import { toast } from 'react-toastify';

import { viewFilesUsingPathOnly } from '../pds/customFunctions/CustomFunctions';


const MasterFiles = () => {
    const [privacyNotice, setPrivacyNotice] = useState('')
    const [privacyFile, setPrivacyFile] = useState('')
    const [commonBackdrop, setCommonBackdrop] = useState(false)

    const retrivePrivacyFile = async (controller) => {
        let res = await axios.post(`/api/master-files/privacy/retrievePrivacyFile`, {}, { signal: controller.abort() })
        console.log(res)
        setPrivacyNotice(res.data)
    }

    const fileCheckerExt = () => { // application file checker
        let flag = 1
        if (!privacyFile) {
            flag = -1
        }
        else {
            let ext = privacyFile.name.slice((Math.max(0, privacyFile.name.lastIndexOf(".")) || Infinity) + 1)
            if (ext !== 'pdf') {
                console.log('not pdf')
                flag = 0
            }
        }
        return flag
    }

    const submitPrivacyNoticeFile = async () => {
        if (fileCheckerExt() === -1) {
            toast.warning('Please add a file')
            return
        }
        else if (fileCheckerExt() === 0) {
            toast.warning('Please choose a pdf file!')
            return
        }
        setCommonBackdrop(true)
        let privacyFormData = new FormData()
        privacyFormData.append('privacyFile', privacyFile)
        let res = await axios.post(`/api/master-files/privacy/UploadPrivacyFile`, privacyFormData)
        setCommonBackdrop(false)
        if (res.data.status === 200) {
            toast.success('Privacy Notice updated!')
            setPrivacyFile('')
            let controller = new AbortController()
            retrivePrivacyFile(controller)
        }
        else if (res.data.status === 500) {
            toast.error(res.data.message)
        }
        console.log(res)
    }

    useEffect(() => {
        let controller = new AbortController()
        retrivePrivacyFile(controller)
        return (() => controller.abort())
    }, [])
    return (
        <Container maxWidth="lg">
            <CommonBackdrop open={commonBackdrop} title='Uploading Privacy Notice' />
            <Typography variant="body1" color="primary">Master Files</Typography>
            <Card mt={1} elevation={5} sx={{ width: { xs: '90%', md: '25rem' } }}>
                <CardContent>
                    <Box
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        sx={{
                            mt: 1
                        }}
                    >
                        <Typography variant="h6" color="#fff" sx={{ bgcolor: 'primary.light', width: '100%', p: .5, borderRadius: .5 }} align='center' mb={1}>Privacy Notice</Typography>
                        <Box mb={2}>
                            <Button variant="contained" color="success" sx={{ borderRadius: '2rem' }} onClick={() => viewFilesUsingPathOnly(privacyNotice?.file_path, '/api/master-files/privacy/viewPrivacyFile')} startIcon={privacyNotice ? <VisibilityIcon /> : <VisibilityOffIcon />} disabled={!privacyNotice ? true : false}> {!privacyNotice ? 'no current file' : 'view current privacy notice file'}</Button>
                        </Box>
                        {privacyFile?.name ? <><Typography variant="body1" color="error" mb={.5}> {privacyFile.name}<HighlightOffIcon sx={{ cursor: 'pointer', ml: .5 }} onClick={() => setPrivacyFile('')} /></Typography></> : <Typography variant="body1" color="#3D3D3D" mb={.5}>&nbsp;</Typography>}
                        <Box display='flex' gap={1}>
                            <Button variant="contained" component="label" color="warning" sx={{ borderRadius: '2rem' }} display="inline-block" startIcon={<AttachFileIcon />}>
                                CHOOSE FILE
                                <input hidden accept="pdf/*" type="file" onChange={(e) => setPrivacyFile(e.target.files[0])} />
                            </Button>
                            <Button startIcon={<ArrowForward />} variant="contained" sx={{ borderRadius: '2rem' }} onClick={submitPrivacyNoticeFile}>Sumbit</Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

        </Container>
    );
};

export default MasterFiles;