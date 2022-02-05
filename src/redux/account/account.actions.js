export const setAccountEmail = (email) => {
    return {
        type: "SET_ACCOUNT_EMAIL",
        payload: email,
    };
};

export const resetAccount = () => {
    return {
        type: "RESET_ACCOUNT",
    };
};
