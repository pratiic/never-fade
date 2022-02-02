import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { HiPlus } from "react-icons/hi";

import { getMemorySpaces } from "../../redux/memory-spaces/memory-spaces.actions";
import { setSearchType } from "../../redux/search/search.actions";

import Heading from "../../components/heading/heading";
import CardsList from "../../components/cards-list/cards-list";

const MemorySpaces = ({
    memorySpaces: { memorySpaces, loading, needToFetch },
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const memorySpacesMessage = "you are not a member of any memory spaces";

    useEffect(() => {
        document.title = "Memory spaces";
    }, []);

    useEffect(() => {
        if (needToFetch) {
            dispatch(getMemorySpaces());
        }
    }, [needToFetch]);

    const handleSearchClick = () => {
        dispatch(setSearchType("memory space"));
        navigate("/search");
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
