import React,{useState,memo, useEffect} from 'react';
import {Grid,Typography,Button,TextField,TableContainer,Table,TableHead,TableRow,TableCell,TableBody } from '@mui/material'
import file from '../../../.././assets/test/test.xlsx';
// import fsp from 'fs/promises'
//import fs from 'fs'
import { Workbook } from 'exceljs';
import { saveAs } from "file-saver";
// import "tachyons";
import ImageSearchForm from './components/imagesearchform/ImageSearchForm';
import FaceDetect from './components/facedetect/FaceDetect';
// Import Clarifai into our App
import Clarifai from "clarifai";
import readXlsxFile from 'read-excel-file';
import Address from '../../../.././address.json';
import { postRegionName } from './TestRequest';
import Swal from 'sweetalert2';
import Signals from './components/signals/Signals';

//Can read xlsx and xls file
import XLSX from "xlsx";
import { readExcelFiles } from '../../customprocessdata/CustomProcessData';
import { Billing } from '../../palms/payroll/billing/Billing';

const TestExcel = memo(()=>{
    useEffect( ()=>{
        /**
         * Two Sum
         */
        function twoSum(arr,target){
            let i = 0;
            let indexes = [];
            for(i;i<arr.length;i++){
                for(let x=0;x<arr.length;x++){
                    for(let y=0;y<arr.length;y++){
                        if(i!==x && i!==y && x!==y){
                            if(arr[i]+arr[x]+arr[y] === target){
                                indexes.push([i,x,y])
                            }
                        }
                        
                    }
                }
            }
            console.log(indexes)
        }
        /**
         * Three Sum
         */
        function threeSum(){
            let i = 0;
            let indexes = [];
            for(i;i<arr.length;i++){
                for(let x=0;x<arr.length;x++){
                    if(i!==x){
                        if(arr[i]+arr[x] === target){
                            indexes.push([i,x])
                        }
                    }
                }
            }
            console.log(indexes)
        }
        
        let arr = [1,2,3,4,5];
        let target = 6;
        twoSum(arr,target)
        threeSum(arr,target)
    },[])
    
    const readXlsx = (obj)=> {
      if (!obj.target.files) {
        return;
      }
      const f = obj.target.files[0];
      const workbook = new Workbook();
      var fileReader = new FileReader();
      fileReader.onload = (e) => {
        const buffer = e.target.result;
        workbook.xlsx.load(buffer).then(async (wb)=> {
          console.log("readFile success");
        //   downloadFile(wb, 'abcd.xlsx')
        }).catch((error)=> {
          console.log("readFile fail", error);
        })
      };
      fileReader.readAsArrayBuffer(f);
    }
    const generatorXlsx = () =>{
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("sheet 1");
      worksheet.addRow(["a", "b", "c"]);

      // download the file
      downloadFile(workbook, 'abc.xlsx')
    }
    const downloadFile = (wb, fileName) =>{
       wb.xlsx
        .writeBuffer()
        .then(buffer => {
          const blob = new Blob([buffer]);
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            console.log("writeFile ok");
            saveAs(blob, fileName);
          }
        })
        .catch(err => {
          console.log("writeFile Fail");
        });
    }
    useEffect(()=>{
        // console.log(Address)
        // console.log(Object.keys(Address))
        
    },[])
    const handleRegion = ()=>{
        console.log(Address['01'])
        var region_id = Object.keys(Address);
        var reg = [];
        region_id.forEach(el=>{
            /**
            Get province
             */
            var province = Object.keys(Address[el].province_list);
            var prov = [];
            province.forEach(el2=>{
                /**
                Get municipality or city
                */
                var muni_city = Object.keys(Address[el].province_list[el2].municipality_list);
                var mc = [];

                muni_city.forEach(el3=>{
                    /**
                    Get brgy.
                    */
                    var brgy = Address[el].province_list[el2].municipality_list[el3].barangay_list;
                    var b = [];

                    brgy.forEach(el4=>{
                        b.push(el4)
                    })
                    mc.push({
                        muni_city_name:el3,
                        brgy:b
                    })
                })
                prov.push({
                    province_name:el2,
                    muni_city:mc
                })
            })
            reg.push({
                region_id:el,
                region_name:Address[el].region_name,
                province:prov
            })
        })
        console.log(reg)
        var t_data = {
            data:reg
        }
        postRegionName(t_data)
        .then(res=>{
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const [data,setData] = useState([])
    const [totalWinners,setTotalWinners] = useState(0)
    const handleReadFile = async (e)=>{
        const res = await readExcelFiles(e.target.files[0]);
        console.log(res)
        // var reader = new FileReader();

        // reader.readAsArrayBuffer(e.target.files[0]);
        // reader.onload = function(e){

        // var data = new Uint8Array(reader.result);

        // var work_book = XLSX.read(data, {type:'array'});

        // var sheet_name = work_book.SheetNames;

        // var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1});
        // return sheet_data;
        // setData(sheet_data)
        // }
        // console.log(reader)

        // readXlsxFile(e.target.files[0])
        // .then((rows)=>{
        //     console.log(rows)
        //     var new_data = [];
        //     rows.forEach((el,key)=>{
        //         if(key!==0){
        //             new_data.push({
        //                 name:el[0],
        //                 age:el[1],
        //                 location:el[2]
        //             })
        //         }
        //     })
        //     console.log(new_data)
        //     // var t_data = rows
        //     setData(new_data)
        // })
    }
    const [selectedRandom,setSelectedRandom] = useState([])
    const [randomName,setRandomName] = useState('')
    const handleStart = ()=>{
        var randomInterval = setInterval(function () {
            setRandomName(getRandomName())
        }, 500);
        setTimeout( function(){
            var i = 0;
            /**
            Get random number
            */
            var temp = [...selectedRandom];
            for(i;i<totalWinners;){
                var return_val = getRandom(temp);
                if(typeof return_val !== 'function'){
                    temp.push(data[return_val])
                    i++;
                }
            }
            setSelectedRandom(temp)
            setRandomName('')
            clearInterval(randomInterval)
        },5000)
        

    }
    const getRandomName = () =>{
        var index = Math.floor(Math.random() * data.length);
        return data[index].name
    }
    const getRandom = (temp) =>{
        var index = Math.floor(Math.random() * data.length);
        if(notExist(index,temp)){
            return index;
        }else{
            return getRandom(temp);
        }
    }
    const notExist = (index,temp) => {
        /**
        Check if already selected
         */
        
        var exist = temp.filter((el)=>{
            return el.name === data[index].name
        })
        if(exist.length === 0){
            return true;
        }else{
            return false;
        }
    }
    const handleClear = () =>{
        setSelectedRandom([])
    }
    return (
        <>
        <Billing/>
         {/* <Grid container spacing={1}> */}
            {/* <Grid item xs={12}>
                <Typography>Test Module</Typography>
                {JSON.stringify(data)}
            </Grid> */}
            {/* <Grid item xs={12}> */}
                {/* <Button variant='contained' color='primary' onClick={handleRegion}>Add Region</Button> */}
              {/* <ImageSearchForm
                onInputChange={onInputChange}
                onSubmit={onSubmit}
              /> */}
            {/* <FaceDetect/> */}
                 {/* <TextField type='file' label='Upload file' onChange={handleReadFile}/> */}
                 {/*
                <TextField label = 'Total' type='number' value = {totalWinners} onChange ={(val)=>setTotalWinners(val.target.value)}/>
                <Button variant='contained' onClick={handleStart}>Start</Button>
                <Button variant='contained' onClick={handleClear}>Clear</Button>
            </Grid>
            <Grid item xs={12}>
                {
                    data.length>0
                    ?
                    <TableContainer>
                        <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    Age
                                </TableCell>
                                <TableCell>
                                    Location
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map((item,key)=>
                                        <TableRow key={key}>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.age}
                                            </TableCell>
                                            <TableCell>
                                                {item.location}
                                            </TableCell>
                                        </TableRow>
                                    
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    null
                }
                {
                    selectedRandom.map((item,key)=>
                        <Typography key = {key}>{item.name}</Typography>
                    )
                }
                <Typography>{randomName}</Typography>
            </Grid> */}
        {/* </Grid> */}
        </>
    )
})
export default TestExcel;