import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { blue, green, red } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';

// mui icons
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SendAndArchiveIcon from '@mui/icons-material/SendAndArchive';
import AddCircleIcon from '@mui/icons-material/AddCircle'

// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function AddSpecialSkills(props) {

  const specialSkills = useRef('')

  const handleAdd = (e) => {
    e.preventDefault();
    console.log(specialSkills.current.value)
    let recordToAdd = props.specialSkillsRecord.map(item => item)
    let rowId = recordToAdd.length

    recordToAdd.push({
      description: specialSkills.current.value,
      // type_id: 1,
      status: 2,
      rowId: rowId + 1
    })

    let record = props.specialSkills.map((item) => item)
    record.unshift({ // push to state used in the table
      description: specialSkills.current.value,
      rowId: rowId + 1,
      type_id: 1,
      isNew: true
    })

    props.setSpecialSkillsRecord(recordToAdd)
    props.setSpecialSkills(record)
    props.handleClose()
  }

  return (
    <Box >
      <form onSubmit={handleAdd} style={{ marginTop: 1, display: 'flex', gap: 1 }}>
        <TextField label="SPECIAL SKILLS" variant='filled' fullWidth size="small" inputRef={specialSkills} required></TextField>
        <Button variant='contained' size="small" type="submit" sx={{ ml: 1 }}>ADD</Button>
      </form>

    </Box>
  )
}

export default AddSpecialSkills