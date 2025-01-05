import moment from 'moment';
import React from 'react';
import { formatExtName, formatMiddlename } from '../../../../../customstring/CustomString';
export const PayrollPager = ({id,page,totalPage,user}) =>{
    return(
        <div id={id}>
            <div style={{width:'100%',position:'relative'}}>
                <p style={{textAlign:'left',fontSize:'.5rem'}}><em>{`${user?.fname} ${formatMiddlename(user?.mname)} ${user?.lname} ${formatExtName(user?.extname)}`}, {moment().format('M/D/YYYY HH:mm A')}</em></p>
                <p style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',fontSize:'.5rem'}}><em>Page {page} of {totalPage}</em></p>
            </div>
        </div>
    )
}