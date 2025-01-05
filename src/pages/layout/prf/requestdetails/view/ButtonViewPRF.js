import { Box, Button } from '@mui/material'
import React, { Fragment, useContext } from 'react'
import ViewRequestForm from './ViewRequestForm'
import { PrfStateContext } from '../../PrfProvider'
import { CustomFullDialog } from '../../components/export_components/ExportComp'

function ButtonViewPRF({ id, minWidth, open, handleClickOpen, handleClose, compSize, comptitle }) {
  // const { tempReq } = useContext(PrfStateContext)

  return (
    <>
      <Button variant="contained" color="info" onClick={handleClickOpen}> View PRF </Button>

      <Fragment>
        <CustomFullDialog id={id} minWidthP={minWidth} openG={open} handleCloseG={handleClose} compSize={compSize} comptitle={comptitle}>
          <ViewRequestForm />
        </CustomFullDialog>
      </Fragment>
    </>
  )
}

export default ButtonViewPRF