import React, { useState, useEffect } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { useDispatch, connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    removeMemory,
    setMemoryToUpdate,
    setNeedToFetch as setNeedToFetchMemories,
} from "../../redux/memories/memories.actions";
import {
    removeMemorySpace,
    setMemorySpaceToUpdate,
    setNeedToFetch as setNeedToFetchSpaces,
} from "../../redux/memory-spaces/memory-spaces.actions";
import { toggleDropdown as toggleDropdownRedux } from "../../redux/dropdown/dropdown.actions";
import {
    closeModal,
    showConfirmationModal,
    showLoadingModal,
} from "../../redux/modal/modal.actions";
import {
    removeSharedMemory,
    setNeedToFetch as setNeedToFetchSharedMemories,
} from "../../redux/shared-memories/shared-memories.actions";

import Dropdown from "../dropdown/dropdown";
import DropdownItem from "../dropdown-item/dropdown-item";

const ContentMenu = ({
    id,
    title,
    description,
    userInfo,
    type,
    image,
    date,
    category,
    showDropdownRedux,
    memories,
    sharedMemories,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!showDropdownRedux) {
            setShowDropdown(false);
        }
    }, [showDropdownRedux]);

    const toggleDropdown = (event) => {
        event.stopPropagation();

        dispatch(toggleDropdownRedux());
        setShowDropdown(!showDropdown);
    };

    const handleEditClick = () => {
        let updateInfo = { id, description };

        if (type === "memory") {
            updateInfo = { ...updateInfo, title, date, category };
            dispatch(setMemoryToUpdate(updateInfo));
            return navigate(`/memories/edit/${id}`);
        }

        updateInfo.name = title;
        updateInfo.image = image;
        dispatch(setMemorySpaceToUpdate(updateInfo));
        return navigate(`/memory-spaces/edit/${id}`);
    };

    const handleDeleteClick = () => {
        dispatch(
            showConfirmationModal(
                `are you sure you want to delete this ${type} ?`,
                handleContentDeletion
            )
        );
    };

    const handleContentDeletion = async () => {
        const link = `/api/${
            type === "memory" ? "memories" : "memory-spaces"
        }/delete/${id}/`;
        dispatch(showLoadingModal(`deleting ${type}`));

        try {
            const response = await fetch(link, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const data = await response.json();

            if (response.status === 200) {
                if (type === "memory") {
                    if (memories.find((memory) => memory.id === Number(id))) {
                        dispatch(setNeedToFetchMemories(true));
                    }

                    if (
                        sharedMemories.find(
                            (memory) => memory.id === Number(id)
                        )
                    ) {
                        dispatch(setNeedToFetchSharedMemories(true));
                    }
                    // dispatch(removeMemory(Number(id)));
                    // dispatch(removeSharedMemory(Number(id)));
                    return navigate(-1);
                }

                // dispatch(removeMemorySpace(Number(id)));
                dispatch(setNeedToFetchSpaces(true));
                navigate("/memory-spaces");
            }
        } catch (error) {
        } finally {
            dispatch(closeModal());
        }
    };

    return (
        <div className="relative">
            <HiMenuAlt4 className="icon-bigger" onClick={toggleDropdown} />
            <Dropdown show={showDropdown}>
                <DropdownItem clickHandler={handleEditClick}>
                    edit {type}
                </DropdownItem>
                <DropdownItem clickHandler={handleDeleteClick}>
                    delete {type}
                </DropdownItem>
            </Dropdown>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        showDropdownRedux: state.dropdown.showDropdown,
        memories: state.memories.memories,
        sharedMemories: state.sharedMemories.sharedMemories,
    };
};

export default connect(mapStateToProps)(ContentMenu);
