import "./Login.css"
import React, {useContext, useRef, FormEvent, Dispatch, useState} from "react";
import {loginCall} from "../../api-calls";
import {AuthContext, AuthContextInterface} from "../../contexts/Auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {Phone, Lock} from "@mui/icons-material";

export const isPhoneWrong = (phone: string): string | undefined => {
    const phone_regex: RegExp = /^\+[0-9]{7,14}$/;
    if (!phone_regex.test(phone)) return 'Incorrect phone number format!'

}

export const isPasswordWrong = (password: string): string | undefined => {
    const pass_regex: RegExp = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!pass_regex.test(password)) return "Password must have 1 special character, 1 uppercase letter, 1 digit, and be at least 8 characters long.";

}

export function Login(): JSX.Element {
    const navigate = useNavigate();
    const phone = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const { dispatch }: AuthContextInterface = useContext<AuthContextInterface>(AuthContext)!;
    const [error, setError] = useState("");

    function handleRegisterButtonClick() {
        navigate('/register');
    }

    const handleClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (phone.current && password.current) {

            const pass_error: string | undefined = isPasswordWrong(password.current.value);
            const phone_error: string | undefined = isPhoneWrong(phone.current.value);

            if (phone_error) {
                setError(phone_error);
                return;
            }

            if (pass_error) {
                setError(pass_error);
                return;
            }

            loginCall(
                { phone_number: phone.current.value, password: password.current.value },
                dispatch
            ).catch(err => setError(err));
        }
    };

    return (
        <div className="auth-page-container">
            <h1 className="auth-page-header">Login page</h1>
            {error && <p className="auth-page-error"> {error}</p>}
            <form className="auth-page-form" onSubmit={handleClick}>
                <div className="auth-custom-input">
                    <Phone/>
                    <input
                        placeholder="Phone"
                        type="phone"
                        required
                        className="auth-page-input"
                        maxLength={15}
                        ref={phone}
                    />
                </div>
                <div className="auth-custom-input">
                    <Lock/>
                    <input
                        placeholder="Password"
                        type="password"
                        required
                        minLength={8}
                        maxLength={17}
                        className="auth-page-input"
                        ref={password}
                    />
                </div>
                <button className="auth-page-button" type="submit">
                    Login
                </button>
                <p className="auth-page-footer">
                    Don't have an account?
                    <button onClick={handleRegisterButtonClick}>
                        Register
                    </button>
                </p>
            </form>
        </div>
    );
}
