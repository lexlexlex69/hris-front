import moment from "moment";
import React, { useState } from "react";

export const LWOPStateContext = React.createContext(null);

export const LeaveWithoutPayRegistration = ({ children }) => {
    const [lwopState, setLWOPState] = useState({
        lwopList: [],
        lwopListLoading: false,
        selectedLWOP: null,
        lwopDialogOpen: true,
        lwopFilters: {
            year: moment().format('YYYY'),
            month: moment().format('MM'),
            position: '',
            department: '',
            employee: '',
        }
    });

    const value = {
        lwopState,
        setLWOPState,
    };

    return (
        <LWOPStateContext.Provider value={value}>
            {children}
        </LWOPStateContext.Provider>
    );
};
