import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import { getErrors } from "../../utils/utils.errors";
import { setAccountEmail } from "../../redux/account/account.actions";

import InputGroup from "../../components/input-group/input-group";
import MessagesContainer from "../../components/messages-container/messages-container";
import FormContainer from "../../components/form-container/form-container";

const ResetPassword = ({ email, userInfo }) => {
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatedNewPassword, setRepeatedNewPassword] = useState("");
    const [resettingPassword, setResettingPassword] = useState(false);
    const [errors, setErrors] = useState([]);

    const inputRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "Reset your password";
    }, []);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (userInfo) {
            return navigate(-1);
        }

        if (!email) {
            return navigate("/send-code");
        }
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!code) {
            return setErrors(["code is required"]);
        }

        if (!newPassword) {
            return setErrors(["password is required"]);
        }

        if (newPassword !== repeatedNewPassword) {
            return setErrors(["passwords do not match"]);
        }

        setResettingPassword(true);

        try {
            const response = await fetch(`/api/users/reset-password/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    reset_code: code.trim(),
                    new_password: newPassword.trim(),
                }),
            });
            const data = await response.json();

            if (response.status === 200) {
                dispatch(setAccountEmail(""));
                return navigate("/");
            }

            if (response.status === 404) {
                return setErrors([
                    `account with the email ${email} does not exist`,
                ]);
            }

            if (data.errors) {
                return setErrors(getErrors(data));
            }
        } catch (error) {
        } finally {
            setResettingPassword(false);
        }
    };

    return (
        <FormContainer title="reset your account">
            <form className="w-72" onSubmit={handleFormSubmit}>
                <MessagesContainer messages={errors} />
                <InputGroup
                    label="code"
                    placeholder="4-digit code"
                    info="the code you just received in your email"
                    ref={inputRef}
                    changeHandler={setCode}
                />
                <InputGroup
                    label="new password"
                    placeholder="new password to your account"
                    type="password"
                    changeHandler={setNewPassword}
                />
                <InputGroup
                    label="repeat new password"
                    type="password"
                    changeHandler={setRepeatedNewPassword}
                />
                <Link
                    to="/send-code"
                    className="link ml-1 -mt-2 mb-3 text-lg block"
                >
                    Did not get a code ?
                </Link>
                <button
                    className={`${
                        resettingPassword ? "button-loading" : "form-button"
                    }`}
                >
                    reset password
                </button>
            </form>
        </FormContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        email: state.account.email,
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(ResetPassword);
