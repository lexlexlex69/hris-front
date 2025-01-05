import { Box, Grid, Tab, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { toast } from "react-toastify";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
// import { getRateInvAs } from "../../axios/prfPooling";
import ViewIAF from "./ViewIAF";
import { PrfStateContext } from "../../PrfProvider";

function EvaluateIAF({ }) {
  const { applicantData } = useContext(PrfStateContext)
  const [value, setValue] = useState('iaf');
  const [qualificationData, setQualificationData] = useState({})
  
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


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // console.log(applicantData, Object.keys(applicantData).length)
  // if (applicantData) {
  // navigate(`../recruitment/evaluate-pds/${applicantData.app_id}:${applicantData.is_employee === 1 ? 'employee' : 'applicant'}`)
  // }
  // console.log(applicantData)

  // useEffect(() => {
  //   if (!value) { return }

  //   if (value === 'iaf') {
  //     enqueueRequest(async () => {
  //       try {
  //         const res = await getRateInvAs({ prf_id: applicantData.id, rater_lvl: applicantData.rater_lvl, data: applicantData, })
  //         if (res.data.status === 200) {
  //           setQualificationData(res.data.data)
  //         } else {
  //           toast.error(res.data.message);
  //         }
  //       } catch (error) {
  //         toast.error(error.message);
  //       }
  //     });
  //   }
  // }, [value])

  // EVALUATION OF TAB FOR INTERVIEW ASSESSMENT RESULT AND PDS
  return (
    <Box sx={{ margin: "0 10px 10px 10px" }}>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12} lg={12}>
          <Box sx={{ width: '100%', }}>
            <TabContext value={value} sx={{ overflowY: "auto", }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Interview Assessment Form" value="iaf" />
                  <Tab label="Personal Data Sheet" value="pds" />
                </TabList>
              </Box>
              <TabPanel value="iaf">
                <Box>
                  {/* <ViewIAF data={qualificationData} /> */}
                </Box>
              </TabPanel>
              <TabPanel value="pds">
                <Typography variant="body1"> Personal Data Sheet </Typography>
                <Box>
                  {/* <ViewPds /> */}
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default EvaluateIAF

