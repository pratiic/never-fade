const INITIAL_STATE = {
    full: true,
    show: false,
};

export const sidebarReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "TOGGLE_SIDEBAR":
            return { ...state, show: !state.show };
        case "HIDE_SIDEBAR":
            return { ...state, show: false };
        default:
            return state;
    }
};
