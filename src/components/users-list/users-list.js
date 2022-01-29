import React from "react";

import UserCard from "../user-card/user-card";
import Status from "../status/status";
import UserSkeleton from "../../skeletons/user-skeleton/user-skeleton";

import { getSkeletons } from "../../utils/utils.skeletons";

const UsersList = ({
    list,
    loading,
    message,
    allowSelect,
    messagePosition,
}) => {
    if (!loading && list.length === 0) {
        return <Status text={message} position={messagePosition} />;
    }

    return (
        <div>
            {loading
                ? getSkeletons(<UserSkeleton />)
                : list.map((user) => {
                      return (
                          <UserCard
                              {...user}
                              key={user.id}
                              allowSelect={allowSelect}
                          />
                      );
                  })}
        </div>
    );
};

export default UsersList;
