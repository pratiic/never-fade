import React from "react";
import { Link } from "react-router-dom";

import { capitalizeFirstLetter } from "../../utils/utils.strings";

const Status = ({ text, link, position }) => {
    return (
        <div
            className={`max-w-xl text-lg ${
                position !== "left" ? "m-auto text-center" : "ml-3"
            }`}
        >
            <p className="text-grey-darker">{capitalizeFirstLetter(text)}</p>
            {link && (
                <Link to={link.linkTo} className="text-blue capitalize">
                    {link.title}
                </Link>
            )}
        </div>
    );
};

export default Status;
