import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";

import { getDate } from "../../utils/utils.date-time";
import { getErrorMessage } from "../../utils/utils.errors";

import Heading from "../../components/heading/heading";
import ToggleList from "../../components/toggle-list/toggle-list";
import CardsList from "../../components/cards-list/cards-list";
import ContentMenu from "../../components/content-menu/content-menu";
import Status from "../../components/status/status";

const SpaceDetails = ({ userInfo }) => {
    const [spaceDetails, setSpaceDetails] = useState({});
    const [spaceMemoriesMessage, setSpaceMemoriesMessage] = useState(
        "this memory space has no memories"
    );
    const [error, setError] = useState("");

    const { id } = useParams();

    useEffect(() => {
        getSpaceDetails();
    }, []);

    const getSpaceDetails = async () => {
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
        } catch (error) {}
    };

    if (error) {
        return <Status text={error} />;
    }

    if (Object.keys(spaceDetails).length === 0 || !userInfo) {
        return null;
    }

    const { name, description, created_at, users, memories, image } =
        spaceDetails;

    return (
        <div>
            <div className="grid grid-cols-details mb-5">
                <div className="mr-3">
                    <Heading text={name} spacebetween>
                        <ContentMenu
                            id={id}
                            title={name}
                            description={description}
                            image={image}
                            type="memory space"
                        />
                    </Heading>
                    <span className="text-grey-darker block -mt-2">
                        {getDate(created_at)}
                    </span>
                    <div className="mt-3">
                        {description && (
                            <p className="content-description">{description}</p>
                        )}
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
                        <Link to={`/memory-spaces/add-members/${id}`}>
                            <AiOutlinePlus className="icon" />
                        </Link>
                    </div>
                </ToggleList>
            </div>
            <Heading text="memories">
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
