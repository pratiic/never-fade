import React from "react";

const DropdownItem = ({ children, clickHandler }) => {
    return (
        <div
            className="bg-grey px-4 py-1 text-lg text-grey-darker cursor-pointer hover:bg-grey-dark hover:text-black capitalize whitespace-nowrap first:rounded-tl first:rounded-tr last:rounded-bl last:rounded-br"
            onClick={clickHandler}
        >
            {children}
        </div>
    );
};

export default DropdownItem;
