import React from "react";

import UserCard from "../user-card/user-card";
import Status from "../status/status";
import UserSkeleton from "../../skeletons/user-skeleton/user-skeleton";

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

    const skeletons = [1, 2, 3, 4, 5];

    return (
        <div>
            {loading
                ? skeletons.map((skeleton) => {
                      return <UserSkeleton key={skeleton} />;
                  })
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
