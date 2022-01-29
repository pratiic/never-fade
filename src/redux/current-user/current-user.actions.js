export const setCurrentUser = (userInfo) => {
    return (dispatch) => {
        dispatch({
            type: "SET_CURRENT_USER",
            payload: userInfo,
        });
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    };
};

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem("userInfo");
        dispatch({
            type: "CURRENT_USER_LOGOUT",
        });
        dispatch({ type: "CLOSE_MODAL" });
    };
};
