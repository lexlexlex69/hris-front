import { Autocomplete, Box, Button, Card, CardActionArea, CardContent, Checkbox, Chip, createFilterOptions, FormControl, FormHelperText, FormLabel, Grid, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Popper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { Add as AddIcon, } from "@mui/icons-material";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { PrfStateContext } from "../../PrfProvider";
import { red } from "@mui/material/colors";
import { TableContainerComp } from "../../components/export_components/ExportComp";
import { isEmptyObject } from "jquery";
import { CustomAutocomplete, SearchCreateAutocomplete, SelectFieldRD, SimpleAutocomplete, SimpleAutocompleteChip, TextAreaRD, TextFieldRD } from "../component/RequestDetailsComponent";
const color = red[500];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const filter = createFilterOptions();

function RequestForm() {
  const { requestDataForm, setRequestDataForm, empStat, natureReq, errors, deptOrg, colDataQS, posTitle, setPosTitle, qsState, postsPerPage, offSet, searchValue, setSearchValue, deptData, } = useContext(PrfStateContext)

  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [secFilter, setSecFilter] = useState([])
  const [uniFilter, setUniFilter] = useState([])

  let educQS = []
  let eligQS = []
  let expeQS = []
  let trainQS = []
  let techQS = []
  const [educQSValue, setEducQSValue] = useState([...educQS])
  const [eligQSValue, setEligQSValue] = useState([...eligQS])
  const [expeQSValue, setExpeQSValue] = useState([...expeQS])
  const [trainQSValue, setTrainQSValue] = useState([...trainQS])
  const [techQSValue, setTechQSValue] = useState([...techQS])
  let jobSummaryArr = []
  const [jobSummValue, setJobSummValue] = useState([...jobSummaryArr])

  useEffect(() => {
    console.log(value)
    if (value === null || value === undefined) {
      setEducQSValue([]); setEligQSValue([]); setExpeQSValue([]); setTrainQSValue([]); setTechQSValue([]);
      return setRequestDataForm(draft => { draft.position = ""; })
    } else {
      if (typeof (value['position_title']) === 'string') { setRequestDataForm(draft => { draft.position = value['id']; }) }
    }
  }, [value])

  useEffect(() => {
    if (Object.keys(educQSValue).length > 0) { setRequestDataForm(draft => { draft.qs_educ_id = educQSValue; }) }
    else { setRequestDataForm(draft => { draft.qs_educ_id = []; }) }
    if (Object.keys(eligQSValue).length > 0) { setRequestDataForm(draft => { draft.qs_elig_id = eligQSValue; }) }
    else { setRequestDataForm(draft => { draft.qs_elig_id = []; }) }
    if (Object.keys(expeQSValue).length > 0) { setRequestDataForm(draft => { draft.qs_expe_id = expeQSValue; }) }
    else { setRequestDataForm(draft => { draft.qs_expe_id = []; }) }
    if (Object.keys(techQSValue).length > 0) { setRequestDataForm(draft => { draft.qs_tech_skll_id = techQSValue; }) }
    else { setRequestDataForm(draft => { draft.qs_tech_skll_id = []; }) }
    if (Object.keys(trainQSValue).length > 0) { setRequestDataForm(draft => { draft.qs_train_id = trainQSValue; }) }
    else { setRequestDataForm(draft => { draft.qs_train_id = []; }) }
    if (Object.keys(jobSummValue).length > 0) { setRequestDataForm(draft => { draft.job_summary = jobSummValue; }) }
    else { setRequestDataForm(draft => { draft.job_summary = []; }) }
  }, [educQSValue, eligQSValue, expeQSValue, techQSValue, trainQSValue, jobSummValue])

  useEffect(() => {
    if (requestDataForm.position !== null || requestDataForm.position !== undefined || requestDataForm.position !== "") {
      if (!isEmptyObject(value)) {
        educQS = posTitle.categories.education.filter(o => o.category === value['education'])
        eligQS = posTitle.categories.eligibility.filter(o => o.category === value['eligibility'])
        expeQS = posTitle.categories.experience.filter(o => o.category === value['experience'])
        techQS = posTitle.categories.technical_skills.filter(o => o.category === value['technical_skills'])
        trainQS = posTitle.categories.training.filter(o => o.category === value['training'])
        setEducQSValue(posTitle.categories.education.filter(o => o.category === value['education']));
        setEligQSValue(posTitle.categories.eligibility.filter(o => o.category === value['eligibility']));
        setExpeQSValue(posTitle.categories.experience.filter(o => o.category === value['experience']));
        setTrainQSValue(posTitle.categories.training.filter(o => o.category === value['training']));
        setTechQSValue(posTitle.categories.technical_skills.filter(o => o.category === value['technical_skills']));

        jobSummaryArr = posTitle.categories.job_summary.filter(o => o.job_summ === value['job_summary'])
        setJobSummValue(posTitle.categories.job_summary.filter(o => o.job_summ === value['job_summary']))
      }
    }
  }, [requestDataForm.position])

  useEffect(() => {
    if (requestDataForm.div_id === null || requestDataForm.div_id === "" || requestDataForm.div_id === undefined) {
      setSecFilter([])
    }
    else {
      setRequestDataForm(draft => { draft.sec_id = null; })
      const f = deptOrg.sections.filter((d) => d.fr_key === requestDataForm.div_id)
      setSecFilter(f)
    }
  }, [requestDataForm.div_id])

  useEffect(() => {
    if (requestDataForm.sec_id === null || requestDataForm.sec_id === "" || requestDataForm.sec_id === undefined) {
      setUniFilter([])
    }
    else {
      setRequestDataForm(draft => { draft.unit_id = null; })
      const f = deptOrg.units.filter((d) => d.fr_key === requestDataForm.sec_id)
      setUniFilter(f)
    }
  }, [requestDataForm.sec_id])

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={3}>
            <TextFieldRD readOnly={true} shrinkInput={true} name={'prf_no'} label={'PRF Number'} placeholder={'(For CHRMD use only)'} value={requestDataForm.prf_no} onchange={(ev) => setRequestDataForm(draft => { draft.prf_no = ev.target.value })} disabled sx={{ backgroundColor: "rgb(240,240,240)" }} />
          </Grid>
          <Grid item xs={12} lg={9}>
            <TextFieldRD readOnly={true} shrinkInput={true} name={'office_dept'} label={'Office/Department'} placeholder={''} value={requestDataForm.office_dept} onchange={(ev) => setRequestDataForm(draft => { draft.office_dept = ev.target.value })} disabled sx={{ backgroundColor: "rgb(240,240,240)" }} />
          </Grid>
          <Grid item xs={12} lg={12}>
            <SelectFieldRD name={"div_id"} id={"div-id"} label={'Division'} error={errors.errDiv} value={requestDataForm.div_id} onchange={(ev) => setRequestDataForm({ ...requestDataForm, div_id: ev.target.value })} color={color} >
              {deptOrg.divisions.map((item, index) => (
                <MenuItem key={"div-" + item.id} value={item.id}>
                  {item.div_name}
                </MenuItem>
              ))}
            </SelectFieldRD>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SelectFieldRD name={"sect_id"} id={"sect-id"} label={'Section'} error={errors.errSect} disabled={typeof (requestDataForm.div_id) === 'number' ? false : true}
              value={requestDataForm.sec_id} onchange={(ev) => setRequestDataForm({ ...requestDataForm, sec_id: ev.target.value })} color={color} >
              <MenuItem value=""> <em>None</em> </MenuItem>
              {secFilter.map((item, index) => (
                <MenuItem key={"sect-" + item.id} value={item.id}>
                  {item.sec_name}
                </MenuItem>
              ))}
            </SelectFieldRD>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SelectFieldRD name={"unit_id"} id={"unit-id"} label={'Unit'} error={errors.errUnit} disabled={typeof (requestDataForm.sec_id) === 'number' ? false : true}
              value={requestDataForm.unit_id} onchange={(ev) => setRequestDataForm({ ...requestDataForm, unit_id: ev.target.value })} color={color} >
              <MenuItem value=""> <em>None</em> </MenuItem>
              {uniFilter.map((item, index) => (
                <MenuItem key={"unit-" + item.id} value={item.id}>
                  {item.unit_name}
                </MenuItem>
              ))}
            </SelectFieldRD>
          </Grid>
          <Grid item xs={12} lg={3}>
            <TextFieldRD readOnly={false} shrinkInput={true} name={'head_cnt'} label={'Head Count(HC)'} placeholder={''} type={'number'} error={errors.errHead}
              value={requestDataForm.head_cnt} onchange={(ev) => setRequestDataForm({ ...requestDataForm, head_cnt: ev.target.value })} required={true} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <TextFieldRD readOnly={false} shrinkInput={true} name={'sal_pay'} label={'Pay/Salary Grade'} placeholder={''} type={'number'} error={errors.errPay}
              value={requestDataForm.pay_sal} onchange={(ev) => setRequestDataForm({ ...requestDataForm, pay_sal: ev.target.value })} required={true} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <TextFieldRD readOnly={true} shrinkInput={true} name={'date_requested'} label={'Date Requested'} placeholder={''} type={'text'}
              // InputProps={{ inputProps: { min: } }}
              value={requestDataForm.date_requested} onchange={(ev) => setRequestDataForm({ ...requestDataForm, date_requested: ev.target.value })} required={true} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <TextFieldRD readOnly={false} shrinkInput={true} name={'date_needed'} label={'Date Needed'} placeholder={''} type={'date'} error={errors.errDateNd}
              value={requestDataForm.date_needed} onchange={(ev) => setRequestDataForm({ ...requestDataForm, date_needed: ev.target.value })} required={true} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ marginTop: "16px", marginBottom: "16px" }}>
          <Grid item xs={12} lg={6}>
            <SelectFieldRD name={"emp_stat_id"} id={"emp_stat-id"} label={'Employment Status'} error={errors.errEmpStat}
              value={requestDataForm.emp_stat} onchange={(ev) => setRequestDataForm({ ...requestDataForm, emp_stat: ev.target.value })} color={color} >
              {empStat.map((item, index) => (
                <MenuItem key={"emp-" + item.id} value={item.emp_stat}>
                  {item.emp_stat}
                </MenuItem>
              ))}
            </SelectFieldRD>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SimpleAutocomplete error={errors.errPosTitle} id={'prf-position'} oninputchange={(event, newInputValue) => { setInputValue(newInputValue); }}
              onchange={(event, newValue) => { setValue(newValue); }} getoptionlabel={(opt) => opt.position_title} inputvalue={inputValue} value={value}
              option={posTitle.position_builder} renderinput={(params) => <TextField {...params} label="Position/Functional Title" />}
              renderoption={(props, option) => {
                return (
                  <li {...props} key={option.id + "-" + option.position_name}>
                    {option.position_title}
                  </li>
                )
              }} color={color} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <SimpleAutocompleteChip options={natureReq} getoptionlabel={(data) => data.category_name} getoptionkey={(data) => data.id}
              onchange={(ev, newValue) => setRequestDataForm(draft => { draft.nature_req = newValue; })} value={requestDataForm.nature_req}
              renderinput={(params) => <TextField {...params} label="Nature of Request" />} error={errors.errNat} />
          </Grid>
          <Grid item xs={12}>
            {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>If new applicant does it have available laptop or computer to use?</Typography> */}
            {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>Others</Typography> */}
            {/* <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: "400" }}>How many devices needed?</Typography> */}
          </Grid>
          <Grid item xs={12}>
            <TextAreaRD label={'Justification/Purpose(Please attach supporting documents if necessary)'} value={requestDataForm.justification || ''}
              onchange={(ev) => setRequestDataForm({ ...requestDataForm, justification: ev.target.value })} rows={3} maxRows={3} />
          </Grid>

          <Grid item xs={12}>
            <Stack gap={1}>
              <FormLabel>Job summary</FormLabel>
              {/* <Box sx={{ flex: '1 1 auto' }} /> */}
              <SearchCreateAutocomplete
                id='job_summ'
                label='Job Summary'
                value={jobSummValue}
                setValue={setJobSummValue}
                option={posTitle.categories.job_summary}
                disabled={requestDataForm.position === null || requestDataForm.position === undefined || requestDataForm.position === ""}
                name={'job_summ'}
              // error={errors.errQSTech}
              // helperText={errors.errQSTech}
              />
            </Stack>

            <Stack gap={1}>
              <FormLabel>Education</FormLabel>
              <CustomAutocomplete
                id='qs_educ_id'
                label='Education'
                options={posTitle.categories.education}
                value={educQSValue}
                onChange={(ev, newValue) => { setEducQSValue([...educQS, ...newValue.filter((option) => educQS.indexOf(option) === -1),]); }}
                error={errors.errQSEd}
                disabled={requestDataForm.position === null || requestDataForm.position === undefined || requestDataForm.position === ""}
                helperText={errors.errQSEd}
              />
            </Stack>

            <Stack gap={1}>
              <FormLabel> Eligibility </FormLabel>
              <CustomAutocomplete
                id='qs_elig_id'
                label='Eligibility'
                options={posTitle.categories.eligibility}
                value={eligQSValue}
                onChange={(ev, newValue) => { setEligQSValue([...eligQS, ...newValue.filter((option) => eligQS.indexOf(option) === -1),]); }}
                disabled={requestDataForm.position === null || requestDataForm.position === undefined || requestDataForm.position === ""}
                error={errors.errQSEl}
                helperText={errors.errQSEl}
              />
            </Stack>

            <Stack gap={1}>
              <FormLabel> Experience </FormLabel>
              <CustomAutocomplete
                id='qs_expe_id'
                label='Experience'
                options={posTitle.categories.experience}
                value={expeQSValue}
                onChange={(ev, newValue) => { setExpeQSValue([...expeQS, ...newValue.filter((option) => expeQS.indexOf(option) === -1),]); }}
                error={errors.errQSEx}
                disabled={requestDataForm.position === null || requestDataForm.position === undefined || requestDataForm.position === ""}
                helperText={errors.errQSEx}
              />
            </Stack>

            <Stack gap={1}>
              <FormLabel> Technical skills </FormLabel>
              <SearchCreateAutocomplete
                id='qs_tech_skll_id'
                label='Technical Skills'
                value={techQSValue}
                setValue={setTechQSValue}
                option={posTitle.categories.technical_skills}
                disabled={requestDataForm.position === null || requestDataForm.position === undefined || requestDataForm.position === ""}
                name={'category'}
                error={errors.errQSTech}
                helperText={errors.errQSTech}
              />
            </Stack>

            <Stack gap={1}>
              <FormLabel> Training </FormLabel>
              <CustomAutocomplete
                id='qs_train_id'
                label='Training'
                options={posTitle.categories.training}
                value={trainQSValue}
                onChange={(ev, newValue) => { setTrainQSValue([...trainQS, ...newValue,]); }}
                error={errors.errQSTrng}
                disabled={requestDataForm.position === null || requestDataForm.position === undefined || requestDataForm.position === ""}
                helperText={errors.errQSTrng}
              />
            </Stack>
          </Grid>

          {/* <Grid item xs={12}>
            <Box>
              <FormLabel> Job summary </FormLabel>
              <TableJobSumm data={jobSummValue}>
                <TableRow sx={{ display: 'block' }}>
                  <TableCell sx={{ display: 'block', paddingTop: "16px", paddingBottom: "16px" }}>
                  </TableCell>
                </TableRow>
              </TableJobSumm>
            </Box>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Box>
              <FormLabel> Education </FormLabel>
              <TableQS colDataQS={colDataQS} data={educQSValue}>
                <TableRow sx={{ display: 'block' }}>
                  <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                  </TableCell>
                </TableRow>
              </TableQS>
            </Box>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Box>
              <FormLabel> Eligibility </FormLabel>
              <TableQS colDataQS={colDataQS} data={eligQSValue}>
                <TableRow sx={{ display: 'block' }}>
                  <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                  </TableCell>
                </TableRow>
              </TableQS>
            </Box>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Box>
              <FormLabel> Experience </FormLabel>
              <TableQS colDataQS={colDataQS} data={expeQSValue}>
                <TableRow sx={{ display: 'block' }}>
                  <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                  </TableCell>
                </TableRow>
              </TableQS>
            </Box>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Box>
              <FormLabel> Technical skills </FormLabel>
              <TableQS colDataQS={colDataQS} data={techQSValue}>
                <TableRow sx={{ display: 'block' }}>
                  <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                  </TableCell>
                </TableRow>
              </TableQS>
            </Box>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Box>
              <FormLabel> Training </FormLabel>
              <TableQS colDataQS={colDataQS} data={trainQSValue}>
                <TableRow sx={{ display: 'block' }}>
                  <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
                  </TableCell>
                </TableRow>
              </TableQS>
            </Box>
          </Grid> */}

          <Grid item xs={12} lg={12}>
            <TextAreaRD label={'Other Requirements'} value={requestDataForm.qs_other_id || ''}
              onchange={(ev) => setRequestDataForm(draft => { draft.qs_other_id = ev.target.value; })} rows={3} maxRows={3} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export function TableJobSumm({ data, children }) {
  return (
    <Card>
      <CardContent>
        <TableContainer sx={{ overflowX: 'auto!important', height: "300px", }} size="small">
          <Table sx={{ display: 'block' }}>
            <TableHead sx={{ display: 'block' }}>
              <TableRow>
                <TableCell sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important", width: "100vw" }}>
                  NAME/TITLE
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ display: 'block' }}>
              {data.map((o, indx) => (
                <TableRow key={o.job_summ + indx} sx={{ display: 'block' }}>
                  <TableCell sx={{ display: 'block' }}> {o.job_summ} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      {/* <TableContainerComp> */}
      {/* </TableContainerComp> */}
    </Card>
  )
}

export function TableQS({ colDataQS, data, label, name, setRequestDataForm, requestDataForm, children }) {
  return (
    <>
      {/* <Paper> */}
      <Card>
        <CardContent>
          <TableContainer sx={{ overflowX: 'auto!important', height: "300px" }}>
            <Table sx={{ display: 'block' }}>
              <TableHead>
                <TableRow>
                  {colDataQS.map((column, index) => (
                    <TableCell key={column.id + index} size="small" sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", backgroundColor: "#1565C0 !important", width: "100vw" }}>
                      {column.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ display: 'block' }}>
                {Object.keys(data).length > 0 && (
                  <>
                    {data.map((item, index) => (
                      <TableRow key={name + index} sx={{ display: 'block' }}>
                        <TableCell sx={{ display: 'block' }}> {item.category} </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      {/* <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
      {/* </Paper > */}
    </>
  )
}

export default RequestForm


const AutocompleteField = ({
  id,
  label,
  value,
  setValue,
  options,
  error,
  helperText,
  setCategoryValue,
  colDataQS
}) => {
  const handleChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setValue([...value, { category: newValue }]);
    } else if (newValue && newValue.inputValue) {
      setValue([...value, { category: newValue.inputValue }]);
    } else {
      setValue([...value, ...newValue]);
    }
  };

  return (
    <FormControl fullWidth error={error}>
      <FormLabel>{label}</FormLabel>
      <TableRow sx={{ display: 'block' }}>
        <TableCell colSpan={Object.keys(colDataQS).length} sx={{ display: 'block' }}>
          <FormControl fullWidth>
            <Autocomplete
              disablePortal
              multiple
              size="small"
              id={id}
              freeSolo
              disableClearable
              options={options}
              value={value}
              onChange={handleChange}
              filterOptions={(options, params) => {
                const filtered = createFilterOptions()(options, params);
                const { inputValue } = params;
                const isExisting = options.some(option => inputValue === option.category);
                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    category: `Add "${inputValue}"`,
                  });
                }
                return filtered;
              }}
              getOptionLabel={(option) => option.inputValue || option.category || option}
              renderOption={(props, option) => (
                <li {...props} key={option.inputValue || option.category || option}>
                  {option.category || option}
                </li>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip key={index} label={option.category} {...getTagProps({ index })} />
                ))
              }
              slotProps={{ popper: { sx: { zIndex: 2500 } } }}
              renderInput={(params) => (
                <TextField {...params} label={`Select additional ${label.toLowerCase()}`} />
              )}
            />
          </FormControl>
        </TableCell>
      </TableRow>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};
