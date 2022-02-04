import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { HiPlus } from "react-icons/hi";

import {
    getMemorySpaces,
    setPage,
} from "../../redux/memory-spaces/memory-spaces.actions";

import Heading from "../../components/heading/heading";
import CardsList from "../../components/cards-list/cards-list";

const MemorySpaces = ({
    memorySpaces: {
        memorySpaces,
        loading,
        needToFetch,
        hasNext,
        hasPrev,
        page,
    },
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const memorySpacesMessage = "you are not a member of any memory spaces";
    const queryPage = Number(location.search.split("=")[1]);

    useEffect(() => {
        document.title = "Memory spaces";
    }, []);

    useEffect(() => {
        if (needToFetch && page) {
            dispatch(getMemorySpaces());
        }
    }, [needToFetch, page]);

    useEffect(() => {
        if (queryPage !== page) {
            dispatch(setPage(queryPage, true));
        }
    }, [queryPage]);

    const navigateToPage = (page) => {
        navigate(`/memory-spaces/?page=${page}`);
    };

    return (
        <div>
            <Heading text="memory spaces">
                <Link to="/memory-spaces/create" className="ml-5">
                    <HiPlus className="icon" />
                </Link>
            </Heading>
            <CardsList
                list={memorySpaces}
                type="memory space"
                message={memorySpacesMessage}
                loading={loading}
                link={{
                    title: "create memory space",
                    linkTo: "/memory-spaces/create",
                }}
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
        memorySpaces: state.memorySpaces,
    };
};

export default connect(mapStateToProps)(MemorySpaces);
