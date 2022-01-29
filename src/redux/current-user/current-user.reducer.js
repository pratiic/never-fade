const userInfoFromLocalStorage = localStorage.getItem("userInfo");

const INITIAL_STATE = {
    userInfo: userInfoFromLocalStorage
        ? JSON.parse(userInfoFromLocalStorage)
        : null,
};

export const currentUserReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SET_CURRENT_USER":
            return { ...state, userInfo: action.payload };
        case "CURRENT_USER_LOGOUT":
            return {};
        default:
            return state;
    }
};
