import { Box, Button, Card, CardContent, FormControlLabel, Paper, Radio, RadioGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useContext, useEffect, useState } from "react"
import { PrfStateContext } from "../../PrfProvider"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { getInterviewAssessment, insertInterviewAssessment } from "../../axios/prfPooling"
import { isEmptyObject } from "jquery"

import { grey, red } from '@mui/material/colors';
import { QCBody, QCExamOption, QCHeader } from "../component/QCComponent"
const lastQualComColor = grey[200];



function QualificationsCompetencies({ closeModal }) {
  const { applicantData, setApplicantData, userId } = useContext(PrfStateContext)
  const [selectedValue, setSelectedValue] = useState({
    radio_qualifications1: null,
    radio_qualifications2: null,
    radio_qualifications3: null,
    radio_qualifications4: null,
    radio_qualifications5: null,
    radio_qualifications6: null,
    radio_qualifications7: null,
    radio_qualifications8: null,
    radio_qualifications9: null,
    radio_qualifications10: null,
  });
  const [examSelector, setExamSelector] = useState(() => {
    const savedContent = localStorage.getItem('examOpt');
    return savedContent ? savedContent : '0';
  })

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

  useEffect(() => {
    localStorage.setItem('examOpt', examSelector)
  }, [examSelector])


  const handleExamChanges = (event) => {
    const { value, name } = event.target
    setExamSelector(value)
  }
  const handleChange = (event) => {
    const { value, name, id } = event.target
    // console.log(value, name, id)
    setSelectedValue({ ...selectedValue, [name]: value });
  };

  const handleSubmitQ = (ev) => {
    ev.preventDefault();

    if (selectedValue.radio_qualifications1 === null || selectedValue.radio_qualifications2 === null || selectedValue.radio_qualifications3 === null || selectedValue.radio_qualifications4 === null || selectedValue.radio_qualifications5 === null || selectedValue.radio_qualifications6 === null || selectedValue.radio_qualifications7 === null || selectedValue.radio_qualifications8 === null || selectedValue.radio_qualifications9 === null || selectedValue.radio_qualifications10 === null) {
      return toast.warning("Please fill in the fields")
    }

    if (examSelector === null || examSelector === undefined) {
      return toast.warning("Please select if it need an examination or not")
    }

    var payload = {}
    payload.prf_data = applicantData;
    payload.rating1 = selectedValue.radio_qualifications1;
    payload.rating2 = selectedValue.radio_qualifications2;
    payload.rating3 = selectedValue.radio_qualifications3;
    payload.rating4 = selectedValue.radio_qualifications4;
    payload.rating5 = selectedValue.radio_qualifications5;
    payload.rating6 = selectedValue.radio_qualifications6;
    payload.rating7 = selectedValue.radio_qualifications7;
    payload.rating8 = selectedValue.radio_qualifications8;
    payload.rating9 = selectedValue.radio_qualifications9;
    payload.rating10 = selectedValue.radio_qualifications10;
    payload.exam_opt = examSelector;

    console.log(applicantData.id)

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
            const res = await insertInterviewAssessment(payload, applicantData.id);
            if (res.data.status === 200) {
              toast.success(res.data.message)
              closeModal();
            } else {
              toast.error(res.data.message)
              closeModal();
            }
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    });
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} lg={12}>
            <QCHeader />
          </Grid2>
          <Grid2 item xs={12} lg={12} sx={{ paddingBottom: "2rem" }}>
            <QCExamOption examSelector={examSelector} handleExamChanges={handleExamChanges} />
          </Grid2>
          <Grid2 item xs={12} lg={12}>
            <QCBody selectedValue={selectedValue} handleChange={handleChange} disabledTog={false} />
          </Grid2>
          <Grid2 item xs={12} lg={12}>
            <Box>
              <Button variant="contained" color="success" sx={{ float: "right", }} onClick={(ev) => handleSubmitQ(ev)}> Submit </Button>
            </Box>
          </Grid2>
        </Grid2 >
      </CardContent>
    </Card >
  )
}

export default QualificationsCompetencies