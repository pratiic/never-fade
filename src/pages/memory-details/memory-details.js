import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { connect } from "react-redux";
import { IoMdShareAlt } from "react-icons/io";

import { getDate } from "../../utils/utils.date-time";
import { capitalizeFirstLetter } from "../../utils/utils.strings";
import { getErrorMessage } from "../../utils/utils.errors";

import Heading from "../../components/heading/heading";
import ProfilePicture from "../../components/profile-picture/profile-picture";
import ImagesList from "../../components/images-list/images-list";
import ContentMenu from "../../components/content-menu/content-menu";
import ToggleList from "../../components/toggle-list/toggle-list";
import Status from "../../components/status/status";

const MemoryDetails = ({ userInfo }) => {
    const [memoryDetails, setMemoryDetails] = useState({});
    const [memoryImages, setMemoryImages] = useState([]);
    const [error, setError] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!userInfo) {
            return navigate(`/login/?redirect=${location.pathname}`);
        }
    }, [userInfo]);

    useEffect(() => {
        fetchMemoryDetails();
    }, []);

    const fetchMemoryDetails = async () => {
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
        } catch (error) {}
    };

    const removeMemoryImage = (imageID) => {
        setMemoryImages(memoryImages.filter((image) => image.id !== imageID));
    };

    const addMemoryImages = (images) => {
        setMemoryImages([...memoryImages, ...images]);
    };

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
            <div className="flex items-center mb-7">
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
            <div className="grid grid-cols-details mb-7">
                <div>
                    <PostDetails />
                    {description && (
                        <p className="content-description">
                            {capitalizeFirstLetter(description)}
                        </p>
                    )}
                </div>
                <ToggleList list={shared_with}>
                    <div
                        className={`toggle-list-header ${
                            isOwner || memory_space
                                ? "justify-between"
                                : "justify-center"
                        }`}
                    >
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
