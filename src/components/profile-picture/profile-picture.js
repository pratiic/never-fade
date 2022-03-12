import React from "react";
import { useDispatch } from "react-redux";

import { showGallery } from "../../redux/gallery/gallery.actions";

const ProfilePicture = ({
    url,
    username,
    size,
    rounded = true,
    expand = false,
}) => {
    const dispatch = useDispatch();
    const imageURL =
        url || `https://avatars.dicebear.com/api/initials/${username}.svg`;
    let classNames = "";

    if (size === "smaller") {
        classNames += " h-9 w-9";
    } else if (size === "bigger") {
        classNames = " h-32 w-32";
    } else if (size === "full") {
        classNames = " w-full";
    } else {
        classNames += " h-11 w-11";
    }

    const handleImageClick = () => {
        if (expand) {
            dispatch(showGallery([{ src: imageURL, id: username }]));
        }
    };

    return (
        <div
            className={`${
                rounded ? "rounded-full" : "rounded"
            } ${classNames} bg-grey`}
        >
            <img
                src={imageURL}
                alt="profile img"
                className={`block h-full w-full object-cover cursor-pointer ${
                    rounded ? "rounded-full" : "rounded"
                }`}
                onClick={handleImageClick}
            />
        </div>
    );
};

export default ProfilePicture;
