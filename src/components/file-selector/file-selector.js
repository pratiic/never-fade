import React, { useRef } from "react";
import { CgImage } from "react-icons/cg";

import { selectFile } from "../../redux/files/files.actions";

import { capitalizeFirstLetter } from "../../utils/utils.strings";

import { connect, useDispatch } from "react-redux";

const FileSelector = ({
    label,
    selectedFiles,
    multiple,
    full,
    preview,
    info,
}) => {
    const dispatch = useDispatch();
    const inputRef = useRef();

    const handleFileSelect = (event) => {
        dispatch(selectFile(event.target.files));
    };

    return (
        <div>
            <label className="form-label">{capitalizeFirstLetter(label)}</label>
            {preview && <img src={preview} className="rounded mb-3 block" />}
            <div>
                <input
                    type="file"
                    ref={inputRef}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    className="hidden h-0 w-0"
                />
                <button
                    className={`file-selector ${full && "w-full"}`}
                    onClick={(event) => {
                        event.preventDefault();
                        inputRef.current.click();
                    }}
                >
                    <CgImage className="mr-3" /> select{" "}
                    {multiple ? "images" : "image"}
                </button>
            </div>
            {info && (
                <label className="text-grey-darker pl-1 -mt-2 block mb-3">
                    {capitalizeFirstLetter(info)}
                </label>
            )}
            {selectedFiles.length > 0 && (
                <div className="-mt-1 mb-3">
                    {selectedFiles.map((selectedFile, index) => {
                        return (
                            <p
                                className="text-grey-darker leading-tight mb-1"
                                key={selectedFile.name}
                            >
                                {index + 1}. {selectedFile.name}
                            </p>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        selectedFiles: state.files.selectedFiles,
    };
};

export default connect(mapStateToProps)(FileSelector);
