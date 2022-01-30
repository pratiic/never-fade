const INITIAL_STATE = {
    full: true,
    show: true,
};

export const sidebarReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "TOGGLE_SIDEBAR":
            return { ...state, full: !state.full };
        default:
            return state;
    }
};
