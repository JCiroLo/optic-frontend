import React, { FC, useEffect } from 'react';
import classnames from 'classnames';

import '../../css/Modal.scss';

interface ModalProps {
    className?: string,
    show?: boolean,
    height?: string,
    width?: string,
    Title?: React.ReactNode,
    Body?: React.ReactNode,
    Actions?: React.ReactNode
}

const Modal: FC<ModalProps> = ({
    className = '',
    show = true,
    height = undefined,
    width = undefined,
    Title = <></>,
    Body = <></>,
    Actions = <></>
}) => {

    const customStyle: React.CSSProperties = {
        'height': height,
        'width': width
    }

    useEffect(() => {
        show ?
            document.body.classList.add("fix-overflow") :
            document.body.classList.remove("fix-overflow");
        return () => { }
    }, [show])

    return (
        <div className={classnames(`custom-modal ${className}`, { show })}>
            <div className={classnames("custom-modal-content")} style={customStyle}>
                <div className="custom-modal-header">
                    {Title}
                </div>
                <div className="custom-modal-body">
                    {Body}
                </div>
                <div className="custom-modal-footer">
                    {Actions}
                </div>
            </div>

        </div >
    )
}

export default Modal;
