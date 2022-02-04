import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import {
    getSharedMemories,
    setPage,
    setSharedMemoriesType,
} from "../../redux/shared-memories/shared-memories.actions";

import CardsList from "../../components/cards-list/cards-list";
import OptionsToggler from "../../components/options-toggler/options-toggler";
import Heading from "../../components/heading/heading";

const SharedMemories = ({
    sharedMemories: {
        sharedMemories,
        loading,
        type,
        options,
        needToFetch,
        hasNext,
        hasPrev,
        page,
    },
    userInfo,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const sharedMemoriesMessage =
        type === "with me"
            ? "no one has shared any memories with you"
            : "you have not shared any memories";
    const queryPage = Number(location.search.split("=")[1]);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (needToFetch && page) {
            dispatch(getSharedMemories(type));
        }
    }, [needToFetch, page]);

    useEffect(() => {
        if (queryPage > 0) {
            return dispatch(setPage(queryPage, queryPage !== page));
        }

        navigateToPage(page || 1);
    }, [queryPage]);

    useEffect(() => {
        document.title = "Shared memories";
    }, []);

    const toggleHandler = (option) => {
        navigateToPage(1);
        dispatch(setSharedMemoriesType(option.title));
    };

    const navigateToPage = (page) => {
        navigate(`/shared-memories/?page=${page}`);
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
                hasNext={hasNext}
                hasPrev={hasPrev}
                page={page}
                fetchNextInitiator={() => navigateToPage(page + 1)}
                fetchPrevInitiator={() => navigateToPage(page - 1)}
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
