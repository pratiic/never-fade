import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

const Welcome = ({ userInfo }) => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Welcome";
    }, []);

    useEffect(() => {
        if (userInfo) {
            navigate("/memories");
        }
    }, []);

    return (
        <div className="flex flex-col items-center mt-5">
            <h1 className="text-4xl text-black mb-1">Welcome to Never Fade</h1>
            <p className="text-xl text-grey-darker mb-5">
                Save and share your memories so that they never fade
            </p>
            <Link to="/register">
                <button className="button">register</button>
            </Link>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(Welcome);
