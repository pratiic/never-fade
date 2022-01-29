const INITIAL_STATE = {
    sharedMemories: [],
    loading: false,
    error: null,
    type: "with me",
    options: [
        { title: "with me", active: true },
        { title: "by me", active: false },
        { title: "all", active: false },
    ],
};

export const sharedMemoriesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SHARED_MEMORIES_REQUEST":
            return { ...state, loading: true };
        case "SHARED_MEMORIES_SUCCESS":
            return { ...state, sharedMemories: action.payload, loading: false };
        case "SHARED_MEMORIES_FAILURE":
            return { ...INITIAL_STATE, error: action.payload };
        case "ADD_SHARED_MEMORY":
            return {
                ...state,
                sharedMemories: [action.payload, ...state.sharedMemories],
            };
        case "SET_SHARED_MEMORIES_TYPE":
            return {
                ...state,
                type: action.payload,
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
