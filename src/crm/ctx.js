import React from 'react';

// Shared app state: the team (for owner pickers), the record drawer opener and
// a version counter that bumps when any record changes so lists reload.
export const Crm = React.createContext(null);
export const useCrm = () => React.useContext(Crm);
