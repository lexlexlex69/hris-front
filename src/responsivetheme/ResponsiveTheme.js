import { createTheme} from '@mui/material/styles';
// media query
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
export const ResponsiveTheme = createTheme({
    breakpoints: {
        values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        },
    },
    components: {
        MuiIconButton: {
        defaultProps: {
            size: breakpoints.values.sm?'small':'auto',
            noSsr: true,
        },
        },
    }
})