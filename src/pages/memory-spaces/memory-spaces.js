import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";

import { getMemorySpaces } from "../../redux/memory-spaces/memory-spaces.actions";
import { setSearchType } from "../../redux/search/search.actions";

import Heading from "../../components/heading/heading";
import CardsList from "../../components/cards-list/cards-list";

const MemorySpaces = ({ memorySpaces: { memorySpaces, loading } }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const memorySpacesMessage = "you are not a member of any memory spaces";

    useEffect(() => {
        dispatch(getMemorySpaces());
    }, []);

    const handleSearchClick = () => {
        dispatch(setSearchType("memory space"));
        navigate("/search");
    };

    return (
        <div>
            <Heading text="memory spaces">
                <div className="flex items-center">
                    <Link to="/memory-spaces/create" className="ml-5">
                        <AiOutlinePlus className="icon" />
                    </Link>
                    <FiSearch
                        className="icon ml-3"
                        onClick={handleSearchClick}
                    />
                </div>
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
