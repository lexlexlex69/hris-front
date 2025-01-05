import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { orange, red } from '@mui/material/colors';
import { Tooltip } from '@mui/material';

const PdsBtn = ({ type, onClick }) => {
    return (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
            {type === 'update' ? (
                <Tooltip title="Update">
                    <span>
                        <EditIcon sx={{ color: '#fff', bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' }, border: `2px solid ${orange[500]}`, fontSize: 35, p: .5, borderRadius: 1 }} />
                    </span>
                </Tooltip>
            ) : type === 'delete' ? (
                <Tooltip title="Delete">
                    <span>
                        <DeleteIcon sx={{ color: '#fff', bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }, border: `2px solid ${red[500]}`, fontSize: 35, p: .5, borderRadius: 1 }} />
                    </span>
                </Tooltip>
            ) : null}
        </div>
    );
};

export default PdsBtn;