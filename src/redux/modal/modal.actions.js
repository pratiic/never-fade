export const showConfirmationModal = (message, proceedHandler) => {
    return {
        type: "SET_MODAL_INFO",
        payload: {
            showModal: true,
            modalMessage: message,
            proceedHandler,
        },
    };
};

export const showLoadingModal = (message) => {
    return {
        type: "SET_MODAL_INFO",
        payload: {
            showModal: true,
            modalMessage: message,
            loading: true,
        },
    };
};

export const closeModal = () => {
    return {
        type: "CLOSE_MODAL",
    };
};

export const showModal = (children) => {
    return {
        type: "SET_MODAL_INFO",
        payload: {
            showModal: true,
            children: children,
        },
    };
};
