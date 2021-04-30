import React from 'react';
import { Link } from 'react-router-dom';

import '../../css/Frame.scss';

const Frame = ({ offer, discount, image, frameInfo, className }) => {
    return (
        <Link className={`frame secondary-font ${className}`} to={`/detail/${frameInfo._id}`}>
            <div className="thumb" style={{ backgroundImage: `url(${image})` }} />
            { offer && <span className="offer">En oferta</span>}
            <div className="info">
                <h5 className="principal-font">{frameInfo.brand}</h5>
                <p>
                    {discount && <span>${new Intl.NumberFormat("de-DE").format(frameInfo.price * 1.25)}</span>} <strong>${new Intl.NumberFormat("de-DE").format(frameInfo.price)}</strong>
                </p>
            </div>
        </Link >
    )
}

export default Frame
