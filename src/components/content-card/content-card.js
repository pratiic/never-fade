import React from "react";
import { useNavigate } from "react-router-dom";

import { getDate } from "../../utils/utils.date-time";

const ContentCard = ({ title, created_at, id, image, type, users, query }) => {
    const navigate = useNavigate();
    const link =
        type === "memory"
            ? `/memories/${id}${query ? `/?${query}` : "/"}`
            : `/memory-spaces/${id}`;

    const handleContentCardClick = () => {
        navigate(link);
    };

    return (
        <div
            className="rounded cursor-pointer h-fit shadow-sm hover:scale-102 hover:shadow-lg active:scale-100 active:shadow-sm transition-all duration-100"
            onClick={handleContentCardClick}
        >
            <img
                src={
                    image
                        ? image
                        : `https://avatars.dicebear.com/api/initials/${title}.svg`
                }
                className={`block w-full object-cover top-rounded ${
                    image ? "max-h-64" : "h-44"
                }`}
            />
            <div className="bg-grey-light py-2 pl-3 rounded-bl rounded-br">
                <h4 className="text-lg capitalize text-black">{title}</h4>
                {created_at && type === "memory" && (
                    <p className="text-grey-darker -mt-1">
                        {getDate(created_at)}
                    </p>
                )}
                {type === "memory space" && (
                    <p className="text-grey-darker -mt-1">
                        {users.length} {users.length > 1 ? "members" : "member"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ContentCard;
