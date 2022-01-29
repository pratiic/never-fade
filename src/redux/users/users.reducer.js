const INITIAL_STATE = {
    selectedUsers: [],
};

export const usersReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SELECT_USER":
            return {
                ...state,
                selectedUsers: [...state.selectedUsers, action.payload],
            };
        case "UNSELECT_USER":
            return {
                ...state,
                selectedUsers: state.selectedUsers.filter(
                    (selectedUser) => selectedUser.id !== action.payload
                ),
            };
        case "UNSELECT_ALL_USERS":
            return {
                ...state,
                selectedUsers: [],
            };
        default:
            return state;
    }
};
