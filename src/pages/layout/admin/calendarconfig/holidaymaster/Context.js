import React, { useState } from "react";

export const HolidayMasterContext = React.createContext();

export const Context = (props) => {
    // for data
    const [holidayMasterData, setHolidayMasterData] = useState({});
    const [tempData, setTempData] = useState({});

    // for control state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(null);

    return (
        <HolidayMasterContext.Provider
            value={{
                holidayMasterData, setHolidayMasterData,
                loading, setLoading,
                error, setError,
                status, setStatus,
                message, setMessage,
                open, setOpen,
                tempData, setTempData,
            }}
        >
            {props.children}
        </HolidayMasterContext.Provider>
    );
};

export default Context;