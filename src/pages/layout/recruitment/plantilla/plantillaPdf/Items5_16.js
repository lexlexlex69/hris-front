import React from 'react';
import Typography from '@mui/material/Typography'

const Items5_16 = ({ data }) => {
    return (
        <>
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td width='50%' colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>5. DEPARTMENT, CORPORATION OR AGENCY/ LOCAL GOVERNMENT</Typography>
                </td>
                <td colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>6. BUREAU OR OFFICE</Typography>
                </td>
            </tr>
            <tr >
                <td colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>{data.agency_name}</Typography>
                </td>
                <td colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>{data.dept_title ? data.dept_title : <>&nbsp;</>}</Typography>
                </td>
            </tr>
            {/*  */}
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td width='50%' colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>7. DEPARTMENT / BRANCH / DIVISION</Typography>
                </td>
                <td colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>8. WORKSTATION / PLACE OF WORK</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>{data.dept_branch ? data.dept_branch : <>&nbsp;</>}</Typography>
                </td>
                <td colSpan={3}>
                    <Typography variant="p" color="initial" className='font-12px'>{data.place_of_work ? data.place_of_work : <>&nbsp;</>}</Typography>
                </td>
            </tr>
            {/*  */}
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td colSpan={1}>
                    <Typography className='font-12px' color="initial">9. PRESENT APPROP ACT</Typography>
                </td>
                <td colSpan={2}>
                    <Typography className='font-12px' color="initial">10. PREVIOUS APPROP ACT</Typography>
                </td>
                <td colSpan={1}>
                    <Typography className='font-12px' color="initial">11. SALARY AUTHORIZED</Typography>
                </td>
                <td colSpan={2}>
                    <Typography className='font-12px' color="initial">12. OTHER COMPENSATION</Typography>
                </td>
            </tr>
            {/*  */}
            <tr className='pdf-printing-no-border'>
                <td colSpan={1}>
                    <Typography className='font-12px' color="initial">{data.present_appro_act}</Typography>
                </td>
                <td colSpan={2}>
                    <Typography className='font-12px'color="initial">{data.previous_appro_act} </Typography>
                </td>
                <td colSpan={1}>
                    <Typography className='font-12px' color="initial">{data.monthly_salary}</Typography>
                </td>
                <td colSpan={2}>
                    <Typography variant="p" color="initial">{data.other_compensation ? data.other_compensation : <>&nbsp;</>}</Typography>
                </td>
            </tr>
            {/*  */}
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td colSpan={3}>
                    <Typography className='font-12px'color="initial">13. POSITION TITLE OF IMMEDIATE SUPERVISOR</Typography>
                </td>
                <td colSpan={3}>
                    <Typography className='font-12px' color="initial">14. POSITION TITLE OF NEXT HIGHER SUPERVISOR</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <Typography className='font-12px' color="initial">{data.immediate_visor ? data.immediate_visor : <>&nbsp;</>}</Typography>
                </td>
                <td colSpan={3}>
                    <Typography className='font-12px' color="initial">{data.next_higher_visor ? data.next_higher_visor : <>&nbsp;</>}</Typography>
                </td>
            </tr>
            {/*  */}
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial">15 POSITION TITLE, AND ITEM OF THOSE DIRECTLY SUPERVISED</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial" align="center">(if more than seven (7) list only by their item numbers and titles)</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <Typography className='font-12px' color="initial">POSITION TITLE</Typography>
                </td>
                <td colSpan={3}>
                    <Typography className='font-12px' color="initial">ITEM NUMBER</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <Typography className='font-12px' color="initial">{data.supervised_positions ? data.supervised_positions : <>&nbsp;</>}</Typography>
                </td>
                <td colSpan={3}>
                    <Typography className='font-12px' color="initial">{data.supervised_item_no ? data.supervised_item_no : <>&nbsp;</>}</Typography>
                </td>
            </tr>
            <tr style={{ backgroundColor: '#BEBEBE' }}>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial">MACHINE, EQUIPMENT, TOOLS, ETC., USED REGULARLY IN PERFORMANCE OF WORK</Typography>
                </td>
            </tr>
            <tr>
                <td colSpan={6}>
                    <Typography className='font-12px' color="initial">{data.machine_equipment ? data.machine_equipment : <>&nbsp;</>}</Typography>
                </td>
            </tr>

        </>
    );
};

export default Items5_16;