import { Box, Button, FormControlLabel, FormLabel, Input, Stack, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react"
import { PrfStateContext } from "../../PrfProvider"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import { insertExamResult } from "../../axios/prfPooling"
import { ExamOption, ExamRemark } from "../component/ExamComponent"

function ExamIAF({ closeModal }) {
  const { tempReq, applicantData, userId } = useContext(PrfStateContext)
  const [examSelector, setExamSelector] = useState(null)
  const [examRemark, setExamRemark] = useState(null)

  // console.log(applicantData)

  const handleSubmit = (ev) => {
    ev.preventDefault();

    console.log(examSelector, examRemark)

    if (!examSelector || !examRemark) {
      return toast.info('Please fill in the fields')
    }

    let payload = {}
    payload.exam_result = examSelector
    payload.exam_remark = examRemark
    payload.applicant_id = applicantData.id
    payload.rater_id = applicantData.rater_id

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
        handleRequest(payload, applicantData.id)
      }
    });
  }

  const handleRequest = async (payload, id) => {
    try {
      const res = await insertExamResult(payload, id);
      if (res.data.status === 200) {
        toast.success(res.data.message)
        closeModal();
      } else {
        toast.error(res.data.message)
        closeModal();
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleReset = (ev) => {
    ev.preventDefault();
    setExamRemark('');
    setExamSelector(null);
  }

  return (
    <Box>
      <Stack gap={2}>
        <Box>
          <ExamOption examSelector={examSelector} handleChange={(ev) => setExamSelector(ev.target.value)} disabledTog={false} />
        </Box>
        <Stack>
          <ExamRemark examRemark={examRemark} handleChange={(ev) => setExamRemark(ev.target.value)} disabledTog={false} />
        </Stack>
      </Stack>

      <Stack gap={1} direction="row" justifyContent='end' sx={{ padding: '1rem 0rem', }}>
        <Button variant="contained" color="warning" onClick={handleReset}> Reset </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}> Submit </Button>
      </Stack>
    </Box>
  )
}

export default ExamIAF