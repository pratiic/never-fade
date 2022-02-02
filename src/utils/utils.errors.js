export const getErrors = (data) => {
    let errorsArr = [];

    if (data.error) {
        errorsArr = [data.error];
    }

    if (data.errors) {
        if (Array.isArray(data.errors)) {
            data.errors = data.errors[0];
        }

        Object.keys(data.errors).forEach((key) => {
            errorsArr = [...errorsArr, `${key}: ${data.errors[key][0]}`];
        });
    }

    return errorsArr;
};

export const getErrorMessage = (error, type) => {
    switch (error) {
        case "not found":
            return `the ${type} was not found. It may have been deleted.`;
        case "unauthorized":
            return `you are not authorized to see the details of this ${type}. ${
                type === "memory"
                    ? "You are neither the owner nor a member of the memory space nor has it been shared with you"
                    : "You are not a member of this memory space"
            }`;
    }
};
