import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <Link to="/" className="text-2.5xl cursor-pointer text-blue">
            Never Fade
        </Link>
    );
};

export default Logo;
