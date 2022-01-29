import React, { useState, useEffect } from "react";
import { BsImages } from "react-icons/bs";
import { FiSearch, FiUsers } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
import { useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaSlideshare } from "react-icons/fa";

import { logout } from "../../redux/current-user/current-user.actions";
import {
    showConfirmationModal,
    showModal,
} from "../../redux/modal/modal.actions";

import SidebarIcon from "../sidebar-icon/sidebar-icon";
import ContentOptions from "../content-options/content-options";

const Sidebar = () => {
    const [links, setLinks] = useState([
        {
            title: "memories",
            icon: (
                <BsImages className="sidebar-icon group-hover:text-primary transition-all ease-in duration-100" />
            ),
            activeLinks: ["/"],
            linkTo: "/",
            active: false,
        },
        {
            title: "search",
            icon: (
                <FiSearch className="sidebar-icon group-hover:text-primary transition-all ease-in duration-100" />
            ),
            activeLinks: ["/search"],
            linkTo: "/search",
            active: false,
        },
        {
            title: "shared",
            icon: (
                <FiUsers className="sidebar-icon group-hover:text-primary transition-all ease-in duration-100" />
            ),
            activeLinks: ["/memories/shared"],
            linkTo: "/memories/shared",
            active: false,
        },
        {
            title: "spaces",
            icon: (
                <FaSlideshare className="sidebar-icon group-hover:text-primary transition-all ease-in duration-100" />
            ),
            activeLinks: ["/memory-spaces"],
            linkTo: "/memory-spaces",
            active: false,
        },
    ]);

    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        setLinks(
            links.map((link) => {
                if (
                    link.activeLinks.find(
                        (activeLink) => location.pathname === activeLink
                    )
                ) {
                    return { ...link, active: true };
                }

                return { ...link, active: false };
            })
        );
    }, [location]);

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

    const handleCreateClick = () => {
        dispatch(showModal(<ContentOptions />));
    };

    return (
        <div className="flex flex-col items-center bg-grey pt-7 rounded-bl-lg border-r border-grey-dark h-full">
            {links.map((link) => {
                return (
                    <Link
                        to={link.linkTo}
                        className="flex items-center"
                        key={link.linkTo}
                    >
                        <SidebarIcon icon={link.icon} active={link.active} />
                    </Link>
                );
            })}
            <div onClick={handleCreateClick}>
                <SidebarIcon
                    icon={
                        <AiOutlinePlus className="sidebar-icon group-hover:text-primary transition-all ease-in duration-100" />
                    }
                />
            </div>
            <div onClick={handleLogoutClick}>
                <SidebarIcon
                    icon={
                        <BiExit className="sidebar-icon group-hover:text-primary transition-all ease-in duration-100" />
                    }
                />
            </div>
        </div>
    );
};

export default Sidebar;
