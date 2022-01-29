import React from "react";
import { FiSettings } from "react-icons/fi";

import Status from "../../components/status/status";

const Loading = () => {
    return (
        <div className="flex flex-col items-center mt-32 text-grey-darker">
            <FiSettings className="animate-spin h-40 w-40" />
            <FiSettings className="h-24 w-24 animate-spin ml-20 -mt-7 mb-5" />
            <Status text="Loading your page..." />
        </div>
    );
};

export default Loading;
