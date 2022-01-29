import React, { useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import UserCard from "../user-card/user-card";

const ToggleList = ({ children, list }) => {
    const [showList, setShowList] = useState(false);

    const toggleList = () => {
        setShowList(!showList);
    };

    return (
        <div className="border border-grey rounded px-2 pt-2 pb-3 h-fit w-fit min-w-15">
            {children}
            <div>
                {list.length === 0 ? (
                    <p className="text-grey-darker capitalize text-center">
                        not shared
                    </p>
                ) : (
                    <div>
                        <button
                            className="button-tertiary button-center"
                            onClick={toggleList}
                        >
                            {showList ? (
                                <React.Fragment>
                                    {" "}
                                    hide <FiChevronUp className="ml-2" />{" "}
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    view <FiChevronDown className="ml-2" />
                                </React.Fragment>
                            )}
                        </button>

                        {showList &&
                            list.map((user) => {
                                return (
                                    <div
                                        className="flex items-center"
                                        key={user.id}
                                    >
                                        <div className="flex-1">
                                            <UserCard
                                                {...user}
                                                size="smaller"
                                            />
                                        </div>
                                        <TiDeleteOutline className="icon ml-3" />
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ToggleList;
