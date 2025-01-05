import { Box, Card, CardContent } from "@mui/material"

function SendNotification() {
    return (
        <Box sx={{ padding: '5px 0px' }}>
            <Card>
                <CardContent>
                    <Box> Date </Box>
                    <Box> Good day! We are glad to inform you that you are included in the listing for
                        {/* {{ $data-> position_title}} */}
                        position with item number
                        {/* {{ $data-> plantilla_no}} */}
                    </Box>
                    <br />
                    <br />
                    <Box> City Government of Butuan - City Human Resource Management Department </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default SendNotification