import React from "react";
import { connect } from "react-redux";

const Dropdown = ({ children, show, position = "right", showDropdown }) => {
    if (!show || !showDropdown) {
        return null;
    }

    return (
        <div
            className={`absolute top-11 shadow-lg z-20 ${
                position === "right" ? "-right-1" : "left-1"
            }`}
        >
            {children}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        showDropdown: state.dropdown.showDropdown,
    };
};

export default connect(mapStateToProps)(Dropdown);
