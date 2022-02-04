import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { HiPlus } from "react-icons/hi";

import { getMemories, setPage } from "../../redux/memories/memories.actions";

import CardsList from "../../components/cards-list/cards-list";
import Heading from "../../components/heading/heading";

const Memories = ({
    userInfo,
    memories: { memories, loading, needToFetch, hasNext, page, hasPrev },
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const memoriesMessage = "looks like you have not created any memories";
    const queryPage = Number(location.search.split("=")[1]);

    useEffect(() => {
        document.title = "Your memories";
    }, []);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo]);

    useEffect(() => {
        if (needToFetch && page) {
            dispatch(getMemories());
        }
    }, [needToFetch, page]);

    useEffect(() => {
        if (queryPage !== page) {
            dispatch(setPage(queryPage, true));
        }
    }, [queryPage]);

    const navigateToPage = (page) => {
        navigate(`/memories/?page=${page}`);
    };

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
                hasNext={hasNext}
                hasPrev={hasPrev}
                page={page}
                fetchNextInitiator={() => navigateToPage(page + 1)}
                fetchPrevInitiator={() => navigateToPage(page - 1)}
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
