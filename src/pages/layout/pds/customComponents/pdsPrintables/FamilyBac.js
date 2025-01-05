import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import moment from 'moment';

function FamilyBac({ family, children }) {

    return (
        <>
            <tr style={{ backgroundColor: 'gray', height: '20px', fontSize: '12px', border: '1px solid black' }}>
                <td style={{ color: '#fff', paddingLeft: '2px' }} colSpan={8}>II. FAMILY BACKGROUND</td>
            </tr>
            <tr sx={{ height: '20px', border: '1px solid black' }}>
                <td rowSpan={3} style={{ paddingLeft: '2px', border: '1px solid black', width: '10%',backgroundColor:'#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            <Typography className='pds-fontsize-8px' >
                                22.
                            </Typography>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography className='pds-fontsize-8px' >
                                    SPOUSE'S SURNAME
                                </Typography>
                                <Typography className='pds-fontsize-8px' >
                                    FIRST NAME
                                </Typography>
                                <Typography className='pds-fontsize-8px' >
                                    MIDDLE NAME
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2} >
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>
                            {family.spouse_surname ? family.spouse_surname?.toUpperCase() : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                    <Typography sx={{fontSize:'9px'}} align="center" >
                        NAME OF CHILDREN (write in fullname and list all)
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black',width:'12%' }} colSpan={3}>
                    <Typography sx={{fontSize:'9px'}} align="center" >
                        DATE OF BIRTH (mm/dd/yyyyy)
                    </Typography>
                </td>
            </tr>
            <tr style={{ paddingLeft: '2px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} >
                    <Typography className='pds-fontsize-10px' align="left">
                        <b>
                            {family.spouse_fname ? family.spouse_fname?.toUpperCase() : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }} >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{fontSize:'6px'}} align="center" >
                            NAME EXTENSION (JR.,SR.)
                        </Typography>
                        <Typography className='pds-fontsize-10px' align="left" sx={{ mt: -.2 }} >
                            <b>{family.spouse_extn ? family.spouse_extn?.toUpperCase() : 'N/A'}</b>
                        </Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[0] && children[0].child_name ? children[0].child_name.toUpperCase() : 'N/A'}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[0] && children[0].dob ? moment(children[0].dob).format('MM/DD/YYYY') : 'N/A'}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2}>
                    <Typography className='pds-fontsize-10px' align="left">
                        <b>
                            {family.spouse_mname ? family.spouse_mname?.toUpperCase() : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[1] && children[1].child_name ? children[1].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[1] && children[1].dob ? moment(children[1].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            {/* occupation start */}
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }} >
                    <Typography className='pds-fontsize-8px'>
                        OCCUPATION
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2} >
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>
                            {family.occupation ? family.occupation?.toUpperCase() : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[2] && children[2].child_name ? children[2].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[2] && children[2].dob ? moment(children[2].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }}>
                    <Typography className='pds-fontsize-8px'>
                        EMPLOYER/BUSINESS NAME
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2} >
                <Typography className={family.employeer_name && family.employeer_name?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'left' }}><b>{family.employeer_name ? family.employeer_name?.toUpperCase() : 'N/A'}</b></Typography>
                    {/* <Typography className='pds-fontsize-10px' sx={{ textAlign: 'center' }}>
                        <b>
                            {family.employeer_name ? family.employeer_name.toUpperCase() : 'N/A'}
                        </b>
                    </Typography> */}
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[3] && children[3].child_name ? children[3].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[3] && children[3].dob ? moment(children[3].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }}>
                    <Typography className='pds-fontsize-8px'>
                        BUSINESS ADDRESS
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2} >
                <Typography className={family.emp_address && family.emp_address?.length > 30 ? `pds-fontsize-long-text2 pds-print-no-pl-m` : `pds-fontsize-10px`} sx={{ textAlign: 'left' }}><b>{family.emp_address ? family.emp_address?.toUpperCase() : 'N/A'}</b></Typography>

                    {/* <Typography className='pds-fontsize-10px' sx={{ textAlign: 'center' }}>
                        <b>
                            {family.emp_address ? family.emp_address.toUpperCase() : 'N/A'}
                        </b>
                    </Typography> */}
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[4] && children[4].child_name ? children[4].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[4] && children[4].dob ?moment(children[4].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }}>
                    <Typography className='pds-fontsize-8px'>
                        TELEPHONE NO.
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2} >
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>
                            {family.tel_no ? family.tel_no : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[5] && children[5].child_name ? children[5].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[5] && children[5].dob ? moment(children[5].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            {/* fathers */}
            <tr sx={{ height: '20px', border: '1px solid black' }}>
                <td rowSpan={3} style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            <Typography className='pds-fontsize-8px' >
                                22.
                            </Typography>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography className='pds-fontsize-8px' >
                                    FATHER'S SURNAME
                                </Typography>
                                <Typography className='pds-fontsize-8px' >
                                    FIRST NAME
                                </Typography>
                                <Typography className='pds-fontsize-8px' >
                                    MIDDLE NAME
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2} >
                    <Typography className="pds-fontsize-10px" sx={{ textAlign: 'left' }}>
                        <b>
                            {family.father_surname ? family.father_surname?.toUpperCase() : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[6] && children[6].child_name ? children[6].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[6] && children[6].dob ? moment(children[6].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            <tr style={{ paddingLeft: '2px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} width="25%" >
                    <Typography className='pds-fontsize-10px' sx={{ textAlign: 'left' }}>
                        <b>
                            {family.father_fname ? family.father_fname?.toUpperCase() : 'N/A'}
                        </b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }} >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{fontSize:'6px'}} align="center" >
                            NAME EXTENSION (JR.,SR.)
                        </Typography>
                        <Typography className='pds-fontsize-10px' align="left" sx={{ mt: -.2 }} >
                            <b>{family.father_extn ? family.father_extn?.toUpperCase() : 'N/A'}</b>
                        </Typography>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[7] && children[7].child_name ? children[7].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[7] && children[7].dob ? moment(children[7].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2}>
                    <Typography className='pds-fontsize-10px' align="left">
                        <b>{family.father_mname ? family.father_mname?.toUpperCase() : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[8] && children[8].child_name ? children[8].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[8] && children[8].dob ? moment(children[8].dob).format('MM/DD/YYYY') : ''}
                    </Typography>
                </td>
            </tr>
            {/* mothers start */}
            <tr sx={{ height: '20px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }} rowSpan={4}>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ mr: 1 }}>
                            <Typography className='pds-fontsize-8px' >
                                22.
                            </Typography>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Typography className='pds-fontsize-8px' >
                                    MOTHER'S MAIDEN NAME
                                </Typography>
                                <Typography className='pds-fontsize-8px' >
                                    SURNAME
                                </Typography>
                                <Typography className='pds-fontsize-8px' >
                                    FIRSTNAME
                                </Typography>
                                <Typography className='pds-fontsize-8px' >
                                    MIDDLE NAME
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }} colSpan={2} >
                    <Typography className='pds-fontsize-10px' align='left' >
                        <b>{family.mother_maiden ? family.mother_maiden?.toUpperCase() : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[9] && children[9].child_name ? children[9].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3}>
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[9] && children[9].dob ? children[9].dob : ''}
                    </Typography>
                </td>
            </tr>
            <tr style={{ paddingLeft: '2px', border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2} >
                    <Typography className='pds-fontsize-10px' align='left' >
                        <b>{family.mother_lname ? family.mother_lname?.toUpperCase() : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[10] && children[10].child_name ? children[10].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[10] && children[10].dob ? children[10].dob : ''}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2}>
                    <Typography className='pds-fontsize-10px' align='left' >
                        <b>{family.mother_fname ? family.mother_fname?.toUpperCase() : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[11] && children[11].child_name ? children[11].child_name.toUpperCase() : ''}
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[11] && children[11].dob ? children[11].dob : ''}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ border: '1px solid black' }}>
                <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={2}>
                    <Typography className='pds-fontsize-10px' align='left' >
                        <b>{family.mother_mname ? family.mother_mname?.toUpperCase() : 'N/A'}</b>
                    </Typography>
                </td>
                <td style={{ paddingLeft: '2px', border: '1px solid black',backgroundColor:'#eaeaea' }} colSpan={5} >
                    <Typography className='pds-fontsize-8px' sx={{color:'red'}} align="center">
                        <b>(Continue on separate sheet if necessary)</b>
                    </Typography>
                </td>
                {/* <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                    <Typography className='pds-fontsize-10px' align="center">
                        {children && children[12] && children[12].dob ? children[12].dob : ''}
                    </Typography>
                </td> */}
            </tr>
            {/* {children.length > 12 ? (
                <>
                    <tr sx={{ border: '1px solid black' }}>
                        <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                            <Typography className='pds-fontsize-8px' align="center" >
                                NAME OF CHILDREN (write in fullname and list all)
                            </Typography>
                        </td>
                        <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                            <Typography className='pds-fontsize-8px' align="center" >
                                DATE OF BIRTH
                            </Typography>
                        </td>
                    </tr>
                    {children.map((item, index) => {
                        if (index > 12) {
                            return (
                                <tr sx={{ border: '1px solid black' }} key={index}>
                                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={4}>
                                        <Typography className='pds-fontsize-8px' align="center" >
                                            {item.child_name}
                                        </Typography>
                                    </td>
                                    <td style={{ paddingLeft: '2px', border: '1px solid black' }} colSpan={3} >
                                        <Typography className='pds-fontsize-8px' align="center" >
                                            {item.dob}
                                        </Typography>
                                    </td>
                                </tr>

                            )
                        }
                    })}
                </>
            ) : null
            } */}
        </>
    )
}

export default React.memo(FamilyBac)