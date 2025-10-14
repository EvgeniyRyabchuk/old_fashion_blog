import React, {createContext, useContext, useEffect, useState} from 'react';
import {db, auth} from "@/firebase/config";
import {getAuthUserById} from "@/services/auth";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(
            async (firebaseUser) => {
                if(firebaseUser) {
                    setUser(await getAuthUserById(firebaseUser.uid));
                } else {
                    setUser(null);
                }
                setLoading(false);
        });

        return () => unsubscribe();
    }, []);



    return (
        <AuthContext.Provider value={{ user, setUser, loading  }}>
            {children}
        </AuthContext.Provider>
    );
};



export const useAuth = () => useContext(AuthContext);