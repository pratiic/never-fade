import React from "react";
import { connect, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { closeModal, showLoadingModal } from "../../redux/modal/modal.actions";

import { addMembers } from "../../api/memory-spaces.api";

import Heading from "../../components/heading/heading";
import UserSearch from "../../components/user-search/user-search";
import { updateMemorySpace } from "../../redux/memory-spaces/memory-spaces.actions";

const AddMembers = ({ userInfo, selectedUsers, memorySpaces }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const whileCreate = location.search.split("=")[1];
    const dispatch = useDispatch();
    const memorySpace = memorySpaces.find((space) => space.id === Number(id));

    const handleMembersAdd = async () => {
        dispatch(showLoadingModal("adding members"));

        try {
            const data = await addMembers(
                id,
                selectedUsers,
                false,
                userInfo.token
            );

            if (data.memory_space) {
                if (memorySpace) {
                    dispatch({
                        type: "MEMORY_SPACE_UPDATE_SUCCESS",
                        payload: data.memory_space,
                    });
                }
                navigate(`/memory-spaces/${id}`);
            }
        } catch (error) {
        } finally {
            dispatch(closeModal());
        }
    };

    const handleButtonClick = () => {
        navigate(`/memory-spaces/${id}`);
    };

    return (
        <div>
            <Heading text="add members" spacebetween backArrow={!whileCreate}>
                <button
                    className="button-secondary"
                    onClick={handleButtonClick}
                >
                    {whileCreate ? "no thanks" : "cancel"}
                </button>
            </Heading>
            <UserSearch action="add" actionHandler={handleMembersAdd} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        selectedUsers: state.users.selectedUsers,
        memorySpaces: state.memorySpaces.memorySpaces,
    };
};

export default connect(mapStateToProps)(AddMembers);
