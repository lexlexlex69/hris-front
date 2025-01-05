import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PhotoIcon from '@mui/icons-material/Photo';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

function ReferencesOthers({ references, govId }) {
    return (
        <>
            <tr>
                <td colSpan={7}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '80%' }}>
                            <p style={{ border: '1px solid black', fontSize: '12px', padding: '0px', margin: '0px', backgroundColor: '#eaeaea' }}>41.REFERENCES (Person not related by consanguinity or affinity to applicant/appointee)
                            </p>

                            <table className='bordered-table-reference'>
                                <thead>
                                    <tr >
                                        <td className='pds-fontsize-8px text-center' style={{ backgroundColor: '#eaeaea', height: '25px' }}><b>NAME</b></td>
                                        <td className='pds-fontsize-8px text-center' style={{ backgroundColor: '#eaeaea' }}><b>ADDRESS</b></td>
                                        <td className='pds-fontsize-8px text-center' style={{ backgroundColor: '#eaeaea' }}><b>TEL NO.</b></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid black', height: '25px' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>
                                                {references && references[0] ? references[0].RefName?.toUpperCase() : 'N/A'}
                                            </b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black', width: '30%' }}>
                                            <Typography className={references[0] && references[0].RefAddress?.length > 50 ? `pds-fontsize-long-text2 pds-print-no-pl-m  pds-print-pl` : `pds-fontsize-long-text pds-print-no-pl-m `} align="center"><b>
                                                {references[0] ? references[0].RefAddress?.toUpperCase() : 'N/A'}
                                            </b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }} >
                                            <Typography className='pds-fontsize-10px' align="center"><b>
                                                {references[0] ? references[0].RefTel : 'N/A'}
                                            </b></Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid black', height: '25px' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>
                                                {references[1] ? references[1].RefName?.toUpperCase() : 'N/A'}
                                            </b></Typography></td>
                                        <td style={{ border: '1px solid black', width: '30%' }}>
                                            <Typography className={references[1] && references[1].RefAddress?.length > 50 ? `pds-fontsize-long-text2 pds-print-no-pl-m  pds-print-pl` : `pds-fontsize-long-text pds-print-no-pl-m `} align="center"><b>
                                                {references[1] ? references[1].RefAddress?.toUpperCase() : 'N/A'}
                                            </b></Typography></td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>
                                                {references[1] ? references[1].RefTel : 'N/A'}
                                            </b></Typography></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid black', height: '25px' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>
                                                {references[2] ? references[2].RefName?.toUpperCase() : 'N/A'}
                                            </b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black', width: '30%' }}>
                                            <Typography className={references[2] && references[2].RefAddress?.length > 50 ? `pds-fontsize-long-text2 pds-print-no-pl-m  pds-print-pl` : `pds-fontsize-long-text pds-print-no-pl-m `} align="center"><b>
                                                {references[2] ? references[2].RefAddress?.toUpperCase() : 'N/A'}
                                            </b></Typography>
                                        </td>
                                        <td style={{ border: '1px solid black' }}>
                                            <Typography className='pds-fontsize-10px' align="center"><b>
                                                {references[2] ? references[2].RefTel : 'N/A'}
                                            </b></Typography>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#eaeaea' }}>
                                            <p className='pds-fontsize-8px' style={{ padding: '5px' }}>
                                                42. I declare under oath that I have personally accomplished this Personal Data Sheet which is a true, correct
                                                and complete statement pursuant to the provisions of pertinent laws, rules and regulations of the Republic of the
                                                Philippines. I authorize the egency head/authorized representative to verify/validate the contents stated
                                                herein. I agree that any misrepresentation made in this document and its attachments shall cause the filing of
                                                administrative/criminal case/s against me.

                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div style={{ marginTop: '10px', display: 'flex', gap: 2 }}>
                                <div style={{ width: '50%' }}>
                                    <table className='bordered-table-reference pds-fontsize-8px'>
                                        <thead>
                                            <tr>
                                                <td colSpan={2} style={{ backgroundColor: '#eaeaea' }}>
                                                    <p style={{ margin: 0, padding: 0 }}>
                                                        Goverment Issued ID (i.e. Passport, GSIS, SSS, PRC, Driver's License, etc.)
                                                        PLEASE INDICATE ID Number and Date of Issuance
                                                    </p>
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ height: '25px' }} >Government Issued ID: {govId?.gov_id ? govId?.gov_id : <>&nbsp;</>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ height: '25px' }}>ID/License/Passport No.: {govId?.id_no ? govId?.id_no : <>&nbsp;</>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ height: '25px' }}>Date/Place of Issuance: {govId?.date_place_issuance ? govId?.date_place_issuance : <>&nbsp;</>}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <table className='bordered-table-reference pds-fontsize-8px'>
                                        <thead>
                                            <tr>
                                                <td colSpan={2} style={{ height: '50px' }}>

                                                    &nbsp;

                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td align='center' style={{ backgroundColor: '#eaeaea' }}>Signature (Sign inside the box)</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align='center' style={{ backgroundColor: '#eaeaea' }}>Date accomplished</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '15%', margin: '20px' }}>
                            <div style={{ marginTop: '40px', height: '120px', border: '1px solid black', width: '80%', marginBottom: '15px', margin: 'auto' }}>
                                <p style={{ paddingTop: '10px', paddingLeft: '10px', paddingRight: '10px', textAlign: 'center', fontSize: '7px' }} >ID picture taken within
                                    the last  6 months
                                    4.5 cm. X 3.5 cm
                                    (passport size)</p>
                                <p style={{ textAlign: 'center', paddingLeft: '10px', paddingRight: '10px', fontSize: '7px' }} >
                                    Computer generated
                                    or photocopied picture
                                    is not acceptable
                                </p>
                            </div>
                            <p style={{ padding: 0, textAlign: 'center', color: '#BEBEBE' }} className="pds-fontsize-10px">Photo</p>

                            <div style={{ height: '80px', marginTop: '25px', border: '1px solid black', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', margin: 'auto' }}>
                                <p style={{ position: 'absolute', bottom: '0px', margin: 0, padding: 0, border: '1px solid black', width: '100%', textAlign: 'center', fontSize: '9px', backgroundColor: '#eaeaea' }}>Right Thumbmark</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ border: '1px solid black', width: '100%', marginBottom: '10px' }}></div>
                    <p className='pds-fontsize-8px' style={{ margin: 0, padding: 0, paddingLeft: '50px' }}>
                        SUBSCRIBED AND SWORN to before me this   __________________________________________________________, affiant exhibiting his/her validly issued government ID as indicated above.
                    </p>
                    <div style={{ display: 'flex', paddingBottom: '10px' }}>

                        <div style={{ width: '50%' }}>
                            {/* <p className='pds-fontsize-8px'>
                                SUBSCRIBE AND SWORN to before me this
                            </p>
                            <p className='pds-fontsize-8px' style={{ lineHeight: .8 }}>
                                DOC ISO <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>
                            </p>
                            <p className='pds-fontsize-8px' style={{ lineHeight: .8 }}>
                                DOC ISO <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>
                            </p>
                            <p className='pds-fontsize-8px' style={{ lineHeight: .8 }}>
                                DOC ISO <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>
                            </p>
                            <p className='pds-fontsize-8px' style={{ lineHeight: .8 }}>
                                DOC ISO <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>
                            </p> */}
                        </div>
                        <div style={{ width: '50%' }}>
                            <div style={{ border: '1px solid black', width: '70%' }}>
                                <div style={{ display: 'flex-3', padding: '5px', paddingBottom: '0px', height: '80px' }}>
                                </div>
                                <div style={{ display: 'flex-1', borderTop: '1px solid black' }}>
                                    <p className=' pds-fontsize-8px text-center' style={{ margin: 0, padding: 0, backgroundColor: '#eaeaea' }}> Person Administering the Oath</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </td>
            </tr>
        </>
    )
}

export default React.memo(ReferencesOthers)