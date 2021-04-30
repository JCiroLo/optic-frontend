import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { getAllGlasses } from '../utils/Actions';
import LoadingScreen from '../layout/LoadingScreen';

import '../../css/Mounts.scss';

const useOutsideAlerter = (ref, hideFunction) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                hideFunction(false)
                document.body.classList.remove("fix-overflow");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, hideFunction]);
}

function Mounts({ onChange, toggleVisibility, visibility }) {
    const [selectedId, setSelectedId] = useState(null);
    const [mounts, setMounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { stateAction, allGlasses } = await getAllGlasses();
            if (stateAction) { setMounts(allGlasses); }
            setLoading(false);
        })()
    }, [])

    const mountSelectorRef = useRef(null)

    useOutsideAlerter(mountSelectorRef, toggleVisibility)

    return (
        <>
            {loading && visibility && <LoadingScreen />}
            <div className={classnames("mounts-slider", { 'show': !loading && visibility })}>
                <div className="mounts-section" ref={mountSelectorRef}>
                    <div className="title principal-font">
                        <i className="material-icons"
                            onClick={() => {
                                toggleVisibility(false);
                                document.body.classList.remove("fix-overflow");
                            }}>close</i>
                        <span>Elige tu montura ideal</span>
                    </div>
                    <div className="content row align-content-start flex-wrap m-0">
                        {mounts.map((frame, index) => (
                            <div
                                key={index}
                                className={classnames("frame col-6 col-sm-6", { 'selected': selectedId === frame._id })}
                            >
                                <div
                                    className="thumb"
                                    onClick={(e) => {
                                        onChange(`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_testing.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`)
                                        setSelectedId(frame._id)
                                    }}
                                    style={{ backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_testing.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc)` }}
                                />
                                <div className="info">
                                    <h5 className="principal-font font-weight-bold">{frame.brand}</h5>
                                    <Link className="more-info" to={`/detail/${frame._id}`} target='_blank'>
                                        <span className="material-icons">info</span>
                                    </Link>

                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}



export default Mounts
