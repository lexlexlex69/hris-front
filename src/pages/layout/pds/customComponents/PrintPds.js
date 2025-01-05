import React, { useEffect, useContext, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonalInfo from './pdsPrintables/PersonalInfo'
import FamilyBac from './pdsPrintables/FamilyBac'
import EducBackground from './pdsPrintables/EducBackground';
import WorkExp from './pdsPrintables/WorkExp';
import Voluntry from './pdsPrintables/Voluntary';
import Training from './pdsPrintables/Training';
import OtherInfo from './pdsPrintables/OtherInfo';
import Others_34_40 from './pdsPrintables/Others_34_40'
import ReferencesOthers from './pdsPrintables/ReferencesOthers';
import Eligibility from './pdsPrintables/Eligibility';
import WorkExpSheet from './pdsPrintables/WorkExpSheet';
import { AddToPreferencesContext } from './pdsPrintables/AddToPreferencesContext';
import AddToPreferences from './pdsPrintables/AddToPreferences';
import ExceesChildren from './pdsPrintables/ExceesChildren';

function PrintPds({ personalInfo, address, family, children, education, workExp, eligibility, voluntary, training, specialSkills, recognition, organization, nNumberOthers, references, _34_40, vacancy_id, applicant_type, govId, defaultEducation }) {

    const exceesChild = children.length > 12 ? children.slice(12, children.length) : []
    const exceesEducation = education.length > 5 ? education.slice(5, education.length) : []
    const exceesWorkExp = workExp.length > 28 ? workExp.slice(28, workExp.length) : []
    const exceesEligibility = eligibility.length > 7 ? eligibility.slice(7, eligibility.length) : []
    const exceesVoluntary = voluntary.length > 7 ? voluntary.slice(7, voluntary.length) : []
    const exceesTrainings = training.length > 19 ? training.slice(19, training.length) : []
    const exceesSpecialSkills = nNumberOthers > 7 ? specialSkills.slice(7, specialSkills.length) : []
    const exceesRecognition = nNumberOthers > 7 ? recognition.slice(7, recognition.length) : []
    const exceesOrganization = nNumberOthers > 7 ? organization.slice(7, organization.length) : []

    const [preferencesModal, setPreferencesModal] = useState(false)
    const [preferencesData, setPreferencesData] = useState(null)
    const [totalPage, setTotalPage] = useState(0)
    const toggleModal = (category, data) => {
        setPreferencesData({
            category: category,
            data: data,
            vacancy_id: vacancy_id,
            applicant_type: applicant_type
        })
        setPreferencesModal(prev => !prev)
    }
    const pageFooter = () => (
        <>
            <div className="page-footer">
                <table style={{ width: '100%', margin: 'auto' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', backgroundColor: '#BEBEBE' }} colSpan={4}>
                                <Typography sx={{ fontSize: '10.66px', backgroundColor: '#fff', color: 'red' }} align="center">
                                    (Continue to separate sheet if necessary)
                                </Typography>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                                <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }} align="center">
                                    Signature
                                </Typography>
                            </td>
                            <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                                <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }}></Typography>
                            </td>
                            <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                                <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }} align="center">
                                    Date
                                </Typography>
                            </td>
                            <td style={{ border: '1px solid black', backgroundColor: '#fff' }} width="25%">
                                <Typography sx={{ fontSize: '12px', backgroundColor: '#fff' }}></Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
    const Revise = () => (
        <>

            <div id="content">
                <div id="pageFooter"> </div>
                <div > &nbsp; of {totalPage}</div>
            </div>
        </>
    )

    const [totalPages,setTotalPages] = useState()


    useEffect(() => {
        let len = document.querySelectorAll('#pageFooter').length
        setTotalPage(len)
    }, [govId])

    return (
        <>
            <Box className="pds-print-wrapper">
                <Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography sx={{ fontSize: '9px', fontFamily: 'serif' }}><b>CS FORM No. 212</b></Typography>
                        <Typography sx={{ fontSize: '8px', fontFamily: 'serif', mt: -.5 }}><b>Revised 2017</b></Typography>
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="h4" sx={{ fontSize: '20px', letterSpacing: '2px', fontFamily: 'serif' }}><b>PERSONAL DATA SHEET</b></Typography>
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', pl: 2 }}>
                        <Typography variant="p" sx={{ fontSize: '8px', fontFamily: 'serif', m: 0, p: 0 }}><b>
                            Warning: Any misrepresentation made in the Personal Data Sheet and the Work Experience Sheet shall cause the filing of administrative/criminal case/s against the person concerned.
                        </b></Typography>
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', pl: 2, mt: .5 }}>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="p" sx={{ fontSize: '8px', fontFamily: 'serif', m: 0, p: 0 }}>
                                    <b>
                                        READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET (PDS) BEFORE ACCOMPLISHING THE PDS FORM.
                                    </b>
                                </Typography>
                                <Typography variant="p" sx={{ fontSize: '8px', fontFamily: 'serif', m: 0, p: 0, display: 'flex' }}>
                                    Print legibly. Tick appropriate boxes ( &nbsp; &nbsp;)  &nbsp;<Box><input type="checkbox" /> </Box>  &nbsp; use separate sheet if necessary. Indicate N/A of not applicable. <b>DO NOT ABBREVIATE.</b>
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <Box sx={{ border: '1px solid black', width: '100%', display: 'flex', justifyContent: 'space-between', height: '20px', alignItems: 'center' }}>
                                <span style={{ backgroundColor: 'gray', paddingLeft: '1', paddingRight: '1', fontSize: '10px', height: '100%' }}> &nbsp;1. CS ID No. &nbsp;</span>
                                <span style={{ fontSize: '8px' }}>(Do not fill up. For CSC use only)</span>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <AddToPreferencesContext.Provider value={{ toggleModal }} >
                            <AddToPreferences open={preferencesModal} handleClose={() => setPreferencesModal(false)} data={preferencesData} />
                            <table className="pds-table-print" style={{ width: '100%' }}>
                                {/* <thead>
                                <th><td><div className='empty-header'></div></td></th>
                            </thead> */}
                                <tbody className='empty-content bordered-table'>
                                    <PersonalInfo personalInfo={personalInfo || ''} address={address || ''} />
                                    <FamilyBac family={family || ''} children={children.slice(0, 12) || ''} />
                                </tbody>
                            </table>
                            <table className="pds-table-print" style={{ width: '100%' }}>
                                <tbody className='empty-content bordered-table'>
                                    <EducBackground education={defaultEducation || ''} defaultVals />
                                </tbody>
                            </table>
                            {pageFooter()}
                            {Revise()}
                            {/* excees sa children */}
                            {children.length > 12 && (
                                <div className='pds-break-margin-top'>
                                    <table className="pds-table-print force-break-before" style={{ width: '100%' }}>
                                        <tbody className='empty-content bordered-table'>
                                            <ExceesChildren children={exceesChild} />
                                        </tbody>
                                    </table>
                                    {pageFooter()}
                                    {Revise()}
                                </div>
                            )}

                            {/* exceeds the default education csc length in the pds goes here */}
                            {education && Array.from(Array(Math.ceil(education.length / 27))).map((item, index) => (
                                <div className='pds-break-margin-top' key={index}>
                                    <table className="pds-table-print force-break-before" style={{ width: '100%', paddingTop: '16px' }}>
                                        <tbody className='empty-content bordered-table'>
                                            <EducBackground education={education.slice((27 * index), (27 * (index + 1))) || ''} />
                                        </tbody>
                                    </table>
                                    {pageFooter()}
                                    {Revise()}
                                </div>
                            )
                            )}
                            <div className='pds-break-margin-top'>
                                <table className="pds-table-print force-break-before ">
                                    <tbody className='empty-content bordered-table'>
                                        <Eligibility eligibility={eligibility.slice(0, 7) || ''} defaultVals={true} />
                                    </tbody>
                                </table>
                            </div>
                            <table className="pds-table-print" style={{ width: '100%' }}>
                                <tbody className='empty-content bordered-table'>
                                    <WorkExp workExp={workExp.slice(0, 28) || ''} defaultVals />
                                </tbody>
                            </table>
                            {pageFooter()}
                            {Revise()}
                            {/* exceeds the default eligibility csc length in the pds goes here */}
                            {exceesEligibility && Array.from(Array(Math.ceil(exceesEligibility.length / 27))).map((item, index) => (
                                <div className='pds-break-margin-top' key={index}>
                                    <table className="pds-table-print force-break-before" style={{ width: '100%', paddingTop: '16px' }}>
                                        <tbody className='empty-content bordered-table'>
                                            <Eligibility eligibility={exceesEligibility.slice((27 * index), (27 * (index + 1))) || ''} />
                                        </tbody>
                                    </table>
                                    {pageFooter()}
                                    {Revise()}
                                </div>
                            )
                            )}

                            {exceesWorkExp && Array.from(Array(Math.ceil(exceesWorkExp.length / 37))).map((item, index) => (
                                <div className='pds-break-margin-top' key={index}>
                                    <table className="pds-table-print force-break-before" style={{ width: '100%' }}>
                                        <tbody className='empty-content bordered-table'>
                                            <WorkExp workExp={exceesWorkExp.slice((index * 37), (37 * (index + 1))) || ''} />
                                        </tbody>
                                    </table>
                                    {pageFooter()}
                                    {Revise()}
                                </div>
                            )
                            )}
                            <div className='pds-break-margin-top'>
                                <table className="pds-table-print force-break-before" style={{ width: '100%' }}>
                                    <tbody className='empty-content bordered-table'>
                                        <Voluntry voluntary={voluntary.slice(0, 7) || ''} defaultVals={true} />
                                    </tbody>
                                </table>
                            </div>
                            <table className="pds-table-print" style={{ width: '100%' }}>
                                <tbody className='empty-content bordered-table'>
                                    <Training training={training.slice(0, 19) || ''} defaultVals={true} />
                                </tbody>
                            </table>
                            <table className="pds-table-print" style={{ width: '100%' }}>
                                <tbody className='empty-content bordered-table'>
                                    <OtherInfo specialSkills={specialSkills.slice(0, 7) || ''} recognition={recognition.slice(0, 7) || ''} organization={organization.slice(0, 7) || ''} nNumberOthers={nNumberOthers < 7 ? nNumberOthers : 7} defaultVals={true} />
                                </tbody>
                            </table>
                            {pageFooter()}
                            {Revise()}

                            {/* excees of voluntary in pds goes here */}
                            {exceesVoluntary && Array.from(Array(Math.ceil(exceesVoluntary.length / 38))).map((item, index) => (
                                <div className='pds-break-margin-top' key={index}>
                                    <table className="pds-table-print force-break-before" style={{ width: '100%' }}>
                                        <tbody className='empty-content bordered-table'>
                                            <Voluntry voluntary={exceesVoluntary.slice((index * 38), (38 * (index + 1))) || ''} />
                                        </tbody>
                                    </table>
                                    {pageFooter()}
                                    {Revise()}
                                </div>
                            )
                            )}

                            {/* exceeding trainings from pds goes here */}
                            {exceesTrainings && Array.from(Array(Math.ceil(exceesTrainings.length / 38))).map((item, index) => (
                                <div className='pds-break-margin-top' key={index}>
                                    <table className="pds-table-print force-break-before" style={{ width: '100%' }}>
                                        <tbody className='empty-content bordered-table'>
                                            <Training training={exceesTrainings.slice((38 * index), (38 * (index + 1))) || ''} />
                                        </tbody>
                                    </table>
                                    {pageFooter()}
                                    {Revise()}
                                </div>
                            )
                            )}

                            {nNumberOthers > 7 && (
                                <div className='pds-break-margin-top'>
                                    <table className="pds-table-print force-break-before" style={{ width: '100%' }}>
                                        <tbody className='empty-content bordered-table'>
                                            <OtherInfo specialSkills={exceesSpecialSkills || ''} recognition={exceesRecognition || ''} organization={exceesOrganization || ''} nNumberOthers={nNumberOthers - 7 || ''} />
                                        </tbody>
                                    </table>
                                    {pageFooter()}
                                    {Revise()}
                                </div>
                            )}

                            <div className='pds-break-margin-top'>
                                <table className="pds-table-print force-break-before" style={{ width: '100%' }} >
                                    <tbody className='empty-content bordered-table'>
                                        <Others_34_40 _34_40={_34_40 || ''} />
                                    </tbody>
                                </table>
                            </div>
                            <table className="pds-table-print" style={{ border: '1px solid black', width: '100%', height: '100%' }}>
                                <tbody className='empty-content bordered-table'>
                                    <ReferencesOthers references={references || ''} govId={govId} />
                                </tbody>
                            </table>
                            {Revise()}
                        </AddToPreferencesContext.Provider>
                    </Box>
                </Box>
                <WorkExpSheet data={workExp || []} personalInfo = {personalInfo || ''}/>
                <div style={{ position: 'absolute', bottom: '-120px', backgroundColor: '#fff', zIndex: 100, width: '100%', height: '80px' }}></div>
            </Box>
        </>
    )
}

export default React.memo(PrintPds)