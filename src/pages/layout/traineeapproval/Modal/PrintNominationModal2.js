import React, {useEffect, useState} from 'react';
import LetterHead from '../../forms/letterhead/LetterHead';
import NominationForm from '../../forms/nominationform/NominationForm';
import { Grid } from '@mui/material';
import './Custom.css';

export const PrintNominationFormModal = React.forwardRef((props,ref)=>{
    const [data,setData] = useState(props.data)
    useEffect(()=>{
        // var t  = props.data.filter((el)=>{
        //     return el.dept_approved === 1
        // })
        // setData(t)
        console.log(props.selectedTraining.training_details[0])
    },[props.data])
    return (
        <React.Fragment>
            <div id = 'nomination-form' ref={ref}>
            {
                data.map((row,key)=>
                    <Grid container key={key} className={key%2===0?'print-form1':'print-form'}>
                        <LetterHead/>
                        <NominationForm data = {row} trainingDetails = {props.selectedTraining.training_details[0]} deptHead={props.deptHead} preferences = {row.preferences}/>
                            
                        <Grid item xs={12}>
                            <hr/>
                        </Grid>
                    </Grid>
                )
            }
            </div>
        </React.Fragment>
    )
})

export default PrintNominationFormModal