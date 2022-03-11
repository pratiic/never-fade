import React, { useRef, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { connect } from "react-redux";
import { RiCloseFill } from "react-icons/ri";
import { BsImage } from "react-icons/bs";
import { useDispatch } from "react-redux";

import { closeModal, showLoadingModal } from "../../redux/modal/modal.actions";
import { resetGallery, showGallery } from "../../redux/gallery/gallery.actions";

import Heading from "../heading/heading";
import ImagesAdder from "../images-adder/images-adder";
import Status from "../status/status";

const ImagesList = ({
    images,
    userInfo,
    removeMemoryImage,
    addMemoryImages,
    canAdd,
}) => {
    const [showAdder, setShowAdder] = useState(false);

    const imagesMessage = "this memory has no images";
    const dispatch = useDispatch();

    const toggleImagesAdder = () => {
        setShowAdder(!showAdder);
    };

    const Image = ({ url, id, index }) => {
        const imageRef = useRef();
        const imageContainerRef = useRef();

        useEffect(() => {
            imageRef.current.addEventListener("load", () => {
                let span = Math.ceil(imageRef.current.clientHeight / 3);
                span = span <= 115 ? span : 115;

                imageContainerRef.current.style.gridRow = `auto / span ${span}`;
            });
        }, []);

        const handleDeleteClick = async () => {
            dispatch(showLoadingModal("deleting image"));
            dispatch(resetGallery());

            try {
                const response = await fetch(`/api/images/delete/${id}/`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });

                if (response.status === 200) {
                    removeMemoryImage(id);
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(closeModal());
            }
        };

        const handleImageClick = (event) => {
            if (event.target.id === "image-deleter") {
                return;
            }

            dispatch(
                showGallery(
                    images.map((image) => {
                        return {
                            src: image.image,
                            id: image.id,
                        };
                    }),
                    index
                )
            );
        };

        return (
            <div
                className="cursor-pointer rounded-sm shadow-md overflow-hidden mb-1 relative min-h-11 bg-grey"
                ref={imageContainerRef}
                onClick={handleImageClick}
            >
                {canAdd && (
                    <TiDeleteOutline
                        className="absolute top-0 right-0 text-grey icon z-10"
                        id="image-deleter"
                        onClick={handleDeleteClick}
                    />
                )}
                <BsImage className="image-icon" />
                <img
                    src={url}
                    alt="mem img"
                    ref={imageRef}
                    className="image w-full relative"
                />
            </div>
        );
    };

    return (
        <div>
            <Heading text="images" backArrow={false}>
                {canAdd ? (
                    images.length < 15 ? (
                        <button
                            className="button-secondary-small ml-5"
                            onClick={toggleImagesAdder}
                        >
                            {showAdder ? (
                                <React.Fragment>
                                    cancel{" "}
                                    <RiCloseFill className="ml-2 h-5 w-5" />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    add images{" "}
                                    <AiOutlinePlus className="ml-2 h-5 w-5" />
                                </React.Fragment>
                            )}
                        </button>
                    ) : (
                        <button className="button-secondary-small ml-5 pointer-events-none">
                            added max (15)
                        </button>
                    )
                ) : null}
            </Heading>
            <div className="mb-5"></div>

            {showAdder && (
                <React.Fragment>
                    <ImagesAdder
                        addMemoryImages={(images) => {
                            addMemoryImages(images);
                            setShowAdder(false);
                        }}
                        imageCount={images.length}
                    />
                    <div className="mb-5"></div>
                </React.Fragment>
            )}

            {images.length > 0 ? (
                <div className="grid grid-cols-list auto-rows-3 gap-x-1 grid-flow-row-dense">
                    {images.map((image, index) => {
                        return (
                            <Image
                                url={image.image}
                                id={image.id}
                                index={index}
                                key={image.id}
                            />
                        );
                    })}
                </div>
            ) : (
                <Status text={imagesMessage} />
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userInfo: state.currentUser.userInfo,
    };
};

export default connect(mapStateToProps)(ImagesList);
