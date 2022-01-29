import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { resetFiles } from "../../redux/files/files.actions";
import { closeModal, showLoadingModal } from "../../redux/modal/modal.actions";

import { getErrors } from "../../utils/utils.errors";

import FileSelector from "../file-selector/file-selector";
import MessagesContainer from "../messages-container/messages-container";

const ImagesAdder = ({ selectedFiles, userInfo, addMemoryImages }) => {
    const [errors, setErrors] = useState([]);

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(resetFiles());
        };
    }, []);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (selectedFiles.length === 0) {
            return;
        }

        const formData = new FormData();

        selectedFiles.forEach((selectedFile) => {
            formData.append("images", selectedFile);
        });
        dispatch(showLoadingModal("adding images"));

        try {
            const response = await fetch(`/api/images/${id}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: formData,
            });
            const data = await response.json();

            if (data.images) {
                return addMemoryImages(data.images);
            }

            setErrors(getErrors(data));
        } catch (error) {
        } finally {
            dispatch(closeModal());
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="max-w-sm">
            <MessagesContainer messages={errors} />
            <FileSelector multiple />
            <button className="button">add images</button>
        </form>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedFiles: state.files.selectedFiles,
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(ImagesAdder);
