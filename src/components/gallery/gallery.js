import React, { useRef, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { BsImage } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";

import {
    decrementActiveIndex,
    incrementActiveIndex,
    resetGallery,
} from "../../redux/gallery/gallery.actions";

const Gallery = ({ galleryInfo: { show, images, activeIndex } }) => {
    const dispatch = useDispatch();
    const containerRef = useRef();
    const imgLinkRef = useRef();
    const icon =
        "icon h-5 w-5 bg-grey-dark opacity-80 hover:opacity-100 z-50 absolute";
    const stepIcon = `${icon} top-1/2 -translate-y-full`;

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

    const handleDownloadClick = async () => {
        const { src, id } = images[activeIndex];
        const image = await fetch(src);
        const imageBlob = await image.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        imgLinkRef.current.href = imageURL;
        imgLinkRef.current.download = id;
        imgLinkRef.current.click();
    };

    if (!show) {
        return null;
    }

    return (
        <div
            className={`flex justify-center items-center fixed h-full w-full z-50 bg-black-modal outline-none`}
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
            <FiDownload
                className={`${icon} absolute top-5 right-14 mr-5`}
                onClick={handleDownloadClick}
            />
            <a href="link" className="hidden" ref={imgLinkRef}>
                download image
            </a>

            {images.length > 1 && (
                <FiArrowLeft
                    className={`${stepIcon} left-3 500:left-5`}
                    onClick={() => dispatch(decrementActiveIndex())}
                />
            )}

            <BsImage className="image-icon text-grey" />
            <img
                src={images[activeIndex].src}
                alt="mem img"
                className="image max-w-full max-h-full relative"
            />

            {images.length > 1 && (
                <FiArrowRight
                    className={`${stepIcon} right-3 500:right-5`}
                    onClick={() => dispatch(incrementActiveIndex())}
                />
            )}

            <p className="text-grey-darker absolute bottom-1 left-1/2 -translate-x-full z-50 bg-grey opacity-70 rounded px-2">
                {activeIndex + 1} of {images.length}
            </p>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        galleryInfo: state.gallery,
    };
};

export default connect(mapStateToProps)(Gallery);
