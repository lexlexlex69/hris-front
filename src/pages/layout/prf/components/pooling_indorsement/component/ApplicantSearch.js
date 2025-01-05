import { Box, Button, Card, CardActions, CardContent, Chip, Divider, Fade, FormControl, InputLabel, MenuItem, Pagination, Paper, Popover, Popper, Select, Skeleton, Stack, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { Fragment, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { isEmptyObject } from "jquery"
import axios from "axios"
import { red } from "@mui/material/colors"

import { TableContainerComp } from "../../export_components/ExportComp"
import ButtonViewPRF from "../../../requestdetails/view/ButtonViewPRF"
import { AppliedInfo } from "./ExportComponent"
import { getShortList2 } from "../../../axios/prfPooling"
import Swal from "sweetalert2"
import SearchAutocomplete from "./SearchAutocomplete"
import SearchAutocomplete2params from "./SearchAutocomplete2params"
import { useHover } from "../../export_components/CustomPopper"

const color = red[500];
const tableTagHeader = [
	{ id: 'action', label: '', width: '40px' },
	// { id: 'id', label: 'id', width: '50px' },
	{ id: 'name', label: 'name', width: '90px' },
	{ id: 'education', label: 'education', width: '100px' },
	{ id: 'eligibility', label: 'eligibility', width: '100px' },
	{ id: 'experience', label: 'experience', width: '100px' },
	{ id: 'training', label: 'training', width: '100px' },
]

function ApplicantSearch({ tempReq, selectedList, setSelectedList }) {
	const [open, setOpen] = useState(false)
	// const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(3)
	// const [courseList, setCourseList] = useState([])
	// const [internalList, setInternalList] = useState([]);
	// const [externalList, setExternalList] = useState([]);

	const [otherFilter, setOtherFilter] = useState({
		education_grade_level: '',
		training_type_ld: '',
		eligibility_licensed_title: '',
	})
	const [filters, setFilters] = useState({
		education_level: '',
		education_degree_course: '',
		eligibility_licensed_title: '',
		eligibility_rating: '',
		experience_title: '',
		training_title: '',
		training_type_ld: ''
	});

	const [lvlSelection, setLvlSelection] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [searchPref, setSearchPref] = useState(null);

	// for pagination
	const [internalPagination, setInternalPagination] = useState({ total: 0, page: 1, perPageApp: 5, data: [], skips: 0 })
	const [externalPagination, setExternalPagination] = useState({ total: 0, page: 1, perPageApp: 5, data: [], skips: 0 })

	let controller = new AbortController();

	const [anchorPop, setAnchorPop] = useState(null)
	const [tempCandidates, setTempCandidates] = useState(() => {
		const savedContent = localStorage.getItem('selectedCandidates')
		return savedContent ? JSON.parse(savedContent) : [];
	})

	useEffect(() => {
		const handler = setTimeout(() => {
			axios.post('api/prf/pooling-applicants/search-value', { search: '*', pref_type: 'education', column: 'elevel' }, { signal: controller.signal })
				.then((response) => {
					setLvlSelection(response.data.data)
				})
				.catch((error) => {
					toast.error(error.message)
				})

			// getCourse().then(response => {
			// 	setCourseList(response.data)
			// }).catch((error) => {
			// 	toast.error(error.message)
			// })
		}, 500)

		return () => {
			clearTimeout(handler);
		};
	}, [])

	useEffect(() => {
		if (filters.education_level === '' || filters.education_level === undefined || !filters.education_level) {
			setOtherFilter((prev) => ({ ...prev, education_grade_level: '' }))
		}
		if (filters.eligibility_licensed_title === '' || filters.eligibility_licensed_title === undefined || !filters.eligibility_licensed_title) {
			setOtherFilter((prev) => ({ ...prev, eligibility_licensed_title: '' }))
		}
		if (filters.training_type_ld === '' || filters.training_type_ld === undefined || !filters.training_type_ld) {
			setOtherFilter((prev) => ({ ...prev, training_type_ld: '' }))
		}
	}, [filters])

	useEffect(() => {
		console.log(tempCandidates)
	}, [tempCandidates])


	const handleCBAppChange = (ev, it, app_type) => {
		ev.preventDefault()
		const { id, checked } = ev.target
		console.log(id, app_type, it)

		switch (app_type) {
			case 'applicant':
				if (checked) {
					setTempCandidates((prev) => [...prev, { id: id, data: it }])
				} else {
					setTempCandidates(tempCandidates.filter((k) => k.id !== id))
				}
				break;
			case 'employee':
				if (checked) {
					setTempCandidates((prev) => [...prev, { id: id, data: it }])
				} else {
					setTempCandidates(tempCandidates.filter((k) => k.id !== id))
				}
				break;

			default:
				toast.error('Ops, something went wrong!')
				break;
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(3);

		let searchPref = {
			pref_education_level: filters.education_level,
			pref_education_degree_course: filters.education_degree_course,
			pref_eligibility_licensed_title: filters.eligibility_licensed_title,
			pref_eligibility_rating: filters.eligibility_rating,
			pref_experience_title: filters.experience_title,
			pref_training_title: filters.training_title,
			pref_training_type_ld: filters.training_type_ld,

			other_pref_education: otherFilter.education_grade_level,
			other_pref_eligibility: otherFilter.eligibility_licensed_title,
			other_pref_training: otherFilter.training_type_ld,
		};

		setSearchPref(searchPref)


		if (!filters.education_degree_course && !filters.education_level && !filters.eligibility_licensed_title && !filters.eligibility_rating && !filters.experience_date_ended && !filters.experience_date_started && !filters.experience_title && !filters.training_title && !filters.training_type_ld) {
			return toast.warning('Ops, you forgot to enter your preferences')
		}

		if (filters.education_level) {
			if (otherFilter.education_grade_level === undefined || !otherFilter.education_grade_level) {
				return toast.warning('Ops, you forgot to select a grade level')
			}
		}

		Swal.fire('Processing request . . .')
		Swal.showLoading()

		try {
			const [resApp, resEmp] = await Promise.all([
				getShortList2({ searchPref, app_type: 'applicant' }, externalPagination.page, externalPagination.perPageApp, externalPagination.skips),
				getShortList2({ searchPref, app_type: 'employee' }, internalPagination.page, internalPagination.perPageApp, internalPagination.skips),
			])

			if (resApp.data.status === 500) { return toast.error(resApp.data.message) }
			if (resEmp.data.status === 500) { return toast.error(resEmp.data.message) }

			console.log(resApp, resEmp)
			if (resApp.data.status === 200 || resEmp.data.status === 200) {
				setInternalPagination({ total: Number(resEmp.data.total), page: 1, perPageApp: Number(resEmp.data.perPage), data: resEmp.data.data, skips: Number(resEmp.data.skip) });
				setExternalPagination({ total: Number(resApp.data.total), page: 1, perPageApp: Number(resApp.data.perPage), data: resApp.data.data, skips: Number(resApp.data.skip) });
			}
		} catch (error) {
			console.error("Error fetching applicants:", error);
		} finally {
			setLoading(0);
			Swal.close();
		}
	};


	const handleCheckSkips = (page, stateData) => {
		let skips = 0;
		if (page === 1) {
			return skips = 0
		} else {
			return skips = (page - 1) * stateData
		}
	}
	const handlePaginateApplicant = (ev, v, app_type, loader) => {
		setLoading(loader)
		let skips = handleCheckSkips(v, externalPagination.perPageApp)
		getShortList2({ searchPref, app_type: app_type }, v, externalPagination.perPageApp, skips)
			.then((res) => {
				if (res.data.status === 500) { return toast.error(res.data.message) }
				if (res.data.status === 200) {
					setExternalPagination({ total: Number(res.data.total), page: v, perPageApp: Number(res.data.perPage), data: res.data.data, skips: Number(res.data.skip) });
				}
			})
			.catch((err) => {
				console.log(err.message)
			})
			.finally(() => {
				setLoading(0)
			})
	}
	const handlePaginateEmployee = (ev, v, app_type, loader) => {
		setLoading(loader)
		let skips = handleCheckSkips(v, internalPagination.perPageApp)
		getShortList2({ searchPref, app_type: app_type }, v, internalPagination.perPageApp, skips)
			.then((res) => {
				if (res.data.status === 500) { return toast.error(res.data.message) }
				if (res.data.status === 200) {
					setInternalPagination({ total: Number(res.data.total), page: v, perPageApp: Number(res.data.perPage), data: res.data.data, skips: Number(res.data.skip) });
				}
			})
			.catch((err) => {
				console.log(err.message)
			})
			.finally(() => {
				setLoading(0)
			})
	}

	// const handlePaginateApplicant = async (ev, v, app_type, loader) => {
	// 	ev.preventDefault();
	// 	setLoading(loader)
	// 	if (app_type === 'applicant') {
	// 		try {
	// 			const [resApp] = await Promise.all([
	// 				axios.post(`api/prf/pooling-applicants/get-short-list-candidates`, { filters, app_type: 'applicant' }, { signal: controller.signal }),
	// 			])

	// 			if (resApp.status === 500) { return toast.error(resApp.message) }
	// 			if (resApp.status === 200) {
	// 				setApplicantList({
	// 					...applicantList, app_list: resApp.data.data,
	// 				});
	// 				setTotalApp(resApp.data.total);
	// 				setPageApp(resApp.data.current_page);
	// 			}
	// 		} catch (error) {
	// 			console.error("Error fetching applicants:", error);
	// 		} finally {
	// 			setLoading(0)
	// 		}
	// 	} else if (app_type === 'employee') {
	// 		try {
	// 			const [resEmp] = await Promise.all([
	// 				axios.post(`api/prf/pooling-applicants/get-short-list-candidates?page=${v}&&perPage=${perPageEmp}`, { filters, app_type: 'employee' }, { signal: controller.signal })
	// 			])

	// 			if (resEmp.status === 500) { return toast.error(resEmp.message) }
	// 			if (resEmp.status === 200) {
	// 				setApplicantList({
	// 					...applicantList, emp_list: resEmp.data.data,
	// 				});
	// 				setTotalEmp(resEmp.data.total);
	// 				setPageEmp(resEmp.data.current_page);
	// 			}
	// 		} catch (error) {
	// 			console.error("Error fetching applicants:", error);
	// 		} finally {
	// 			setLoading(0)
	// 		}
	// 	}
	// }

	const handleClickToSave = () => {
		if (isEmptyObject(tempCandidates)) {
			return toast.warning('Ops, please select a candidates to continue.')
		}

		let p = []
		if (tempCandidates.length > 0) {
			tempCandidates.forEach(element => {
				p.push(element)
			});
		}

		setSelectedList(p)
		return toast.success('Successfully saved candidates. You may close this modal.')
	}

	// const getCurrentLatest = (data, splitter) => {
	// 	if (!data || isEmptyObject(data)) { return 'N/A' }

	// 	const temp = data.split(splitter)
	// 	return temp.reverse()[0]
	// }

	// const getEducList = (data, splitter) => {
	// 	if (!data || isEmptyObject(data)) { return 'N/A' }
	// 	const temp = data.split(splitter)
	// 	return temp
	// }

	const handleClickPopper = (event) => {
		setAnchorPop(event.currentTarget)
	}
	const canBeOpen = Boolean(anchorPop)
	const idPop = canBeOpen ? 'simple-app-pool-popover' : undefined;

	const handleRemoveApp = (ev, idx) => {
		ev.preventDefault();
		const t = tempCandidates.filter((m, index) => index !== idx)
		setTempCandidates(t)
	}

	return (
		<>
			<Fragment>
				<Popover id={idPop} open={canBeOpen} anchorEl={anchorPop} onClose={() => setAnchorPop(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center', }} transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}>
					<Box sx={{ borderRadius: '2px', p: 1, bgcolor: 'background.paper' }}>
						<Stack spacing={1} sx={{ height: '200px', overflowY: 'scroll', }}>
							{canBeOpen &&
								tempCandidates.map((t, index) => (
									<Link to={`../recruitment/evaluate-pds/${t.data.applicant_id}:${t.data.app_type}`} target={"_blank"}>
										<Chip label={t.data.cname.toUpperCase() + ' - ' + t.data.app_type.toUpperCase()}
											variant="outlined"
											id={t.data.id}
											onDelete={(ev) => handleRemoveApp(ev, index)}
											sx={{ width: "100%", color: 'cornflowerblue', justifyContent: "space-between" }}
										/>
									</Link>
								))
							}
						</Stack>
					</Box>
				</Popover>
			</Fragment>

			<Card sx={{ padding: "5px 0px" }}>
				<CardContent>
					<Stack spacing={2}>
						<AppliedInfo tempReq={tempReq} />
						<Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
							<ButtonViewPRF open={open} handleClickOpen={() => setOpen(true)} handleClose={() => setOpen(false)} id={'pa-id'} minWidth={'65%'} />
						</Box>

						<Divider />

						<Card>
							<Typography variant="body1" sx={{ p: 1, textAlign: 'center' }} fontWeight={600}> Applicant Pooling - Q.S. Preference </Typography>
							<CardContent>
								<Box>
									<Typography variant="body2"> Filter by: </Typography>
									<Box sx={{ margin: '0 2rem' }}>
										<Typography variant="caption"> <em> (Leave the fields blank, if not applicable) </em> </Typography>
									</Box>
								</Box>

								<form onSubmit={handleSubmit} style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
									<Box>
										<FormControl fullWidth>
											<label>Education Level:</label>
											<Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', flexWrap: 'wrap', width: '100%', }}>
												<Select variant="outlined" id="education-level-id" name="education_level" labelId="education-id" value={filters.education_level} onChange={handleChange} size="small">
													{lvlSelection.map((i, index) => (
														<MenuItem value={i.elevel}> {i.elevel} </MenuItem>
													))}
												</Select>

												<FormControl >
													{('COLLEGE' === filters.education_level || 'ELEMENTARY' === filters.education_level || 'SECONDARY' === filters.education_level || 'VOCATIONAL/TRADE COURSE' === filters.education_level || 'GRADUATE STUDIES' === filters.education_level) && (
														<>
															<InputLabel id='education-grade-level' size="small"> Grade level: </InputLabel>
															{/* <SearchAutocomplete2params url={'/api/prf/pooling-applicants/get-grade-level/autocomplete'} optionTitle={'gradelevel'} componentTitle={''} title setTitle={(ev) => setOtherFilter((prev) => ({ ...prev, education_grade_level: ev.target.value }))} defaultValue={''} param2={filters.education_level} /> */}
															{('COLLEGE' === filters.education_level) && (<>
																<Select
																	name={'education_grade_level'}
																	labelId={'education-grade-level'}
																	id='education_grade_level'
																	label='Grade level:'
																	variant="outlined"
																	value={otherFilter.education_grade_level}
																	onChange={(ev) => setOtherFilter((prev) => ({ ...prev, education_grade_level: ev.target.value }))}
																	size={'small'}
																	sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
																>
																	<MenuItem value=''> <em>None</em> </MenuItem>
																	<MenuItem value='graduated'> GRADUATED </MenuItem>
																	<MenuItem value='units'> UNITS </MenuItem>
																	<MenuItem value='under graduate'> UNDER GRADUATE </MenuItem>
																	<MenuItem value='N/A'> N/A </MenuItem>
																</Select>
															</>)}
															{('ELEMENTARY' === filters.education_level) && (<>
																<Select
																	name={'education_grade_level'}
																	labelId={'education-grade-level'}
																	id='education_grade_level'
																	label='Grade level:'
																	variant="outlined"
																	value={otherFilter.education_grade_level}
																	onChange={(ev) => setOtherFilter((prev) => ({ ...prev, education_grade_level: ev.target.value }))}
																	size={'small'}
																	sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
																>
																	<MenuItem value=''> <em>None</em> </MenuItem>
																	<MenuItem value='GRADUATED'> GRADUATED </MenuItem>
																	<MenuItem value='GRADE 1'> GRADE 1 </MenuItem>
																	<MenuItem value='GRADE 2'> GRADE 2 </MenuItem>
																	<MenuItem value='GRADE 3'> GRADE 3 </MenuItem>
																	<MenuItem value='GRADE 4'> GRADE 4 </MenuItem>
																	<MenuItem value='GRADE 5'> GRADE 5 </MenuItem>
																	<MenuItem value='GRADE 6'> GRADE 6 </MenuItem>
																	<MenuItem value='ELEMENTARY'> ELEMENTARY </MenuItem>
																	<MenuItem value='PRIMARY EDUCATION'> PRIMARY EDUCATION </MenuItem>
																	<MenuItem value='WITH HONORS'> WITH HONORS </MenuItem>
																	<MenuItem value='WITH HIGHEST HONOR'> WITH HIGHEST HONOR </MenuItem>
																	<MenuItem value='N/A'> N/A </MenuItem>
																</Select>
															</>)}
															{('SECONDARY' === filters.education_level) && (<>
																<Select
																	name={'education_grade_level'}
																	labelId={'education-grade-level'}
																	id='education_grade_level'
																	label='Grade level:'
																	variant="outlined"
																	value={otherFilter.education_grade_level}
																	onChange={(ev) => setOtherFilter((prev) => ({ ...prev, education_grade_level: ev.target.value }))}
																	size={'small'}
																	sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
																>
																	<MenuItem value=''> <em>None</em> </MenuItem>
																	<MenuItem value='GRADUATED'> GRADUATED </MenuItem>
																	<MenuItem value='GRADE 7'> GRADE 7 </MenuItem>
																	<MenuItem value='GRADE 8'> GRADE 8 </MenuItem>
																	<MenuItem value='GRADE 9'> GRADE 9 </MenuItem>
																	<MenuItem value='GRADE 10'> GRADE 10 </MenuItem>
																	<MenuItem value='1ST YEAR'> 1ST YEAR </MenuItem>
																	<MenuItem value='2ND YEAR'> 2ND YEAR </MenuItem>
																	<MenuItem value='3RD YEAR'> 3RD YEAR </MenuItem>
																	<MenuItem value='4TH YEAR'> 4TH YEAR </MenuItem>
																	<MenuItem value='COMPLETERS'> COMPLETERS </MenuItem>
																	<MenuItem value='HIGH SCHOOL'> HIGH SCHOOL </MenuItem>
																	<MenuItem value='SECONDARY EDUCATION'> SECONDARY EDUCATION </MenuItem>
																	<MenuItem value='JUNIOR HIGH'> JUNIOR HIGHSCHOOL </MenuItem>
																	<MenuItem value='SENIOR HIGH'> SENIOR HIGHSCHOOL </MenuItem>
																	<MenuItem value='WITH HONORS'> WITH HONORS </MenuItem>
																	<MenuItem value='WITH HIGHEST HONOR'> WITH HIGHEST HONOR </MenuItem>
																	<MenuItem value='N/A'> N/A </MenuItem>
																</Select>
															</>)}
															{('VOCATIONAL/TRADE COURSE' === filters.education_level) && (<>
																<Select
																	name={'education_grade_level'}
																	labelId={'education-grade-level'}
																	id='education_grade_level'
																	label='Grade level:'
																	variant="outlined"
																	value={otherFilter.education_grade_level}
																	onChange={(ev) => setOtherFilter((prev) => ({ ...prev, education_grade_level: ev.target.value }))}
																	size={'small'}
																	sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
																>
																	<MenuItem value=''> <em>None</em> </MenuItem>
																	<MenuItem value='GRADUATED'> GRADUATED </MenuItem>
																	<MenuItem value='NC'> NC LICENSED </MenuItem>
																	<MenuItem value='UNDERGRADUATED'> UNDERGRADUATED </MenuItem>
																	<MenuItem value='UNITS'> UNITS </MenuItem>
																	<MenuItem value='1ST SEMESTER'> 1ST SEMESTER </MenuItem>
																	<MenuItem value='2ND SEMESTER'> 2ND SEMESTER </MenuItem>
																	<MenuItem value='1ST YEAR'> 1ST YEAR </MenuItem>
																	<MenuItem value='2ND YEAR'> 2ND YEAR </MenuItem>
																	<MenuItem value='3RD YEAR'> 3RD YEAR </MenuItem>
																	<MenuItem value='WITH HONORS'> WITH HONORS </MenuItem>
																	<MenuItem value='WITH HIGHEST HONOR'> WITH HIGHEST HONOR </MenuItem>
																	<MenuItem value='N/A'> N/A </MenuItem>
																</Select>
															</>)}
															{('GRADUATE STUDIES' === filters.education_level) && (<>
																<Select
																	name={'education_grade_level'}
																	labelId={'education-grade-level'}
																	id='education_grade_level'
																	label='Grade level:'
																	variant="outlined"
																	value={otherFilter.education_grade_level}
																	onChange={(ev) => setOtherFilter((prev) => ({ ...prev, education_grade_level: ev.target.value }))}
																	size={'small'}
																	sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
																>
																	<MenuItem value=''> <em>None</em> </MenuItem>
																	<MenuItem value='GRADUATED'> GRADUATED </MenuItem>
																	<MenuItem value='UNITS'> UNITS </MenuItem>
																	<MenuItem value='CERTIFIED'> CERTIFIED </MenuItem>
																	<MenuItem value='1ST SEMESTER'> ONGOING </MenuItem>
																	<MenuItem value='COMPLETED'> COMPLETED </MenuItem>
																	<MenuItem value='N/A'> N/A </MenuItem>
																</Select>
															</>)}
														</>
													)}
												</FormControl>
											</Box>

											{filters.education_level === '' && <Typography variant="caption" color="red"> Please select education level </Typography>}

										</FormControl>
										<FormControl fullWidth>
											<label>Education Degree Course:</label>
											<SearchAutocomplete title componentTitle='' optionTitle='course_name' url='/api/pds/education/add/autoCompele' setTitle={(newValue) => setFilters(prevFilters => ({ ...prevFilters, education_degree_course: newValue }))} />
										</FormControl>

										<FormControl fullWidth>
											<label>Eligibility Licensed Title:</label>
											<Stack sx={{ gap: '0.25rem' }}>
												<FormControl fullWidth >
													<SearchAutocomplete title componentTitle='' optionTitle='elig_title' url='/api/pds/eligibility/add/autoComplete' setTitle={(newValue) => setFilters(prevFilters => ({ ...prevFilters, eligibility_licensed_title: newValue }))} />
												</FormControl>
												{/* <FormControl fullWidth>
													{filters.eligibility_licensed_title === 'other' && (
														<TextField variant="outlined" type="text" name="eligibility_licensed_title" label="Other license title"
															value={otherFilter.eligibility_licensed_title} onChange={(ev) => setOtherFilter((prev) => ({ ...prev, eligibility_licensed_title: ev.target.value }))}
															size="small" />
													)}
												</FormControl> */}
											</Stack>
										</FormControl>
										<FormControl fullWidth>
											<label>Eligibility Rating:</label>
											<TextField variant="outlined" type="number" step="0.01" name="eligibility_rating" value={filters.eligibility_rating} onChange={handleChange} size="small" min={0} max={100} />
										</FormControl>
										<FormControl fullWidth>
											<label>Experience(Job/Position title):</label>
											<TextField variant="outlined" type="text" name="experience_title" value={filters.experience_title} onChange={handleChange} size="small" />
										</FormControl>
										<FormControl fullWidth>
											<label>Training Title (comma-separated):</label>
											<TextField variant="outlined" type="text" name="training_title" value={filters.training_title} onChange={handleChange} size="small" />
										</FormControl>
										<FormControl fullWidth>
											<label>Training Type of LD:</label>
											<Stack sx={{ gap: '0.25rem' }}>
												<FormControl fullWidth >
													<Select
														name={'training_type_ld'}
														labelId={'training-type-ld-id'}
														variant="outlined"
														value={filters.training_type_ld}
														onChange={handleChange}
														size={'small'}
														sx={{ whiteSpace: 'nowrap!important', textOverflow: "ellipsis", overflow: "hidden", "& .css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select": { whiteSpace: "nowrap!important" } }}
													>
														<MenuItem value=''> <em>None</em> </MenuItem>
														<MenuItem value={'MANAGERIAL'}>MANAGERIAL</MenuItem>
														<MenuItem value={'SUPERVISORY'}>SUPERVISORY</MenuItem>
														<MenuItem value={'TECHNICAL'}>TECHNICAL</MenuItem>
														<MenuItem value={'other'}>Other</MenuItem>
													</Select>
												</FormControl>
												<FormControl fullWidth>
													{filters.training_type_ld === 'other' && (
														<TextField variant="outlined" type="text" name="training_type_ld"
															value={otherFilter.training_type_ld} onChange={(ev) => setOtherFilter((prev) => ({ ...prev, training_type_ld: ev.target.value }))}
															size="small" />
													)}
												</FormControl>
											</Stack>
										</FormControl>
									</Box>
									<Box>
										<Button variant="contained" type="submit" sx={{ float: 'right', clear: "both" }}>
											Search
										</Button>
									</Box>
								</form>
							</CardContent>
							{/* <CardActions sx={{ padding: '0px 16px 16px 16px', justifyContent: 'end' }}>
                        </CardActions> */}
						</Card>
						{/* <hr style={{ margin: "1rem 0rem 1rem 0rem" }} /> */}
						<Stack spacing={2} sx={{ margin: '0px' }}>
							<Card>
								<CardContent>
									<Typography variant="body1" fontWeight={600} sx={{ p: 1, textAlign: 'center', }}> Internal </Typography>
									<TableContainerComp>
										<TableHead>
											<TableRow>
												{tableTagHeader.map((column, index) => (
													<TableCell key={column.label + "-" + index} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: column.width, backgroundColor: "#1565C0 !important", }}>
														{column.label.toUpperCase()}
													</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											{loading === 3 || loading === 1
												? Array.from(Array(5)).map((item, index) => (
													<TableRow key={index}>
														{Array.from(Array(6)).map((item2, index2) => (
															<TableCell component="th" scope="row" key={index2}>
																<Skeleton variant="text" width="" height={45} animation="wave" sx={{ borderRadius: 0 }} />
															</TableCell>
														))}
													</TableRow>
												))
												:
												<>
													{!internalPagination ?
														<></>
														:
														<>
															{internalPagination.data.map((i, ix) => (
																<TableRow>
																	<TableCell>
																		<input
																			checked={tempCandidates.some((t) => { return (String(`checkbox-emp-id-${i.applicant_id}`) === String(t.id)) })}
																			type="checkbox"
																			name="checkbox-employee-id"
																			id={'checkbox-emp-id-' + i.applicant_id}
																			onChange={(ev) => handleCBAppChange(ev, i, 'employee')}
																			style={{ width: '20px', height: '20px' }}
																		/>
																	</TableCell>
																	<TableCell>
																		<Link to={`../recruitment/evaluate-pds/${Number(i.applicant_id)}:${i.app_type}`} target={"_blank"}>
																			{i.cname.toUpperCase() || 'N/A'}
																		</Link>
																	</TableCell>
																	<TableCell>
																		{i.ed_degreecourse ?
																			<HoverableCell data={i.ed_degreecourse} />
																			: 'N/A'
																		}
																	</TableCell>
																	<TableCell>
																		{i.el_title ?
																			<HoverableCell data={i.el_title} />
																			: 'N/A'
																		}
																	</TableCell>
																	<TableCell>
																		{i.ex_position ?
																			<HoverableCell data={i.ex_position} />
																			: 'N/A'
																		}
																	</TableCell>
																	<TableCell>
																		{i.tr_title ?
																			<HoverableCell data={i.tr_title} />
																			: 'N/A'
																		}
																	</TableCell>
																</TableRow>
															))}
														</>
													}
												</>
											}
										</TableBody>
									</TableContainerComp>
									<Box sx={{ mt: 1 }}>
										<Pagination shape="rounded" variant="outlined" count={Math.ceil(internalPagination.total / internalPagination.perPageApp)} page={internalPagination.page} color="primary" onChange={(ev, v) => handlePaginateEmployee(ev, v, 'employee', 1)} />
									</Box>
								</CardContent>
							</Card>
							<Card>
								<CardContent>
									<Typography variant="body1" fontWeight={600} sx={{ p: 1, textAlign: 'center', }}> External </Typography>
									<TableContainerComp>
										<TableHead>
											<TableRow>
												{tableTagHeader.map((column, index) => (
													<TableCell key={column.label + "-" + index} sx={{ textAlign: "center", color: "#FFF", fontWeight: "bold", width: column.width, backgroundColor: "#1565C0 !important", }}>
														{column.label.toUpperCase()}
													</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											{loading === 3 || loading === 2
												? Array.from(Array(5)).map((item, index) => (
													<TableRow key={index}>
														{Array.from(Array(6)).map((item2, index2) => (
															<TableCell component="th" scope="row" key={index2}>
																<Skeleton variant="text" width="" height={45} animation="wave" sx={{ borderRadius: 0 }} />
															</TableCell>
														))}
													</TableRow>
												))
												:
												<>
													{!externalPagination ?
														<></>
														:
														<>
															{externalPagination.data.map((i, ix) => (
																<TableRow>
																	<TableCell>
																		<input
																			checked={tempCandidates.some((t) => { return (String(`checkbox-app-id-${i.applicant_id}`) === String(t.id)) })}
																			type="checkbox"
																			name="checkbox-applicant-id"
																			id={'checkbox-app-id-' + i.applicant_id}
																			onChange={(ev) => handleCBAppChange(ev, i, 'applicant')}
																			style={{ width: '20px', height: '20px' }}
																		/>
																	</TableCell>
																	<TableCell>
																		<Link to={`../recruitment/evaluate-pds/${Number(i.applicant_id)}:${i.app_type}`} target={"_blank"}>
																			{i.cname.toUpperCase() || 'N/A'}
																		</Link>
																	</TableCell>
																	<TableCell>
																		{i.ed_degreecourse ?
																			<HoverableCell data={i.ed_degreecourse} />
																			: 'N/A'
																		}
																	</TableCell>
																	<TableCell>
																		{i.el_title ?
																			<HoverableCell data={i.el_title} />
																			: 'N/A'
																		}
																	</TableCell>
																	<TableCell>
																		{i.ex_position ?
																			<HoverableCell data={i.ex_position} />
																			: 'N/A'
																		}
																	</TableCell>
																	<TableCell>
																		{i.tr_title ?
																			<HoverableCell data={i.tr_title} />
																			: 'N/A'
																		}
																	</TableCell>
																</TableRow>
															))}
														</>
													}
												</>
											}
										</TableBody>
									</TableContainerComp>
									<Box sx={{ mt: 1 }}>
										<Pagination shape="rounded" variant="outlined" count={Math.ceil(externalPagination.total / externalPagination.perPageApp)} page={externalPagination.page} color="primary" onChange={(ev, v) => handlePaginateApplicant(ev, v, 'applicant', 2)} />
									</Box>
								</CardContent>
							</Card>
						</Stack>
					</Stack>
				</CardContent>
				<CardActions sx={{ padding: '0px 16px 16px 16px', justifyContent: 'end' }}>
					<Stack direction="row" spacing={3} alignItems='end'>
						<Box>
							<Box onClick={handleClickPopper} aria-describedby={idPop} sx={{ textDecoration: 'underline', color: 'cornflowerblue', cursor: 'pointer' }}>
								Total Selected Candidates: {tempCandidates.length}
							</Box>
							<Box>
								Request head count: {tempReq.head_cnt}
							</Box>
						</Box>
						<Box>
							<Button variant="contained" color="success" onClick={handleClickToSave}> Save Candidates </Button>
						</Box>
					</Stack>
				</CardActions>
			</Card>
		</>
	)
}

export default ApplicantSearch

const useHoverPopper = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [open, setOpen] = useState(false);

	const handleMouseEnter = (event) => {
		setAnchorEl(event.currentTarget);
		setOpen(true);
	};

	const handleMouseLeave = () => {
		setOpen(false);
	};

	return { anchorEl, open, handleMouseEnter, handleMouseLeave };
};

const handleNewlineSplit = (value) => {
	const arr = value.split('\n').reverse();
	return arr;
}

const HoverableCell = ({ data }) => {
	const { anchorEl, open, handleMouseEnter, handleMouseLeave } = useHoverPopper();

	return (
		<>
			{data ?
				<>
					{handleNewlineSplit(data)[0] === 'N/A' ? 'N/A' :
						<TableCell onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
							{handleNewlineSplit(data)[0]}
							<Popper open={open} anchorEl={anchorEl} placement="bottom-start" sx={{ zIndex: 10000 }}>
								<Card sx={{ padding: '2rem' }}>
									<Box sx={{ maxHeight: '200px', width: '20rem', overflowY: 'scroll' }}>
										<ol style={{ margin: '0' }}>
											{data ? handleNewlineSplit(data).map((item, index) => (
												<li key={index} style={{}}> {item} </li>
											)) : 'N/A'}
										</ol>
									</Box>
								</Card>
							</Popper>
						</TableCell>
					}
				</>
				:
				'N/A'
			}
		</>
	);
};
