import React from "react";

import { ReactComponent as PageNotFoundHuman } from "../../assets/humans/page-not-found.svg";

const NotFound = () => {
    return (
        <div className="flex justify-center">
            <PageNotFoundHuman className="human" />
        </div>
    );
};

export default NotFound;
