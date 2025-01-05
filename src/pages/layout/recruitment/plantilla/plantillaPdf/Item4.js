import React from 'react';
import Typography from '@mui/material/Typography'

const Item4 = ({ data }) => {
    return (
        <>
            <tr style={{backgroundColor:'#BEBEBE'}}>
                <td colSpan={6} ><Typography className='font-12px' color="initial">4. FOR LOCAL GOVERNMENT POSITION, ENUMERATE GOVERNMENTAL UNIT AND CLASS</Typography> </td>
            </tr>
            <tr>
                <td colSpan={6} style={{ padding: '10px',verticalAlign:'top' }}>
                    <div style={{ display: 'flex',alignItems:'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, justifyContent: 'flex-end', flex: 1,alignItems:'flex-start',bgcolor:'red',paddingLeft:'20px',fontSize:'10px' }}>
                            <div>
                                <input type='checkbox' className='checboxes' checked={data.lgu_type === 1 ? true : false}></input>
                                &nbsp;Province
                            </div>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_type === 2 ? true : false}></input>
                                &nbsp;City
                            </div>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_type === 3 ? true : false}></input>
                                &nbsp;Municipality
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1,fontSize:'10px'}}>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_class === 1 ? true : false}></input>
                                &nbsp;1st Class
                            </div>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_class === 2 ? true : false}></input>
                                &nbsp;2nd Class
                            </div>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_class === 3 ? true : false}></input>
                                &nbsp;3rd Class
                            </div>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_class === 4 ? true : false}></input>
                                &nbsp;4th Class
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1,fontSize:'10px' }}>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_class === 5 ? true : false}></input>
                                &nbsp;5th Class
                            </div>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_class === 6 ? true : false}></input>
                                &nbsp;6th Class
                            </div>
                            <div>
                                <input type='checkbox' className='checboxes'  checked={data.lgu_class === 7 ? true : false}></input>
                                &nbsp;Special
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
};

export default Item4;