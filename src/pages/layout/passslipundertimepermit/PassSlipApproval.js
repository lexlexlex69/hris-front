import { Box,Grid,Skeleton,Fade,Paper,Typography, Button } from '@mui/material'
import React,{useEffect, useState} from 'react'
import { getAllForApprovalPassSlip,approvalActionPassSlip} from './PassSlipUndertimeRequest'
import DataTable from 'react-data-table-component'
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//icon
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import Swal from 'sweetalert2';
export default function PassSlipApproval(){
    // media query
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading,setIsLoading] = useState(true)
    const [data,setData] = useState([])
    useEffect(()=>{
        getAllForApprovalPassSlip()
        .then(res=>{
            const result = res.data
            console.log(result)
            setData(result)
            setIsLoading(false)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    const columns = [
        {
            name:'Date',
            selector:row=>row.date
        },
        {
            name:'Departure Time',
            selector:row=>formatAMPM(row.departure_time)
        },
        {
            name:'Expected Time of Return',
            selector:row=>formatAMPM(row.return_time)
        },
        {
            name:'Purpose Type',
            selector:row=>row.purpose_type
        },
        {
            name:'Destination',
            selector:row=>row.destination
        },
        {
            name:'Purpose',
            selector:row=>row.purpose
        },
        
        {
            name:'Action',
            selector:row=><Box><Button color='success' onClick = {()=>action(1,row)}><ThumbUpOutlinedIcon/></Button><Button color='error' onClick = {()=>action(0,row)}><ThumbDownOutlinedIcon/></Button></Box>
        },
    ]
    const formatAMPM = (time)=>{
        var split_time = time.split(':');
        var hours = split_time[0];
        var minutes = split_time[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const action = (type,row)=>{
        var data2 = {
            type:type,
            id:row.pass_slip_id
        }
        Swal.fire({
            icon:'info',
            title:'Please wait...',
            allowEscapeKey:false,
            allowOutsideClick:false
        })
        Swal.showLoading()
        approvalActionPassSlip(data2)
        .then(res=>{
            console.log(res)
            const result = res.data
            if(result.status === 200){
                setData(result.new_data)
                Swal.fire({
                    icon:'success',
                    title:result.message,
                    showConfirmButton:false,
                    timer:1500
                })
            }else{
                Swal.fire({
                    icon:'error',
                    title:result.message
                })
            }
        }).catch(err=>{
            Swal.close()
            console.log(err)
        })
    }
    return (
        <>
        {
            isLoading
            ?
            <Box sx={{padding:'20px'}}>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{margin:'10px 0 10px 0'}}>
                            <Box sx={{display:'flex',flexDirection:'column'}}>
                            <Skeleton variant='text'  width={'100%'} height={'100px'} animation="wave"/>
                            <Skeleton variant='rectangular'  width={'100%'} height={'300px'} animation="wave"/>
                            </Box>
                        </Grid>
                    </Grid>
            </Box>
            :
            <Fade in={!isLoading}>
                <Box sx={{margin:'20px'}}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} component={Paper} sx={{margin:'10px 0 10px 0'}}>
                            <Box sx={{display:'flex',flexDirection:'row',background:'#008756'}}>
                                <Typography variant='h5' sx={{fontSize:matches?'17px':'auto',color:'#fff',textAlign:'center',padding:'15px 0 15px 0'}}  >
                                {/* <StickyNote2 fontSize='large'/> */}
                                &nbsp;
                                Pass Slip Approval
                            </Typography>

                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <DataTable
                                data={data}
                                columns={columns}
                                pagination
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
    }
    </>
    )
}