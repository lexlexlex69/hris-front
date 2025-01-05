import { Backdrop, Box, Button, Chip, ClickAwayListener, Container, Dialog, Fab, FormControl, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Modal, Paper, Popover, Popper, Select, Slide, Stack, Table, TableContainer, TextField, Tooltip, Typography, styled } from "@mui/material";
import { forwardRef, Fragment, useEffect, useState } from "react";
import {
  Search as SearchIcon, ChevronRight as ChevronRightIcon, Close as CloseIcon, Feed as FeedIcon, Person as PersonIcon, Draw as DrawIcon, Article as ArticleIcon,
  Edit as EditIcon, Chair as ChairIcon, Delete as DeleteIcon, RestartAlt as RestartAltIcon, Preview as PreviewIcon, Cached as CachedIcon
} from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { isEmptyObject } from "jquery";
import { toWords } from "number-to-words";
const colorRed = red[500];

// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const MyCustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    justifyContent: "start",
    height: "auto",
    position: "relative",
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '0px',
};
export function CustomCenterModal({ children, matches, openner, handleCloseBTN, comptitle, compSize, }) {
  return (
    <Modal sx={{ "& .MuiDialog-paper": { maxWidth: matches ? matches === '' ? matches : '65%' : '100%', height: "100vh", margin: "0" }, borderRadius: '5px!important', border: '1px solid black' }}
      open={openner} onClose={handleCloseBTN} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description"
      BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, }}
    >
      <Box sx={{ ...modalStyle, width: matches ? compSize : '100%' }}>
        {comptitle === '' ? <>
        </> : <>
          <Box sx={{ background: 'rgb(21, 101, 192)', padding: '14px 8px', color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}> {comptitle ? comptitle : ''} </Typography>
            <Box sx={{ flex: '1 1 auto' }} />
            <Box>
              <Fab color="default" aria-label="add" size="small" onClick={handleCloseBTN}>
                <CloseIcon sx={{ fontSize: '1.35rem' }} />
              </Fab>
            </Box>
          </Box>
        </>
        }
        <Box sx={{ p: 2, overflowY: 'scroll', maxHeight: 'calc(100vh - 20vh)', }}>
          {children}
        </Box>
      </Box>
    </Modal >
  )
}


export function CustomDialog({ children, matches, openner, handleCloseBTN, comptitle, compSize, }) {
  return (
    <MyCustomDialog
      sx={{ "& .MuiDialog-paper": { minWidth: typeof (matches) === 'string' ? matches : "65%", height: "100vh", margin: "0", }, }}
      open={openner}
      onClose={handleCloseBTN}
      TransitionComponent={Transition}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Container sx={{ marginBottom: "16px" }}>
        <Box sx={{ marginBottom: "16px", marginTop: "16px" }}>
          <Stack alignItems="end">
            <Box>
              <IconButton edge="start" color="inherit" onClick={handleCloseBTN} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            {comptitle !== "" && (
              <Grid container justifyContent="space-between">
                <Grid item xs={12} lg={5}>
                  <Typography sx={{ color: "#fff", backgroundColor: "#0D47A1", padding: "0px 20px 0px 5px", borderRadius: "0px 16px 16px 0px", }} variant="h6" component="div" width={compSize}>
                    {comptitle}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Stack>
        </Box>
        <Box sx={{ marginBottom: "2rem" }}>
          {children}
        </Box>
      </Container>
    </MyCustomDialog>
  )
}

export function CustomRemark(props) {
  return (
    <TextField InputProps={{ readOnly: true }} sx={{ "& .MuiInputBase-root": { fontSize: typeof (props.fontSizing) === 'string' ? props.fontSizing : '13px' } }} size="small" mt={1} variant="standard" multiline={true} rows={4} maxRows={4}
      value={props.value} />
  )
}


export function CustomAddRemark(props) {
  let data = props.data
  let item = props.item
  let dept = props.dept

  const filtered = data.filter(obj => obj.pr_signs_id === item.id)
  return (
    <>
      {item.id_pr_form && (
        <Box sx={{ height: "100px", overflowY: "scroll" }}>
          <Grid container spacing={1}>
            {filtered.reverse().map((i, indx) => (
              <Grid Grid item xs={12} lg={i.request_stat === 'APPROVED' ? 6 : 12} >
                <FormControl fullWidth key={"tooltip-" + i.id + indx}>
                  <Tooltip title={i.add_remarks ? i.add_remarks : Object.keys(dept.filter(o => o.dept_code === i.dept_code).map(f => f.dept_title)).length ? dept.filter(o => o.dept_code === i.dept_code).map(f => f.dept_title) : null}>
                    <Chip disableRipple disableFocusRipple disableTouchRipple disableElevation label={i.request_stat} icon={<ChevronRightIcon />} color={i.request_stat === "DISAPPROVED" || i.request_stat === "CANCELLED" ? "error" : i.request_stat === "RETURNED FOR REVISION" ? "secondary" : "info"}
                      variant="outlined" size="small" sx={{ fontSize: "12px", padding: "2px 0px", height: "auto", '& .MuiChip-label': { display: 'block', whiteSpace: 'normal', }, }} />
                  </Tooltip>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Box >
      )
      }
    </>
  )
}

export function SelectComp(props) {
  let children = props.children
  let error = props.errorP
  let label = props.labelP
  let id = props.idP
  let name = props.nameP
  let value = props.valueP
  let setterVal = props.setterValP

  return (
    <>
      {label && (
        <FormLabel> {label} </FormLabel>
      )}
      <FormControl fullWidth error={error}>
        <InputLabel id={id}> {name} </InputLabel>
        <Select labelId={id} label={name} variant="outlined" sx={{ "& div": { whiteSpace: "nowrap !important" } }} value={value} onChange={(e) => setterVal(e.target.value)} >
          {children}
        </Select>
      </FormControl>
      <FormHelperText sx={{ color: colorRed }}>
        {error}
      </FormHelperText>
    </>
  )
}

export function TableContainerComp({ children, maxHeight, height }) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: maxHeight ? maxHeight : 530, height: height ? height : "90vh" }}>
        <Table stickyHeader aria-label="sticky table" size='small'>
          {children}
        </Table>
      </TableContainer>
    </Paper>
  )
}

const stylebtn = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // position: "relative",
  height: "auto",
  // marginTop: "4rem",
  // overflowY: "scroll",
  borderRadius: '5px',
  bgcolor: 'background.paper',
  border: '1px solid rgb(0,0,0, 0.7)',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export function CustomCMDialog({ children, matches, handleCloseBtn, openx, compSize, comptitle, hmatches, prf_no }) {
  return (
    <Modal open={openx} onClose={handleCloseBtn}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Container sx={{ ...stylebtn, marginBottom: "16px", width: typeof (matches) === 'string' ? matches : matches ? "100%" : "45%", height: typeof (hmatches) === 'string' ? hmatches : 'auto' }}>
        <Box sx={{ marginBottom: "16px", marginTop: "16px" }}>
          <Stack alignItems="end">
            <Box>
              <IconButton edge="start" color="inherit" onClick={handleCloseBtn} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            {comptitle !== "" && (
              <Grid container justifyContent="space-between">
                <Grid item xs={12} lg={5}>
                  <Typography sx={{ color: "#fff", backgroundColor: "#0D47A1", padding: "0px 20px 0px 5px", borderRadius: "0px 16px 16px 0px", }} variant="h6" component="div" width={compSize}>
                    {comptitle}
                  </Typography>
                </Grid>
                {/* {typeof (prf_no) === 'string' && (
                  <Grid item>
                    <Typography> {prf_no} </Typography>
                  </Grid>
                )} */}
              </Grid>
            )}
          </Stack>
        </Box>
        <Box sx={{ marginBottom: "2rem" }}>
          {children}
        </Box>
      </Container>
    </Modal>
  )
}

export function CustomFullDialog({ id, openG, handleCloseG, children, comptitle, compSize, minWidthP }) {
  return (
    <MyCustomDialog id={id} sx={{ "& .MuiDialog-paper": { minWidth: minWidthP ? minWidthP : "100%", height: "100vh", margin: "0", }, }}
      open={openG} onClose={handleCloseG}
      TransitionComponent={Transition}
    >
      <Container sx={{ marginBottom: "16px" }}>
        <Box sx={{ marginBottom: "16px", marginTop: "16px" }}>
          <Stack alignItems="end">
            <Box>
              <IconButton edge="start" color="inherit" onClick={handleCloseG} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            {comptitle !== "" && (
              <Grid container justifyContent="space-between">
                <Grid item xs={12} lg={5}>
                  <Typography sx={{ color: "#fff", backgroundColor: "#0D47A1", padding: "0px 20px 0px 5px", borderRadius: "0px 16px 16px 0px", }} variant="h6" component="div" width={compSize}>
                    {comptitle}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Stack>
        </Box>
        <Box sx={{ marginBottom: "2rem" }}>
          {children}
        </Box>
      </Container>
    </MyCustomDialog>
  )
}

export function CustomPopover({ idPop, openPop, anchorElPop, handleClosePop, children, anchorV, anchorH, tranV, tranH }) {
  return (
    <>
      <Popover
        id={idPop}
        open={openPop}
        anchorEl={anchorElPop}
        onClose={handleClosePop}
        anchorOrigin={{ vertical: anchorV ? anchorV : 'bottom', horizontal: anchorH ? anchorH : 'left', }}
        transformOrigin={{ vertical: tranV ? tranV : 'top', horizontal: tranH ? tranH : 'center', }}
      >
        <Box sx={{ padding: "1rem" }}>
          {children}
        </Box>
      </Popover>
    </>
  )
}

export const phpPesoIntFormater = new Intl.NumberFormat("en-us", { style: 'currency', currency: 'PHP' })

export const useNumberToWords = (number) => {
  const [words, setWords] = useState('');

  useEffect(() => {
    if (number !== null && number !== undefined) {
      const formattedWords = `${toWords(number)} pesos`;
      setWords(formattedWords);
    }
  }, [number]);

  return words;
};

// export function CustomSwalDelete(props) {
//   let handleDelete = props.handleDeleteP
//   const handleDelete = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       cancelButtonColor: "#d33",
//       confirmButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // deleteIAFData({ id: i })
//         //   .then((r) => {
//         //     console.log(r)
//         //     if (r.data.status === 200) {
//         //       toast.success(r.data.message)
//         //     } else if (r.data.status === 500) {
//         //       toast.error(r.data.message)
//         //     }
//         //   })
//         //   .catch((e) => {
//         //     toast.error(e.message)
//         //   })
//       }
//     });
//   }
//   return (
//     <></>
//   )
// }

export function SearchFilComponent({ handleReloadData, data, selectedRef, setSelectedRef, searchRef, setSearchRef, handleSearchRef }) {
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    if (isEmptyObject(data)) {
      return true
    } else {
      const f = data.map(ss => ss.office_dept)
      const filteredArr = f.filter((item, index) => { return f.indexOf(item) === index; })
      setFilteredData(filteredArr)
      return false
    }
  }, [data])

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Box>
          <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" size="small" onClick={handleReloadData}>
            <CachedIcon />
          </IconButton>
        </Box>
        <Box>
          <FormControl>
            <InputLabel id="demo-simple-select-label" size="small">Select for a department</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Select for a department" size="small"
              sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", width: "240px", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
              value={selectedRef} onChange={(ev) => setSelectedRef(ev.target.value)}
            >
              <MenuItem value=""> <em> None </em> </MenuItem>
              {filteredData.map((it, index) => (
                <MenuItem key={it + index} value={it}>
                  {it}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField size="small" id="search" label="Search" variant="outlined" value={searchRef} onChange={(ev) => setSearchRef(ev.target.value)} />
        <Button variant="contained" onClick={(e) => handleSearchRef(e)}>
          <SearchIcon />
        </Button>
      </Stack>
    </>
  )
}

export function SearchComponent({ handleReload, searchRef, setSearchRef, handleSearchBtn }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box>
        <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" onClick={handleReload} size="small">
          <CachedIcon />
        </IconButton>
      </Box>
      <Box>
        <FormControl fullWidth >
          <TextField size="small" id="search" label="Search" variant="outlined" value={searchRef} onChange={(ev) => { setSearchRef(ev.target.value) }} />
        </FormControl>
      </Box>
      {/* <Box>
        <FormControl fullWidth >

        </FormControl>
      </Box> */}
      <Box>
        <Button variant="contained" onClick={handleSearchBtn} >
          <SearchIcon />
        </Button>
      </Box>
    </Stack>
  )
}

export const getAcronym = (str) => {
  var matches = str.match(/\b(\w)/g);
  var acronym = matches.join('');
  return acronym;
}