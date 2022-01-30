import React from "react";

const SidebarIcon = ({ icon, active, clickHandler }) => {
    return (
        <div
            className="sidebar-icon-container group-hover:bg-grey-darkest group-active:bg-grey-dark transition-all duration-100"
            onClick={clickHandler}
        >
            {icon}
        </div>
    );
};

export default SidebarIcon;
