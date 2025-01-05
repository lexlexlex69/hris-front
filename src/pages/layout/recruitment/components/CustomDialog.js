import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const CustomDialog = ({ children, open, handleClose, fullScreen, specifyWidth, currentPositionInfo, jobPostingModal }) => {
  // media query
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Dialog
      fullScreen
      sx={{ width: fullScreen ? '100vw' : matches ? '100vw' : specifyWidth ? specifyWidth : '40vw' }}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', zIndex: 1500 }}>
        <Toolbar>
          {jobPostingModal && (
            <Box display="flex" flexDirection="column" width="100%">
              <Typography variant='body2'>Position: <u>{currentPositionInfo?.position_name?.toUpperCase()}</u> </Typography>
              <Typography variant='body2'> {currentPositionInfo?.plantilla_id ? <>Item number: {currentPositionInfo?.plantilla_item}</> : <>Mpr number: <u>{currentPositionInfo?.mpr_no?.toUpperCase()}</u></> }</Typography>
              <Typography variant='body2'> Employment status: <u>{currentPositionInfo?.emp_status === 'CS' ? 'CASUAL' : currentPositionInfo?.emp_status === 'CS' ? 'CASUAL' : currentPositionInfo?.emp_status === 'JO' ? 'JOB ORDER' : currentPositionInfo?.emp_status === 'COS' ? 'CONTRACT OF SERVICE' : currentPositionInfo?.emp_status === 'RE' ? 'PERMANENT' : ''}</u> &nbsp; {currentPositionInfo?.head_count ? <> | <>&nbsp;</> HEAD COUNT: <u>{currentPositionInfo?.head_count}</u></> : ''}</Typography>
            </Box>
          )}

          <Box display="" mx="" my="" sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
            <Button autoFocus color="inherit" onClick={handleClose} startIcon={<CloseIcon />}>
              close
            </Button>
          </Box>

        </Toolbar>
      </AppBar>
      <Box sx={{ overflowY: 'scroll',flexGrow:1,width:'100%' }}>
        {children}
      </Box>
    </Dialog>
  );
};

export default CustomDialog;