import React from "react";
import { Link } from "react-router-dom";

import { capitalizeFirstLetter } from "../../utils/utils.strings";

import BackArrow from "../back-arrow/back-arrow";

const FormContainer = ({
    title,
    subtitle,
    subtitleLink,
    backArrow = true,
    children,
}) => {
    return (
        <div className="flex flex-col items-center">
            <div className="mb-3">
                <h3 className="flex items-center text-center text-3xl text-black">
                    {backArrow && <BackArrow />}
                    <div className="mr-3"></div>
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
