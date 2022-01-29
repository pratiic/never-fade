import React from "react";

const SidebarIcon = ({ icon, active, clickHandler }) => {
    return (
        <div
            className={`sidebar-icon-container group transition-all ease-in duration-100 ${
                active && "sidebar-icon-container-active"
            }`}
            onClick={clickHandler}
        >
            {icon}
        </div>
    );
};

export default SidebarIcon;
