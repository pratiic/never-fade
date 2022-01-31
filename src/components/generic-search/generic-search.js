import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const GenericSearch = ({ placeholder, submitHandler }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [inputFocused, setInputFocused] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        submitHandler(searchTerm);
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className="max-w-full min-w-20 w-full 400:w-72"
        >
            <div
                className={`flex items-center h-9 bg-grey rounded px-2 ${
                    inputFocused && "border border-blue"
                }`}
            >
                <FiSearch className="mr-2 h-5 w-5 text-grey-darker" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    ref={inputRef}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="bg-transparent h-full flex-1 outline-none text-lg text-black"
                />
            </div>
        </form>
    );
};

export default GenericSearch;
