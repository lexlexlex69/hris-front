import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationOutlined(props,ref) {
  return (
    <Stack spacing={2}>
      <Pagination
        page={props.page}
        count={props.count}
        variant="outlined"
        color={props.color}
        onChange={props.onChange}
        siblingCount={0}
        // boundaryCount={2}
        showFirstButton = {props.showFirstButton}
        showLastButton = {props.showLastButton}
      />
    </Stack>
  );
}