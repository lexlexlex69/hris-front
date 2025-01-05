import { useContext, useEffect, useState } from "react"
import { PrfStateContext } from "../PrfProvider"

import { Box, Card, CardContent, Stack, TextField } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

import { getApplicantList } from "../axios/prfPooling"
import { getHeadSignatories, getIndorseDetails } from "../axios/prfTracker"
import Indorsement from "./Indorsement"
import { toast } from "react-toastify"
import moment from "moment"

function DocumentPrep({ closeModal }) {
  const { tempReq, } = useContext(PrfStateContext)
  // const [processDocs, setProcessDocs] = useState({});
  const [headSignatory, setHeadSignatory] = useState([]);
  const [loading, setLoading] = useState(true)

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

  // console.log(tempReq)
  // if (Object.keys(tempReq).length > 0) {
  //   // let detail = {}
  //   // var str = tempReq.office_dept;
  //   // var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
  //   // var acronym = matches.join('');

  //   // detail.office_dept = tempReq.office_dept;
  //   // detail.short_name = acronym;
  //   // detail.date = moment().format("d M Y");
  //   // detail.head_cnt = tempReq.head_cnt;
  //   // detail.prf_no = tempReq.prf_no;
  //   // detail.status = tempReq.emp_stat;
  //   // detail.rate = tempReq.pay_sal;
  //   // detail.remarks = '';
  //   // detail.rev_by = '';
  //   // detail.avail_app = '';


  // }


  useEffect(() => {
    if (Object.keys(tempReq).length > 0) {
      enqueueRequest(async () => {
        try {
          const [res1] = await Promise.all([
            getHeadSignatories(),
          ])
          console.log(res1)
          setHeadSignatory(res1.data)
        } catch (error) {
          toast.error(error.message)
        } finally {
          setLoading(false)
        }
      })
    }
  }, [])

  if (loading) {
    return null
  }

  return (
    <>
      <Grid2 container spacing={1}>
        <Grid2 item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <TextField label="PRF number" size="small" inputProps={{ readOnly: true, }} InputLabelProps={{ shrink: true, }} value={tempReq.prf_no} disabled sx={{ backgroundColor: "rgb(240,240,240)" }} />
          </Stack>
        </Grid2>
        <Grid2 item xs={12}>
          <Indorsement headSignatory={headSignatory} />
        </Grid2>
      </Grid2>
    </>
  )
}

export default DocumentPrep