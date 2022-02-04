import React, { useState, useEffect } from "react";
import { BsImages } from "react-icons/bs";
import { FiSearch, FiUsers } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaSlideshare } from "react-icons/fa";
import { connect } from "react-redux";

import { logout } from "../../redux/current-user/current-user.actions";
import {
    showConfirmationModal,
    showModal,
} from "../../redux/modal/modal.actions";

import SidebarIcon from "../sidebar-icon/sidebar-icon";
import ContentOptions from "../content-options/content-options";

const Sidebar = ({ sidebar: { full, show }, memoriesPage }) => {
    const handleCreateClick = () => {
        dispatch(showModal(<ContentOptions />));
    };

    const handleLogoutClick = () => {
        dispatch(
            showConfirmationModal(
                "are you sure you want to log out ?",
                handleLogout
            )
        );
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const [links, setLinks] = useState([
        {
            title: "memories",
            icon: (
                <BsImages className="sidebar-icon group-active:text-grey-darker" />
            ),
            activeLinks: ["/memories"],
            linkTo: `/memories`,
            active: false,
        },
        {
            title: "search",
            icon: (
                <FiSearch className="sidebar-icon group-active:text-grey-darker" />
            ),
            activeLinks: ["/search"],
            linkTo: "/search",
            active: false,
        },
        {
            title: "shared",
            icon: (
                <FiUsers className="sidebar-icon group-active:text-grey-darker" />
            ),
            activeLinks: ["shared-memories"],
            linkTo: "/shared-memories",
            active: false,
        },
        {
            title: "spaces",
            icon: (
                <FaSlideshare className="sidebar-icon group-active:text-grey-darker" />
            ),
            activeLinks: ["/memory-spaces"],
            linkTo: "/memory-spaces",
            active: false,
        },
        {
            title: "create",
            icon: (
                <AiOutlinePlus className="sidebar-icon group-active:text-grey-darker" />
            ),
            activeLinks: ["/memories/create", "/memory-spaces/create"],
            clickHandler: handleCreateClick,
            active: false,
        },
        {
            title: "sign out",
            icon: (
                <BiExit className="sidebar-icon group-active:text-grey-darker" />
            ),
            activeLinks: [],
            clickHandler: handleLogoutClick,
            active: false,
        },
    ]);

    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        setLinks(
            links.map((link) => {
                if (
                    link.activeLinks.find((activeLink) =>
                        location.pathname.includes(activeLink)
                    )
                ) {
                    return { ...link, active: true };
                }

                return { ...link, active: false };
            })
        );
    }, [location]);

    return (
        <div
            className={`flex flex-col items-end bg-grey rounded-bl-lg h-full ${
                !full && "pt-7"
            } absolute -translate-x-full 850:static 850:translate-x-0 transition-all duration-100 z-40 ${
                show && "translate-x-0"
            } overflow-scroll`}
        >
            {links.map((link) => {
                return (
                    <div
                        onClick={link.clickHandler && link.clickHandler}
                        className="w-full"
                        key={link.title}
                    >
                        <Link
                            to={link.linkTo || ""}
                            className={`flex items-center justify-end text-grey-darker w-full bg-grey group hover:text-black active:text-grey-darker transition-all duration-100 ${
                                link.active && "text-blue"
                            } ${
                                full
                                    ? "px-11 py-3 border-b border-grey-light 850:px-7"
                                    : "px-3 pb-7"
                            }`}
                        >
                            {full && (
                                <span
                                    className={
                                        "mr-3 capitalize text-lg transition-all duration-100"
                                    }
                                >
                                    {link.title}
                                </span>
                            )}
                            <SidebarIcon
                                icon={link.icon}
                                active={link.active}
                            />
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        sidebar: state.sidebar,
        memoriesPage: state.memories.page,
    };
};

export default connect(mapStateToProps)(Sidebar);
