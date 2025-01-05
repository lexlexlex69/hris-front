import { Box, Button, Card, CardActionArea, CardActions, CardContent, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { Fragment, useContext, useEffect, useState } from "react"
import { PrfStateContext } from "../../PrfProvider"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { insertBIAssessment } from "../../axios/prfPooling"
import { BIHeader, BIOtherRemarks, BIPotentialStrengths, BIRedFlags } from "../component/BIComponent"



function BackgroundInvestigation({ closeModal }) {
  const { applicantData, setApplicantData } = useContext(PrfStateContext)
  const [potentialData, setPotentialData] = useState(null)
  const [redFlagsData, setRedFlagsData] = useState(null)
  const [otherData, setOtherData] = useState({
    other_remarks: '',
    remark: '',
  })

  const [anchorEl, setAnchorEl] = useState(null);
  const [requestQueue, setRequestQueue] = useState([]);
  const [processingQueue, setProcessingQueue] = useState(false);

  const processQueue = async () => {
    if (processingQueue || requestQueue.length === 0) return;
    setProcessingQueue(true);
    const currentRequest = requestQueue[0];
    try {
      await currentRequest();
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setRequestQueue(prevQueue => prevQueue.slice(1));
      setProcessingQueue(false);
    }
  };
  useEffect(() => {
    if (!processingQueue) {
      processQueue();
    }
  }, [requestQueue, processingQueue]);
  const enqueueRequest = (requestFn) => {
    setRequestQueue(prevQueue => [...prevQueue, requestFn]);
  };

  const handleSubmitBgInv = (ev) => {
    ev.preventDefault()
    if (!otherData.other_remarks || !potentialData || !redFlagsData) {
      return toast.warning("Please fill in the fields that are required")
    }

    let payload = {}
    payload.potential_strengths = potentialData
    payload.red_flags = redFlagsData
    payload.bg_inv_radio = otherData.other_remarks
    payload.other_remarks = otherData.remark
    payload.data = applicantData

    Swal.fire({
      title: "Click submit to continue?",
      text: "",
      icon: "info",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Submit",
    }).then((result) => {
      if (result.isConfirmed) {
        enqueueRequest(async () => {
          try {
            const res = await insertBIAssessment(payload,);
            if (res.data.status === 200) {
              toast.success(res.data.message);
              closeModal();
            } else {
              toast.error(res.data.message);
            }
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    });
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <>
      <Box sx={{ margin: "0 10px 10px 10px" }}>
        <Card variant="outlined">
          <Box sx={{ textAlign: "center", padding: "1.75rem 0.5rem 1rem 0.5rem" }}>
            <Typography variant="h6" fontWeight="600"> INTERVIEW ASSESSMENT FORM - BACKGROUND INVESTIGATION </Typography>
          </Box>
          <CardContent>
            <Grid2 container spacing={2}>
              <BIPotentialStrengths potentialData={potentialData} handleChange={(ev) => setPotentialData(ev.target.value)} disabledTog={false} />
              <BIRedFlags redFlagsData={redFlagsData} handleChange={(ev) => setRedFlagsData(ev.target.value)} disabledTog={false} />
              <BIOtherRemarks otherData={otherData} setOtherData={setOtherData} disabledTog={false} />

              <Grid2 item xs={12} lg={12}>
                <Box>
                  <Button variant="contained" color="success" sx={{ float: "right", clear: "both" }} onClick={(ev) => handleSubmitBgInv(ev)}> Submit </Button>
                </Box>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default BackgroundInvestigation