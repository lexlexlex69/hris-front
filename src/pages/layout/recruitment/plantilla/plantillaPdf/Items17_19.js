import React from 'react';
import Typography from '@mui/material/Typography'



const Items17_19 = ({ data }) => {
    return (
        <>
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial">
                        CONTACTS/ CLIENTS/ STAKEHOLDERS
                    </Typography>
                </td>
            </tr>
            {/*  */}
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td>
                    <Typography className='font-12px' color="initial">
                        17.a Internal
                    </Typography>
                </td>
                <td>
                    <Typography className='font-12px' color="initial">
                        Occasional
                    </Typography>
                </td>
                <td>
                    <Typography className='font-12px' color="initial">
                        Frequent
                    </Typography>
                </td>
                <td>
                    <Typography className='font-12px' color="initial">
                        17b. External
                    </Typography>
                </td>
                <td>
                    <Typography className='font-12px' color="initial">
                        Occasional
                    </Typography>
                </td>
                <td>
                    <Typography className='font-12px' color="initial">
                        Frequent
                    </Typography>
                </td>
            </tr>
            {/*  */}
            {/*  */}
            <tr className='pdf-print-no-items-17'>
                <td width='30%' style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        Excecutive/Managerial
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <input type='checkbox' className='checboxes' checked={data.internal_executive === 1 || data.internal_executive === 3}></input>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <input type='checkbox' className='checboxes' checked={data.internal_executive === 2 || data.internal_executive === 3}></input>
                </td>
                <td width='30%' style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        General Public
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <input type='checkbox' className='checboxes' checked={data.external_gen_public === 1 || data.external_gen_public === 3}></input>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <input type='checkbox' className='checboxes' checked={data.external_gen_public === 2 || data.external_gen_public === 3}></input>
                </td>
            </tr>
            <tr className='pdf-print-no-items-17'>
                <td width='30%' style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        Supervisors
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        <input type='checkbox' className='checboxes' checked={data.internal_supervisor === 1 || data.internal_supervisor === 3} ></input>
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='font-12px' color="initial">
                            <input type='checkbox' className='checboxes' checked={data.internal_supervisor === 2 || data.internal_supervisor === 3}></input>
                        </Typography>
                    </div>
                </td>
                <td width='30%' style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        Other Agencies
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        <input type='checkbox' className='checboxes' checked={data.external_other_agency === 1 || data.external_other_agency === 3}></input>
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        <input type='checkbox' className='checboxes' checked={data.external_other_agency === 2 || data.external_other_agency === 3}></input>
                    </Typography>
                </td>
            </tr>
            <tr className='pdf-print-no-items-17'>
                <td width='30%' style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        Non-Supervisors
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        <input type='checkbox' className='checboxes' checked={data.internal_non_supervisor === 1 || data.internal_non_supervisor === 3}></input>
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        <input type='checkbox' className='checboxes' checked={data.internal_non_supervisor === 2 || data.internal_non_supervisor === 3}></input>
                    </Typography>
                </td>
                <td width='30%' colSpan={3} rowSpan={2} style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        Others (Please Specify)
                    </Typography>
                </td>
            </tr>
            <tr className='pdf-print-no-items-17'>
                <td width='30%' style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        Staff
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        <input type='checkbox' className='checboxes' checked={data.internal_staff === 1 || data.internal_staff === 3}></input>
                    </Typography>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">
                        <input type='checkbox' className='checboxes' checked={data.internal_staff === 2 || data.internal_staff === 3}></input>
                    </Typography>
                </td>
            </tr>
            {/*  */}
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial">18. WORKING CONDITION</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={1}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='font-12px' color="initial">
                            Office Work
                        </Typography>
                        <Typography className='font-12px' color="initial">
                            Field Work
                        </Typography>
                    </div>
                </td>
                <td colSpan={1}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='font-12px' color="initial">
                            <input type='checkbox' className='checboxes' checked={data.work_office === 1 || data.work_office === 3}></input>
                        </Typography>
                        <Typography className='font-12px' color="initial">
                            <input type='checkbox' className='checboxes' checked={data.work_field === 1 || data.work_field === 3}></input>
                        </Typography>
                    </div>
                </td>
                <td colSpan={1}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography className='font-12px' color="initial">
                            <input type='checkbox' className='checboxes' checked={data.work_office === 2 || data.work_office === 3}></input>
                        </Typography>
                        <Typography className='font-12px' color="initial">
                            <input type='checkbox' className='checboxes' checked={data.work_field === 2 || data.work_field === 3}></input>
                        </Typography>
                    </div>
                </td>
                <td colSpan={3} style={{ verticalAlign: 'top' }}>
                    <Typography className='font-12px' color="initial">Other/s (Please specify)</Typography>
                    <br />
                    <Typography className='font-12px' color="initial">{data.work_others}</Typography>
                </td>
            </tr>
            {/*  */}
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial">19. BRIEF DESCRIPTION OF THE GENERAL FUNCTION OF THE UNIT OR SECTION</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial">{data.desc_unit_section ? data.desc_unit_section : <>&nbsp;</>}</Typography>
                </td>
            </tr>
        </>
    );
};

export default Items17_19;