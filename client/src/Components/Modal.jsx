import React, { useState } from "react";
import Button from "./Button";

const Modal = ({
  id,
  button,
  headerTitle,
  children,
  onCancel,
  onSubmit,
  singleActionButton,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div id={id}>
        <div onClick={() => setShowModal((prev) => !prev)}>{button}</div>

        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/[0.25] z-10 px-4 md:px-0">
            <div className="min-w-full md:min-w-40 lg:min-w-72 max-w-full md:max-w-2xl lg:max-w-4xl bg-white rounded-[28px]">
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
                          onCancel();
                        }}
                        type="button"
                        buttonStyle="text-button"
                      >
                        Cancel
                      </Button>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Modal;
