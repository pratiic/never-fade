import React from "react";

import BackArrow from "../back-arrow/back-arrow";

const Heading = ({ text, spacebetween, size, backArrow = true, children }) => {
    return (
        <div
            className={`${size === "smaller" ? "heading-smaller" : "heading"} ${
                spacebetween && "heading-space-between"
            }`}
        >
            <div className="flex items-center">
                {backArrow && <BackArrow />}
                <h2>{text}</h2>
            </div>
            {children}
        </div>
    );
};

export default Heading;
