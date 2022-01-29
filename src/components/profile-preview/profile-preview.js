import React from "react";
import { Link } from "react-router-dom";

import ProfilePicture from "../profile-picture/profile-picture";

const ProfilePreview = ({ username, avatar }) => {
    return (
        <Link to="/profile/me" className="flex items-center">
            <ProfilePicture url={avatar} username={username} />
            <p className="text-md capitalize text-black ml-2">{username}</p>
        </Link>
    );
};

export default ProfilePreview;
