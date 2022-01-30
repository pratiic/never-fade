import React from "react";
import { Link } from "react-router-dom";

import { capitalizeFirstLetter } from "../../utils/utils.strings";

const FormContainer = ({ title, subtitle, subtitleLink, children }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="mb-3">
                <h3 className="text-center text-2xl text-black">
                    {capitalizeFirstLetter(title)}
                </h3>
                {subtitle && (
                    <h4 className="text-center text-lg text-grey-darker">
                        {subtitle}{" "}
                        <Link to={`/${subtitleLink}`} className="link">
                            {subtitleLink}
                        </Link>
                    </h4>
                )}
            </div>
            {children}
        </div>
    );
};

export default FormContainer;
