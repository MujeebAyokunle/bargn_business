import React from 'react'

function Modal({ children, close }: any) {
    return (
        <div onClick={close} className="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <div onClick={(e) => e.stopPropagation()} className="relative z-50 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal