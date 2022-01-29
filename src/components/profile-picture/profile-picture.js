import React from "react";

const ProfilePicture = ({ url, username, size, rounded = true }) => {
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

    return (
        <img
            src={
                url ||
                `https://avatars.dicebear.com/api/initials/${username}.svg`
            }
            className={`block ${
                rounded ? "rounded-full" : "rounded"
            } ${classNames}`}
        />
    );
};

export default ProfilePicture;
