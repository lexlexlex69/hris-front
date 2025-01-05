import React, { useEffect, useState } from 'react';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import DataTable from 'react-data-table-component';

export default function CustomDataTable(props){
    const [data,setData] = useState([]);
    const [columns,setColumns] = useState([]);
    useEffect(()=>{
        setData(props.data)
        setColumns(props.columns)
    },[props.data])
    
    const tableData = {
        data,
        columns
    }

    return(
        <DataTableExtensions
            {...tableData}
            export={false}
            print={false}
        >
            <DataTable
                pagination
                highlightOnHover
            />
        </DataTableExtensions>
    )
}