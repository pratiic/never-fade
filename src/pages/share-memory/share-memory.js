import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, connect } from "react-redux";

import { unselectAllUsers } from "../../redux/users/users.actions";
import { closeModal, showLoadingModal } from "../../redux/modal/modal.actions";

import Heading from "../../components/heading/heading";
import UserSearch from "../../components/user-search/user-search";

const ShareMemory = ({ selectedUsers, userInfo }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const whileCreate = location.search.split("=")[1];
    const redirect = whileCreate ? "/" : `/memories/${id}`;

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
            const response = await fetch(`/api/memories/share/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    shared_with: selectedUsers.map((selectedUser) => {
                        return selectedUser.id;
                    }),
                }),
            });
            const data = await response.json();

            if (data.memory) {
                dispatch(unselectAllUsers());
                return navigateToRedirect();
            }

            console.log(data);
        } catch (error) {
        } finally {
            dispatch(closeModal());
        }
    };

    const navigateToRedirect = () => {
        navigate(redirect);
    };

    return (
        <div>
            <Heading text="Share your memory" spacebetween>
                <button
                    className="button-secondary"
                    onClick={navigateToRedirect}
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
    };
};

export default connect(mapStateToProps)(ShareMemory);
