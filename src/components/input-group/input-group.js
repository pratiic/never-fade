import React, { forwardRef } from "react";

import { capitalizeFirstLetter } from "../../utils/utils.strings";

const InputGroup = forwardRef(
    (
        {
            label,
            placeholder,
            value,
            type = "text",
            displayType,
            info,
            changeHandler,
        },
        ref
    ) => {
        const inputClassName =
            "border h-9 rounded px-2 focus:border-blue w-full text-black";

        return (
            <div className="mb-5">
                <label className="form-label">
                    {capitalizeFirstLetter(label)}
                </label>
                {displayType === "textarea" ? (
                    <textarea
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => changeHandler(event.target.value)}
                        className={`${inputClassName} h-40 pt-1 leading-5`}
                    ></textarea>
                ) : (
                    <input
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        ref={ref}
                        onChange={(event) => changeHandler(event.target.value)}
                        className={inputClassName}
                    />
                )}
                {info && (
                    <label className="block text-grey-darker pl-1">
                        {" "}
                        {capitalizeFirstLetter(info)}{" "}
                    </label>
                )}
            </div>
        );
    }
);

export default InputGroup;
