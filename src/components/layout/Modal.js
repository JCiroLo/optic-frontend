import { useEffect } from 'react';
import classnames from 'classnames';

import '../../css/Modal.scss';

const Modal = ({ className, show, children, width = null, height = null }) => {

    const customStyle = {
        'height': height !== null && height,
        'width': width !== null && width
    }

    const customClassName = {
        'no-height': height === null,
        'no-width': width === null
    }

    useEffect(() => {
        show ? document.body.classList.add("fix-overflow") : document.body.classList.remove("fix-overflow");
        return () => { }
    }, [show])

    return (
        <div className={classnames(`custom-modal ${className}`, { show })}>
            <div className={classnames("custom-modal-content", customClassName)} style={customStyle}>
                <div className="custom-modal-header">
                    {children.map(child => child.props.type === 'title' ? child : null)}
                </div>
                <div className="custom-modal-body">
                    {children.map(child => child.props.type === 'body' ? child : null)}
                </div>
                <div className="custom-modal-footer">
                    {children.map(child => child.props.type === 'action' ? child : null)}
                </div>
            </div>

        </div >
    )
}

export default Modal
