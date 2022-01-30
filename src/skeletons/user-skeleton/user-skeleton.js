import React from "react";

const UserSkeleton = () => {
    return (
        <div className="flex items-center w-96 max-w-full py-2 mb-1 animate-pulse">
            <div className="h-11 w-11 bg-grey rounded-full"></div>
            <div className="flex-1 ml-2">
                <div className="h-5 bg-grey mb-2 rounded w-2/3"></div>
                <div className="h-5 bg-grey rounded"></div>
            </div>
        </div>
    );
};

export default UserSkeleton;
