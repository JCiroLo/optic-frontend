import React, { CSSProperties, FC } from 'react';
import classnames from 'classnames';

interface CustomArrowProps {
    className?: string,
    styles?: CSSProperties,
    onClick?: React.MouseEventHandler
}

const SlickCustomArrow: FC<CustomArrowProps> = ({
    className = "",
    styles = {},
    onClick
}) => {
    const classList = className.trim().split(" ");
    return (
        <button
            className={classnames('btn custom-arrow', { 'slick-disabled': classList.includes('slick-disabled') })}
            style={styles}
            onClick={onClick}
        >
            <span className="material-icons">arrow_right</span>
        </button >
    );
}

export default SlickCustomArrow;