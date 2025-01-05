import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { blue, green } from '@mui/material/colors';
import axios from 'axios';
import { toast } from 'react-toastify';
import { handleViewFile, handleViewFile2 } from '../../customFunctions/CustomFunctions';
import CommonBackdrop from '../../../../../common/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2';


const AddToPreferences = ({ open, handleClose, data }) => {
  const [checked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const [backdropTitle, setBackdropTitle] = useState('')
  const [commonBackdrop, setCommonBackdrop] = useState(false)

  const [lackingReason, setLackingReason] = useState('')
  const [lackingAttachment, setLackingAttachment] = useState(false)
  const [nonRelevant, setNonRelevant] = useState(false)

  const addPdsToPreferences = async () => {
    Swal.fire({
      text: "Confirm to add",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setBackdropTitle('Adding as related ' + data.category)
        setCommonBackdrop(true)
        let res = await axios.post(`/api/recruitment/applicant/dashboard/addPdsToPreferences`, data)
        console.log(res)
        setCommonBackdrop(false)
        if (res.data.status === 200) {
          toast.success('Item added as related to position!')
          handleCloseModal()
        }
        else if (res.data.status === 500) {
          toast.error(res.data.message)
        }
      }
    })

  }

  const reasonMaker = (category, data) => {
    console.log(data)
    if (category === 'education')
      return `[Education Background] level: ${data?.elevel}, Degree/Course: ${data?.degreecourse}, School: ${data?.nschool} [REASON] : ${lackingReason}`
    if (category === 'eligibility')
      return `[Eligibility] Title: ${data?.title},License number: ${data?.licenseno}, Date validity: ${data?.dateissue} [REASON]  ${lackingReason}`
    if (category === 'work_experience')
      return `[Work Experience] Agency: ${data?.agency}, Position Title: ${data?.positiontitle} [REASON]  ${lackingReason}`
    if (category === 'trainings')
      return `[Trainings] Title: ${data?.title},  [REASON]  ${lackingReason}`
  }

  const categoryChecker = () => {
    if (data.category === 'education')
      return 'EDUCATIONAL BACKGROUND'
    if (data.category === 'eligibility')
      return 'ELIGIBILITY'
    if (data.category === 'work_experience')
      return 'WORK EXPERIENCE'
    if (data.category === 'trainings')
      return 'TRAINING PROGRAMS ATTENDED'
  }

  const submitLacking = async (e) => {
    e.preventDefault()
    setBackdropTitle('Mark as lacking ' + data.category)
    setCommonBackdrop(true)
    let reasonStr = reasonMaker(data.category, data.data)
    const toPost = {
      profile_id: data.data.employee_id ? data.data.employee_id : data.data.applicant_id,
      type: data.applicant_type === 'employee' ? 'Employee' : 'Applicant',
      is_lacking: 1,
      remarks: reasonStr,
      job_vacancy_id: data.vacancy_id,
      is_attachment: lackingAttachment ? 1 : 0,
      is_not_relevant: nonRelevant ? 1 : 0,
      category: categoryChecker(),
      row_index: data.data.id
    }

    let res = await axios.post(`/api/recruitment/jobPosting/status/receiving-applicants/submitRemarks`, toPost)
    console.log(res)
    setCommonBackdrop(false)
    if (res.data.status === 200) {
      toast.success('Added as Lacking document.')
      handleCloseModal()
    }
    else if (res.data.status === 500) {
      toast.error(res.data.message)
    }
  }

  const handleCloseModal = () => {
    setLackingReason('')
    setLackingAttachment(false)
    setNonRelevant(false)
    handleClose()
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '60%', lg: '60%' },
          bgcolor: 'background.paper',
          borderRadius: '2rem',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2
        }}>
          <CommonBackdrop open={commonBackdrop} title={backdropTitle} />
          <Box display="flex" justifyContent='flex-end'>
            <CloseIcon color="error" onClick={handleCloseModal} sx={{ cursor: 'pointer' }} />
          </Box>
          <Box display="flex" gap={1} justifyContent="space-between" sx={{ flexDirection: { xs: 'column', md: 'row' } }} >
            <Card sx={{ minWidth: { xs: '100%', md: '10rem' }, p: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} >
              <Button variant='contained' onClick={addPdsToPreferences}>
                <Typography variant="body2" fontWeight='bold' color="#fff" >Add item as related to '{data && data?.category?.toUpperCase()}'</Typography>
              </Button>
            </Card>
            <Card sx={{ width: { xs: '100%', md: '50rem' } }}>
              <CardContent>
                <form onSubmit={submitLacking}>
                  <TextField fullWidth mt={1} mb={1} label="Mark as Lacking document" placeholder="type your reason for marking it  as lacking document." multiline rows={3} required value={lackingReason} onChange={(e) => setLackingReason(e.target.value)} ></TextField>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={lackingAttachment} />} onChange={() => setLackingAttachment(prev => !prev)} label="Lacking attachment" />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={nonRelevant} />} onChange={() => setNonRelevant(prev => !prev)} label="Not relevant to position" />
                  </FormGroup>
                  <Box display='flex' justifyContent='flex-end'>
                    <Button type='submit' variant='contained' color="error" sx={{ borderRadius: '2rem', mt: 1 }}>Mark lacking</Button>
                  </Box>
                </form>
              </CardContent>
            </Card>

            {data?.category === 'education' ?
              (
                <>
                  {
                    !data?.data?.file_path ? (
                      <Card sx={{ minWidth: { xs: '100%', md: '10rem' }, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: { xs: 2, md: 0 } }}>
                        <Typography variant="body1" fontWeight='bold' color="#BEBEBE" align='center'>No File Attached</Typography>
                      </Card>
                    )
                      :
                      <Card sx={{ minWidth: { xs: '100%', md: '10rem' }, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: { xs: 2, md: 0 } }}>
                        {data?.data?.file_path?.split(';').map((item, i) => (
                          <Button variant='contained' color="primary" fullWidth sx={{ fontSize: '10px' }} onClick={() => handleViewFile2(data?.data?.id, 'education/viewAttachFile', item)}>
                            {item.slice(item.lastIndexOf('/') + 1, item.length)}
                          </Button>
                        ))}
                      </Card>
                  }

                </>
              )
              : (
                <Card sx={{ minWidth: { xs: '100%', md: '10rem' }, p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', bgcolor: data?.data?.file_path ? blue[500] : '#BEBEBE', '&:hover': { bgcolor: blue[700] }, pointerEvents: data?.data?.file_path ? '' : 'none' }} onClick={() => handleViewFile(data?.data?.id, data?.category === 'education' ? 'education/viewAttachFile' : data?.category === 'eligibility' ? 'eligibility/viewAttachFile' : data?.category === 'trainings' ? 'trainings/viewAttachFile' : data?.category === 'work_experience' ? 'workexperience/viewAttachFile' : '')}>
                  <Typography variant="body1" fontWeight='bold' color="#fff" align='justify'> {data?.data?.file_path ? 'View attached file' : '( No File Attached )'}</Typography>
                </Card>
              )
            }

          </Box>

        </Box>
      </Fade>
    </Modal>
  );
};

export default AddToPreferences;