import React, { useState, useEffect } from "react";
import { BsImages } from "react-icons/bs";
import { FiSearch, FiUsers } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSlideshare } from "react-icons/fa";
import { connect } from "react-redux";

import { logout } from "../../redux/current-user/current-user.actions";
import {
    showConfirmationModal,
    showModal,
} from "../../redux/modal/modal.actions";

import SidebarIcon from "../sidebar-icon/sidebar-icon";
import ContentOptions from "../content-options/content-options";

const Sidebar = ({
    sidebar: { full, show },
    memoriesPage,
    sharedMemoriesPage,
    spacesPage,
}) => {
    const location = useLocation();
    const linkClassName = `flex items-center justify-end text-grey-darker w-full bg-grey group hover:text-black active:text-grey-darker transition-all duration-100 px-11 py-3 border-b border-grey-light 850:px-7`;
    const spanClassName = "mr-3 capitalize text-lg transition-all duration-100";
    const iconClassName = "sidebar-icon group-active:text-grey-darker";

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
            title: "search",
            icon: <FiSearch className={iconClassName} />,
            activeLinks: ["/search"],
            linkTo: "/search",
            active: false,
        },
        {
            title: "create",
            icon: <AiOutlinePlus className={iconClassName} />,
            activeLinks: ["/memories/create", "/memory-spaces/create"],
            clickHandler: handleCreateClick,
            active: false,
        },
        {
            title: "sign out",
            icon: <BiExit className={iconClassName} />,
            activeLinks: [],
            clickHandler: handleLogoutClick,
            active: false,
        },
    ]);

    const dispatch = useDispatch();

    const isActive = (link) => {
        return location.pathname === link;
    };

    useEffect(() => {
        setLinks(
            links.map((link) => {
                if (
                    isActive(link.activeLinks[0]) ||
                    isActive(link.activeLinks[1])
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
            <Link
                to={`/memories/?page=${memoriesPage || 1}`}
                className={`${linkClassName} ${
                    isActive("/memories/") && "text-blue"
                }`}
            >
                <span className={spanClassName}>memories</span>
                <SidebarIcon icon={<BsImages className={iconClassName} />} />
            </Link>
            <Link
                to={`/shared-memories/?page=${sharedMemoriesPage || 1}`}
                className={`${linkClassName} ${
                    isActive("/shared-memories/") && "text-blue"
                }`}
            >
                <span className={spanClassName}>shared</span>
                <SidebarIcon icon={<FiUsers className={iconClassName} />} />
            </Link>
            <Link
                to={`/memory-spaces/?page=${spacesPage || 1}`}
                className={`${linkClassName} ${
                    isActive("/memory-spaces/") && "text-blue"
                }`}
            >
                <span className={spanClassName}>spaces</span>
                <SidebarIcon
                    icon={<FaSlideshare className={iconClassName} />}
                />
            </Link>
            {links.map((link) => {
                return (
                    <div
                        onClick={link.clickHandler && link.clickHandler}
                        className="w-full"
                        key={link.title}
                    >
                        <Link
                            to={
                                link.linkTo ||
                                `${location.pathname}${location.search}`
                            }
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
        sharedMemoriesPage: state.sharedMemories.page,
        spacesPage: state.memorySpaces.page,
    };
};

export default connect(mapStateToProps)(Sidebar);
