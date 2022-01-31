import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import { setSearchType } from "../../redux/search/search.actions";

import Heading from "../../components/heading/heading";
import GenericSearch from "../../components/generic-search/generic-search";
import CardsList from "../../components/cards-list/cards-list";
import OptionsToggler from "../../components/options-toggler/options-toggler";

const ContentSearch = ({ userInfo, search: { options } }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const type = options.find((option) => option.active).title;

    const [searchMessage, setSearchMessage] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "Search";
    }, []);

    useEffect(() => {
        setSearchMessage(
            `${
                type === "memory"
                    ? "memories that you have created or been shared or part of your memory spaces"
                    : "memory spaces that you are a part of"
            } will appear here`
        );
    }, [type]);

    const handleFormSubmit = async (searchTerm) => {
        const link = `/api/${
            type === "memory" ? "memories" : "memory-spaces"
        }/search?query=${searchTerm}`;
        setLoading(true);

        try {
            const response = await fetch(link, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const data = await response.json();

            if (response.status === 200) {
                setSearchResults(data.memories || data.memory_spaces);

                if (data.memories) {
                    if (data.memories.length === 0) {
                        setSearchMessage("memories not found");
                    }
                }

                if (data.memory_spaces) {
                    if (data.memory_spaces.length === 0) {
                        setSearchMessage("memory spaces not found");
                    }
                }
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const toggleHandler = (option) => {
        setSearchResults([]);
        dispatch(setSearchType(option.title));
    };

    return (
        <div>
            <Heading
                text={`search for ${
                    type === "memory" ? "memories" : "memory spaces"
                }`}
            ></Heading>
            <div className="flex items-center flex-wrap">
                <div className="mb-3">
                    <OptionsToggler
                        options={options}
                        toggleHandler={toggleHandler}
                        dropdownPosition="left"
                    />
                </div>
                <div className="mr-3"></div>
                <div className="mb-3">
                    <GenericSearch
                        placeholder="memory title, description, date"
                        submitHandler={handleFormSubmit}
                    />
                </div>
            </div>
            {searchResults.length > 0 && (
                <p className="ml-3 mb-3 text-grey-darker text-lg">
                    Found {searchResults.length}{" "}
                    {type === "memory"
                        ? searchResults.length > 1
                            ? "memories"
                            : "memory"
                        : searchResults.length > 1
                        ? "memory spaces"
                        : "memory space"}
                </p>
            )}
            {/* <div className="mb-3"></div> */}
            <CardsList
                list={searchResults}
                type={type}
                message={searchMessage}
                loading={loading}
                messagePosition="left"
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        search: state.search,
    };
};

export default connect(mapStateToProps)(ContentSearch);
