// DBUserContext.js or DBUserContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react';

const DBUserContext = createContext(null);

export const useDBUser = () => useContext(DBUserContext);

export const DBUserProvider = ({ children }) => {
  const [dbUser, setDbUser] = useState(null);

  return (
    <DBUserContext.Provider value={{ dbUser, setDbUser }}>
      {children}
    </DBUserContext.Provider>
  );
};
