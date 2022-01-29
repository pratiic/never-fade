import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import { unselectAllUsers } from "../../redux/users/users.actions";

import GenericSearch from "../generic-search/generic-search";
import UsersList from "../users-list/users-list";

const UserSearch = ({
    label,
    userInfo,
    selectedUsers,
    action,
    actionHandler,
}) => {
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [userMessage, setUserMessage] = useState("users will appear here");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(unselectAllUsers());
        };
    }, []);

    const handleUserSearch = async (searchTerm) => {
        if (!searchTerm) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `/api/users/search/?query=${searchTerm}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            const data = await response.json();

            if (data.users) {
                if (data.users.length === 0) {
                    setUserMessage("users not found");
                }

                return setSearchedUsers(data.users);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <label className="form-label">{label}</label>
            <GenericSearch
                placeholder="username or email..."
                submitHandler={handleUserSearch}
            />
            <div className="mb-3"></div>
            {searchedUsers.length > 0 && (
                <p className="ml-3 mt-2 text-grey-darker text-lg">
                    Found {searchedUsers.length} users
                </p>
            )}
            <UsersList
                list={searchedUsers}
                message={userMessage}
                allowSelect={true}
                loading={loading}
                messagePosition="left"
            />
            {selectedUsers.length > 0 && (
                <React.Fragment>
                    <div>
                        <h4 className="text-xl capitalize text-grey-darker">
                            selected users ({selectedUsers.length})
                        </h4>
                        <UsersList list={selectedUsers} allowSelect={true} />
                    </div>
                    <button className="button mt-5" onClick={actionHandler}>
                        {action}
                    </button>
                </React.Fragment>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
        selectedUsers: state.users.selectedUsers,
    };
};

export default connect(mapStateToProps)(UserSearch);
