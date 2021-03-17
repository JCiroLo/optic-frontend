import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames'

import '../../css/Mounts.scss'

const mounts = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 }
]

const useOutsideAlerter = (ref, hideFunction) => {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                hideFunction(true)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, hideFunction]);
}

function Mounts({ onChange }) {
    const [hiden, setHide] = useState(true)
    const [selectedId, setSelectedId] = useState(null)

    const mountSelectorRef = useRef(null)

    useOutsideAlerter(mountSelectorRef, setHide)

    return (
        <div className={classnames("mounts-slider row m-0 align-items-center", { hiden })}>
            <div className="action-button" onClick={() => setHide(false)}>
                <i className="material-icons">arrow_back_ios_new</i>
            </div>
            <div className="mounts-section" ref={mountSelectorRef}>
                <div className="title principal-font row mx-0 justify-content-center">
                    <i className="material-icons" onClick={() => setHide(true)}>close</i>
                    <span className="flex-grow-1">Elije tu montura ideal</span>
                </div>
                <div className="content row align-content-start flex-wrap m-0">
                    {mounts.map(mount => {
                        return <img
                            key={mount.id}
                            src={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/ex${mount.id}.png?alt=media&token=8f686261-a1d4-41f2-9d84-4036f2d1d67f`}
                            alt={`montura${mount.id}`}
                            className={classnames("col-12 col-sm-6", { 'selected': selectedId === mount.id })}
                            onClick={(e) => {
                                onChange(e.target.src)
                                setSelectedId(mount.id)
                            }}
                        />
                    })}
                </div>

            </div>
        </div>
    )
}



export default Mounts
