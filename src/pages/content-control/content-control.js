import React, { useState, useEffect, useRef } from "react";
import { useDispatch, connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { updateMemory } from "../../redux/memories/memories.actions";
import { resetFiles } from "../../redux/files/files.actions";
import { updateMemorySpace } from "../../redux/memory-spaces/memory-spaces.actions";
import { closeModal, showLoadingModal } from "../../redux/modal/modal.actions";

import { getErrors } from "../../utils/utils.errors";

import FormContainer from "../../components/form-container/form-container";
import InputGroup from "../../components/input-group/input-group";
import FileSelector from "../../components/file-selector/file-selector";
import MessagesContainer from "../../components/messages-container/messages-container";

const ContentControl = ({
    editMode,
    userInfo,
    selectedFiles,
    memoryToUpdate,
    memoryUpdateErrors,
    type,
    memorySpaceToUpdate,
    memorySpaceUpdateErrors,
}) => {
    const contentToUpdate =
        type === "memory space" ? memorySpaceToUpdate : memoryToUpdate;

    const [title, setTitle] = useState(
        contentToUpdate.title || contentToUpdate.name || ""
    );
    const [description, setDescription] = useState(
        contentToUpdate.description || ""
    );
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [contentMemory, setContentMemory] = useState(type === "memory");

    const location = useLocation();
    const memorySpace = location.search.split("=")[1];
    const formTitle = editMode
        ? `Edit ${type}`
        : `Create a ${type} ${memorySpace ? "in your memory space" : ""}`;
    const dispatch = useDispatch();
    const inputRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            return navigateToLogin();
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

    const navigateToLogin = () => {
        navigate(`/login/?redirect=${location.pathname}`);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const link = `/api/${
            contentMemory ? "memories" : "memory-spaces"
        }/create/`;

        if (!userInfo) {
            return navigateToLogin();
        }

        if (editMode) {
            if (type === "memory space") {
                const formData = new FormData();
                formData.append("name", title);
                formData.append("description", description);

                if (selectedFiles.length > 0) {
                    formData.append("image", selectedFiles[0]);
                }

                return dispatch(
                    updateMemorySpace(memorySpaceToUpdate.id, formData, () => {
                        navigate(`/memory-spaces/${memorySpaceToUpdate.id}`);
                    })
                );
            }

            return dispatch(
                updateMemory(memoryToUpdate.id, { title, description }, () => {
                    navigate(`/memories/${memoryToUpdate.id}`);
                })
            );
        }

        const formData = new FormData();
        formData.append(contentMemory ? "title" : "name", title);
        formData.append("description", description);

        // formData.append(
        //     "date",
        //     date ? new Date(date).toDateString() : new Date().toDateString()
        // );

        if (contentMemory && memorySpace) {
            formData.append("memory_space", memorySpace);
        }

        if (selectedFiles.length > 0) {
            if (contentMemory) {
                selectedFiles.forEach((selectedFile) => {
                    formData.append("images", selectedFile);
                });
            } else {
                formData.append("image", selectedFiles[0]);
            }
        }

        try {
            setErrors([]);
            setLoading(true);
            dispatch(showLoadingModal(`creating ${type}`));
            const response = await fetch(link, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: formData,
            });
            const data = await response.json();

            if (response.status === 201) {
                return handleFetchComplete(data);
            }

            // if (data.memory) {
            //     return navigate(
            //         `/memories/share/${data.memory.id}/?while-create=true`
            //     );
            // }

            setErrors(getErrors(data));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            dispatch(closeModal());
        }
    };

    const handleFetchComplete = (data) => {
        if (contentMemory) {
            if (memorySpace) {
                return navigate(`/memory-spaces/${memorySpace}`);
            }
            return navigate(
                `/memories/share/${data.memory.id}/?while-create=true`
            );
        }

        return navigate(
            `/memory-spaces/add-members/${data.memory_space.id}/?while-create=true`
        );
    };

    return (
        <FormContainer title={formTitle}>
            <form onSubmit={handleFormSubmit} className="w-72">
                <MessagesContainer
                    messages={
                        editMode
                            ? type === "memory space"
                                ? memorySpaceUpdateErrors
                                : memoryUpdateErrors
                            : errors
                    }
                />
                <InputGroup
                    label={`${contentMemory ? "title" : "name"}`}
                    placeholder={`${
                        contentMemory ? "title" : "name"
                    } of your ${type}`}
                    value={title}
                    ref={inputRef}
                    changeHandler={setTitle}
                />
                <InputGroup
                    label="description"
                    placeholder="optional"
                    value={description}
                    displayType="textarea"
                    changeHandler={setDescription}
                />
                {/* <InputGroup
                    label="memory date"
                    placeholder="optional"
                    value={date}
                    info="if left empty, this will be assigned to today's date"
                    changeHandler={setDate}
                /> */}
                {!editMode && (
                    <FileSelector
                        label={contentMemory ? "images" : "image"}
                        multiple={contentMemory}
                    />
                )}
                {editMode && type === "memory space" && (
                    <FileSelector
                        label="image"
                        preview={memorySpaceToUpdate.image}
                    />
                )}
                <button
                    type="submit"
                    className={`form-button ${loading && "button-loading"}`}
                >
                    {editMode ? "edit" : "create"}
                </button>
            </form>
        </FormContainer>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        selectedFiles: state.files.selectedFiles,
        memoryToUpdate: state.memories.memoryToUpdate,
        memoryUpdateErrors: state.memories.memoryUpdateErrors,
        memorySpaceToUpdate: state.memorySpaces.memorySpaceToUpdate,
        memorySpaceUpdateErrors: state.memorySpaces.memorySpaceUpdateErrors,
    };
};

export default connect(mapStateToProps)(ContentControl);
