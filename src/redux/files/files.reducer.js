const INITIAL_STATE = {
    selectedFiles: [],
};

export const filesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SELECT_FILES":
            return {
                ...state,
                selectedFiles: [...state.selectedFiles, ...action.payload],
            };
        case "RESET_FILES":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
