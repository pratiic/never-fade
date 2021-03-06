import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { BiExit } from "react-icons/bi";

import {
    closeModal,
    showConfirmationModal,
    showLoadingModal,
} from "../../redux/modal/modal.actions";
import { removeMemorySpace } from "../../redux/memory-spaces/memory-spaces.actions";

import { getDate } from "../../utils/utils.date-time";
import { getErrorMessage } from "../../utils/utils.errors";
import { addMembers } from "../../api/memory-spaces.api";
import { capitalizeFirstLetter } from "../../utils/utils.strings";

import Heading from "../../components/heading/heading";
import ToggleList from "../../components/toggle-list/toggle-list";
import CardsList from "../../components/cards-list/cards-list";
import ContentMenu from "../../components/content-menu/content-menu";
import Status from "../../components/status/status";
import DetailsSkeleton from "../../skeletons/details-skeleton/details-skeleton";
import ProfilePicture from "../../components/profile-picture/profile-picture";

const SpaceDetails = ({ userInfo }) => {
    const [spaceDetails, setSpaceDetails] = useState({});
    const [spaceMemoriesMessage, setSpaceMemoriesMessage] = useState(
        "this memory space has no memories"
    );
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (spaceDetails.name) {
            document.title = capitalizeFirstLetter(spaceDetails.name);
        }
    }, [spaceDetails]);

    useEffect(() => {
        getSpaceDetails();
    }, []);

    const getSpaceDetails = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/api/memory-spaces/${id}`, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const data = await response.json();

            if (data.memory_space) {
                setSpaceDetails({
                    ...data.memory_space,
                    memories: data.memories,
                });
            }

            if (data.error) {
                setError(getErrorMessage(data.error, "memory space"));
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleExitClick = () => {
        dispatch(
            showConfirmationModal(
                "are you sure you want to leave the memory space ?",
                memberExitHandler
            )
        );
    };

    const memberExitHandler = async () => {
        dispatch(showLoadingModal("leaving memory space"));

        try {
            const data = await addMembers(
                id,
                spaceDetails.users.filter((user) => user.id !== userInfo.id),
                true,
                userInfo.token
            );

            if (data.memory_space) {
                // setSpaceDetails(data.memory_space);
                dispatch(removeMemorySpace(Number(id)));
                navigate("/memory-spaces");
            }
        } catch (error) {
        } finally {
            dispatch(closeModal());
        }
    };

    if (loading) {
        return <DetailsSkeleton type="memory space" />;
    }

    if (error) {
        return <Status text={error} />;
    }

    if (Object.keys(spaceDetails).length === 0 || !userInfo) {
        return null;
    }

    const {
        name,
        description,
        created_at,
        users,
        memories,
        image,
        created_by,
    } = spaceDetails;

    return (
        <div>
            <div className="content-details">
                <div>
                    <Heading text={name} spacebetween>
                        <ContentMenu
                            id={id}
                            title={name}
                            description={description}
                            image={image}
                            type="memory space"
                        />
                    </Heading>
                    <div>
                        {created_by ? (
                            <div className="flex items-center">
                                <ProfilePicture
                                    url={created_by.avatar}
                                    username={created_by.username}
                                />
                                <div className="ml-3 leading-snug">
                                    <p className="text-black capitalize text-lg">
                                        {created_by.id === userInfo.id
                                            ? "me"
                                            : created_by.username}
                                    </p>
                                    <span className="text-grey-darker block">
                                        memory space created on{" "}
                                        {getDate(created_at)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-grey-darker block">
                                memory space created on {getDate(created_at)}
                            </span>
                        )}
                        <div className="mt-5">
                            {description && (
                                <p className="content-description">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <ToggleList list={users}>
                    <div className={`toggle-list-header justify-between`}>
                        <h4>
                            members{" "}
                            <span className="text-grey-darker">
                                ({users.length})
                            </span>
                        </h4>
                        <div className="flex items-center ml-7">
                            <Link to={`/memory-spaces/add-members/${id}`}>
                                <AiOutlinePlus className="icon" />
                            </Link>
                            <BiExit
                                className="icon ml-3"
                                onClick={handleExitClick}
                            />
                        </div>
                    </div>
                </ToggleList>
            </div>
            <Heading text="memories" backArrow={false}>
                <Link to={`/memories/create/?memory-space=${id}`}>
                    <AiOutlinePlus className="icon ml-3" />
                </Link>
            </Heading>
            <CardsList
                list={memories}
                message={spaceMemoriesMessage}
                link={{
                    title: "create memory",
                    linkTo: `/memories/create/?memory-space=${id}`,
                }}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(SpaceDetails);
