import { removeArrItem, updateArrItem } from "../../utils/utils.reducers";

const INITIAL_STATE = {
    memorySpaces: [],
    loading: false,
    error: null,
    memorySpaceUpdateLoading: false,
    memorySpaceUpdateErrors: [],
    memorySpaceToUpdate: {},
    needToFetch: true,
};

export const memorySpacesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "MEMORY_SPACES_REQUEST":
            return { ...state, loading: true };
        case "MEMORY_SPACES_SUCCESS":
            return {
                ...INITIAL_STATE,
                memorySpaces: action.payload,
                needToFetch: false,
            };
        case "MEMORY_SPACES_FAILURE":
            return { ...INITIAL_STATE, error: action.payload };
        case "MEMORY_SPACE_UPDATE_REQUEST":
            return { ...state, memorySpaceUpdateLoading: true };
        case "MEMORY_SPACE_UPDATE_SUCCESS":
            return {
                ...INITIAL_STATE,
                memorySpaces: updateArrItem(
                    action.payload.id,
                    state.memorySpaces,
                    action.payload
                ),
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
        case "REMOVE_MEMORY_SPACE":
            return {
                ...state,
                memorySpaces: removeArrItem(action.payload, state.memorySpaces),
            };
        case "RESET_MEMORY_SPACES":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
