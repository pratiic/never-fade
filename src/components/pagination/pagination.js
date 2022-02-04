import React from "react";

const Pagination = ({
    page,
    hasNext,
    hasPrev,
    pageIncrementHandler,
    pageDecrementHandler,
}) => {
    if (!hasNext && !hasPrev) {
        return null;
    }

    const getButtonClassName = (disabled) => {
        return `button-tertiary ${
            disabled && "text-grey-dark pointer-events-none"
        }`;
    };

    return (
        <div className="flex items-center bg-grey-light w-fit mx-auto mt-7 mb-5">
            <button
                className={getButtonClassName(!hasPrev)}
                onClick={pageDecrementHandler}
            >
                prev
            </button>
            <span className="text-grey-darker mx-3 text-lg font-semibold">
                {page}
            </span>
            <button
                className={getButtonClassName(!hasNext)}
                onClick={pageIncrementHandler}
            >
                next
            </button>
        </div>
    );
};

export default Pagination;
