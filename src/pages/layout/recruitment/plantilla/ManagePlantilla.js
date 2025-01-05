import React, { useState, useEffect } from 'react'
import { orange, blue, green } from '@mui/material/colors'
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination';

import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit'
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add'
import BarChartIcon from '@mui/icons-material/BarChart';
import SearchIcon from '@mui/icons-material/Search';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';

import CustomDialog from '../components/CustomDialog';
import AddPlantilla from './AddPlantilla';
import PlantillaPdf from './PlantillaPdf';
import UpdatePlantilla from './UpdatePlantilla';
import PlantillaPreferences from './plantillaPreferences/PlantillaPreferences';
import { read, utils, writeFileXLSX } from 'xlsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ManagePlantilla = () => {
    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.down('sm'))
    const typographyTheme = createTheme({
        typography: {
            body2: {
                fontFamily: ['Roboto', 'Sans-serif'].join(','),
                fontSize: '11px',
            }
        }
    })
    const [plantilla, setPlantilla] = useState([])
    const [loader, setLoader] = useState(true)
    const [plantillaId, setPlantillaId] = useState('')
    const [plantillaInfo, setPlantillaInfo] = useState('')
    const [plantillaSearch, setPlantillaSearch] = useState('')
    const [searchDept, setSearchDept] = useState('')
    const [searchItemNo, setSearchItemNo] = useState('')

    // dialog for adding new plantilla
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    // dialog for viewing / update pdf
    const [openPdf, setOpenPdf] = useState(false)
    const handleOpenPdf = (param) => {
        setOpenPdf(true)
        setPlantillaId(param)
    }
    const handleClosePdf = () => setOpenPdf(false)

    // dialog for preferences
    const [openPreferences, setOpenPreferences] = useState(false)
    const [preferencesDialogData, setPreferencesDialogData] = useState('')
    const handleOpenPreferences = (item) => {
        setPreferencesDialogData(item)
        setOpenPreferences(true)
    }
    const handleClosePreferences = () => setOpenPreferences(false)

    // dialog for updating plantilla information
    const [openUpdate, setOpenUpdate] = useState(false)
    const handleOpenUpdate = (param) => {
        setOpenUpdate(true)
        setPlantillaInfo(param)
    }
    const handleCloseUpdate = () => setOpenUpdate(false)


    // for pagination
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchPlantilla = async (controller, page, setTotal) => {
        let plantillaRequest = await axios.get(`/api/recruitment/plantilla/getPlantilla${page ? `?page=${page}` : ''}${plantillaSearch ? `&&search=${plantillaSearch}` : ''}${searchDept ? `&&dept=${searchDept}` : ''}${searchItemNo ? `&&item_no=${searchItemNo}` : ''}`, {}, { signal: controller.signal })
        setLoader(false)
        setPlantilla(plantillaRequest.data.plantilla.data)
        setTotal(plantillaRequest.data.plantilla.total)
    }

    const handlePaginateChange = (e, value) => {
        setLoader(true)
        let controller = new AbortController()
        setPage(value)
        fetchPlantilla(controller, value, setTotal)
    }

    const handleSearchPlantilla = async () => {
        let controller = new AbortController()
        setLoader(true)
        fetchPlantilla(controller, 1, setTotal)
    }

    const handleExport = async () => {
        Swal.fire({
            text: 'Preparing report, please wait . . .',
            icon: 'info'
        })
        Swal.showLoading()
        try {
            let plantillaRequest = await axios.get(`/api/recruitment/plantilla/getPlantillaReport`)
            Swal.close()
            let exportedData = plantillaRequest.data.plantilla.map((item) => ({
                'Department': item.dept_title,
                'Division': item.division_id,
                'Section': item.section_id,
                'Position': item.position_name,
                'Old Item': item.old_item_no,
                'New Item': item.new_item_no,
                'Salary Grade': item.salary_grade,
                'Employment status code': item.employment_status_code,
                'Status': item?.employee_id === 0 || item?.employee_id === null || item?.employee_id === undefined ? 'Vacant' : 'Filled',
                'Remarks': item?.remarks,
            }))
            let ws2 = utils.json_to_sheet(exportedData);
            let wb = utils.book_new();
            utils.book_append_sheet(wb, ws2, "Sheet 2");
            writeFileXLSX(wb, "SheetJSReactAoO.xlsx");
        }
        catch (err) {
            toast.error(err)
        }
    }
    useEffect(() => {
        let controller = new AbortController()
        fetchPlantilla(controller, page, setTotal)
        return () => controller.abort()
    }, [])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <CssBaseline />
            <CustomDialog open={open} handleClose={handleClose} fullScreen={false} >
                <AddPlantilla plantilla={plantilla} setPlantilla={setPlantilla} handleClose={handleClose} />
            </CustomDialog>
            <CustomDialog open={openPdf} handleClose={handleClosePdf} fullScreen={true} >
                <PlantillaPdf plantillaId={plantillaId} />
            </CustomDialog>
            <CustomDialog open={openUpdate} handleClose={handleCloseUpdate} fullScreen={false} >
                <UpdatePlantilla plantillaInfo={plantillaInfo} plantilla={plantilla} setPlantilla={setPlantilla} handleClose={handleCloseUpdate} />
            </CustomDialog>
            <CustomDialog open={openPreferences} handleClose={handleClosePreferences} fullScreen={true} >
                <PlantillaPreferences data={preferencesDialogData} />
            </CustomDialog>
            <Box sx={{ px: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                        <Button variant="contained" size={matches ? 'small' : 'medium'} color="primary" startIcon={<AddIcon />} sx={{ borderRadius: '2rem' }} onClick={handleOpen}>
                            {matches ? 'Plantilla' : 'Plantilla'}
                        </Button>
                    </Box>
                    <Box display='flex' alignItems='center'>
                        <TextField size='small' label="search position" value={plantillaSearch} onChange={(e) => setPlantillaSearch(e.target.value)} sx={{ mr: 2 }} />
                        <TextField size='small' label="Department" value={searchDept} onChange={(e) => setSearchDept(e.target.value)} sx={{ mr: 2 }} />
                        <TextField size='small' label="New item number" value={searchItemNo} onChange={(e) => setSearchItemNo(e.target.value)} sx={{ mr: 2 }} />
                        <Tooltip title='search'>
                            <SearchIcon sx={{ cursor: 'pointer', mr: 1 }} color='primary' onClick={handleSearchPlantilla} />
                        </Tooltip>
                        |
                        <Tooltip title='Generate excel file'>
                            <ImportExportIcon color="success" sx={{ ml: 1, cursor: 'pointer' }} onClick={handleExport} />
                        </Tooltip>
                    </Box>
                </Box>
                <Box display='flex' justifyContent='flex-end'>

                </Box>
                <ThemeProvider theme={typographyTheme} >
                    <TableContainer component={Paper}>
                        <Table aria-label="plantilla table" size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Department</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Division</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Section</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Position</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Old Item</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">New Item</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Salary Grade</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Step</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Employment Status Code</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Status</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Remarks</TableCell>
                                    <TableCell className='cgb-color-table' sx={{ color: '#fff' }} align="left">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loader ? (
                                    <>
                                        {Array.from(Array(10)).map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton variant="text" sx={{ my: 1 }} /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                                <TableCell><Skeleton variant="text" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {plantilla && plantilla.map((item) => (
                                            <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#e8eaf6' } }}>
                                                <TableCell>{item?.dept_title}</TableCell>
                                                <TableCell>{item?.division_id}</TableCell>
                                                <TableCell>{item?.section_id}</TableCell>
                                                <TableCell>{item?.position_name}</TableCell>
                                                <TableCell>{item?.old_item_no}</TableCell>
                                                <TableCell>{item?.new_item_no}</TableCell>
                                                <TableCell>{item?.sg}</TableCell>
                                                <TableCell>{item?.step}</TableCell>
                                                <TableCell>{item?.employment_status_code === 'RE' ? 'PERMANENT' : ''}</TableCell>
                                                <TableCell>{item?.employee_id === 0 || item?.employee_id === null || item?.employee_id === undefined ? 'Vacant' : 'Filled'}</TableCell>
                                                <TableCell>{item?.remarks}</TableCell>
                                                <TableCell sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                    <Tooltip title="Update plantilla information" placement='top'>
                                                        <IconButton aria-label="" size='small' sx={{ color: orange[500], '&:hover': { color: orange[800] }, border: `2px solid ${orange[500]}` }} onClick={e => handleOpenUpdate(item)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="view Position Description Form" placement='top'>
                                                        <IconButton aria-label="" size='small' sx={{ color: blue[500], '&:hover': { color: blue[800] }, border: `2px solid ${blue[500]}` }} onClick={e => handleOpenPdf(item.id)}>
                                                            <DescriptionIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Plantilla preferences" placement='top'>
                                                        <IconButton aria-label="" size='small' sx={{ color: green[500], '&:hover': { color: green[800] }, border: `2px solid ${green[500]}` }} onClick={e => handleOpenPreferences(item)}>
                                                            <AutoAwesomeMosaicIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ThemeProvider>
                <Box sx={{ mt: 1 }}>
                    <Pagination count={Math.ceil(total / 10)} page={page} color='primary' onChange={handlePaginateChange} />
                </Box>
            </Box>
        </Box>
    );
};

export default ManagePlantilla;