export const selectUser = (user) => {
    return {
        type: "SELECT_USER",
        payload: user,
    };
};

export const unselectUser = (id) => {
    return {
        type: "UNSELECT_USER",
        payload: id,
    };
};

export const unselectAllUsers = () => {
    return {
        type: "UNSELECT_ALL_USERS",
    };
};
