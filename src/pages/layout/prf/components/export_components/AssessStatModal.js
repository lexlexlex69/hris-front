import { Box, Step, StepLabel, Stepper } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Fragment, useState } from "react";
import CommonModal from "../../../../../common/Modal";

const steps = {
  1: ['INTERVIEW', 'EXAMINATION', 'BACKGROUND INVESTIGATION'], // stepsWExam
  2: ['INTERVIEW', 'BACKGROUND INVESTIGATION'], // stepsWOExam
}

function AssessStatModal({ item, data, }) {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };




  return (
    <>
      <Box onDoubleClick={() => setOpen(true)}>
        {['human_resources', 'immediate_head', 'next_level_head'].map((dt) => (
          <>
            {data.rater_info.filter(ob => ob.rater_lvl === dt && ob.prf_applicant_id === item.id).map(f => {
              let countInt = 0

              if (f.assessed_int_id) {
                countInt++
              }
              if (f.assessed_bi_id) {
                countInt++
              }
              if (f.assessed_exam_id) {
                countInt++
              }
              return (
                <ul>
                  {dt === 'human_resources' && (
                    <li>
                      HUMAN RESOURCES: {countInt}
                    </li>
                  )}
                  {dt === 'immediate_head' && (
                    <li>
                      IMMEDIATE HEAD: {countInt}
                    </li>
                  )}
                  {dt === 'next_level_head' && (
                    <li>
                      NEXT LEVEL HEAD: {countInt}
                    </li>
                  )}
                </ul>
              );
            })}
          </>
        ))}
      </Box>

      <Fragment>
        <CommonModal open={open} setOpen={() => { setOpen(false) }} title={""} customWidth={"auto"}>
          <Grid2 container spacing={2} sx={{ paddingTop: "0.75rem" }}>
            <Grid2 item xs={12} lg={12}>
              <Stepper activeStep={activeStep}>
                {steps[1].map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  // if (isStepOptional(index)) {
                  //   labelProps.optional = (
                  //     <Typography variant="caption">Optional</Typography>
                  //   );
                  // }
                  // if (isStepSkipped(index)) {
                  //   stepProps.completed = false;
                  // }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid2>
            <Grid2 item xs={12} lg={12}>
              test
            </Grid2>
          </Grid2>
        </CommonModal>
      </Fragment >
    </>
  )
}

export default AssessStatModal