import React from "react";

const Tag = ({ children }) => {
    return (
        <div className="flex justify-center items-center bg-green-200 text-green-700 px-2 rounded-lg capitalize mr-1 mb-1">
            {children}
        </div>
    );
};

export default Tag;
