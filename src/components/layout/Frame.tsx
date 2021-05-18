import { FC } from 'react';
import { Link } from 'react-router-dom';

import { FrameType } from '../utils/Consts';

import '../../css/Frame.scss';

interface FrameProps {
    image: string,
    frameInfo: FrameType,
    className?: string
}

const Frame: FC<FrameProps> = ({
    children,
    image,
    frameInfo,
    className = ""
}) => {
    const innerInfo =
        <><div className="thumb" style={{ backgroundImage: `url(${image})` }} />
            { frameInfo.discount > 0 && <span className="offer">En oferta</span>}
            <div className="info">
                <h5 className="principal-font">{frameInfo.brand}</h5>
                <p>
                    {frameInfo.discount ?
                        <><span>${new Intl.NumberFormat("de-DE").format(frameInfo.price)}</span> <strong>
                            ${new Intl.NumberFormat("de-DE").format(frameInfo.price * (1 - frameInfo.discount / 100))}
                        </strong></> :
                        <strong>
                            ${new Intl.NumberFormat("de-DE").format(frameInfo.price)}
                        </strong>
                    }
                </p>
            </div>
            <div className="actions">
                {children}
            </div>
        </>

    const outerInfo = children
        ? <div className={`frame secondary-font ${className}`}>
            {innerInfo}
        </div>
        : <Link className={`frame secondary-font ${className}`} to={`/detail/${frameInfo._id}`}>
            {innerInfo}
        </Link>

    return (
        outerInfo
    )
}

export default Frame;
