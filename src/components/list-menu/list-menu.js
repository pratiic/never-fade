import React, { useState, useEffect } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { connect, useDispatch } from "react-redux";

import { toggleDropdown as toggleDropdownRedux } from "../../redux/dropdown/dropdown.actions";

import Dropdown from "../dropdown/dropdown";
import DropdownItem from "../dropdown-item/dropdown-item";

const ListMenu = ({ option, clickHandler, showDropdownRedux }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!showDropdownRedux) {
            setShowDropdown(false);
        }
    }, [showDropdownRedux]);

    const toggleDropdown = (event) => {
        event.stopPropagation();

        dispatch(toggleDropdownRedux());
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="relative">
            <HiMenuAlt4 className="icon-bigger" onClick={toggleDropdown} />
            <Dropdown show={showDropdown}>
                <DropdownItem clickHandler={clickHandler}>
                    {option}
                </DropdownItem>
            </Dropdown>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        showDropdownRedux: state.dropdown.showDropdown,
    };
};

export default connect(mapStateToProps)(ListMenu);
