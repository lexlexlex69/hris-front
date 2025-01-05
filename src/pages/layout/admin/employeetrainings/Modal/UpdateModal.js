import React,{useEffect, useState} from 'react';
import {Grid,TextField,Autocomplete,Button} from '@mui/material';
import { getMetatags, updateEmployeeMetatags } from '../EmployeeTrainingsRequest';
import Swal from 'sweetalert2';
export default function UpdateModal(props){
    const [metaTags,setMetaTags] = useState([])
    const [metaTagsData,setMetaTagsData] = useState([])
    useEffect(()=>{
        if(props.selectedEmp.meta_tags){
            var t_meta_tags = props.selectedEmp.meta_tags.split(',')
            var t_meta_tags_arr = [];
            getMetatags()
            .then(res=>{
                // console.log(res.data)
                setMetaTagsData(res.data)
                res.data.forEach(el => {
                    if(t_meta_tags.includes(el.meta_name)){
                        t_meta_tags_arr.push(el)
                    }
                });
                console.log(t_meta_tags_arr)
                setMetaTags(t_meta_tags_arr)
            }).catch(err=>{
                console.log(err)
            })
        }else{
            var t_meta_tags_arr = [];
            getMetatags()
            .then(res=>{
                setMetaTagsData(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }
        
    },[])
    const saveUpdate = ()=>{
        Swal.fire({
        icon:'info',
        title: 'Do you want to save the changes?',
        showCancelButton: true,
        confirmButtonText: 'Save',
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon:'info',
                title:'Updating meta tags',
                html:'Please wait...',
                allowEscapeKey:false,
                allowOutsideClick:false
            })
            Swal.showLoading();
            var t_meta_tags = '';
            var t_length = metaTags.length;
            var i = 0;
            for(i;i<t_length;i++){
                if(i === 0){
                    t_meta_tags+= metaTags[i].meta_name;
                }else{
                    t_meta_tags+=','+metaTags[i].meta_name;
                }
            }
            
            var data2 = {
                meta_tags:t_meta_tags,
                employee_id:props.selectedEmp.id
            }
            updateEmployeeMetatags(data2)
            .then(res=>{
                console.log(res.data)
                if(res.data.status === 200){
                    props.handleUpdateMetatags()
                    props.close();
                    Swal.fire({
                        icon:'success',
                        title:res.data.message,
                        timer:1500,
                        showConfirmButton:false,
                    })
                }else{
                    Swal.fire({
                        icon:'error',
                        title:res.data.message
                    })
                }
            }).catch(err=>{
                Swal.close();
                console.log(err)
            })
        }
        })
        
    }
    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Autocomplete
                    disablePortal
                    id="metatags-box"
                    options={metaTagsData}
                    getOptionLabel={(option) => option.meta_name}
                    // isOptionEqualToValue={(option, value) => option.perm_menu_id === value.perm_menu_id}
                    value={metaTags}
                    onChange={(event, newValue) => {
                        setMetaTags(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Meta Tags *"/>
                    )}
                    multiple
                    disableCloseOnSelect
                />
            </Grid>
            <Grid item xs={12} sx={{display:'flex',justifyContent:'flex-end'}}>
                <Button variant='contained' color='success' className='custom-roundbutton' disabled={metaTags.length === 0 ?true:false}onClick = {saveUpdate}>Save update</Button>
            </Grid>
        </Grid>
    )
}