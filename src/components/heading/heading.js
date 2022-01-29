import React from "react";

const Heading = ({ text, spacebetween, size, children }) => {
    return (
        <div
            className={`${size === "smaller" ? "heading-smaller" : "heading"} ${
                spacebetween && "heading-space-between"
            }`}
        >
            <h2>{text}</h2>
            {children}
        </div>
    );
};

export default Heading;
