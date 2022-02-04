import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, connect } from "react-redux";

import { shareMemory } from "../../api/memories.api";

import { unselectAllUsers } from "../../redux/users/users.actions";
import { closeModal, showLoadingModal } from "../../redux/modal/modal.actions";
import { addSharedMemory } from "../../redux/shared-memories/shared-memories.actions";

import Heading from "../../components/heading/heading";
import UserSearch from "../../components/user-search/user-search";

const ShareMemory = ({
    selectedUsers,
    userInfo,
    sharedMemories: { options },
}) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const whileCreate = location.search.split("=")[1];
    const activeOption = options.find((option) => option.active);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, []);

    const handleMemoryShare = async () => {
        if (selectedUsers.length === 0) {
            return;
        }

        dispatch(showLoadingModal("sharing memory"));

        try {
            const data = await shareMemory(
                id,
                selectedUsers,
                false,
                userInfo.token
            );

            if (data.memory) {
                if (activeOption.title === "by me") {
                    dispatch(addSharedMemory(data.memory));
                }

                dispatch(unselectAllUsers());
                return navigate(`/memories/${id}`);
            }
        } catch (error) {
        } finally {
            dispatch(closeModal());
        }
    };

    return (
        <div>
            <Heading
                text="Share your memory"
                spacebetween
                backArrow={!whileCreate}
            >
                <button
                    className="button-secondary"
                    onClick={() => navigate(`/memories/${id}`)}
                >
                    {whileCreate ? "no thanks" : "cancel"}
                </button>
            </Heading>
            <UserSearch action="share" actionHandler={handleMemoryShare} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedUsers: state.users.selectedUsers,
        userInfo: state.currentUser.userInfo,
        sharedMemories: state.sharedMemories,
    };
};

export default connect(mapStateToProps)(ShareMemory);
