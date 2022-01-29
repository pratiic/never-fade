import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useDispatch, connect } from "react-redux";

import { toggleDropdown as toggleDropdownRedux } from "../../redux/dropdown/dropdown.actions";

import Dropdown from "../dropdown/dropdown";
import DropdownItem from "../dropdown-item/dropdown-item";

const OptionsToggler = ({
    options,
    toggleHandler,
    dropdownPosition = "right",
    showDropdownRedux,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const activeOption = options.find((option) => option.active);
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

    const handleDropdownItemClick = (title) => {
        toggleHandler(options.find((option) => option.title === title));
    };

    return (
        <div className="relative w-fit">
            <span
                className="flex items-center bg-grey px-2 h-9 rounded cursor-pointer capitalize hover:bg-grey-dark active:bg-grey-darkest transition-all duration-100"
                onClick={toggleDropdown}
            >
                {activeOption.title}
                <FiChevronDown className="ml-1" />
            </span>

            <Dropdown show={showDropdown} position={dropdownPosition}>
                {options.map((option) => {
                    return (
                        <DropdownItem
                            key={option.title}
                            clickHandler={() =>
                                handleDropdownItemClick(option.title)
                            }
                        >
                            {option.title}
                        </DropdownItem>
                    );
                })}
            </Dropdown>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        showDropdownRedux: state.dropdown.showDropdown,
    };
};

export default connect(mapStateToProps)(OptionsToggler);
