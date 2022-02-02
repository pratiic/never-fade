import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const BackArrow = () => {
    const navigate = useNavigate();

    return <BiArrowBack className="icon mr-1" onClick={() => navigate(-1)} />;
};

export default BackArrow;
