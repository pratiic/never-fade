import React, { useState, useRef, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { setCurrentUser } from "../../redux/current-user/current-user.actions";

import { getErrors } from "../../utils/utils.errors";

import FormContainer from "../../components/form-container/form-container";
import InputGroup from "../../components/input-group/input-group";
import MessagesContainer from "../../components/messages-container/messages-container";

const Login = ({ userInfo }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);
    const [errors, setErrors] = useState([]);

    const inputRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const controller = new AbortController();
    const { signal } = controller;

    useEffect(() => {
        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (userInfo) {
            const redirect = location.search.split("=")[1] || "/";
            navigate(redirect);
        }
    }, [userInfo]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef.current]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoggingIn(true);
            setErrors([]);
            const response = await fetch("/api/users/login/", {
                signal,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.status === 200) {
                return dispatch(setCurrentUser(data));
            }

            setLoginErrors(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoggingIn(false);
        }
    };

    const setLoginErrors = (data) => {
        if (data.detail) {
            return setErrors([data.detail]);
        }

        setErrors(getErrors({ errors: data }));
    };

    return (
        <FormContainer
            title="Login to never fade"
            subtitle="Do not have an account ?"
            subtitleLink="register"
        >
            <form onSubmit={handleFormSubmit} className="w-72">
                <MessagesContainer messages={errors} />
                <InputGroup
                    label="email"
                    value={email}
                    ref={inputRef}
                    changeHandler={setEmail}
                />
                <InputGroup
                    label="password"
                    value={password}
                    type="password"
                    changeHandler={setPassword}
                />
                <p className="text-blue link ml-1 mb-3 -mt-2">
                    Forgot password ?
                </p>
                <button
                    type="submit"
                    className={`${
                        loggingIn ? "button-loading" : "form-button "
                    }`}
                >
                    login
                </button>
            </form>
        </FormContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(Login);
