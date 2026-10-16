'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AdminPasscodeContext = createContext({
  passcode: '',
  setPasscode: () => {},
  isAuthorized: false,
  setIsAuthorized: () => {},
  signOut: () => {},
});

export function AdminPasscodeProvider({ children }) {
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('th_admin_passcode');
    if (saved) {
      setPasscode(saved);
      setIsAuthorized(true);
    }
  }, []);

  const handleSetPasscode = (code) => {
    setPasscode(code);
    setIsAuthorized(true);
    sessionStorage.setItem('th_admin_passcode', code);
  };

  const signOut = () => {
    setPasscode('');
    setIsAuthorized(false);
    sessionStorage.removeItem('th_admin_passcode');
  };

  return (
    <AdminPasscodeContext.Provider
      value={{
        passcode,
        setPasscode: handleSetPasscode,
        isAuthorized,
        setIsAuthorized,
        signOut,
      }}
    >
      {children}
    </AdminPasscodeContext.Provider>
  );
}

export function useAdminPasscode() {
  return useContext(AdminPasscodeContext);
}
