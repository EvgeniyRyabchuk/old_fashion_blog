import React, {createContext, useContext, useEffect, useState} from 'react';
import {db, auth} from "@/firebase/config";
import {getAuthUserById} from "@/services/auth";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(
            async (firebaseUser) => {
                if(firebaseUser) {
                    setUser(await getAuthUserById(firebaseUser.uid));
                    setIsAuth(true);
                } else {
                    setUser(null);
                    setIsAuth(false);
                }
                setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, isAuth  }}>
            {children}
        </AuthContext.Provider>
    );
};



export const useAuth = () => useContext(AuthContext);