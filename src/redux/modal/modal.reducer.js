const INITIAL_STATE = {
    modalInfo: {
        showModal: false,
        modalMessage: "Performing the task",
        proceedHandler: [],
        children: null,
        loading: false,
    },
};

export const modalReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SET_MODAL_INFO":
            return {
                ...state,
                modalInfo: { ...action.payload },
            };
        case "CLOSE_MODAL":
            return { ...INITIAL_STATE };
        default:
            return state;
    }
};
