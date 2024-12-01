import {createContext, useEffect, useReducer, useContext, ReactNode} from "react";
import React, {Dispatch, Context} from "react";
import AuthReducer from "./AuthReducer";
import {Action} from "./AuthReducer";

interface User {
    _id: string;
    username: string;
}

interface AuthContextProviderProps {
    children: ReactNode;
}

export interface AuthContextInterface {
    user: User | null;
    error: boolean;
    logout: () => void;
    dispatch: Dispatch<Action>;
}

const INITIAL_STATE : AuthContextInterface = {
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
    error: false,
    logout: () => {},
    dispatch: () => {},
};

export const AuthContext : Context<AuthContextInterface> = createContext<AuthContextInterface>(INITIAL_STATE);

export function useAuth() {
    const context : AuthContextInterface | undefined = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) : JSX.Element => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    function logout() {
        dispatch({type: 'LOGOUT'});
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                error: state.error,
                logout,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
);

}
