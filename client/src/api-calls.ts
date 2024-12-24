import axios from "axios";
import {Dispatch} from "react";
import {Action} from "./contexts/Auth/AuthReducer";

interface userRegisterRequest {
    phone_number: string,
    password: string,
    username: string
}

interface userLoginRequest {
    phone_number: string,
    password: string,
}

export const loginCall = async (userInfo: userLoginRequest, dispatch: Dispatch<Action>) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post("http://localhost:3001/api/auth/login", userInfo);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err: any) {
        dispatch({ type: "LOGIN_FAILURE"});
        throw err.response.data;
    }
};

export const registerCall = async (userInfo: userRegisterRequest, dispatch: Dispatch<Action>) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post("http://localhost:3001/api/auth/register", userInfo);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err: any) {
        dispatch({ type: "LOGIN_FAILURE"});
        throw err.response.data;
    }
};
