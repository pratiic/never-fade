import React from "react";
import { connect, useDispatch } from "react-redux";
import { TiTick } from "react-icons/ti";

import { selectUser, unselectUser } from "../../redux/users/users.actions";

import ProfilePicture from "../profile-picture/profile-picture";

const UserCard = ({
    id,
    username,
    email,
    avatar,
    allowSelect,
    selectedUsers,
    showSelect,
    size,
    border = false,
    userInfo,
    clickHandler,
}) => {
    const dispatch = useDispatch();
    const selected = selectedUsers.find(
        (selectedUser) => selectedUser.id === id
    );

    const handleUserClick = () => {
        if (clickHandler) {
            return clickHandler();
        }

        if (allowSelect) {
            if (!selected) {
                dispatch(selectUser({ id, username, email, avatar }));
            } else {
                dispatch(unselectUser(id));
            }
        }
    };

    return (
        <div
            className={`flex items-center px-1 py-2 max-w-17 w-fit 400:max-w-20 500:max-w-25 cursor-pointer ${
                border && "border-b border-grey"
            }`}
            onClick={handleUserClick}
        >
            <ProfilePicture url={avatar} username={username} size={size} />
            <div className="ml-2 max-w-full">
                <p className="text-black text-lg">
                    {userInfo.id === id ? "me" : username}
                </p>
                <p className="text-grey-darker -mt-1 truncate">{email}</p>
            </div>
            {selected && <TiTick className="text-blue h-5 w-5" />}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedUsers: state.users.selectedUsers,
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(UserCard);
