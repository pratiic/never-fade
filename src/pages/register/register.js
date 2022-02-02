import React, { useState, useRef, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setCurrentUser } from "../../redux/current-user/current-user.actions";
import { resetFiles } from "../../redux/files/files.actions";

import { getErrors } from "../../utils/utils.errors";

import FormContainer from "../../components/form-container/form-container";
import InputGroup from "../../components/input-group/input-group";
import FileSelector from "../../components/file-selector/file-selector";
import MessagesContainer from "../../components/messages-container/messages-container";

const Register = ({ userInfo, selectedFiles }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [registering, setRegistering] = useState(false);
    const [errors, setErrors] = useState([]);

    const inputRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            navigate("/memories");
        }
    }, [userInfo]);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        return () => {
            dispatch(resetFiles());
        };
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmedPassword) {
            return setErrors(["passwords do not match"]);
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        if (selectedFiles.length > 0) {
            formData.append("avatar", selectedFiles[0]);
        } else {
            formData.append("avatar", "");
        }

        try {
            setRegistering(true);
            setErrors([]);
            const response = await fetch("/api/users/register/", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();

            if (data.user) {
                return dispatch(setCurrentUser(data.user));
            }

            setRegisterErrors(data);
        } catch (error) {
            console.log(error);
        } finally {
            setRegistering(false);
        }
    };

    const setRegisterErrors = (data) => {
        setErrors(getErrors(data));
    };

    return (
        <FormContainer
            title="Register with never fade"
            subtitle="Already have an account ?"
            subtitleLink="login"
        >
            <form onSubmit={handleFormSubmit} className="w-72">
                <MessagesContainer messages={errors} />
                <InputGroup
                    label="username"
                    placeholder="min 5 chars, max 25 chars"
                    value={username}
                    ref={inputRef}
                    changeHandler={setUsername}
                />
                <InputGroup
                    label="email"
                    placeholder="valid, unique email"
                    value={email}
                    changeHandler={setEmail}
                />
                <FileSelector label="avatar" />
                <InputGroup
                    label="password"
                    placeholder="minimum 7 characters"
                    value={password}
                    type="password"
                    changeHandler={setPassword}
                />
                <InputGroup
                    label="retype password"
                    value={confirmedPassword}
                    type="password"
                    changeHandler={setConfirmedPassword}
                />
                <button
                    type="submit"
                    className={`${
                        registering ? "button-loading" : "form-button"
                    }`}
                >
                    register
                </button>
            </form>
        </FormContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        selectedFiles: state.files.selectedFiles,
    };
};

export default connect(mapStateToProps)(Register);
