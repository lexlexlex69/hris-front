import React,{ useRef } from 'react'
import './Preview.css';
import moment from 'moment';
import Logo from '../../.././assets/img/bl.png'
export const PreviewLeaveApplicationForm = React.forwardRef((props,ref)=>{
    const date = moment(new Date()).format('MMMM DD,YYYY')
    return(
        <div ref={ref} id="preview">
            <div style = {{position:'absolute'}}>
                <em><h5 style={{fontSize:'9px',fontWeight:'bold'}}>Civil Service Form No. 6 <br/>
                Revised 2020</h5></em>
            </div>
            <div style = {{position:'absolute',margin:'18px 0 0 175px'}}>
                <img src={Logo} alt="" width={50} height={50} />
            </div>
            <div className='center'>
                <h5 className='font-header'>Republic of the Philippines<br/>
                City Government of Butuan<br/>
                J. Rosales Ave., Butuan City</h5>
            </div>
            <div className='center'>
                <h3 style = {{fontSize:'17px',fontWeight:'bold'}}>APPLICATION FOR LEAVE</h3>
            </div>
            <div className='table2'>
                <div className='info-div'>
                    <div>
                        <h5 className='info-header'>1. OFFICE/DEPARTMENT</h5>
                        <h5 className='info-text'>{props.info.officeassign}</h5>
                    </div>
                    <div>
                        <h5 className='info-header'>2. NAME:</h5>
                    </div>
                    <div>
                        <h5 className='info-header'>(Last)</h5>
                        <h5 className='info-text'>{props.info.lname}</h5>
                    </div>
                    <div>
                        <h5 className='info-header'>(First)</h5>
                        <h5 className='info-text'>{props.info.fname}</h5>
                    </div>
                    <div>
                        <h5 className='info-header'>(Middle)</h5>
                        <h5 className='info-text'>{props.info.mname}</h5>
                    </div>
                </div>
                <div className='horizontal-line'>

                </div>
                <div className='info-div'>
                    <div>
                        <h5 className='info-header'>3. DATE OF FILING &nbsp;
                        <span className='info-text' style={{borderBottom:'solid 1px'}}>{date}</span></h5>
                    </div>
                    <div>
                        <h5 className='info-header'>4. POSITION &nbsp;
                        <span className='info-text' style={{borderBottom:'solid 1px'}}>{props.info.designation}</span></h5>
                    </div>
                    <div>
                        <h5 className='info-header'>5. SALARY &nbsp;
                        <span className='info-text' style={{borderBottom:'solid 1px'}}>&#8369; {props.info.monthly_salary?props.info.monthly_salary.toLocaleString():'N/A'}</span></h5>
                    </div>
                </div>
                <div className='horizontal-line'>

                </div>
                <div className='horizontal-line2'>

                </div>
                <div className='center'>
                    <h5 style={{fontSize:'11px',fontWeight:'bold',paddingTop:'5px'}}>6. DETAILS OF APPLICATION</h5>
                </div>
                <div className='horizontal-line'>

                </div>
                <div className='horizontal-line2'>

                </div>
                
                <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{padding:'10px 33px 0 10px',borderRight:'solid 1px'}}>
                        <h5 className='info-header'>6.A TYPE OF LEAVE TO BE AVAILED OF</h5>
                        {props.data.map((data,key)=>
                        <div  key = {key}>
                            <label className='label'>
                            <input type = "checkbox" disabled checked = {props.leaveType === data.leave_type_id  ? true:false}/>&nbsp;{data.leave_type_name} <small className='label-desc'>{data.leave_desc}</small>
                            </label>
                            <br/>
                        </div>
                        )}

                    </div>
                    <div style={{padding:'10px 0 0 425px',position:'absolute'}}>
                        <h5 className='info-header'>6.B DETAILS OF LEAVE </h5>
                        <em className='info-header'>In case of Vacation/Special Privilege Leave:</em><br/>
                        <label className='label'>
                            <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 1?true:false :false} disabled /> &nbsp;Within the Philippines &nbsp;{
                            props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                            ?
                                props.leaveDetails === 1
                                ?
                                    props.specifyDetails !== ''
                                    ?
                                    <u>_____{props.specifyDetails}_____</u>
                                    :
                                    <span>___________________________________</span>
                                :
                                <span>___________________________________</span>
                            :
                            <span>___________________________________</span>
                            }
                        </label>
                        <br/>
                        <label className='label'>
                            <input type = "checkbox" checked = {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6? props.leaveDetails === 2?true:false :false} disabled/> &nbsp;Abroad (Specify) &nbsp;{
                            props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                            ?
                                props.leaveDetails === 2
                                ?
                                    props.specifyDetails !== ''
                                    ?
                                    <u>_____{props.specifyDetails}_____</u>
                                    :
                                    <span>_________________________________________</span>
                                :
                                <span>_________________________________________</span>
                            :
                            <span>_________________________________________</span>


                        }
                        </label>
                        <br/>
                        
                        <em className='info-header'>In case of Sick Leave:</em><br/>
                        <label className='label'>
                            <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 5?true:false :false} disabled/> &nbsp;In Hospital (Specify Illness) {
                            props.leaveType === 3
                            ?
                                props.leaveDetails === 5
                                ?
                                    props.specifyDetails !== ''
                                    ?
                                    <u>_____{props.specifyDetails}_____</u>
                                    :
                                    <span>_______________________________</span>
                                :
                                <span>_______________________________</span>
                            :
                            <span>_______________________________</span>


                        }
                        </label>
                        <br/>
                        <label className='label'>
                            <input type = "checkbox" checked = {props.leaveType === 3? props.leaveDetails === 6?true:false :false} disabled/> &nbsp;Out Patient (Specify Illness) {
                            props.leaveType === 3
                            ?
                                props.leaveDetails === 6
                                ?
                                    props.specifyDetails !== ''
                                    ?
                                    <u>_____{props.specifyDetails}_____</u>
                                    :
                                    <span>_______________________________</span>
                                :
                                <span>_______________________________</span>
                            :
                            <span>_______________________________</span>


                        }
                        </label>
                        <br/>

                        <em className='info-header'>In case of Special Leave Benefits for Women:</em><br/>
                        <label className='label'>
                            (Specify Illness) {
                            props.leaveType === 11
                            ?
                                props.specifyDetails !== ''
                                ?
                                <u>_____{props.specifyDetails}_____</u>
                                :
                                <span>_________________________________________________</span>
                            :
                            <span>_________________________________________________</span>


                        }
                        </label>
                        <br/>

                        <em className='info-header'>In case of Study Leave:</em><br/>
                        <label className='label'>
                            <input type = "checkbox" checked = {props.leaveType === 8 ? props.leaveDetails === 7?true:false :false} disabled/> &nbsp;Completion of Master's Degree
                        </label>
                        <br/>
                        <label className='label'>
                            <input type = "checkbox"  checked = {props.leaveType === 8 ? props.leaveDetails === 8?true:false :false} disabled/> &nbsp;BAR/Board Examination Review
                        </label>
                        <br/>

                        <em className='info-header'>Other purpose:</em><br/>
                        <label className='label'>
                            <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 9?true:false :false} disabled/> &nbsp;Monetization of Leave Credits
                        </label>
                        <br/>
                        <label className='label'>
                            <input type = "checkbox" checked = {props.leaveType === 15 ? props.leaveDetails === 10?true:false :false} disabled/> &nbsp;Terminal Leave
                        </label>
                    </div>
                </div>
                <div className='horizontal-line'>

                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{padding:'10px 159px 30px 10px',borderRight:'solid 1px'}}>
                        <h5 className='info-header'>6.C NUMBER OF WORKING DAYS APPLIED FOR</h5>
                        <u style={{fontSize:'10px'}}><strong>_____{props.applied_days}________________________</strong></u>

                        <h5 className='info-header'>INCLUSIVE DATES</h5>
                        <u style={{fontSize:'10px'}}><strong>_____{props.inclusiveDates}_____________________</strong></u>
                        
                    </div>
                    <div style={{padding:'10px 0 0 425px',position:'absolute'}}>
                        <h5 className='info-header'>6.D COMMUTATION</h5>
                        <label className='label'>
                            <input type = "checkbox" disabled/> &nbsp;Not Requested
                        </label>
                        <br/>
                        <label className='label'>
                            <input type = "checkbox" disabled/> &nbsp;Requested
                        </label>
                        <br/>
                        <div className='center' style = {{paddingLeft:'37px'}}>
                            <span>___________________________________</span>
                            <br/>
                            <span className='info-header'>Signature of Applicant</span>
                        </div>


                    </div>
                </div>
                <div className='horizontal-line'>

                </div>
                <div className='horizontal-line2'>

                </div>
                <div className='center'>
                    <h5 style={{fontSize:'11px',fontWeight:'bold',paddingTop:'5px'}}>7. DETAILS OF ACTION ON APPLICATION</h5>
                </div>
                <div className='horizontal-line'>

                </div>
                <div className='horizontal-line2'>

                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{padding:'10px 79px 10px 10px',borderRight:'solid 1px',margin:'0 0 0 20px'}}>
                        <h5 className='info-header'>7.A CERTIFICATION OF LEAVE CREDITS</h5>
                        <h5 className='info-text center'>As of ____<u>{moment(new Date()).format('MMMM YYYY')}</u>____</h5>
                        <table style={{border: '1px solid',width:'100%',fontSize:'13px'}}>
                            <thead style={{padding:'10px'}}>
                                <tr >
                                <th>
                                   
                                </th>
                                <th style={{padding:'5px',borderLeft:'solid 1px'}}>
                                    Vacation Leave
                                </th>
                                <th  style={{padding:'5px',borderLeft:'solid 1px'}}>
                                    Sick Leave
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{border:'solid 1px',textAlign:'center'}}>
                                    <td style={{borderRight:'solid 1px'}}>Total Earned</td>
                                    <td style={{borderRight:'solid 1px'}}>{props.vl}</td>
                                    <td style={{borderRight:'solid 1px'}}>{props.sl}</td>
                                </tr>

                                <tr style={{border:'solid 1px',textAlign:'center'}}>
                                    <td style={{borderRight:'solid 1px'}}>Less this Application</td>
                                    <td style={{borderRight:'solid 1px'}}>
                                    {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.applied_days>props.balance ? props.balance:props.applied_days
                                    :
                                    ''
                                    }
                                    </td>
                                    <td style={{borderRight:'solid 1px'}}>
                                    {props.leaveType === 3
                                    ?
                                        props.applied_days>props.balance ? props.balance:props.applied_days
                                    :
                                    ''
                                    }
                                    </td>
                                </tr>

                                <tr style={{border:'solid 1px',textAlign:'center'}}>
                                    <td style={{borderRight:'solid 1px'}}>Balance</td>
                                    <td style={{borderRight:'solid 1px'}}>
                                    {props.leaveType === 1 || props.leaveType === 2 || props.leaveType === 6
                                    ?
                                        props.applied_days>props.balance
                                        ?
                                        props.balance-props.balance:props.balance-props.applied_days
                                    :
                                    ''
                                    }
                                    </td>
                                    <td style={{borderRight:'solid 1px'}}>
                                    {props.leaveType === 3
                                    ?
                                        props.applied_days>props.balance
                                        ?
                                        props.balance-props.balance:props.balance-props.applied_days
                                    :
                                    ''
                                    }
                                    </td>
                                </tr>
                            </tbody>
                            
                        </table>
                        {props.signatory.map((data,key)=>
                            data.location === '7.A'
                            ?
                            <div key = {key}>
                            <h5 className='info-text center' style ={{margin:'30px 0 0 34px'}}><u>{data.assign_name}</u></h5>
                            <h5 className='center' style ={{margin:'0 0 0 34px',fontSize:'10px'}}>{data.assign_position}</h5>
                            <h5 className='info-text center' style ={{margin:'0 0 0 34px'}}  >_______________________________________________________ <br/>
                            (Authorized Officer)</h5>
                            </div>
                            :
                            ''
                        )}
                    </div>
                    <div style={{padding:'10px 0 0 425px',position:'absolute'}}>
                        <h5 className='info-header'>7.B RECOMMENDATION</h5>
                        <label className='label'>
                            <input type = "checkbox" disabled/> &nbsp;For Approval
                        </label>
                        <br/>
                        <label className='label'>
                            <input type = "checkbox" disabled/> &nbsp;For Disapproval due to ____________________________
                        </label>
                        <br/>
                        {props.signatory.map((data,key)=>
                            data.location === '7.B'
                            ?
                            <div key = {key}>
                            <h5 className='info-text center' style ={{margin:'102px 0px 0px 36px'}}><u>{data.assign_name}</u></h5>
                            <h5 className='center' style ={{margin:'0 0 0 33px',fontSize:'10px'}}>{data.assign_position}</h5>
                            <h5 className='info-text center' style ={{margin:'0 0 0 38px'}}  >_______________________________________________________ <br/>
                            (Authorized Officer)</h5>
                            </div>
                            :
                            ''
                        )}
                    </div>
                </div>
                <div className='horizontal-line'>

                </div>
                <div className='horizontal-line2'>

                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{padding:'10px 326px 0 10px'}}>
                        <h5 className='info-header'>7.C APPROVED FOR:</h5>
                        <span className='info-header' >____<u>{props.applied_days > props.balance ? props.balance:props.applied_days}</u>_____ days with pay</span><br/>
                        <span className='info-header'>____<u>{props.applied_days > props.balance? props.applied_days-props.balance:0}</u>______ days without pay</span><br/>
                        <span className='info-header'>___________ others (Specify)</span>

                        
                    </div>
                    <div style={{padding:'10px 0 0 470px',position:'absolute'}}>
                        <h5 className='info-header'>7.D DISAPPROVED DUE TO:</h5>
                        <span className='info-header'>____________________________________</span><br/>

                        <br/>
                    </div>
                </div>
                <div className='center'>

                <span className='info-header'><u><strong>ENGR. RONNIE VICENTE C. LAGNADA</strong></u></span><br/>
                <span className='info-header'>City Mayor</span><br/>
                </div>

            </div>
        </div>
    )
})
export default PreviewLeaveApplicationForm