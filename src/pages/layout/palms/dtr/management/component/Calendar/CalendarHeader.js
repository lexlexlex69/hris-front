import * as React from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box } from "@mui/material";
import moment from "moment";

export const dtrcalendarviews = [
    { value: "WEEK_TIME", label: "Week time" },
    { value: "DAY", label: "Day" },
    { value: "DAY_REVERSE", label: "Day reverse" },
    { value: "MONTH", label: "Month" },
    { value: "WEEK", label: "Week" },
    { value: "WEEK_IN_PLACE", label: "Week in place" },
    { value: "DAY_IN_PLACE", label: "Day in place" }
];
export const dtrcalendardays = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" }
];

const timeDateFields = [
    { value: "startTimeDate-endTimeDate", label: "Start time - end time" },
    { value: "createdAt-updatedAt", label: "Created at - updated at" },
    { value: "startTimeDate", label: "Start time" },
    { value: "endTimeDate", label: "End time date" }
];

const CalendarHeader = ({ viewsRef, setViewsRef, weekStartsOnRef, setWeekStartsOnRef, currentDate, setCurrentDate }) => {

    return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {/* Views selector - month, week, and year */}
            {/* <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel id="demo-select-small-label">Views</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={viewsRef}
                    onChange={(e) => setViewsRef(e.target.value)}
                    label="Views"
                >
                    {dtrcalendarviews.map((view) => (
                        <MenuItem key={view.value} value={view.value}>
                            {view.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
            
            {/* <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel id="demo-select-small-label">Week starts on</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={weekStartsOnRef}
                    onChange={(e) => setWeekStartsOnRef(e.target.value)}
                    label="Week starts on"
                >
                    {dtrcalendardays.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                            {day.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}

            {/* Month selector */}
            <FormControl sx={{ minWidth: 160 }} size="small">
                <InputLabel id="demo-select-small-label" shrink>Month</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    label="Month"
                    shrink
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem key={i} value={i}>
                            {moment().month(i).format('MMMM')}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                <InputLabel id="demo-select-small-label">
                    Active time date field
                </InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={activeTimeDateField}
                    onChange={(e) => setActiveTimeDateField(e.target.value)}
                    label="Active time date field"
                >
                    {timeDateFields.map((timeDateField) => (
                        <MenuItem key={timeDateField.value} value={timeDateField.value}>
                            {timeDateField.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
        </Box>
    );
};

export default CalendarHeader;
