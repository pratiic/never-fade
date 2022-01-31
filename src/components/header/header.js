import React from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

import { toggleSidebar } from "../../redux/sidebar/sidebar.actions";

import Logo from "../logo/logo";
import ProfilePreview from "../profile-preview/profile-preview";

const Header = ({ userInfo }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleMenuClick = () => {
        dispatch(toggleSidebar());
    };

    return (
        <div className="flex justify-between items-center px-5 border-b border-grey 650:px-7">
            <div className="flex items-center">
                {userInfo && (
                    <FiMenu
                        className="icon mr-3 850:hidden"
                        onClick={handleMenuClick}
                    />
                )}
                <Logo />
            </div>
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
