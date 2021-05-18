import { FC, MouseEventHandler } from 'react';
import classnames from 'classnames';

import '../../css/ButtonToggler.scss';

interface ButtonTogglerProps {
    className?: string
    state: boolean,
    onClick: MouseEventHandler
}

const ButtonToggler: FC<ButtonTogglerProps> = ({ className = '', state, onClick }) => {
    return (
        <div className={classnames('parent-toggler', { 'active': state })}>
            <button
                className={`btn btn-toggler ${className}`}
                onClick={onClick}
            >
                <span className="top"></span>
                <span className="mid"></span>
                <span className="bot"></span>
            </button>
        </div>
    )
}

export default ButtonToggler
