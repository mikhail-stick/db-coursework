import React, {useContext, useRef, FormEvent, useState} from "react";
import {registerCall} from "../../api-calls";
import {AuthContext, AuthContextInterface} from "../../contexts/Auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {Person, Lock, Phone} from "@mui/icons-material";
import {isPasswordWrong, isPhoneWrong} from "../Login/Login";

export function Register(): JSX.Element {
    const navigate = useNavigate();
    const phone = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const username = useRef<HTMLInputElement>(null);
    const {dispatch}: AuthContextInterface = useContext<AuthContextInterface>(AuthContext);

    const [error, setError] = useState("");

    function handleLoginButtonClick() {
        navigate('/login');
    }

    const handleClick = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (phone.current && password.current && username.current) {
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

            registerCall(
                {
                    phone_number: phone.current.value,
                    password: password.current.value,
                    username: username.current.value
                },
                dispatch
            ).catch(err => setError(err.toString()));
        }
    };

    return (
        <div className="auth-page-container">
            <p className="auth-page-header">Register page</p>
            {error && <p className="auth-page-error">{error}</p>}
            <form className="auth-page-form" onSubmit={handleClick}>
                <div className="auth-custom-input">
                    <Person/>
                    <input
                        placeholder="Username"
                        type="text"
                        required
                        minLength={6}
                        maxLength={25}
                        className="auth-page-input"
                        ref={username}
                    />
                </div>
                <div className="auth-custom-input">
                    <Phone/>
                    <input
                        placeholder="Phone"
                        type="tel"
                        required
                        className="auth-page-input"
                        ref={phone}
                        maxLength={15}
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
                    Register
                </button>

                <p className="auth-page-footer"> Already have an account?
                    <button onClick={handleLoginButtonClick}>
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
}
