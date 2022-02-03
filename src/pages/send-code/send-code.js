import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setAccountEmail } from "../../redux/account/account.actions";

import { getErrors } from "../../utils/utils.errors";

import InputGroup from "../../components/input-group/input-group";
import MessagesContainer from "../../components/messages-container/messages-container";
import FormContainer from "../../components/form-container/form-container";

const SendCode = ({ email }) => {
    const [gettingLink, setGettingLink] = useState(false);
    const [errors, setErrors] = useState([]);

    const inputRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Send code";
    }, []);

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
                `/api/users/get-reset-code/${email.trim()}/`,
                {
                    method: "PATCH",
                }
            );
            const data = await response.json();

            if (response.status === 200) {
                return navigate("/reset-password");
            }

            if (response.status === 404) {
                return setErrors(["account with this email does not exist"]);
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
        <FormContainer title="reset your account">
            <form className="w-72" onSubmit={handleFormSubmit}>
                <MessagesContainer messages={errors} />
                <InputGroup
                    label="email"
                    placeholder="email accociated with your account"
                    info="you will get a code to reset your password in this email, check your spam if you do not see the code"
                    value={email}
                    ref={inputRef}
                    changeHandler={(email) => dispatch(setAccountEmail(email))}
                />
                <p
                    className="link ml-1 -mt-2 mb-3 text-lg"
                    onClick={() => {
                        if (!email) {
                            return setErrors(["email is required"]);
                        }

                        navigate("/reset-password");
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
        </FormContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        email: state.account.email,
    };
};

export default connect(mapStateToProps)(SendCode);
