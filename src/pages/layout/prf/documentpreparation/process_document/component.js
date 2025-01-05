import { Box } from "@mui/material";




export function CheckLetterHF({ letterData, classname, imgstyle, boxstyle, letterName }) {
    return (
        !letterData ? <>No {letterName} Found </> : <>
            <Box className={classname} sx={boxstyle}>
                <img src={letterData} style={imgstyle} alt={letterName} />
            </Box>
        </>
    )
}