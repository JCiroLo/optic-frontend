import React from 'react';
import classnames from 'classnames';

const SlickCustomArrow = ({ className, styleName, onClick }) => {
    const classList = className.split(" ");
    return (
        <button
            className={classnames('btn custom-arrow', { 'slick-disabled': classList.includes('slick-disabled') })}
            style={{ ...styleName }}
            onClick={onClick}
        >
            <span className="material-icons">arrow_right</span>
        </button>
    );
}

export default SlickCustomArrow;