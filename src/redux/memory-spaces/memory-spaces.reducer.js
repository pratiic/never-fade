const INITIAL_STATE = {
    memorySpaces: [],
    loading: false,
    error: null,
    memorySpaceUpdateLoading: false,
    memorySpaceUpdateErrors: [],
    memorySpaceToUpdate: {},
};

export const memorySpacesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "MEMORY_SPACES_REQUEST":
            return { ...state, loading: true };
        case "MEMORY_SPACES_SUCCESS":
            return { ...INITIAL_STATE, memorySpaces: action.payload };
        case "MEMORY_SPACES_FAILURE":
            return { ...INITIAL_STATE, error: action.payload };
        case "MEMORY_SPACE_UPDATE_REQUEST":
            return { ...state, memorySpaceUpdateLoading: true };
        case "MEMORY_SPACE_UPDATE_SUCCESS":
            return {
                ...INITIAL_STATE,
                memorySpaces: state.memorySpaces.map((memorySpace) => {
                    if (memorySpace.id === action.payload.id) {
                        return action.payload;
                    }

                    return memorySpace;
                }),
            };
        case "MEMORY_SPACE_UPDATE_FAILURE":
            return { ...state, memorySpaceUpdateErrors: action.payload };
        case "ADD_MEMORY_SPACE":
            return {
                ...state,
                memorySpaces: [action.payload, ...state.memorySpaces],
            };
        case "SET_MEMORY_SPACE_TO_UPDATE":
            return { ...state, memorySpaceToUpdate: action.payload };
        default:
            return state;
    }
};
