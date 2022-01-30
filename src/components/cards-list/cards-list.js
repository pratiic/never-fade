import React from "react";
import { connect } from "react-redux";

import { getSkeletons } from "../../utils/utils.skeletons";

import ContentCard from "../content-card/content-card";
import ContentSkeleton from "../../skeletons/content-skeleton/content-skeleton";
import Status from "../status/status";

const CardsList = ({
    list,
    type = "memory",
    message,
    loading,
    link,
    messagePosition,
}) => {
    if (!loading && list.length === 0) {
        return <Status text={message} link={link} position={messagePosition} />;
    }

    return (
        <div className="grid grid-cols-list gap-7 justify-center smallest:justify-start">
            {loading
                ? getSkeletons(<ContentSkeleton />)
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
    );
};

const mapStateToProps = (state) => {
    return {
        memoriesLoading: state.memories.loading,
        memorySpacesLoading: state.memorySpaces.loading,
    };
};

export default connect(mapStateToProps)(CardsList);
