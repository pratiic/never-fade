const INITIAL_STATE = {
    showDropdown: false,
};

export const dropdownReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "TOGGLE_DROPDOWN":
            return { ...state, showDropdown: !state.showDropdown };
        case "HIDE_DROPDOWN":
            return { ...state, showDropdown: false };
        default:
            return state;
    }
};
