import React from "react";

const ContentSkeleton = () => {
    return (
        <div className="shadow-sm rounded animate-pulse">
            <div className="bg-grey h-44 top-rounded"></div>
            <div className="bg-grey-light p-2 bottom-rounded">
                <div className="w-3/4 h-5 bg-grey rounded mb-2"></div>
                <div className="w-1/4 h-5 bg-grey rounded"></div>
            </div>
        </div>
    );
};

export default ContentSkeleton;
