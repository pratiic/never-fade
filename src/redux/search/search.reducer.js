const INITIAL_STATE = {
    options: [
        { title: "memory", active: true },
        { title: "memory space", active: false },
    ],
};

export const searchReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SET_SEARCH_TYPE":
            return {
                ...state,
                options: state.options.map((option) => {
                    if (option.title === action.payload) {
                        return { ...option, active: true };
                    }

                    return { ...option, active: false };
                }),
            };
        default:
            return state;
    }
};
