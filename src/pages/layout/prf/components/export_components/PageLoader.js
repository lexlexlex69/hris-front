import { Box, Skeleton, Stack, useMediaQuery } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

function PageLoader(props) {
  // const matches = useMediaQuery('(min-width:75%)');
  let listData = props.skele
  let space = props.spacing

  return (
    <>
      <Grid2 container spacing={space}>
        {listData.map((i, indx) => (
          <Grid2 item xs={12} lg={i.sizing} key={"skeleton-" + indx}>
            <Skeleton variant={i.variant} width={i.width === 0 ? "100%" : i.width} height={i.height} />
          </Grid2>
        ))}
      </Grid2>
    </>
  )
}

export default PageLoader