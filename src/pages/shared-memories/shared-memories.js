import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getSharedMemories,
    setSharedMemoriesType,
} from "../../redux/shared-memories/shared-memories.actions";

import CardsList from "../../components/cards-list/cards-list";
import OptionsToggler from "../../components/options-toggler/options-toggler";
import Heading from "../../components/heading/heading";

const SharedMemories = ({
    sharedMemories: { sharedMemories, loading, type, options, needToFetch },
    userInfo,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sharedMemoriesMessage =
        type === "with me"
            ? "no one has shared any memories with you"
            : "you have not shared any memories";

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (needToFetch) {
            dispatch(getSharedMemories(type));
        }
    }, [needToFetch]);

    useEffect(() => {
        document.title = "Shared memories";
    }, []);

    const toggleHandler = (option) => {
        dispatch(setSharedMemoriesType(option.title));
    };

    return (
        <div>
            <Heading text="shared memories" spacebetween>
                <div className="flex items-center">
                    <span className="text-lg text-grey-darker capitalize mr-2">
                        shared
                    </span>
                    <OptionsToggler
                        options={options}
                        toggleHandler={toggleHandler}
                    />
                </div>
            </Heading>

            <CardsList
                list={sharedMemories}
                message={sharedMemoriesMessage}
                loading={loading}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        sharedMemories: state.sharedMemories,
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(SharedMemories);
