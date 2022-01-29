import React from "react";
import { connect, useDispatch } from "react-redux";
import { ImSpinner11 } from "react-icons/im";
import { RiCloseFill } from "react-icons/ri";

import { closeModal as closeModalRedux } from "../../redux/modal/modal.actions";

import { capitalizeFirstLetter } from "../../utils/utils.strings";

const Modal = ({ modalInfo }) => {
    const { showModal, modalMessage, loading, proceedHandler, children } =
        modalInfo;
    const dispatch = useDispatch();

    if (!showModal) {
        return null;
    }

    const renderModalConfirmation = () => {
        return (
            <div>
                <h3 className="text-2xl text-black text-center mb-5 mt-2">
                    {capitalizeFirstLetter(modalMessage)}
                </h3>
                <div className="flex justify-center items-center">
                    <button className="button-secondary" onClick={closeModal}>
                        no
                    </button>
                    <button className="button ml-3" onClick={proceedHandler}>
                        yes
                    </button>
                </div>
            </div>
        );
    };

    const renderModalMessage = () => {
        return (
            <div className="flex items-center text-xl text-black">
                {capitalizeFirstLetter(modalMessage)}{" "}
                <ImSpinner11 className="ml-3" />
            </div>
        );
    };

    const handleModalContainerClick = (event) => {
        if (event.target.id === "modal-container") {
            closeModal();
        }
    };

    const closeModal = () => {
        if (!loading) {
            dispatch(closeModalRedux());
        }
    };

    return (
        <div
            className="flex justify-center items-center fixed l-0 t-0 h-screen w-screen bg-black-modal"
            id="modal-container"
            onClick={handleModalContainerClick}
        >
            <div className="flex items-center px-7 py-3 min-h-5 max-w-25 rounded shadow-lg bg-white relative">
                {!loading && (
                    <RiCloseFill
                        className="block absolute top-0 left-0 icon-bigger"
                        onClick={closeModal}
                    />
                )}
                {proceedHandler
                    ? renderModalConfirmation()
                    : modalMessage
                    ? renderModalMessage()
                    : null}
                {children}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        modalInfo: state.modal.modalInfo,
    };
};

export default connect(mapStateToProps)(Modal);
