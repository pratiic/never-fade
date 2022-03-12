import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setCurrentUser } from "../../redux/current-user/current-user.actions";
import { resetFiles } from "../../redux/files/files.actions";
import {
    closeModal,
    showLoadingModal,
    showModal,
} from "../../redux/modal/modal.actions";

import { getErrors } from "../../utils/utils.errors";

import Heading from "../../components/heading/heading";
import ProfilePicture from "../../components/profile-picture/profile-picture";
import InputGroup from "../../components/input-group/input-group";
import FileSelector from "../../components/file-selector/file-selector";
import MessagesContainer from "../../components/messages-container/messages-container";
import FormContainer from "../../components/form-container/form-container";

const UserProfile = ({ userInfo, selectedFiles }) => {
    useEffect(() => {
        if (!userInfo) {
            return navigate("/login");
        }
    }, [userInfo]);

    const { id, avatar } = userInfo;
    const [username, setUsername] = useState(userInfo.username);
    const [email, setEmail] = useState(userInfo.email);
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Your profile";
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("username", username.trim());
        formData.append("email", email.trim());

        if (selectedFiles.length > 0) {
            formData.append("avatar", selectedFiles[0]);
        }

        dispatch(showLoadingModal("updating your profile"));

        try {
            const response = await fetch(`/api/users/update/${id}/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: formData,
            });
            const data = await response.json();

            if (data.user) {
                dispatch(setCurrentUser(data.user));
                return dispatch(resetFiles());
            }

            setErrors(getErrors(data));
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(closeModal());
        }
    };

    const handleChangePasswordClick = () => {
        dispatch(showModal(<ChangePassword />));
    };

    const ChangePassword = () => {
        const [currentPassword, setCurrentPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [repeatedNewPassword, setRepeatedNewPassword] = useState("");
        const [passwordErrors, setPasswordErrors] = useState([]);
        const [changing, setChanging] = useState(false);

        const passwordInputRef = useRef();

        useEffect(() => {
            passwordInputRef.current.focus();
        }, []);

        const handlePasswordFormSubmit = async (event) => {
            event.preventDefault();

            if (!newPassword) {
                return setPasswordErrors(["new password is required"]);
            }

            if (newPassword !== repeatedNewPassword) {
                return setPasswordErrors(["passwords do not match"]);
            }

            try {
                setPasswordErrors([]);
                setChanging(true);

                const response = await fetch(
                    `/api/users/change-password/${userInfo.id}/`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                        body: JSON.stringify({
                            current_password: currentPassword.trim(),
                            new_password: newPassword.trim(),
                        }),
                    }
                );
                const data = await response.json();

                if (data.user) {
                    dispatch(setCurrentUser(data.user));
                    return dispatch(closeModal());
                }

                setPasswordErrors(getErrors(data));
            } catch (error) {
            } finally {
                setChanging(false);
            }
        };

        return (
            <FormContainer title="change your password" backArrow={false}>
                <form
                    className="w-60 400:w-72"
                    onSubmit={handlePasswordFormSubmit}
                >
                    <MessagesContainer messages={passwordErrors} />
                    <InputGroup
                        label="current password"
                        value={currentPassword}
                        type="password"
                        ref={passwordInputRef}
                        changeHandler={setCurrentPassword}
                    />
                    <InputGroup
                        label="new password"
                        value={newPassword}
                        type="password"
                        changeHandler={setNewPassword}
                    />
                    <InputGroup
                        label="repeat password"
                        value={repeatedNewPassword}
                        type="password"
                        changeHandler={setRepeatedNewPassword}
                    />
                    <button
                        className={changing ? "button-loading" : "form-button"}
                        type="submit"
                    >
                        change
                    </button>
                </form>
            </FormContainer>
        );
    };

    return (
        <div>
            <Heading text="your profile"></Heading>
            <div className="flex flex-col items-center 600:flex-row 600:items-start 600:justify-center">
                <div className="w-52">
                    <ProfilePicture
                        url={avatar}
                        username={username}
                        size="full"
                        rounded={false}
                        expand={true}
                    />
                    <div className="mt-3"></div>
                    <FileSelector full />
                </div>
                <form className="w-72 600:ml-7" onSubmit={handleFormSubmit}>
                    <MessagesContainer messages={errors} />
                    <InputGroup
                        label="username"
                        value={username}
                        changeHandler={setUsername}
                    />
                    <InputGroup
                        label="email"
                        value={email}
                        changeHandler={setEmail}
                    />
                    <p
                        className="link text-lg -mt-2 cursor-pointer ml-1"
                        onClick={handleChangePasswordClick}
                    >
                        Change password
                    </p>
                    <button type="submit" className="form-button">
                        update
                    </button>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        selectedFiles: state.files.selectedFiles,
    };
};

export default connect(mapStateToProps)(UserProfile);
