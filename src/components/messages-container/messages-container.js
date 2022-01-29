import React from "react";

import { capitalizeFirstLetter } from "../../utils/utils.strings";

const MessagesContainer = ({ messages }) => {
    if (messages.length === 0) {
        return null;
    }

    return (
        <div className="mb-5">
            {messages.map((message) => {
                return (
                    <h3
                        key={message}
                        className="bg-red-200 p-2 text-red-500 rounded mb-1 font-semibold"
                    >
                        {capitalizeFirstLetter(message)}
                    </h3>
                );
            })}
        </div>
    );
};

export default MessagesContainer;
