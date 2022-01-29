import React from "react";
import { connect, useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { closeModal, showLoadingModal } from "../../redux/modal/modal.actions";

import Heading from "../../components/heading/heading";
import UserSearch from "../../components/user-search/user-search";

const AddMembers = ({ userInfo, selectedUsers }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const whileCreate = location.search.split("=")[1];
    const dispatch = useDispatch();

    const handleMembersAdd = async () => {
        dispatch(showLoadingModal("adding members"));

        try {
            const response = await fetch(
                `/api/memory-spaces/add-members/${id}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    body: JSON.stringify({
                        members: selectedUsers.map(
                            (selectedUser) => selectedUser.id
                        ),
                    }),
                }
            );
            const data = await response.json();

            if (data.memory_space) {
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
            <Heading text="add members" spacebetween>
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
    };
};

export default connect(mapStateToProps)(AddMembers);
