import React from "react";
import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import Logo from "../logo/logo";
import ProfilePreview from "../profile-preview/profile-preview";

const Header = ({ userInfo }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex justify-between items-center px-7 border-b border-grey">
            <Logo />
            <div>
                {userInfo ? (
                    <ProfilePreview
                        username={userInfo.username}
                        avatar={userInfo.avatar}
                    />
                ) : location.pathname.includes("login") ? (
                    <button
                        className="button"
                        onClick={() => navigate("/register")}
                    >
                        register
                    </button>
                ) : (
                    <button
                        className="button"
                        onClick={() => navigate("/login")}
                    >
                        login
                    </button>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(Header);
