import React from "react";
import Button from "./Button";

const Modal = ({
  headerTitle,
  children,
  showModal,
  setShowModal,
  onCancel,
  onSubmit,
  singleActionButton,
}) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/[0.5] z-10">
          <div className="w-full min-w-72 max-w-4xl bg-white rounded-[28px]">
            {/* Header and Content */}
            <div className="flex flex-col gap-y-6 pt-6 px-6">
              {/* Header */}
              <h3 className="text-2xl text-[#1D1B20]">{headerTitle}</h3>

              {/* Content */}
              {children}
            </div>
            {/* Actions Button */}
            <div className="flex justify-end">
              <div className="flex items-center gap-x-2 py-6 pr-6 pl-2">
                {singleActionButton ? (
                  <Button
                    onClick={() => {
                      setShowModal(false);
                      if (onSubmit) {
                        onSubmit();
                      }
                    }}
                    type="button"
                    buttonStyle="text-button"
                  >
                    Submit
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setShowModal(false);
                        if (onSubmit) {
                          onSubmit();
                        }
                      }}
                      type="button"
                      buttonStyle="text-button"
                    >
                      Submit
                    </Button>
                    <Button
                      onClick={() => {
                        setShowModal(false);
                        onCancel();
                      }}
                      type="button"
                      buttonStyle="text-button"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;