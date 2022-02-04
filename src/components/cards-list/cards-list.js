import React from "react";
import { connect } from "react-redux";
import { ImSpinner11 } from "react-icons/im";

import ContentCard from "../content-card/content-card";
import ContentSkeleton from "../../skeletons/content-skeleton/content-skeleton";
import Status from "../status/status";
import Pagination from "../pagination/pagination";

const CardsList = ({
    list,
    type = "memory",
    message,
    loading,
    link,
    messagePosition,
    hasNext,
    hasPrev,
    page,
    fetchNextInitiator,
    fetchPrevInitiator,
}) => {
    if (!loading && list.length === 0) {
        return <Status text={message} link={link} position={messagePosition} />;
    }

    const skeletons = [1, 2, 3, 4, 5];

    return (
        <div>
            <div className="grid grid-cols-list gap-7 relative">
                {loading
                    ? skeletons.map((skeleton) => {
                          return <ContentSkeleton key={skeleton} />;
                      })
                    : list.map((listItem) => {
                          let props = { ...listItem };

                          if (type === "memory") {
                              props.image = listItem.preview;
                          } else {
                              props.title = listItem.name;
                          }

                          return (
                              <ContentCard
                                  {...props}
                                  type={type}
                                  key={listItem.id}
                              />
                          );
                      })}
            </div>
            {!loading && (
                <Pagination
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    page={page}
                    pageIncrementHandler={fetchNextInitiator}
                    pageDecrementHandler={fetchPrevInitiator}
                />
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        memoriesLoading: state.memories.loading,
        memorySpacesLoading: state.memorySpaces.loading,
    };
};

export default connect(mapStateToProps)(CardsList);
