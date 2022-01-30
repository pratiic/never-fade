import React from "react";
import { BsImage } from "react-icons/bs";

import UserSkeleton from "../user-skeleton/user-skeleton";
import ContentSkeleton from "../content-skeleton/content-skeleton";

const DetailsSkeleton = ({ type }) => {
    const iconClassName = "h-5 w-5 bg-grey rounded-full";
    const images = [1, 2, 3, 4, 5];
    const memories = [1, 2, 3, 4, 5];

    return (
        <div className="animate-pulse">
            <div className="heading justify-between mb-5">
                <div className="h-7 w-44 rounded bg-grey"></div>
                <div className={iconClassName}></div>
            </div>
            <div className="grid grid-cols-details">
                <div>
                    <div className="flex items-center mb-5">
                        <div className="h-11 w-11 bg-grey rounded-full"></div>
                        <div className="ml-3">
                            <div className="h-5 w-40 bg-grey mb-3 rounded"></div>
                            <div className="h-5 w-28 bg-grey rounded"></div>
                        </div>
                    </div>
                    <div className="h-24 w-80 bg-grey rounded"></div>
                </div>
                <div className="border border-grey rounded w-64 py-5 px-3">
                    <div className="flex justify-between items-center mb-5">
                        <div className="h-5 w-32 bg-grey rounded"></div>
                        <div className={iconClassName}></div>
                    </div>
                    <UserSkeleton />
                    <UserSkeleton />
                </div>
            </div>
            <div>
                <div className="heading mb-5">
                    <div className="h-7 w-40 bg-grey rounded"></div>
                </div>
                <div className="grid grid-cols-list gap-5">
                    {type === "memory"
                        ? images.map((image) => {
                              return (
                                  <div
                                      className="h-44 bg-grey rounded relative"
                                      key={image}
                                  >
                                      <BsImage className="image-icon text-grey-dark" />
                                  </div>
                              );
                          })
                        : memories.map((memory) => {
                              return <ContentSkeleton key={memory} />;
                          })}
                </div>
            </div>
        </div>
    );
};

export default DetailsSkeleton;
