import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { HiPlus } from "react-icons/hi";

import { getMemories } from "../../redux/memories/memories.actions";

import CardsList from "../../components/cards-list/cards-list";
import Heading from "../../components/heading/heading";

const Memories = ({
    userInfo,
    memories: { memories, loading, needToFetch },
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const memoriesMessage = "looks like you have not created any memories";

    useEffect(() => {
        document.title = "Your memories";
    }, []);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo]);

    useEffect(() => {
        if (needToFetch) {
            dispatch(getMemories());
        }
    }, [needToFetch]);

    return (
        <div>
            <Heading text="your memories" backArrow={false}>
                <Link to="/memories/create" className="ml-5">
                    <HiPlus className="icon" />
                </Link>
            </Heading>
            <CardsList
                list={memories}
                message={memoriesMessage}
                loading={loading}
                link={{ title: "create memory", linkTo: "/memories/create" }}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        memories: state.memories,
    };
};

export default connect(mapStateToProps)(Memories);
