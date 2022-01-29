import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { closeModal } from "../../redux/modal/modal.actions";

import OptionsToggler from "../options-toggler/options-toggler";

const ContentOptions = ({ userInfo }) => {
    const [options, setOptions] = useState([
        { title: "memory", active: true },
        { title: "memory space", active: false },
    ]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToggle = (opt) => {
        setOptions(
            options.map((option) => {
                if (option.title === opt.title) {
                    return { ...option, active: true };
                }

                return { ...option, active: false };
            })
        );
    };

    const handleCreateClick = () => {
        const activeOption = options.find((option) => option.active);

        if (activeOption === "memory") {
            return navigate("/memories/create");
        }

        navigate("/memory-spaces/create");
        dispatch(closeModal());
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl mt-2 mb-5 text-center text-black">
                What would you like to create, {userInfo.username} ?
            </h3>
            <div className="flex items-center justify-center">
                <OptionsToggler
                    options={options}
                    toggleHandler={handleToggle}
                />
                <button className="button ml-5" onClick={handleCreateClick}>
                    create
                </button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(ContentOptions);
