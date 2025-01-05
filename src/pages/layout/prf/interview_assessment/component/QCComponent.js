import { Box, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { grey } from "@mui/material/colors";

const lastQualComColor = grey[200];

const questionsDataIAF = [
  {
    id: 1, title: "Education and Experience",
    subtitle: "Appropriate educational qualifications or training for the position applied for; Acquired similar skills or qualifications through past work experiences. (Check for employment gaps).",
  },
  {
    id: 2, title: "Job Knowledge and Competencies (Technical Qualifications)",
    subtitle: "Knowledge on responsibilities and duties of the desired position.",
  },
  {
    id: 3, title: "Integrity & Professionalism",
    subtitle: "Being honest and having strong moral principles; moral uprightness. It is generally a personal choice to hold oneself to consistent moral and ethical standards.",
  },
  {
    id: 4, title: "Customer-Centered Service",
    subtitle: "The candidate demonstrates the knowledge and skills to create a positive customer or patient experience/interaction necessary for this position.",
  },
  {
    id: 5, title: "Passion for Excellence (General Appearance & Confidence)",
    subtitle: "Creates an excellent appearance; a very likeable person; shows determination and confidence; high interest level in the desired position.",
  },
  {
    id: 6, title: "Communication",
    subtitle: "The ability to convey articulate information effectively in both verbal and non- verbal communication skills.",
  },
  {
    id: 7, title: "Leadership Ability",
    subtitle: "Demonstrates the leadership skills necessary for the position; high potentials; trainability.",
  },
  {
    id: 8, title: "Synergy",
    subtitle: "The ability to work well with others; willingness to cooperate; a team player.",
  },
  {
    id: 9, title: "Potential and Role Fitness",
    subtitle: "The candidate’s overall potential and fitness to the role and the organization.",
  },
  {
    id: 10, title: "Overall Assessment Rating (Part I)",
  },
]


export function QCHeader() {
  return (
    <>
      <Box sx={{ padding: "1.75rem 0.5rem 1rem 0.5rem" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="600"> INTERVIEW ASSESSMENT FORM </Typography>
        </Box>
      </Box>
      <Typography variant="subtitle1" sx={{ lineHeight: "1.25rem" }}>
        Interview Assessment Form is to be completed by the interviewer to rank the candidate’s overall qualifications for the position for which they have applied for. Under each heading, the interviewer should give the candidate a numerical rating by putting a check mark (√) in the appropriate box. The numerical rating system is based on the scale below.
      </Typography>
      <Stack spacing={2} direction="row" justifyContent="space-around" mt={1} mb={1}>
        <Typography variant="subtitle2" fontWeight={600}> Scale: </Typography>
        <Typography variant="subtitle2"> <span style={{ fontWeight: 600 }}> 5 </span> - Very Strong </Typography>
        <Typography variant="subtitle2"> <span style={{ fontWeight: 600 }}> 4 </span> - Strong </Typography>
        <Typography variant="subtitle2"> <span style={{ fontWeight: 600 }}> 3 </span> - Acceptable </Typography>
        <Typography variant="subtitle2"> <span style={{ fontWeight: 600 }}> 2 </span> - Weak </Typography>
        <Typography variant="subtitle2"> <span style={{ fontWeight: 600 }}> 1 </span> - Very Weak </Typography>
      </Stack>
    </>
  )
}

export function QCExamOption({ examSelector, handleExamChanges }) {
  return (
    <>
      <Box sx={{ lineHeight: "0.5rem" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "800" }}> Examination option </Typography>
        <Typography variant="caption"> <em> (Select the yes option if it needs to undergo for exam) </em> </Typography>
      </Box>
      <Stack direction="row" gap={2} sx={{ flexWrap: "wrap" }}>
        <Box sx={{ display: 'contents' }}>
          <input type="radio" name={'radio-exam-option'} id={'radio-exam-option-0'} value='0' checked={String(examSelector) === '0'} onChange={handleExamChanges} style={{ width: '23px', height: "23px" }} />
          <div> No </div>
        </Box>
        <Box sx={{ display: 'contents' }}>
          <input type="radio" name={'radio-exam-option'} id={'radio-exam-option-1'} value='1' checked={String(examSelector) === '1'} onChange={handleExamChanges} style={{ width: '23px', height: "23px" }} />
          <div> Yes </div>
        </Box>
      </Stack>
    </>
  )
}

export function QCBody({ selectedValue, handleChange, disabledTog, }) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" rowSpan={2} sx={{ width: 600, color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}>
              <Typography variant="h6" fontWeight={"600"}> PART I: QUALIFICATIONS AND COMPETENCIES </Typography>
            </TableCell>
            <TableCell align="center" colSpan={5} sx={{ width: 100, color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}>
              <Typography variant="caption"> RATING </Typography>
            </TableCell>
          </TableRow>
          <TableRow align="center">
            <TableCell align="center" sx={{ color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}> 5 </TableCell>
            <TableCell align="center" sx={{ color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}> 4 </TableCell>
            <TableCell align="center" sx={{ color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}> 3 </TableCell>
            <TableCell align="center" sx={{ color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}> 2 </TableCell>
            <TableCell align="center" sx={{ color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important" }}> 1 </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questionsDataIAF.map((ob, index) => (
            <TableRow key={'radio-table-' + ob.id} sx={{ height: "7.75rem", backgroundColor: Object.keys(questionsDataIAF).length - 1 === index ? lastQualComColor : "" }}>
              <TableCell>
                <Stack sx={{ flexWrap: "wrap" }}>
                  <Typography variant="subtitle1" fontWeight={"bold"}> {ob.title} </Typography>
                  {ob.subtitle && (
                    <Typography variant="subtitle2" fontStyle={"italic"}> {ob.subtitle} </Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell align="center"> <input disabled={disabledTog} type="radio" id={'radio-qualifications-option5'} name={'radio_qualifications' + ob.id} value={5} checked={String(selectedValue['radio_qualifications' + ob.id]) === '5'} onClick={(ev) => handleChange(ev)} style={{ width: '23px', height: "23px" }} /> </TableCell>
              <TableCell align="center"> <input disabled={disabledTog} type="radio" id={'radio-qualifications-option4'} name={'radio_qualifications' + ob.id} value={4} checked={String(selectedValue['radio_qualifications' + ob.id]) === '4'} onClick={(ev) => handleChange(ev)} style={{ width: '23px', height: "23px" }} /> </TableCell>
              <TableCell align="center"> <input disabled={disabledTog} type="radio" id={'radio-qualifications-option3'} name={'radio_qualifications' + ob.id} value={3} checked={String(selectedValue['radio_qualifications' + ob.id]) === '3'} onClick={(ev) => handleChange(ev)} style={{ width: '23px', height: "23px" }} /> </TableCell>
              <TableCell align="center"> <input disabled={disabledTog} type="radio" id={'radio-qualifications-option2'} name={'radio_qualifications' + ob.id} value={2} checked={String(selectedValue['radio_qualifications' + ob.id]) === '2'} onClick={(ev) => handleChange(ev)} style={{ width: '23px', height: "23px" }} /> </TableCell>
              <TableCell align="center"> <input disabled={disabledTog} type="radio" id={'radio-qualifications-option1'} name={'radio_qualifications' + ob.id} value={1} checked={String(selectedValue['radio_qualifications' + ob.id]) === '1'} onClick={(ev) => handleChange(ev)} style={{ width: '23px', height: "23px" }} /> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}