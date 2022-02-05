import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import { setCurrentUser } from "../../redux/current-user/current-user.actions";

import { getUserDetails } from "../../api/users.api";

import ProfilePicture from "../profile-picture/profile-picture";

const ProfilePreview = ({ username, avatar, userInfo }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchCurrentUserDetails();
    }, []);

    const fetchCurrentUserDetails = async () => {
        const data = await getUserDetails(userInfo.token);

        if (data.user) {
            dispatch(setCurrentUser(data.user));
        }
    };

    return (
        <Link to="/profile/me" className="flex items-center">
            <ProfilePicture url={avatar} username={username} />
            <p className="text-md capitalize text-black ml-2 max-w-7 500:max-w-fit truncate">
                {username}
            </p>
        </Link>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(ProfilePreview);
