const INITIAL_STATE = {
    memories: [],
    loading: false,
    error: null,
    memoryUpdateLoading: false,
    memoryUpdateErrors: [],
    memoryToUpdate: {},
};

export const memoriesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "MEMORIES_REQUEST":
            return { ...state, loading: true };
        case "MEMORIES_SUCCESS":
            return { ...INITIAL_STATE, memories: action.payload };
        case "MEMORIES_FAILURE":
            return { ...INITIAL_STATE, error: action.payload };
        case "ADD_MEMORY":
            return { ...state, memories: [action.payload, ...state.memories] };
        case "MEMORY_UPDATE_REQUEST":
            return { ...state, memoryUpdateLoading: true };
        case "MEMORY_UPDATE_SUCCESS":
            return {
                ...INITIAL_STATE,
                memories: state.memories.map((memory) => {
                    if (memory.id === action.payload.id) {
                        return action.payload;
                    }

                    return memory;
                }),
            };
        case "MEMORY_UPDATE_FAILURE":
            return { ...state, memoryUpdateErrors: action.payload };
        case "SET_MEMORY_TO_UPDATE":
            return { ...state, memoryToUpdate: action.payload };
        default:
            return state;
    }
};
