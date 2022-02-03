const INITIAL_STATE = {
    email: "",
};

export const accountReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SET_ACCOUNT_EMAIL":
            return { ...state, email: action.payload };
        default:
            return state;
    }
};
