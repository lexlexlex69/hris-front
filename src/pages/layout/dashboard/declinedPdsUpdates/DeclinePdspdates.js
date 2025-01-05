import React, { useEffect } from 'react';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge';
import CommonDialog from '../../../../common/CommonDialog'
import { useState } from 'react';
import AccordionItems from './AccordionItems';

import axios from 'axios'

const DeclinePdspdates = () => {
    const [totalDecline, setTotalDecline] = useState(0)
    const fetchDecline = async () => {
        let res = await axios.get(`/api/pds/decline-updates/fetchDeclinedUpdates`)
        setTotalDecline(res.data)
    }
    useEffect(() => {
        fetchDecline()
    }, [])

    const [openDialog, setOpenDialog] = useState(false)
    return (
        <Box width='100%'>
            <CommonDialog open={openDialog} handleClose={() => setOpenDialog(false)} title="DECLINED UPDATES" >
                <AccordionItems />
            </CommonDialog>
            {/* <Badge badgeContent={false} color="error" anchorOrigin={{ vertical: 'top', horizontal: 'left', }}> */}
            <Button variant="contained" disabled={totalDecline.length > 0 ? false : true} color="error" sx={{ width: '100%', borderRadius: '1rem' }} onClick={() => setOpenDialog(true)} >
                PDS DECLINED UPDATES
            </Button>
            {/* </Badge> */}

        </Box>
    );
};

export default DeclinePdspdates;