import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getErrors } from "../../utils/utils.errors";

import FormContainer from "../../components/form-container/form-container";
import InputGroup from "../../components/input-group/input-group";
import MessagesContainer from "../../components/messages-container/messages-container";

const ResetAccount = () => {
    const [gotLink, setGotLink] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const navigate = useNavigate();

    const CodeSender = () => {
        const [email, setEmail] = useState(userEmail || "");
        const [gettingLink, setGettingLink] = useState(false);
        const [errors, setErrors] = useState([]);

        const inputRef = useRef();

        useEffect(() => {
            inputRef.current.focus();
        }, []);

        const handleFormSubmit = async (event) => {
            event.preventDefault();

            if (!email) {
                return setErrors(["email is required"]);
            }

            setGettingLink(true);

            try {
                const response = await fetch(
                    `/api/users/get-reset-code/${email}/`,
                    {
                        method: "PATCH",
                    }
                );
                const data = await response.json();

                if (response.status === 200) {
                    setUserEmail(email);
                    return setGotLink(true);
                }

                if (response.status === 404) {
                    return setErrors([
                        "account with this email does not exist",
                    ]);
                }

                if (data.errors) {
                    setErrors(getErrors(data));
                }
            } catch (error) {
            } finally {
                setGettingLink(false);
            }
        };

        return (
            <form className="w-72" onSubmit={handleFormSubmit}>
                <MessagesContainer messages={errors} />
                <InputGroup
                    label="email"
                    placeholder="email accociated with your account"
                    info="you will get a code to reset your password in this email, check your spam if you do not see the code"
                    value={email}
                    ref={inputRef}
                    changeHandler={setEmail}
                />
                <p
                    className="link ml-1 -mt-2 mb-3 text-lg"
                    onClick={() => {
                        if (!email) {
                            return setErrors(["email is required"]);
                        }

                        setUserEmail(email);
                        setGotLink(true);
                    }}
                >
                    Already have a code ?
                </p>
                <button
                    className={`${
                        gettingLink ? "button-loading" : "form-button"
                    }`}
                    type="submit"
                >
                    get code
                </button>
            </form>
        );
    };

    const PasswordReset = () => {
        const [code, setCode] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [repeatedNewPassword, setRepeatedNewPassword] = useState("");
        const [resettingPassword, setResettingPassword] = useState(false);
        const [errors, setErrors] = useState([]);

        const inputRef = useRef();

        useEffect(() => {
            inputRef.current.focus();
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
                        email: userEmail,
                        reset_code: code,
                        new_password: newPassword,
                    }),
                });
                const data = await response.json();

                if (response.status === 200) {
                    return navigate("/");
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
                <p
                    className="link ml-1 -mt-2 mb-3 text-lg"
                    onClick={() => setGotLink(false)}
                >
                    Did not get a code ?
                </p>
                <button
                    className={`${
                        resettingPassword ? "button-loading" : "form-button"
                    }`}
                >
                    reset password
                </button>
            </form>
        );
    };

    return (
        <FormContainer title="reset your account">
            {gotLink ? <PasswordReset /> : <CodeSender />}
        </FormContainer>
    );
};

export default ResetAccount;
