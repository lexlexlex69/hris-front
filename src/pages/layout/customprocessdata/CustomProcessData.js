import Swal from "sweetalert2";
import { convertTo64 } from "../selfserviceportal/onlinedtr/convertfile/ConvertFile";
import moment from "moment";
import { timeDiff } from "../timediff/TimeDiff";
//Can read xlsx and xls file
import XLSX from "xlsx";
import { toast } from "react-toastify";
import { getPayrollGroup } from "../palms/payroll/setuppayroll/SetupPayrollRequests";
import { APILoading } from "../apiresponse/APIResponse";

export function TrainingReplacement(data){
    return data;
}
export function customSetFile(e,fileExtensions){
    var file = e.target.files[0].name;
    var extension = file.split('.').pop();
    // let result;
    // console.log(file)
    if(fileExtensions.includes(extension.toLowerCase())){
        let fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        
        fileReader.onload = (event) => {
            // return fileReader.result
            // setFileData(fileReader.result)
        }
        return fileReader.onload
        // return result;
    }else{
        // setFileData(null);

        Swal.fire({
            icon:'warning',
            title:'Oops...',
            html:'Please upload PDF | DOC | Image file.'
        })
        return null
    }
}
export async function handleMultipleFile(e,fileExtensions,fileUpload){
        var file = e.target.files[0].name;
        var extension = file.split('.').pop();
        if(fileExtensions.includes(extension.toLowerCase())){
            var i = 0;
            var files = [...fileUpload];
            var len = e.target.files.length;

            for(i;i<len;i++){
                var file = e.target.files[i].name;
                var extension = file.split('.').pop();
                var t_filename = file.split('.');
                var f_filename;
                if(t_filename[0].length>10){
                    f_filename = t_filename[0].substring(0,10)+'...'+t_filename[1];
                }else{
                    f_filename = file;
                }
                files.push({
                    data:await convertTo64(e.target.files[i]),
                    filename:f_filename
                });
            }
            return files
        }else{
            Swal.fire({
                icon:'warning',
                title:'Oops...',
                html:'File not accepted'
            })
            return []
        }
        
}
export const convertFileTo64 = (file,fileExtensions) => { // converter for file to base 64 string
    var t_file = file.name;

    var extension = t_file.split('.').pop();
    if(fileExtensions.includes(extension.toLowerCase())){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = error => reject(error);
        });
    }else{
        Swal.fire({
            icon:'warning',
            title:'Oops...',
            text:'File not accepted !'
        })
        return null;
    }
    
}
export const getTimeLogs = (work_sched,data,date,leave_days,holidays,ob_oft,rectification) => {
    /**
    Get the year of date
    */
    let work_sched_data = work_sched.filter(el=>el.year === parseInt(moment(date).format('YYYY')) || el.year === 0);
    let work_days_sched = JSON.parse(work_sched_data[0].working_days).filter(el=>el.day === moment(date).format('dddd'))
    let rest_days_sched = JSON.parse(work_sched_data[0].rest_days).filter(el=>el.day === moment(date).format('dddd'))
    let dates = data?.filter(el => el.trandate === moment(date).format('YYYY-MM-DD'));

    /**
    if logs is null Check if has leave, ob-oft or rectification 
    */
    var is_leave = checkIsLeave(leave_days,date);
    var is_ob_oft = checkOBOFT(ob_oft,date);
    var is_holiday = checkHolidays(holidays,date);

    if(work_days_sched.length>0){
        if(dates.length>0){
            let time_in = dates.filter(el=>parseInt(el.suffix) === 0);
            let break_out = dates.filter(el=>parseInt(el.suffix) === 2);
            let break_in = dates.filter(el=>parseInt(el.suffix) === 3);
            let time_out = dates.filter(el=>parseInt(el.suffix) === 1);
            
            if(time_in.length>0){
                time_in = {log:time_in.length>0?moment(time_in[0].timein,'HH:mm:ss').format('hh:mm A'):null,type:1};
            }else{
                time_in = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'AM','TIME IN',date);
                
            }
            if(break_out.length>0){
                break_out = {log:break_out.length>0?moment(break_out[break_out.length-1].timein,'HH:mm:ss').format('hh:mm A'):null,type:1};
            }else{
                break_out = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'AM','BREAK OUT',date);
            }

            if(break_in.length>0){
                break_in = {log:break_in.length>0?moment(break_in[0].timein,'HH:mm:ss').format('hh:mm A'):null,type:1};
            }else{
                break_in = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'PM','BREAK IN',date);
               
            }
            if(time_out.length>0){
                time_out = {log:time_out.length>0?moment(time_out[time_out.length-1].timein,'HH:mm:ss').format('hh:mm A'):null,type:1};
            }else{
                time_out = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'PM','TIME OUT',date);
            }
            let schedule = [];
            // let t_late_undertime = computeLate(work_sched,data,date,leave_days,holidays,ob_oft,rectification);
            // let result = {
            //     work_date: date,
            //     time_in:time_in.log?moment(time_in.log,'HH:mm A').format('HH:mma'):'',
            //     half_break:(break_out.log?moment(break_out.log,'HH:mm A').format('HH:mma'):'')+';'+(break_in.log?moment(break_in.log,'HH:mm A').format('HH:mma'):''),
            //     time_out: time_out.log?moment(time_out.log,'HH:mm A').format('HH:mma'):'',
            //     actual_in:time_in.log?moment(time_in.log,'HH:mm A').format('HH:mm'):'' ,
            //     Actual_Break: (break_out.log?moment(break_out.log,'HH:mm A').format('HH:mm'):'')+';'+(break_in.log?moment(break_in.log,'HH:mm A').format('HH:mm'):''),
            //     Actual_Breakin: "",
            //     adjust_break1: "",
            //     adjust_break2: "",
            //     actual_out: time_out.log?moment(time_out.log,'HH:mm A').format('HH:mm'):'',
            //     sched_in: moment(work_days_sched[0].time_in,'HH:mm').format('hh:mma'),
            //     sched_out:moment(work_days_sched[0].time_out,'HH:mm').format('hh:mma'),
            //     "reg_hrs": "0.00",
            //     "absent_day": "0.00",
            //     late_minutes:t_late_undertime.late_minutes,
            //     under_time:t_late_undertime.undertime_minutes,
            //     "ot_minutes": "0.00",
            //     "leave_day": "1.00",
            //     "adjust_in": "",
            //     "adjust_out": "",
            //     "adjust_break_in": "",
            //     "adjust_break_out": "",
            //     "day_type": "2",
            //     "ob-ot-no": "0",
            //     "ob-ot-in": "",
            //     "ob-ot-out": "",
            //     "tran_type": "6",
            //     "remarks": ""
            // }
            return {
                absent:0,
                date:date,
                day_type:1,
                time_in:time_in,
                break_out:break_out,
                break_in:break_in,
                time_out:time_out,
                holiday_period:is_holiday.period,
                leave_period:is_leave.period,
                late_undertime:computeLate(work_sched,data,date,leave_days,holidays,ob_oft,rectification,work_sched_data[0].adjust_sched_min),
                raw_logs:dates
            }
        }else{
            /**
            Day type 1 = regular , 2 = holiday, 3 = leave, 4 = ob-oft , 0 = restday
            */
            var temp_timein = null;
            var temp_breakout = null;
            var temp_breakin = null;
            var temp_timeout = null;
            var temp_undertime = 0;
            var day_type = 1;

            if(is_leave.is_leave){
                day_type = 2;
                if(is_leave.period === 'NONE'){
                    temp_timein = {log:is_leave.leave_name,type:2};
                    temp_breakout = {log:is_leave.leave_name,type:2};
                    temp_breakin = {log:is_leave.leave_name,type:2};
                    temp_timeout = {log:is_leave.leave_name,type:2};
                }else if(is_leave.period === 'AM'){
                    temp_timein = {log:is_leave.leave_name,type:2};
                    temp_breakout = {log:is_leave.leave_name,type:2};
                }else{
                    temp_breakin = {log:is_leave.leave_name,type:2};
                    temp_timeout = {log:is_leave.leave_name,type:2};
                }
            }
            
            if(is_holiday.is_holiday){
                day_type = 3;

                if(is_holiday.period === 'NONE'){
                    temp_timein = {log:is_holiday.holiday_desc,type:3};
                    temp_breakout = {log:is_holiday.holiday_desc,type:3};
                    temp_breakin = {log:is_holiday.holiday_desc,type:3};
                    temp_timeout = {log:is_holiday.holiday_desc,type:3};
                }else if(is_holiday.period === 'AM'){
                    temp_timein = {log:is_holiday.holiday_desc,type:3};
                    temp_breakout = {log:is_holiday.holiday_desc,type:3};
                }else{
                    temp_breakin = {log:is_holiday.holiday_desc,type:3};
                    temp_timeout = {log:is_holiday.holiday_desc,type:3};
                }
            }

            if(is_ob_oft.is_ob_oft){
                day_type = 4;

                if(is_ob_oft.details.time_in){
                    temp_timein = {log:is_ob_oft.details.remarks,type:4};
                }

                if(is_ob_oft.details.break_out){
                    temp_breakout = {log:is_ob_oft.details.remarks,type:4};
                }

                if(is_ob_oft.details.break_in){
                    temp_breakin = {log:is_ob_oft.details.remarks,type:4};
                }

                if(is_ob_oft.details.time_out){
                    temp_timeout = {log:is_ob_oft.details.remarks,type:4};
                }
                
            }

            if(temp_timein || temp_breakout || temp_timein || temp_breakout ){
                if(!temp_timein && !temp_breakout){
                    temp_undertime+=240;
                }
                if(!temp_breakin && !temp_timeout){
                    temp_undertime+=240;
                }
            }
            var absent = !temp_timein&&!temp_breakout&&!temp_breakin&&!temp_timeout?1:0;
            return {
                absent:absent,
                date:date,
                day_type:day_type,
                time_in:temp_timein,
                break_out:temp_breakout,
                break_in:temp_breakin,
                time_out:temp_timeout,
                holiday_period:is_holiday.period,
                leave_period:is_leave.period,
                late_undertime:{
                    day_type:day_type,
                    late:0,
                    late_hours:0,
                    late_minutes:0,
                    undertime:temp_undertime,
                    undertime_hours:0,
                    undertime_late:temp_undertime,
                    undertime_minutes:temp_undertime
                }
            }
        }
    }else{
        if(rest_days_sched.length>0){
            if(dates.length>0){
                let time_in = dates.filter(el=>parseInt(el.suffix) === 0);
                let break_out = dates.filter(el=>parseInt(el.suffix) === 2);
                let break_in = dates.filter(el=>parseInt(el.suffix) === 3);
                let time_out = dates.filter(el=>parseInt(el.suffix) === 1);
                
                if(time_in.length>0){
                    time_in = {log:time_in.length>0?moment(time_in[0].timein,'HH:mm:ss').format('hh:mm A'):null,type:0};
                }else{
                    time_in = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'AM','TIME IN',date);
                    
                }
                if(break_out.length>0){
                    break_out = {log:break_out.length>0?moment(break_out[break_out.length-1].timein,'HH:mm:ss').format('hh:mm A'):null,type:0};
                }else{
                    break_out = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'AM','BREAK OUT',date);
                }

                if(break_in.length>0){
                    break_in = {log:break_in.length>0?moment(break_in[0].timein,'HH:mm:ss').format('hh:mm A'):null,type:0};
                }else{
                    break_in = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'PM','BREAK IN',date);
                
                }
                if(time_out.length>0){
                    time_out = {log:time_out.length>0?moment(time_out[time_out.length-1].timein,'HH:mm:ss').format('hh:mm A'):null,type:0};
                }else{
                    time_out = checkOtherTimeLogs(is_leave,is_ob_oft,is_holiday,rectification,'PM','TIME OUT',date);
                }
                // let schedule = [];
                return {
                    absent:0,
                    date:date,
                    day_type:1,
                    time_in:time_in,
                    break_out:break_out,
                    break_in:break_in,
                    time_out:time_out,
                    holiday_period:is_holiday.period,
                    leave_period:is_leave.period,
                    late_undertime:{
                        day_type:0,
                        late:0,
                        late_hours:0,
                        late_minutes:0,
                        undertime:0,
                        undertime_hours:0,
                        undertime_late:0,
                        undertime_minutes:0
                    },
                    raw_logs:dates
                }
            }else{
                return {
                    absent:0,
                    date:date,
                    day_type:0,
                    time_in:{log:moment(date).format('dddd').toLocaleUpperCase(),type:0},
                    break_out:{log:moment(date).format('dddd').toLocaleUpperCase(),type:0},
                    break_in:{log:moment(date).format('dddd').toLocaleUpperCase(),type:0},
                    time_out:{log:moment(date).format('dddd').toLocaleUpperCase(),type:0},
                    late_undertime:{
                        day_type:0,
                        late:0,
                        late_hours:0,
                        late_minutes:0,
                        undertime:0,
                        undertime_hours:0,
                        undertime_late:0,
                        undertime_minutes:0
                    }
                }
            }
            
        }
    }
    
}
export const checkOtherTimeLogs = (is_leave,is_ob_oft,is_holiday,rectification,period,nature,date) => {
    let text = null;
    let type = 0;
    if(is_leave.is_leave){
        if(period === is_leave.period){
            text =  is_leave.leave_name;
            type = 2;

        }
    }
    if(is_ob_oft.is_ob_oft){
        switch(nature){
            case 'TIME IN':
                if(is_ob_oft.details.time_in){
                    text = is_ob_oft.details.remarks;
                    type = 4;
                }
            break;
            case 'BREAK OUT':
                if(is_ob_oft.details.break_out){
                    text = is_ob_oft.details.remarks
                    type = 4;
                }
            break;
            case 'BREAK IN':
                if(is_ob_oft.details.break_in){
                    text = is_ob_oft.details.remarks
                    type = 4;
                }
            break;
            case 'TIME OUT':
                if(is_ob_oft.details.time_out){
                    text = is_ob_oft.details.remarks
                    type = 4;
                }
            break;
            
        }
    }
    if(is_holiday.is_holiday){
        if(period === is_holiday.period){
            text = is_holiday.holiday_desc;
            type = 3;
        }
    }
    let is_rectification = checkRectification(rectification,date,nature)

    if(is_rectification.is_rectification){
        text = moment(is_rectification.rectified_time,'HH:mm').format('hh:mm A');
        type = 5;
    }

    return {log:text,type:type};
}
export const checkRectification = (rectification,date,nature) =>{
    let check = rectification.filter(el=>moment(el.date,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(date,'YYYY-MM-DD').format('YYYY-MM-DD') && el.nature.toLocaleUpperCase() === nature);

    if(check.length>0){
        return {is_rectification:true,rectified_time:check[0].rectified_time}
    }else{
        return {is_rectification:false,rectified_time:null}
    }
}

export const getTimePunch = (work_sched,data,type,date,leave_days,holidays,ob_oft) =>{
    /**
    Get the year of date
    */
    let work_sched_data = work_sched.filter(el=>el.year === parseInt(moment(date).format('YYYY')) || el.year === 0);

    /**
    
    */
    let work_days_sched = JSON.parse(work_sched_data[0].working_days).filter(el=>el.day === moment(date).format('dddd'))
    let rest_days_sched = JSON.parse(work_sched_data[0].rest_days).filter(el=>el.day === moment(date).format('dddd'))
    let dates = data?.filter(el => el.trandate === moment(date).format('YYYY-MM-DD') && parseInt(el.suffix) === type);
    if(dates.length>0){
        // /**
        // Get the year of date
        // */
        // let work_sched_data = work_sched.filter(el=>el.year === parseInt(moment(date).format('YYYY')));

        // /**
        
        // */
        // let work_days_sched = JSON.parse(work_sched_data[0].working_days).filter(el=>el.day === moment(date).format('dddd'))
        // let rest_days_sched = JSON.parse(work_sched_data[0].rest_days).filter(el=>el.day === moment(date).format('dddd'))
        if(work_days_sched.length>0){
                // let dates = data?.filter(el => el.trandate === moment(date).format('YYYY-MM-DD') && parseInt(el.suffix) === type);

                switch(type){
                    //time in
                    case 0:
                    if(dates.length>0){
                        return moment(dates[0].timein,'HH:mm:ss').format('hh:mm A');
                    }else{
                        return null;
                    }
                    break;
                    //time out
                    case 1:
                    if(dates.length>0){
                        return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                    }else{
                        return null;
                    }
                    break;
                    //break out
                    case 2:
                    if(dates.length>0){
                        return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                    }else{
                        return null;
                    }
                    break;
                    //break in
                    case 3:
                    if(dates.length>0){
                        return moment(dates[0].timein,'HH:mm:ss').format('hh:mm A');
                    }else{
                        return null;
                    }
                    break;
                }
        }else{
            /**
            Check if rest_days
            */
            if(rest_days_sched.length>0){
                // let dates = data?.filter(el => el.trandate === moment(date).format('YYYY-MM-DD') && parseInt(el.suffix) === type);
                if(dates.length>0){
                    switch(type){
                        //time in
                        case 0:
                        if(dates.length>0){
                            return moment(dates[0].timein,'HH:mm:ss').format('hh:mm A');
                        }else{
                            return null;
                        }
                        break;
                        //time out
                        case 1:
                        if(dates.length>0){
                            return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                        }else{
                            return null;
                        }
                        break;
                        //break out
                        case 2:
                        if(dates.length>0){
                            return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                        }else{
                            return null;
                        }
                        break;
                        //break in
                        case 3:
                        if(dates.length>0){
                            return moment(dates[0].timein,'HH:mm:ss').format('hh:mm A');
                        }else{
                            return null;
                        }
                        break;
                    }
                }else{
                return moment(date).format('dddd')

                }
            }
        }
    }else{
        let is_leave = false;
        let leave_name = '';
        let period = 'NONE';
        let with_pay = false;
        leave_days.forEach(el=>{
            var inclusive_dates = JSON.parse(el.inclusive_dates);
            var inclusive_dates_wopay = el.inclusive_dates_without_pay?el.inclusive_dates_without_pay==='null'?[]:JSON.parse(el.inclusive_dates_without_pay):[];
            inclusive_dates.forEach(el2=>{
                if(moment(el2.date,'MM-DD-YYYY').format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')){
                    is_leave = true;
                    with_pay = true;
                    leave_name = el.short_name;
                    period = el2.period;
                }
            })
            inclusive_dates_wopay.forEach(el2=>{
                if(moment(el2.date,'MM-DD-YYYY').format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')){
                    is_leave = true;
                    with_pay = false;
                    leave_name = el.short_name+' W/O Pay';
                    period = el2.period;
                }
            })
        })
        
        if(is_leave){
            if(period === 'NONE'){
                return leave_name;
            }else{
                if(period === 'AM' && (type === 0 || type === 2)){
                    return leave_name;
                }else{
                    if(period === 'PM' && (type === 1 || type === 3)){
                        return leave_name;
                    }else{
                        var is_holiday =  checkHolidays(holidays,date)
                        if(is_holiday.is_holiday){
                            if(is_holiday.period === 'AM' && (type === 0 || type === 2)){
                                return is_holiday.holiday_desc
                            }else{
                                if(is_holiday.period === 'PM' && (type === 1 || type === 3)){
                                    return is_holiday.holiday_desc
                                }else{
                                    return null;
                                }
                            }
                        }else{
                            return null;
                        }
                        // return null;
                    }
                }
            }
        }else{
            var is_holiday =  checkHolidays(holidays,date)
            if(is_holiday.is_holiday){
                if(is_holiday.period === 'AM' && (type === 0 || type === 2)){
                    return is_holiday.holiday_desc
                }else{
                    if(is_holiday.period === 'PM' && (type === 1 || type === 3)){
                        return is_holiday.holiday_desc
                    }else{
                        return null;
                    }
                }
            }else{
                /**
                Check if rest_days
                */
                var is_rest_day = checkRestDays(dates,rest_days_sched,date,type)
                if(is_rest_day){
                    return is_rest_day;
                }else{
                    /**
                    Check if has OB-OFT
                     */
                    var is_ob_oft = checkOBOFT(ob_oft,date)
                    if(is_ob_oft.is_ob_oft){
                        switch(type){
                            case 0:
                                if(is_ob_oft.details.time_in){
                                    return is_ob_oft.details.remarks
                                }else{
                                    return null;
                                }
                            break;
                            case 1:
                                if(is_ob_oft.details.time_out){
                                    return is_ob_oft.details.remarks
                                }else{
                                    return null;
                                }
                            break;
                            case 2:
                                if(is_ob_oft.details.break_out){
                                    return is_ob_oft.details.remarks
                                }else{
                                    return null;
                                }
                            break;
                            case 3:
                                if(is_ob_oft.details.break_in){
                                    return is_ob_oft.details.remarks
                                }else{
                                    return null;
                                }
                            break;
                        }
                    }else{
                        return null;
                    }
                }
            }
            
        }
    }
}
const checkOBOFT = (ob_oft,date) => {
    var is_ob_oft = false;
    var details;
    ob_oft.forEach(el=>{
        var dates = JSON.parse(el.days_details);
        dates.forEach(el2=>{
            if(moment(el2.date,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(date,'YYYY-MM-DD').format('YYYY-MM-DD')){
                is_ob_oft = true;
                details = el2;
            }
        })
    })
    return {is_ob_oft:is_ob_oft,details:details}
}
const checkRestDays = (dates,rest_days_sched,date,type) => {
    /**
    Check if rest_days
    */
    if(rest_days_sched.length>0){
        // let dates = data?.filter(el => el.trandate === moment(date).format('YYYY-MM-DD') && parseInt(el.suffix) === type);
        if(dates.length>0){
            switch(type){
                //time in
                case 0:
                if(dates.length>0){
                    return moment(dates[0].timein,'HH:mm:ss').format('hh:mm A');
                }else{
                    return null;
                }
                break;
                //time out
                case 1:
                if(dates.length>0){
                    return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                }else{
                    return null;
                }
                break;
                //break out
                case 2:
                if(dates.length>0){
                    return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                }else{
                    return null;
                }
                break;
                //break in
                case 3:
                if(dates.length>0){
                    return moment(dates[0].timein,'HH:mm:ss').format('hh:mm A');
                }else{
                    return null;
                }
                break;
            }
        }else{
            return moment(date).format('dddd')
        }
    }else{
        return false;
    }
}
const checkIsLeave = (leave_days,date) => {
    let is_leave = false;
    let leave_name = '';
    let period = 'NONE';
    let with_pay = false;
    leave_days.forEach(el=>{
        var inclusive_dates = JSON.parse(el.inclusive_dates);
        var inclusive_dates_wopay = el.inclusive_dates_without_pay?el.inclusive_dates_without_pay==='null'?[]:JSON.parse(el.inclusive_dates_without_pay):[];
        inclusive_dates.forEach(el2=>{
            if(moment(el2.date,'MM-DD-YYYY').format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')){
                is_leave = true;
                with_pay = true;
                leave_name = el.short_name;
                period = el2.period;
            }
        })
        inclusive_dates_wopay.forEach(el2=>{
            if(moment(el2.date,'MM-DD-YYYY').format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')){
                is_leave = true;
                with_pay = false;
                leave_name = el.short_name+' W/O Pay';
                period = el2.period;
            }
        })
    })
    return {is_leave:is_leave,period:period,leave_name:leave_name};
}
const getLocalTimePunch = (work_sched,data,type,date) =>{
    /**
    Get the year of date
    */
    let work_sched_data = work_sched.filter(el=>el.year === parseInt(moment(date).format('YYYY')) || el.year === 0);

    /**
    
     */
    let work_days_sched = JSON.parse(work_sched_data[0].working_days).filter(el=>el.day === moment(date).format('dddd'))
    let rest_days_sched = JSON.parse(work_sched_data[0].rest_days).filter(el=>el.day === moment(date).format('dddd'))
    if(work_days_sched.length>0){
            let dates = data?.filter(el => el.trandate === moment(date).format('YYYY-MM-DD') && parseInt(el.suffix) === type);

            switch(type){
                //time in
                case 0:
                if(dates.length>0){
                    return moment(dates[0].timein,'HH:mm:ss').format('HH:mm');
                }else{
                    return null;
                }
                break;
                //time out
                case 1:
                if(dates.length>0){
                    return moment(dates[dates.length-1].timein,'HH:mm:ss').format('HH:mm');

                }else{
                    return null;
                }
                break;
                //break out
                case 2:
                if(dates.length>0){
                    return moment(dates[dates.length-1].timein,'HH:mm:ss').format('HH:mm');
                }else{
                    return null;
                }
                break;
                //break in
                case 3:
                if(dates.length>0){
                    return moment(dates[0].timein,'HH:mm:ss').format('HH:mm');
                }else{
                    return null;
                }
                break;
            }
    }else{
        /**
        Check if rest_days
         */
        if(rest_days_sched.length>0){
            let dates = data?.filter(el => el.trandate === moment(date).format('YYYY-MM-DD') && parseInt(el.suffix) === type);
            if(dates.length>0){
                switch(type){
                    //time in
                    case 0:
                    if(dates.length>0){
                        return moment(dates[0].timein,'HH:mm:ss').format('hh:mm');
                    }else{
                        return null;
                    }
                    break;
                    //time out
                    case 1:
                    if(dates.length>0){
                        return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                    }else{
                        return null;
                    }
                    break;
                    //break out
                    case 2:
                    if(dates.length>0){
                        return moment(dates[dates.length-1].timein,'HH:mm:ss').format('hh:mm A');
                    }else{
                        return null;
                    }
                    break;
                    //break in
                    case 3:
                    if(dates.length>0){
                        return moment(dates[0].timein,'HH:mm:ss').format('hh:mm A');
                    }else{
                        return null;
                    }
                    break;
                }
            }else{
                return null
            }
        }
    }
}
export const diffTwotimeMinutes = (time1,time2)=>{
    return parseInt(moment(time1,'HH:mm').diff(moment(time2,'HH:mm'),'minutes'))
}
export const computeProcessLate = (row,data)=>{
    let t_data = data.sort((a,b)=>moment(a.trandate,'HH:mm:ss') - moment(b.trandate,'HH:mm:ss'));


    var time_in_arr = t_data.filter(el=>el.suffix === 0);
    var break_out_arr = t_data.filter(el=>el.suffix === 2);
    var break_in_arr = t_data.filter(el=>el.suffix === 3);
    var time_out_arr = t_data.filter(el=>el.suffix === 1);

    var raw_time_in = time_in_arr.length>0?time_in_arr[0].timein:'';
    var raw_break_out = break_out_arr.length>0?break_out_arr[break_out_arr.length-1].timein:'';
    var raw_break_in = break_in_arr.length>0?break_in_arr[0].timein:'';
    var raw_time_out = time_out_arr.length>0?time_out_arr[time_out_arr.length-1].timein:'';
    // var raw_time_in = '08:00';
    // var raw_break_out = '12:40';
    // var raw_break_in = '13:00';
    // var raw_time_out = '16:50';
    var late = 0;
    var undertime = 0;
    var late_undertime = 0;
    var hours = 0;
    var minutes = 0;
    // return t_data;

    /**
    Get morning late
     */
    /**
    Check if adjust sched min is greater than 0
     */
    if(raw_time_in && raw_break_out){
        if(row.adjust_sched_min>0){
            /**
            Dept Head
            */
            let req_timein = moment(row.sched_time_in,'HH:mm').add(row.adjust_sched_min,'minutes');

            /**
            Check if time in between required time in
            */
            if(moment(raw_time_in,'HH:mm').isAfter(moment(req_timein,'HH:mm'))){
                //late
                minutes = diffTwotimeMinutes(raw_time_in,req_timein);
                late+=minutes;
                late_undertime+=minutes;
            }else{
                if(raw_time_out){
                    if(moment(raw_time_in,'HH:mm').isAfter(moment(row.sched_in,'HH:mm'))){
                        /**
                        set required time out
                        */
                        let req_timeout = moment(raw_time_in,'HH:mm').add(9,'hours');
                        // return moment(req_timeout).format('hh:mm')
                        if(moment(raw_time_out,'HH:mm').isBefore(moment(req_timeout,'HH:mm')) && moment(raw_time_out,'HH:mm').isSameOrAfter(moment(row.sched_time_out,'HH:mm'))){
                            //late
                            var limit = parseInt(moment(raw_time_out,'HH:mm').diff(moment(row.sched_time_out,'HH:mm'),'minutes'));
                            if(limit<=row.adjust_sched_min){
                                minutes = diffTwotimeMinutes(raw_time_in,row.sched_time_in)-parseInt(moment(raw_time_out,'HH:mm').diff(moment(row.sched_time_out,'HH:mm'),'minutes'));
                                late+=minutes;
                                late_undertime+=minutes;
                            }
                            
                        }
                    }
                }else{
                    //late
                    minutes = diffTwotimeMinutes(raw_time_in,row.sched_time_in);
                    late+=minutes;
                    late_undertime+=minutes;
                }
            }
            //morning undertime
            if(moment(raw_break_out,'HH:mm').isBefore(moment(row.sched_break_out,'HH:mm'))){
                minutes = diffTwotimeMinutes(row.sched_break_out,raw_break_out);
                undertime+=minutes;
                late_undertime+=minutes;
            }
        }else{
            if(moment(raw_time_in,'HH:mm').isAfter(moment(row.sched_time_in,'HH:mm'))){
                minutes = diffTwotimeMinutes(raw_time_in,row.sched_time_in);
                late+=minutes;
                late_undertime+=minutes;
            }
            //morning undertime
            if(moment(raw_break_out,'HH:mm').isBefore(moment(row.sched_break_out,'HH:mm'))){
                minutes = diffTwotimeMinutes(row.sched_break_out,raw_break_out);
                undertime+=minutes;
                late_undertime+=minutes;
            }
        }
    }
    //end morning late

    //afternoon late
    if(raw_break_in&&raw_time_out){
        if(moment(raw_break_in,'HH:mm').isAfter(moment(row.sched_break_in,'HH:mm'))){
            minutes = diffTwotimeMinutes(raw_break_in,row.sched_break_in);
            late+=minutes;
            late_undertime+=minutes;
        }
        //afternoon undertime
        if(moment(raw_time_out,'HH:mm').isBefore(moment(row.sched_time_out,'HH:mm'))){
            minutes = diffTwotimeMinutes(row.sched_time_out,raw_time_out);
            undertime+=minutes;
            late_undertime+=minutes;
        }
    }
    //end afternoon late

    

    return {late:late,undertime:undertime,late_undertime:late_undertime};
}
export const computeLate = (work_sched,data,date,leave_days,holidays,ob_oft,rectification,adjust_sched_min) =>{
    var is_holiday = checkHolidays2(holidays,date);
    var is_leave = checkIsLeave(leave_days,date);

    if(is_holiday.is_holiday){
        if(is_holiday.period === 'NONE'){
            var result = {
                late:0,
                late_hours:0,
                late_minutes:0,
                undertime:0,
                undertime_hours:0,
                undertime_minutes:0,
                undertime_late:0,
                day_type:2
            }
            return result;
        }else{
            /**
            Get the year of date
            */
            let work_sched_data = work_sched.filter(el=>el.year === parseInt(moment(date).format('YYYY')) || el.year === 0);

            /**
            
            */
            let work_days_sched = JSON.parse(work_sched_data[0].working_days).filter(el=>el.day === moment(date).format('dddd'))
            // let rest_days_sched = JSON.parse(work_sched_data[0].rest_days).filter(el=>el.day === moment(date).format('dddd'))
            // console.log(rest_days_sched)

            if(work_days_sched.length>0){
                let time_in = work_days_sched[0].time_in;
                let break_out = work_days_sched[0].break_out;
                let break_in = work_days_sched[0].break_in;
                let time_out = work_days_sched[0].time_out;
                let raw_time_in;
                let raw_break_out;
                let raw_break_in;
                let raw_time_out;
                if(is_holiday.period === 'AM'){
                    raw_time_in = time_in;
                    raw_break_out = break_out;
                }
                else{
                    raw_break_in = break_in;
                    raw_time_out = time_out;
                }
                // raw_time_in = getLocalTimePunch(work_sched,data,0,date);

                // raw_time_out = getLocalTimePunch(work_sched,data,1,date);

                // raw_break_out = getLocalTimePunch(work_sched,data,2,date);

                // raw_break_in = getLocalTimePunch(work_sched,data,3,date);

                // console.log(date)

                /**
                * 
                Check if undertime
                */
                let undertime_lates = 0;
                let late_hours = 0;
                let late_minutes = 0;
                let undertime_hours = 0;
                let undertime_minutes = 0;
                /**
                Check ob_oft */
                var is_ob_oft = checkOBOFT(ob_oft,date);
                if(is_ob_oft.is_ob_oft){
                    raw_time_in = time_in;
                    raw_break_out = break_out;
                    raw_break_in = break_in;
                    raw_time_out = time_out;
                }
                if(!raw_time_in && !raw_break_out){
                    if(!is_leave.is_leave){
                        //morning lates
                        if(moment(raw_time_in,'HH:mm').isAfter(moment(time_in,'HH:mm'))){
                            var hours_min = timeDiff(time_in,raw_time_in).split(':')
                            var hours = parseInt(hours_min[0]);
                            var minutes = hours_min[1];

                            late_hours+=parseInt(hours);
                            late_minutes+=parseInt(minutes)+(hours*60);
                            undertime_lates+=parseInt(minutes)+(hours*60);
                        }
                        //morning undertime
                        if(moment(raw_break_out,'HH:mm').isBefore(moment(break_out))){
                            var hours_min = timeDiff(break_out,raw_break_out).split(':')
                            var hours = parseInt(hours_min[0]);
                            var minutes = hours_min[1];

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes)+(hours*60);
                            undertime_lates+=parseInt(minutes)+(hours*60);
                        }
                        if(!raw_time_in || !raw_break_out){
                            var hours_min = timeDiff(time_in,break_out).split(':')
                            var hours = parseInt(hours_min[0]);
                            var minutes = hours_min[1];

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes)+(hours*60);
                            undertime_lates+=parseInt(minutes)+(hours*60);
                        }
                    }else{
                        if(is_leave.period === 'PM' || is_leave === 'NONE'){
                            //morning lates
                            if(moment(raw_time_in,'HH:mm').isAfter(moment(time_in,'HH:mm'))){
                                var hours_min = timeDiff(time_in,raw_time_in).split(':')
                                var hours = parseInt(hours_min[0]);
                                var minutes = hours_min[1];

                                late_hours+=parseInt(hours);
                                late_minutes+=parseInt(minutes)+(hours*60);
                                undertime_lates+=parseInt(minutes)+(hours*60);
                            }
                            //morning undertime
                            if(moment(raw_break_out,'HH:mm').isBefore(moment(break_out))){
                                var hours_min = timeDiff(break_out,raw_break_out).split(':')
                                var hours = parseInt(hours_min[0]);
                                var minutes = hours_min[1];

                                undertime_hours+=parseInt(hours);
                                undertime_minutes+=parseInt(minutes)+(hours*60);
                                undertime_lates+=parseInt(minutes)+(hours*60);
                            }
                            if(!raw_time_in || !raw_break_out){
                                var hours_min = timeDiff(time_in,break_out).split(':')
                                var hours = parseInt(hours_min[0]);
                                var minutes = hours_min[1];

                                undertime_hours+=parseInt(hours);
                                undertime_minutes+=parseInt(minutes)+(hours*60);
                                undertime_lates+=parseInt(minutes)+(hours*60);
                            }
                        }
                        
                    }
                }
                if(!raw_break_in && !raw_time_out){
                    if(!is_leave.is_leave){
                        //afternoon lates
                        if(moment(raw_break_in,'HH:mm').isAfter(moment(break_in,'HH:mm'))){
                            var hours_min = timeDiff(time_in,raw_time_in).split(':')
                            var hours = parseInt(hours_min[0]);
                            var minutes = hours_min[1];

                            late_hours+=parseInt(hours);
                            late_minutes+=parseInt(minutes)+(hours*60);
                            undertime_lates+=parseInt(minutes);
                        }
                        //afternoon undertime
                        if(moment(raw_time_out,'HH:mm').isBefore(moment(time_out))){
                            var hours_min = timeDiff(time_out,raw_time_out).split(':')
                            var hours = parseInt(hours_min[0]);
                            var minutes = hours_min[1];

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }

                        if(!raw_break_in || !raw_time_out){
                            var hours_min = timeDiff(break_in,time_out).split(':')
                            var hours = parseInt(hours_min[0]);
                            var minutes = hours_min[1];

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes)+(hours*60);
                            undertime_lates+=parseInt(minutes)+(hours*60);
                        }
                    }else{
                        if(is_leave.period === 'AM' || is_leave === 'NONE'){
                            //afternoon lates
                            if(moment(raw_break_in,'HH:mm').isAfter(moment(break_in,'HH:mm'))){
                                var hours_min = timeDiff(time_in,raw_time_in).split(':')
                                var hours = parseInt(hours_min[0]);
                                var minutes = hours_min[1];

                                late_hours+=parseInt(hours);
                                late_minutes+=parseInt(minutes)+(hours*60);
                                undertime_lates+=parseInt(minutes);
                            }
                            //afternoon undertime
                            if(moment(raw_time_out,'HH:mm').isBefore(moment(time_out))){
                                var hours_min = timeDiff(time_out,raw_time_out).split(':')
                                var hours = parseInt(hours_min[0]);
                                var minutes = hours_min[1];

                                undertime_hours+=parseInt(hours);
                                undertime_minutes+=parseInt(minutes);
                                undertime_lates+=parseInt(minutes);
                            }

                            if(!raw_break_in || !raw_time_out){
                                var hours_min = timeDiff(break_in,time_out).split(':')
                                var hours = parseInt(hours_min[0]);
                                var minutes = hours_min[1];

                                undertime_hours+=parseInt(hours);
                                undertime_minutes+=parseInt(minutes)+(hours*60);
                                undertime_lates+=parseInt(minutes)+(hours*60);
                            }
                        }
                        
                    }
                    
                }
                var result = {
                    late:late_minutes,
                    late_hours:late_hours,
                    late_minutes:late_minutes,
                    undertime:undertime_minutes,
                    undertime_hours:undertime_hours,
                    undertime_minutes:undertime_minutes,
                    undertime_late:undertime_lates,
                    day_type:1
                }
                return result;
            }else{
                var result = {
                    lates:0,
                    undertime:0,
                    day_type:2
                }
                return result; 
            }
        }
        
    }else{
        /**
        Get the year of date
        */
        let work_sched_data = work_sched.filter(el=>el.year === parseInt(moment(date).format('YYYY')) || el.year === 0);

        /**
        
        */
        let work_days_sched = JSON.parse(work_sched_data[0].working_days).filter(el=>el.day === moment(date).format('dddd'))
        // let rest_days_sched = JSON.parse(work_sched_data[0].rest_days).filter(el=>el.day === moment(date).format('dddd'))
        // console.log(rest_days_sched)

        if(work_days_sched.length>0){
            let time_in = work_days_sched[0].time_in;
            let break_out = work_days_sched[0].break_out;
            let break_in = work_days_sched[0].break_in;
            let time_out = work_days_sched[0].time_out;
            let total_logs = 0;
            let raw_time_in = getLocalTimePunch(work_sched,data,0,date);

            let raw_time_out = getLocalTimePunch(work_sched,data,1,date);

            let raw_break_out = getLocalTimePunch(work_sched,data,2,date);

            let raw_break_in = getLocalTimePunch(work_sched,data,3,date);


            /**
            * 
            Check if undertime
            */
            let undertime_lates = 0;
            let late_hours = 0;
            let late_minutes = 0;
            let undertime_hours = 0;
            let undertime_minutes = 0;
            var is_leave = checkIsLeave(leave_days,date);
             /**
            Check ob_oft */
            var is_ob_oft = checkOBOFT(ob_oft,date);
            if(is_ob_oft.is_ob_oft){
                if(is_ob_oft.details.time_in){
                    raw_time_in = time_in;
                }
                if(is_ob_oft.details.break_out){
                    raw_break_out = break_out;
                }
                if(is_ob_oft.details.break_in){
                    raw_break_in = break_in;
                }
                if(is_ob_oft.details.time_out){
                    raw_time_out = time_out;
                }
                // raw_break_out = break_out;
                // raw_break_in = break_in;
                // raw_time_out = time_out;
            }
            var rec_timein = checkRectification(rectification,date,'TIME IN');
            var rec_breakout = checkRectification(rectification,date,'BREAK OUT');
            var rec_breakin = checkRectification(rectification,date,'BREAK IN');
            var rec_timeout = checkRectification(rectification,date,'TIME OUT');
            if(rec_timein.is_rectification){
                raw_time_in = rec_timein.rectified_time;
            }
            if(rec_breakout.is_rectification){
                raw_break_out = rec_breakout.rectified_time;
            }
            if(rec_breakin.is_rectification){
                raw_break_in = rec_breakin.rectified_time;
            }
            if(rec_timein.is_rectification){
                raw_time_out = rec_timeout.rectified_time;
            }
            if(raw_time_in){
                total_logs+=1;
            }
            if(raw_break_out){
                total_logs+=1;
            }
            if(raw_break_in){
                total_logs+=1;
            }
            if(raw_time_out){
                total_logs+=1;
            }
            var hours;
            var minutes;
            if(!raw_time_in && !raw_break_out){
                if(!is_leave.is_leave){
                    //morning lates
                    if(moment(raw_time_in,'HH:mm').isAfter(moment(time_in,'HH:mm'))){
                        // var hours_min = timeDiff(time_in,raw_time_in).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];
                        hours = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                        minutes = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');

                        late_hours+=parseInt(hours);
                        late_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                    //morning undertime
                    if(moment(raw_break_out,'HH:mm').isBefore(moment(break_out))){
                        // var hours_min = timeDiff(break_out,raw_break_out).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];
                        hours = moment(raw_break_out,'HH:mm').diff(moment(break_out,'HH:mm'),'hours');
                        minutes = moment(raw_break_out,'HH:mm').diff(moment(break_out,'HH:mm'),'minutes');

                        undertime_hours+=parseInt(hours);
                        undertime_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                    if(!raw_time_in || !raw_break_out){
                        // var hours_min = timeDiff(time_in,break_out).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];
                        hours = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                        minutes = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');

                        undertime_hours+=parseInt(hours);
                        undertime_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                }else{
                    if(is_leave.period === 'PM' || is_leave === 'NONE'){
                        //morning lates
                        if(moment(raw_time_in,'HH:mm').isAfter(moment(time_in,'HH:mm'))){
                            // var hours_min = timeDiff(time_in,raw_time_in).split(':')
                            // var hours = parseInt(hours_min[0]);
                            // var minutes = hours_min[1];
                            hours = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                            minutes = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');

                            late_hours+=parseInt(hours);
                            late_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }
                        //morning undertime
                        if(moment(raw_break_out,'HH:mm').isBefore(moment(break_out))){
                            // var hours_min = timeDiff(break_out,raw_break_out).split(':')
                            // var hours = parseInt(hours_min[0]);
                            // var minutes = hours_min[1];
                            hours = moment(raw_break_out,'HH:mm').diff(moment(break_out,'HH:mm'),'hours');
                            minutes = moment(raw_break_out,'HH:mm').diff(moment(break_out,'HH:mm'),'minutes');

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }
                        if(!raw_time_in || !raw_break_out){
                            // var hours_min = timeDiff(time_in,break_out).split(':')
                            // var hours = parseInt(hours_min[0]);
                            // var minutes = hours_min[1];

                            hours = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                            minutes = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }
                    }
                    
                }
            }else{
                /**
                check if has adjust sched min
                 */

                if(adjust_sched_min>0){
                    /**
                    Check if the raw time in is lapse to adjust sched min 
                    */
                    if(moment(raw_time_in,'HH:mm').isAfter(moment(time_in,'HH:mm').add(adjust_sched_min,'minutes'))){
                        hours = moment(raw_time_in,'HH:mm').subtract(adjust_sched_min,'minutes').diff(moment(time_in,'HH:mm'),'hours');
                        minutes = moment(raw_time_in,'HH:mm').subtract(adjust_sched_min,'minutes').diff(moment(time_in,'HH:mm'),'minutes');

                        late_hours+=parseInt(hours);
                        late_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }else{
                        /**
                        Check if time out is required based on time in
                         */
                        var t_out = moment(raw_time_in,'HH:mm').add(9,'hours');
                        //morning lates

                        if(moment(raw_time_out,'HH:mm').isBefore(t_out)){
                            if(moment(raw_time_out,'HH:mm').isAfter(moment(time_out,'HH:mm'))){
                                hours = moment(t_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'hours');
                                minutes = moment(t_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'minutes');
                                late_hours+=parseInt(hours);
                                late_minutes+=parseInt(minutes)+(hours*60);
                                undertime_lates+=parseInt(minutes)+(hours*60);
                            }
                            hours = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                            minutes = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');
                            late_hours+=parseInt(hours);
                            late_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                            
                        }
                        //morning undertime
                        if(moment(raw_break_out,'HH:mm').isBefore(moment(break_out,'HH:mm'))){
                            // var hours_min = timeDiff(break_out,raw_break_out).split(':')
                            // var hours = parseInt(hours_min[0]);
                            // var minutes = hours_min[1];
                            hours = moment(break_out,'HH:mm').diff(moment(raw_break_out,'HH:mm'),'hours');
                            minutes = moment(break_out,'HH:mm').diff(moment(raw_break_out,'HH:mm'),'minutes');

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }
                        if(!raw_time_in || !raw_break_out){
                            hours = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                            minutes = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');
                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }
                    }

                }else{
                    //morning lates
                    if(moment(raw_time_in,'HH:mm').isAfter(moment(time_in,'HH:mm'))){
                        hours = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                        minutes = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');

                        late_hours+=parseInt(hours);
                        late_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                    //morning undertime
                    if(moment(raw_break_out,'HH:mm').isBefore(moment(break_out,'HH:mm'))){
                        // var hours_min = timeDiff(break_out,raw_break_out).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];
                        hours = moment(break_out,'HH:mm').diff(moment(raw_break_out,'HH:mm'),'hours');
                        minutes = moment(break_out,'HH:mm').diff(moment(raw_break_out,'HH:mm'),'minutes');

                        undertime_hours+=parseInt(hours);
                        undertime_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                    if(!raw_time_in || !raw_break_out){
                        // var hours_min = timeDiff(time_in,break_out).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];

                        hours = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                        minutes = moment(break_out,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');

                        undertime_hours+=parseInt(hours);
                        undertime_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                }
            }
            if(!raw_break_in && !raw_time_out){
                if(!is_leave.is_leave){
                    //afternoon lates
                    if(moment(raw_break_in,'HH:mm').isAfter(moment(break_in,'HH:mm'))){
                        // var hours_min = timeDiff(time_in,raw_time_in).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];
                        hours = moment(time_in,'HH:mm').diff(moment(raw_time_in,'HH:mm'),'hours');
                        minutes = moment(time_in,'HH:mm').diff(moment(raw_time_in,'HH:mm'),'minutes');

                        late_hours+=parseInt(hours);
                        late_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                    //afternoon undertime
                    if(moment(raw_time_out,'HH:mm').isBefore(moment(time_out,'HH:mm'))){
                        // var hours_min = timeDiff(time_out,raw_time_out).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];
                        hours = moment(time_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'hours');
                        minutes = moment(time_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'minutes');

                        undertime_hours+=parseInt(hours);
                        undertime_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }

                    if(!raw_break_in || !raw_time_out){
                        // var hours_min = timeDiff(break_in,time_out).split(':')
                        // var hours = parseInt(hours_min[0]);
                        // var minutes = hours_min[1];

                        hours = moment(break_in,'HH:mm').diff(moment(time_out,'HH:mm'),'hours');
                        minutes = moment(break_in,'HH:mm').diff(moment(time_out,'HH:mm'),'minutes');

                        undertime_hours+=parseInt(hours);
                        undertime_minutes+=parseInt(minutes);
                        undertime_lates+=parseInt(minutes);
                    }
                }else{
                    if(is_leave.period === 'AM' || is_leave === 'NONE'){
                        //afternoon lates
                        if(moment(raw_break_in,'HH:mm').isAfter(moment(break_in,'HH:mm'))){
                            // var hours_min = timeDiff(time_in,raw_time_in).split(':')
                            // var hours = parseInt(hours_min[0]);
                            // var minutes = hours_min[1];

                            hours = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'hours');
                            minutes = moment(raw_time_in,'HH:mm').diff(moment(time_in,'HH:mm'),'minutes');

                            late_hours+=parseInt(hours);
                            late_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }
                        //afternoon undertime
                        if(moment(raw_time_out,'HH:mm').isBefore(moment(time_out,'HH:mm'))){
                            // var hours_min = timeDiff(time_out,raw_time_out).split(':')
                            // var hours = parseInt(hours_min[0]);
                            // var minutes = hours_min[1];
                            hours = moment(time_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'hours');
                            minutes = moment(time_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'minutes');

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }

                        if(!raw_break_in || !raw_time_out){
                            // var hours_min = timeDiff(break_in,time_out).split(':')
                            // var hours = parseInt(hours_min[0]);
                            // var minutes = hours_min[1];

                            hours = moment(break_in,'HH:mm').diff(moment(time_out,'HH:mm'),'hours');
                            minutes = moment(break_in,'HH:mm').diff(moment(time_out,'HH:mm'),'minutes');

                            undertime_hours+=parseInt(hours);
                            undertime_minutes+=parseInt(minutes);
                            undertime_lates+=parseInt(minutes);
                        }
                    }
                    
                }
                
            }else{
                //afternoon lates
                if(moment(raw_break_in,'HH:mm').isAfter(moment(break_in,'HH:mm'))){
                    // var hours_min = timeDiff(time_in,raw_time_in).split(':')
                    // var hours = parseInt(hours_min[0]);
                    // var minutes = hours_min[1];
                    hours = moment(raw_break_in,'HH:mm').diff(moment(break_in,'HH:mm'),'hours');
                    minutes = moment(raw_break_in,'HH:mm').diff(moment(break_in,'HH:mm'),'minutes');

                    late_hours+=parseInt(hours);
                    late_minutes+=parseInt(minutes);
                    undertime_lates+=parseInt(minutes);
                }
                //afternoon undertime
                if(moment(raw_time_out,'HH:mm').isBefore(moment(time_out,'HH:mm'))){
                    // var hours_min = timeDiff(time_out,raw_time_out).split(':')
                    // console.log(timeDiff(time_out,raw_time_out))
                    // console.log(time_out)
                    // console.log(raw_time_out)

                    hours = moment(time_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'hours');
                    minutes = moment(time_out,'HH:mm').diff(moment(raw_time_out,'HH:mm'),'minutes');

                    undertime_hours+=parseInt(hours);
                    undertime_minutes+=parseInt(minutes);
                    undertime_lates+=parseInt(minutes);
                }

                if(!raw_break_in || !raw_time_out){
                    // var hours_min = timeDiff(break_in,time_out).split(':')
                    // var hours = parseInt(hours_min[0]);
                    // var minutes = hours_min[1];

                    hours = moment(time_out,'HH:mm').diff(moment(break_in,'HH:mm'),'hours');
                    minutes = moment(time_out,'HH:mm').diff(moment(break_in,'HH:mm'),'minutes');

                    undertime_hours+=parseInt(hours);
                    undertime_minutes+=parseInt(minutes);
                    undertime_lates+=parseInt(minutes);
                }

            }
            if(total_logs <= 1){
                undertime_lates = 0;
                late_hours = 0;
                late_minutes = 0;
                undertime_hours = 0;
                undertime_minutes = 0;
            }
            var result = {
                late:late_minutes,
                late_hours:late_hours,
                late_minutes:late_minutes,
                undertime:undertime_minutes,
                undertime_hours:undertime_hours,
                undertime_minutes:undertime_minutes,
                undertime_late:undertime_lates,
                day_type:1
            }
            return result;
        }else{
            var result = {
                lates:0,
                undertime:0,
                day_type:2
            }
            return result; 
        }
    }
    
}
export const displayLatesUndertime = (duration,type) => {
    var hours = (duration / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60; 
    var rminutes = Math.round(minutes);
    if(duration>0){
        if(type === 1){
            if(duration>=60){
                return Math.floor(rhours);
            }else{
                return '-';
            }
        }else{
            if(rminutes>0){
                return rminutes;
            }else{
                return '-'
            }
        }
    }else{
        return '-';
    }
    
}
const checkHolidays = (holidays,date) =>{
    let holidays_data = holidays.filter(el=>moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(date,'YYYY-MM-DD').format('YYYY-MM-DD'));
    if(holidays_data.length>0){
        if(holidays_data[0].holiday_cover === 1 && holidays_data[0].holiday_type <=5){
            return {is_holiday:true,period:'NONE',holiday_desc:'NATIONAL HOLIDAY'};
        }else{
            if(holidays_data[0].holiday_type === 6){
                // return holidays_data[0].holiday_desc;
                return {is_holiday:true,period:'AM',holiday_desc:holidays_data[0].holiday_desc};

            }else{
                if(holidays_data[0].holiday_type === 7){
                    return {is_holiday:true,period:'AM',holiday_desc:holidays_data[0].holiday_desc};
                }else{
                    return {is_holiday:true,period:'AM',holiday_desc:'LOCAL HOLIDAY'};
                }
            }
        }
    }else{
        return {is_holiday:false,period:'NONE'};
    }
}
const checkHolidays2 = (holidays,date) =>{
    let holidays_data = holidays.filter(el=>moment(el.holiday_date1,'YYYY-MM-DD').format('YYYY-MM-DD') === moment(date,'YYYY-MM-DD').format('YYYY-MM-DD'));
    if(holidays_data.length>0){
        if(holidays_data[0].holiday_cover === 1 && holidays_data[0].holiday_type <=5){
            return {is_holiday:true,period:'NONE'};
        }else{
            if(holidays_data[0].holiday_type === 6){
                return {is_holiday:true,period:'AM'};
            }else{
                if(holidays_data[0].holiday_type === 7){
                    return {is_holiday:true,period:'PM'};
                }else{
                    return {is_holiday:false,period:'NONE'};
                }
            }
        }
    }else{
        return {is_holiday:false,period:'NONE'};
    }
}
export const displayTotalLatesUndertime = (data,type,time_type)=>{
    //type 1 = Undertime , 2 = Lates
    //time_type 1 = hour, 2 = minutes
    if(type === 1){
        var total = 0;
        data.forEach(element => {
            total+=element.undertime;
        });
        if(time_type === 1){
            return total/60;
        }else{
            var minutes = total%60;
            if(minutes>0){
                return minutes;
            }else{
                return '-';
            }
        }
    }else{
        var total = 0;
        data.forEach(element => {
            total+=element.late;
        });
        if(time_type === 1){
            return total/60;
        }else{
            var minutes = total%60;
            if(minutes>0){
                return minutes;
            }else{
                return '-';
            }
        }
    }
    
}
export const readExcelFiles = (file,type) =>{
    
    if(type === 1){
        return new Promise((resolve,reject) => {
            const id = toast.loading('Loading File')
            // Swal.fire({
            //     icon:'info',
            //     title:'Loading file',
            //     text:'Please wait...'
            // })
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onerror = () => {
                toast.update(id,{
                    render:'Error loading file',
                    type:'error',
                    autoClose:true,
                    isLoading:false
                })
                reader.abort();
                reject(new DOMException('Problem parsing input file.'));
            }
            reader.onload = () => {

                var data = new Uint8Array(reader.result);

                var work_book = XLSX.read(data, {type:'array'});

                var sheet_name = work_book.SheetNames;
                var sheet_data = [];

                sheet_name.forEach(el=>{
                    // sheet_data.push(XLSX.utils.sheet_to_json(work_book.Sheets[el], {header:1}));
                    var arr1 = XLSX.utils.sheet_to_json(work_book.Sheets[el], {header:1});
                    var obj = Object.assign([],{sheet_name:el},arr1);
                    sheet_data.push(obj)
                })
                resolve({data:sheet_data,sheets:sheet_name});
                toast.update(id,{
                    render:'File Loaded',
                    type:'success',
                    autoClose:true,
                    isLoading:false
                })
                // Swal.close();

            }
            // reader.readAsText(file);

        })
    }else{
        return new Promise((resolve,reject) => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem parsing input file.'));
            }
            reader.onload = () => {

                var data = new Uint8Array(reader.result);

                var work_book = XLSX.read(data, {type:'array'});

                var sheet_name = work_book.SheetNames;

                var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header:1});
                resolve(sheet_data);
            }
            // reader.readAsText(file);
        })
    }
}
export const sortNumber = (arr,string)=>{
    return arr.sort((a, b) => {
        return a[string] - b[string];
    });
}

export const sortString = (arr,string)=>{
    return arr.sort((a,b) => {
        let fa = a[string].toLowerCase(),
            fb = b[string].toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
}
export const getPayGroup = async (dept_code,setData,emp_status)=>{
    if(dept_code){
        APILoading('info','Loading Payroll Group','Please Wait...')
        // setSelectedPayrollGroup(null)
        const res = await getPayrollGroup({dept_code:dept_code,emp_status:emp_status});
        setData(res.data.data)
        Swal.close();
    }
}