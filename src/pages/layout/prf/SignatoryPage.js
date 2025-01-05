import { Fragment, useEffect, useState } from "react"
import { Box, Button, Typography, FormControl, IconButton, Paper, useMediaQuery, Stack, InputLabel, Select, MenuItem, TextField, Tooltip } from "@mui/material"
import { Cached as CachedIcon } from '@mui/icons-material'
import ModuleHeaderText from "../moduleheadertext/ModuleHeaderText"
import { DataGrid } from '@mui/x-data-grid';

import PrfProvider from "./PrfProvider"
import { CustomCenterModal } from "./components/export_components/ExportComp"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import SmallModal from "../custommodal/SmallModal"
import CustomSearchEmployee from "./modal/SearchEmployee"
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { getAllSignatory, updateInsertSignatory } from "./axios/prfSignatory";
import axios from "axios";

function SignatoryPage() {
    return (
        <>
            <PrfProvider>
                <SignatoryComponent />
            </PrfProvider>
        </>
    )
}

export default SignatoryPage




const signatory_slug = [
    { id: 1, category: 'job order', slug: 'prepared_by' },
    { id: 1, category: 'job order', slug: 'recommending_approval' },
    { id: 3, category: 'job order', slug: 'certified_existence_appropriation' },
    { id: 4, category: 'job order', slug: 'approved' },
    { id: 5, category: 'employment notice', slug: 'city_mayor' },
    { id: 6, category: 'employment notice', slug: 'city_administrator' },
    { id: 7, category: 'notice of employment', slug: 'city_mayor' },
    { id: 8, category: 'notice of employment', slug: 'city_administrator' },
    // { id: 8, category: 'notice of employment', slug: 'candidate_signatory'},
    { id: 9, category: 'advice to report', slug: 'city_human_resource' },
    // { id: 10, category: 'advice to report', slug: 'candidate_signatory'},
    { id: 10, category: 'notice of upgrade', slug: 'city_mayor' },
    { id: 11, category: 'notice of upgrade', slug: 'city_administrator' },
    // { id: 12, category: 'notice of upgrade', slug: 'candidate_signatory'},
    { id: 13, category: 'summary of candidates', slug: 'prepared_by' },
    { id: 14, category: 'summary of candidates', slug: 'endorsed_by' },
    { id: 15, category: 'interview assessment form', slug: 'hr_in_charge' },
    { id: 16, category: 'interview assessment form', slug: 'immediate_head' },
    { id: 17, category: 'interview assessment form', slug: 'next_level_head' },
    { id: 18, category: 'interview assessment form', slug: 'city_mayor' },
    { id: 19, category: 'interview assessment form', slug: 'chrmo' },
    { id: 20, category: 'personnel request form', slug: 'requested_by' },
    { id: 21, category: 'personnel request form', slug: 'availability_of_appropriation' },
    { id: 22, category: 'personnel request form', slug: 'reviewed_by' },
    { id: 23, category: 'personnel request form', slug: 'approval' },
    { id: 24, category: 'personnel request form', slug: 'hrmo_in_charge' },
]


function SignatoryComponent() {
    // const signatoryData = [
    //     { id: 1, name: 'John', position: 'Manager', description: 'Manager', dept: 'IT', actions: [{ label: "Insert", onClick: () => handleSubmitClick() }, { label: "Edit", onClick: () => handleUpdateClick() }] },
    //     { id: 2, name: 'Doe', position: 'Manager', description: 'Manager', dept: 'IT', actions: [{ label: "Insert", onClick: () => handleSubmitClick() }, { label: "Edit", onClick: () => handleUpdateClick() }] },
    //     { id: 3, name: 'Doe', position: 'Manager', description: 'Manager', dept: 'IT', actions: [{ label: "Insert", onClick: () => handleSubmitClick() }, { label: "Edit", onClick: () => handleUpdateClick() }] },
    //     { id: 4, name: 'Doe', position: 'Manager', description: 'Manager', dept: 'IT', actions: [{ label: "Insert", onClick: () => handleSubmitClick() }, { label: "Edit", onClick: () => handleUpdateClick() }] },
    // ]

    const signatoryHeader = [
        { id: 1, field: 'id', headerName: '#', width: 100 },
        { id: 2, field: 'fullname', headerName: 'NAME', width: 200 },
        { id: 3, field: 'position_name', headerName: 'POSITION', width: 200 },
        { id: 4, field: 'description', headerName: 'DESCRIPTION', width: 150 },
        { id: 4, field: 'signatory_category', headerName: 'category', width: 100 },
        { id: 4, field: 'signatory_slug', headerName: 'slug', width: 100 },
        { id: 5, field: 'dept_code', headerName: 'DEPARTMENT', width: 100 },
        // { id: 6, field: 'action', headerName: 'ACTIONS', width: 100 },
    ]

    const [open, setOpen] = useState(null)
    const [rowData, setRowData] = useState([])
    const [selectData, setSelectData] = useState({})
    const [selectSlug, setSelectSlug] = useState('')
    const [selectCategory, setSelectCategory] = useState('')

    // const [noDataFound, setNoDataFound] = useState(true)
    // const [onPageChange, setOnPageChange] = useState(1)
    // const [rowsPerPage, setRowsPerPage] = useState(5)

    const matches = useMediaQuery('(min-width: 565px)');
    const [empInformation, setEmpInformation] = useState({})
    // let uniqueSlug = [];

    useEffect(() => {
        fetchData();
    }, [])

    let controller = new AbortController();

    const handleReloadData = () => {
        fetchData();
    }

    const fetchData = async () => {
        try {
            getAllSignatory().then((res) => {
                if (res.data.status === 500) { toast.error(res.data.message) }
                if (res.data.status === 200) { toast.success(res.data.message) }
                console.log(res)

                // { id: 1, field: 'id', headerName: '#', width: 100 },
                // { id: 2, field: 'name', headerName: 'NAME', width: 100 },
                // { id: 3, field: 'position_name', headerName: 'POSITION', width: 100 },
                // { id: 4, field: 'description', headerName: 'DESCRIPTION', width: 100 },
                // { id: 4, field: 'signatory_category', headerName: 'category', width: 100 },
                // { id: 4, field: 'signatory_slug', headerName: 'slug', width: 100 },
                // { id: 5, field: 'dept_code', headerName: 'DEPARTMENT', width: 100 },

                setRowData(res.data)
                // let t_data = []
                // res.data.map((element, ex) => {

                // })
            }).catch((err) => {
                toast.error(err.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchSelect = (data) => {
        console.log(data)
        setSelectData(data)
        let mname = data.mname ? data.mname[0] : '';
        let fname = data.fname ? data.fname : '';
        let lname = data.lname ? data.lname : '';

        let fullname = lname + ', ' + fname + ' ' + mname

        setEmpInformation({ name: fullname, position: data.position_name, dept_name: data.dept_title })
    }

    const handleSaveClick = (ev) => {
        ev.preventDefault();
        console.log(selectSlug, selectCategory, selectData)

        let t_data = {
            slug: selectSlug,
            category: selectCategory,
            data: empInformation,
        }

        Swal.fire({
            title: 'Are you sure you want to save?',
            icon: "info",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Submit",
        }).then((result) => {
            if (result.isConfirmed) {
                updateInsertSignatory(t_data).then((res) => {
                    if (res.data.status === 500) { toast.error(res.data.message) }
                    if (res.data.status === 200) { toast.success(res.data.message) }
                }).catch((err) => {
                    toast.error(err.message)
                })
            }
        })
    }

    // const handleChange = (ev) => {
    //     ev.preventDefault();
    //     const { value } = ev.target
    //     setSelectSlug(value)
    // }

    return (
        <Box sx={{ margin: "0 10px 10px 10px" }}>
            <Fragment>
                <CustomCenterModal compSize={'50%'} comptitle={''} handleCloseBTN={() => setOpen(null)} matches={matches} openner={open === 'add_signatory' || open === 'update_insert'}>
                    {open === 'add_signatory' ? <>
                        <Grid2 container>
                            <Grid2 item xs={12}>
                                <Stack direction="row" spacing={1}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}> Update or Insert Signatory </Typography>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button variant="contained" size="small" color="secondary" onClick={() => setOpen('update_insert')}> Search </Button>
                                </Stack>
                            </Grid2>
                            <br />
                            <Grid2 item xs={12}>
                                <FormControl fullWidth sx={{ gap: '1' }}>
                                    <Typography variant="subitle1"> Name: {empInformation.name || ''} </Typography>
                                    <Typography variant="subitle2"> Position: {empInformation.position || ''} </Typography>
                                    <Typography variant="subitle2"> Department: {empInformation.dept_name || ''} </Typography>
                                </FormControl>
                                {/* <Tooltip title="Setting as all">
                                    <Button variant="contained" color="info" size="small" onClick={() => handleDefaultSetter()}> department</Button>
                                </Tooltip> */}
                                <hr />
                                <Stack spacing={1}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label"> Slug </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectSlug}
                                            label="Slug"
                                            onChange={(ev) => setSelectSlug(ev.target.value)}
                                        >
                                            <MenuItem value='prepared_by'> prepared_by </MenuItem>
                                            <MenuItem value='recommending_approval'> recommending_approval </MenuItem>
                                            <MenuItem value='certified_existence_appropriation'> certified_existence_appropriation </MenuItem>
                                            <MenuItem value='approved'> approved </MenuItem>
                                            <MenuItem value='city_mayor'> city_mayor </MenuItem>
                                            <MenuItem value='city_administrator'> city_administrator </MenuItem>
                                            <MenuItem value='city_human_resource'> city_human_resource </MenuItem>
                                            <MenuItem value='endorsed_by'> endorsed_by </MenuItem>
                                            <MenuItem value='hr_in_charge'> hr_in_charge </MenuItem>
                                            <MenuItem value='immediate_head'> immediate_head </MenuItem>
                                            <MenuItem value='next_level_head'> next_level_head </MenuItem>
                                            <MenuItem value='chrmo'> chrmo </MenuItem>
                                            <MenuItem value='requested_by'> requested_by </MenuItem>
                                            <MenuItem value='availability_of_appropriation'> availability_of_appropriation </MenuItem>
                                            <MenuItem value='reviewed_by'> reviewed_by </MenuItem>
                                            <MenuItem value='approval'> approval </MenuItem>
                                            <MenuItem value='hrmo_in_charge'> hrmo_in_charge </MenuItem>
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-category-label"> Category </InputLabel>
                                        <Select
                                            labelId="demo-simple-category-label"
                                            id="demo-simple-category"
                                            value={selectCategory}
                                            label="Category"
                                            onChange={(ev) => setSelectCategory(ev.target.value)}
                                        >
                                            <MenuItem value={'job order'}> job order </MenuItem>
                                            <MenuItem value={'employment notice'}> employment notice </MenuItem>
                                            <MenuItem value={'notice of employment'}> notice of employment </MenuItem>
                                            <MenuItem value={'notice of upgrade'}> notice of upgrade </MenuItem>
                                            <MenuItem value={'summary of candidates'}> summary of candidates </MenuItem>
                                            <MenuItem value={'interview assessment form'}> interview assessment form </MenuItem>
                                            <MenuItem value={'personnel request form'}> personnel request form </MenuItem>
                                            <MenuItem value={'advice to report'}> advice to report </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <hr />
                            </Grid2>
                            <Grid2>
                                <Button variant="contained" color="error" onClick={() => setOpen(null)} > back </Button>
                                &nbsp;
                                <Button variant="contained" color="success" onClick={(ev) => handleSaveClick(ev)} > save </Button>
                            </Grid2>
                        </Grid2>
                    </> : <>
                    </>}
                </CustomCenterModal>
                <SmallModal close={() => setOpen('add_signatory')} open={open === 'update_insert'} title={''} >
                    <CustomSearchEmployee handleSelect={handleSearchSelect} />
                </SmallModal>
            </Fragment>

            <ModuleHeaderText title="PERSONNEL REQUEST FORM (PRF) - Signatory" />
            <Box sx={{ margin: "10px 0px", display: 'flex', justifyContent: 'end' }}>
                <IconButton className="custom-iconbutton" color="primary" aria-label="reload table data" onClick={handleReloadData} size="small">
                    <CachedIcon />
                </IconButton>
                &ensp;
                <Button variant="contained" color="primary" onClick={() => setOpen('add_signatory')}>
                    Add Signatory
                </Button>
            </Box>
            <Box sx={{ margin: "10px 0px" }}>
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rowData}
                        columns={signatoryHeader}
                        initialState={{ pagination: { page: 0, pageSize: 5 } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>
            </Box>
        </Box>
    )
}