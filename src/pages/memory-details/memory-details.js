import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { IoMdShareAlt } from "react-icons/io";
import { FiUserMinus } from "react-icons/fi";

import {
    closeModal,
    showConfirmationModal,
} from "../../redux/modal/modal.actions";
import { removeSharedMemory } from "../../redux/shared-memories/shared-memories.actions";

import { shareMemory } from "../../api/memories.api";

import { getDate } from "../../utils/utils.date-time";
import { capitalizeFirstLetter } from "../../utils/utils.strings";
import { getErrorMessage } from "../../utils/utils.errors";

import Heading from "../../components/heading/heading";
import ProfilePicture from "../../components/profile-picture/profile-picture";
import ImagesList from "../../components/images-list/images-list";
import ContentMenu from "../../components/content-menu/content-menu";
import ToggleList from "../../components/toggle-list/toggle-list";
import Status from "../../components/status/status";
import DetailsSkeleton from "../../skeletons/details-skeleton/details-skeleton";

const MemoryDetails = ({ userInfo }) => {
    const [memoryDetails, setMemoryDetails] = useState({});
    const [memoryImages, setMemoryImages] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userInfo) {
            return navigate(`/login/?redirect=${location.pathname}`);
        }
    }, [userInfo]);

    useEffect(() => {
        fetchMemoryDetails();
    }, []);

    const fetchMemoryDetails = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/api/memories/${id}`, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const data = await response.json();

            if (data.memory) {
                setMemoryDetails(data.memory);
                return setMemoryImages(data.images);
            }

            if (data.error) {
                setError(getErrorMessage(data.error, "memory"));
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const removeMemoryImage = (imageID) => {
        setMemoryImages(memoryImages.filter((image) => image.id !== imageID));
    };

    const addMemoryImages = (images) => {
        setMemoryImages([...memoryImages, ...images]);
    };

    const removeHandler = (username, id) => {
        dispatch(
            showConfirmationModal(
                `are you sure you want to unshare this memory with ${
                    id === userInfo.id ? "you" : username
                } ?`,
                () => handleUserRemoval(id)
            )
        );
    };

    const handleUserRemoval = async (userID) => {
        try {
            const data = await shareMemory(
                id,
                userInfo.token,
                true,
                shared_with.filter((user) => user.id !== userID)
            );

            if (data.memory) {
                setMemoryDetails(data.memory);

                if (userID === userInfo.id) {
                    dispatch(removeSharedMemory(data.memory.id));
                    navigate("/memories/shared");
                }
            }
        } catch (error) {
        } finally {
            dispatch(closeModal());
        }
    };

    if (loading) {
        return <DetailsSkeleton type="memory" />;
    }

    if (error) {
        return <Status text={error} />;
    }

    if (Object.keys(memoryDetails).length === 0 || !userInfo) {
        return null;
    }

    const {
        title,
        description,
        owner: { id: userID, username, avatar },
        created_at,
        shared_with,
        date,
        memory_space,
    } = memoryDetails;
    const isOwner = userInfo.id === userID;
    document.title = capitalizeFirstLetter(title);

    const PostDetails = () => {
        return (
            <div className="flex items-center mb-5">
                <ProfilePicture url={avatar} username={username} />
                <div className="ml-3 leading-snug">
                    <p className="text-black text-lg capitalize">
                        {userID === userInfo.id ? "me" : username}
                    </p>

                    {created_at === date ? (
                        <p className="text-grey-darker">
                            {" "}
                            created and posted on {getDate(created_at)}{" "}
                        </p>
                    ) : (
                        <React.Fragment>
                            <p className="text-grey-darker">
                                memory created on {getDate(date)}
                            </p>
                            <p className="text-grey-darker">
                                posted on {getDate(created_at)}
                            </p>
                        </React.Fragment>
                    )}

                    {memory_space && (
                        <p className="bg-grey py-1 px-2 rounded text-grey-darker mt-2">
                            Part of{" "}
                            <Link
                                to={`/memory-spaces/${memory_space.id}`}
                                className="text-blue font-semibold"
                            >
                                {memory_space.name}
                            </Link>{" "}
                            memory space
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            <Heading text={title} spacebetween>
                {(isOwner || memory_space) && (
                    <ContentMenu
                        id={id}
                        title={title}
                        description={description}
                        type="memory"
                    />
                )}
            </Heading>
            <div className="content-details">
                <div>
                    <PostDetails />
                    {description && (
                        <p className="content-description max-w-md">
                            {capitalizeFirstLetter(description)}
                        </p>
                    )}
                </div>
                <ToggleList
                    list={shared_with}
                    removeHandler={
                        !memory_space && isOwner ? removeHandler : null
                    }
                >
                    <div className={"toggle-list-header justify-between"}>
                        <h4>
                            shared with{" "}
                            <span className="text-grey-darker">
                                ({shared_with.length})
                            </span>
                        </h4>
                        {(isOwner || memory_space) && (
                            <Link to={`/memories/share/${id}/`}>
                                <IoMdShareAlt className="icon ml-3" />
                            </Link>
                        )}
                        {shared_with.find(
                            (user) => user.id === userInfo.id
                        ) && (
                            <FiUserMinus
                                className="icon"
                                onClick={() =>
                                    removeHandler(
                                        userInfo.username,
                                        userInfo.id
                                    )
                                }
                            />
                        )}
                    </div>
                </ToggleList>
            </div>
            <ImagesList
                images={memoryImages}
                removeMemoryImage={removeMemoryImage}
                addMemoryImages={addMemoryImages}
                canAdd={isOwner || memory_space}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(MemoryDetails);
