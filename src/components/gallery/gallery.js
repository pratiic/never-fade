import React, { useRef, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { MdClose } from "react-icons/md";

import {
    decrementActiveIndex,
    incrementActiveIndex,
    resetGallery,
} from "../../redux/gallery/gallery.actions";

const Gallery = ({ galleryInfo: { show, images, activeIndex } }) => {
    const dispatch = useDispatch();
    const containerRef = useRef();
    const icon = "icon h-5 w-5 bg-grey-dark opacity-80 hover:opacity-100";

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, [containerRef.current]);

    const handleContainerClick = (event) => {
        if (event.target.id === "gallery-container") {
            dispatch(resetGallery());
        }
    };

    const handleKeyPress = (event) => {
        if (event.code === "ArrowLeft") {
            dispatch(decrementActiveIndex());
        }

        if (event.code === "ArrowRight") {
            dispatch(incrementActiveIndex());
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div
            className={`flex ${
                images.length > 1 ? "justify-between" : "justify-center"
            } items-center fixed h-full w-full z-50 bg-black-modal px-5 outline-none`}
            id="gallery-container"
            tabIndex={-1}
            ref={containerRef}
            onClick={handleContainerClick}
            onKeyDown={handleKeyPress}
        >
            <MdClose
                className={`${icon} absolute top-5 right-5`}
                onClick={() => dispatch(resetGallery())}
            />

            {images.length > 1 && (
                <FiArrowLeft
                    className={`${icon}`}
                    onClick={() => dispatch(decrementActiveIndex())}
                />
            )}

            <img
                src={images[activeIndex].src}
                alt="mem img"
                className="image max-h-80 max-w-80"
            />

            {images.length > 1 && (
                <FiArrowRight
                    className={`${icon}`}
                    onClick={() => dispatch(incrementActiveIndex())}
                />
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        galleryInfo: state.gallery,
    };
};

export default connect(mapStateToProps)(Gallery);
