import React, { createContext, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children, values }) => {
    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);