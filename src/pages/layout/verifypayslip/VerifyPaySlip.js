import React,{useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useSearchParams
} from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { verifyPaySlipInfo } from "./VerifyPaySlipRequest";
import { ViewPaySlip } from "./ViewPaySlip";
import Swal from "sweetalert2";
import NotFound from "../notfound/NotFound";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
export default function VerifyPaySlip(){
    const [searchParams,setSearchParams] = useSearchParams();
    const [code,setCode] = useState();
    const [isLoading,setIsLoading] = useState(true);
    const [data,setData] = useState([]);
    const [infoExists,setInfoExists] = useState([]);
    useEffect(()=>{
        console.log(searchParams.get('code'))
        setCode(searchParams.get('code'))
        var t_data = {
            code:searchParams.get('code').replaceAll(' ','+')
        }
        verifyPaySlipInfo(t_data)
        .then(res=>{
            console.log(res.data)
            if(res.data.status===200){
                setIsLoading(false)
                if(res.data.data.length>0){
                    setInfoExists(true)
                }else{
                    setInfoExists(false)
                }
                setData(res.data.data)
            }else{
                setIsLoading(false)
                setInfoExists(false)
            }
        }).catch(err=>{
            console.log(err)
        })
    },[])
    let {id} = useParams();
    
    return (
        <>
            {
                isLoading
                ?
                <Box sx={{ position: 'absolute',top: '50%',left: '50%',transform: 'translateX(-50%)',display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
                <CircularProgress />
                <Typography sx={{textAlign:'center'}}>Checking information. Please wait... </Typography>
                </Box>
                :
                    infoExists
                    ?
                    <ViewPaySlip data = {data}/>
                    :
                    <NotFound/>

            }
        </>
    )
}