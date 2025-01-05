import { Grid, Typography } from '@mui/material';
import React,{useEffect, useState} from 'react';
import { ReactGoogleChartEvent, Chart } from "react-google-charts";
import moment from 'moment';
export default function LeaveDetailsModal(props){
    const [data,setData] = useState([]);
    const options = {
        title: "Leave Applications",
        chartArea: { width: "50%" },
        hAxis: {
          title: "Total Application",
          minValue: 0,
        },
        vAxis: {
          title: "Date",
          minValue: 0,

        },
        animation: {
            startup: true,
            easing: "linear",
            duration: 1000,
          },
      };
    useEffect(()=>{
        console.log(props.data)
        var temp = [
            ["Status"],
            [moment(props.from_date).format('MM-DD-YYYY')+' - '+moment(props.to_date).format('MM-DD-YYYY')]
        ]
        props.data.chart_data.forEach(el=>{
            temp[0].push(el.status);
            temp[1].push(el.total);
        })
        setData(temp)
    },[])
    return(
        <Grid container>
            <Grid item xs={12}>
                <Chart
                    chartType="BarChart"
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            </Grid>
        </Grid>
    )
}