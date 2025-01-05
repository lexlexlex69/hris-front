import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function Others_34_40({ _34_40 }) {

    return (
        <>
            <tr style={{ fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, backgroundColor: '#eaeaea' }} colSpan={4}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            34.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                                <Typography className='pds-fontsize-10px'>
                                    Are you related by consanguinity or affinity to the appointing or recommending authority, or to chief or bureu or office or to the person who has immediate supervision over you in the office, Bureau of Department where you will be appointed,
                                </Typography>
                                <Typography className='pds-fontsize-10px'>
                                    a. within the third degree
                                </Typography>
                                <Typography className='pds-fontsize-10px'>
                                    b. within the fourth degree (for Local Goverment Unit - Career Employees)?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, paddingTop: '3rem', paddingLeft: '1rem' }} colSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[0].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[0].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[0]?.value === 1 &&  _34_40[0].specify ? _34_40[0].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[1].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[1].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, backgroundColor: '#eaeaea' }} colSpan={4}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            35.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 3 }}>
                                <Typography className='pds-fontsize-10px'>
                                    a. Have you ever been found guilty of any administrative offense?
                                </Typography>
                                <Typography className='pds-fontsize-10px'>
                                    b. Have you been criminally charge before any court?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, paddingTop: '0rem', paddingLeft: '1rem' }} colSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column',height:'150px' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[2].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[2].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[2].specify && _34_40[2]?.value === 1  ? _34_40[2].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[3].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[3].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: _34_40[3]?.value === 1 ? 0 : 2 }}>
                                <Typography className='pds-fontsize-long-text' >DATE FILLED: <span><u>{_34_40.length > 0 && _34_40[3]?.value === 1 && _34_40[3].specify ? _34_40[3].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></span></Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: _34_40[3]?.value === 1 ? 0 : 2 }}>
                                <Typography className='pds-fontsize-long-text' >Status of case/s:<u>{_34_40.length > 0 && _34_40[3]?.value === 1 && _34_40[3].specify  ? _34_40[3].specify2 : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, backgroundColor: '#eaeaea' }} colSpan={4}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            36.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 3 }}>
                                <Typography className='pds-fontsize-10px'>
                                    Have you ever been convicted of any crime or violation of any law,decree,ordinance or regulation by any court or tribunal?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, paddingTop: '0rem', paddingLeft: '1rem' }} colSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[4].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[4].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 &&  _34_40[4]?.value === 1 && _34_40[4].specify ? _34_40[4].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, backgroundColor: '#eaeaea' }} colSpan={4}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            37.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 3 }}>
                                <Typography className='pds-fontsize-10px'>
                                    Have you ever been separated from the service in any of the following modes: resignation,retirement,dropped from the rolls, dismissal,termination,end of term,finished contact or phased out (abolition) in public or private sector?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, paddingTop: '0rem', paddingLeft: '1rem' }} colSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[5].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[5].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[5]?.value === 1 && _34_40[5].specify ? _34_40[5].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, backgroundColor: '#eaeaea' }} colSpan={4}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            38.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 3 }}>
                                <Typography className='pds-fontsize-10px'>
                                    a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?
                                </Typography>
                                <Typography className='pds-fontsize-10px'>
                                    b. Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, paddingTop: '0rem', paddingLeft: '1rem' }} colSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[6].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[6].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[6]?.value === 1 && _34_40[6].specify ? _34_40[6].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[7].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[7].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[7]?.value  === 1 && _34_40[7].specify ? _34_40[7].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, backgroundColor: '#eaeaea' }} colSpan={4}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            39.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 3 }}>
                                <Typography className='pds-fontsize-10px'>
                                    Have you acquired the status of an immigrant or permanent resident of another country?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, paddingTop: '0rem', paddingLeft: '1rem' }} colSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[8].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[8].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[8]?.value === 1 && _34_40[8].specify ? _34_40[8].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
            <tr style={{ fontSize: '12px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, backgroundColor: '#eaeaea' }} colSpan={4}>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ mr: 1 }}>
                            40.
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: 3 }}>
                                <Typography className='pds-fontsize-10px'>
                                    Pursuant to: (a) Indigenous People's Act (RA 8371); (b) Magna Carta for Disabled Persons (RA 7277); and (c) Solo Parents Welfare Act of 2000 (RA 8972), please answer the following
                                </Typography>
                                <Typography className='pds-fontsize-10px'>
                                    a. Are you a member of any indigenous group?
                                </Typography>
                                <Typography className='pds-fontsize-10px'>
                                    b. Are you a person with disability ?
                                </Typography>
                                <Typography className='pds-fontsize-10px'>
                                    c. Are you a solo parent?
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black', flex: 1, paddingTop: '0rem', paddingLeft: '1rem' }} colSpan={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[9].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[9].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[9].specify && _34_40[9].value === 1 ? _34_40[9].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[10].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[10].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[10]?.value === 1 && _34_40[10].specify ? _34_40[10].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 && _34_40[11].value === 1 ? true : false} />
                                <Typography className='pds-fontsize-10px'>YES</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <input type="checkbox" style={{ accentColor: '#808080' }} defaultChecked={false} checked={_34_40.length > 0 ? _34_40[11].value === 0 ? true : false : true} />
                                <Typography className='pds-fontsize-10px'>NO</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography className='pds-fontsize-10px'>if YES, give details: </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 10 }}>
                                <Typography className='pds-fontsize-10px' ><u>{_34_40.length > 0 && _34_40[11]?.value === 1  && _34_40[11].specify ? _34_40[11].specify : (<>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>)}</u></Typography>
                            </Box>
                        </Box>
                    </Box>
                </td>
            </tr>
        </>
    )
}

export default React.memo(Others_34_40)