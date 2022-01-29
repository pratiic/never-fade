import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

import { getMemories } from "../../redux/memories/memories.actions";

import CardsList from "../../components/cards-list/cards-list";
import Heading from "../../components/heading/heading";

const Memories = ({ userInfo, memories: { memories, loading } }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const memoriesMessage = "looks like you have not created any memories";

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo]);

    useEffect(() => {
        document.title = "Your memories";
        dispatch(getMemories());
    }, []);

    return (
        <div>
            <Heading text="your memories">
                <Link to="/memories/create" className="ml-3">
                    <AiOutlinePlus className="icon" />
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
