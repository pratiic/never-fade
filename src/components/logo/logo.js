import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as LogoIcon } from "../../assets/logos/logo.svg";
import { ReactComponent as LogoTextIcon } from "../../assets/logos/logo-text.svg";

const Logo = () => {
    return (
        <Link
            to="/"
            className="flex items-center text-2xl cursor-pointer text-blue"
        >
            <LogoIcon className="w-9 h-9" />
            <LogoTextIcon className="h-9 -ml-9 hidden 700:block" />
            {/* <span className="hidden ml-3 700:block">Never Fade</span> */}
        </Link>
    );
};

export default Logo;
