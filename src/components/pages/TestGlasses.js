import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Stage, Layer, Transformer, Image } from 'react-konva';
import useImage from 'use-image';
import Mounts from '../layout/Mounts';

import '../../css/TestGlasses.scss';

const PictureShape = ({ shapeProps, isSelected, onSelect, onChange, image }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <Image
                image={image}
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

const getPhotoDimensions = dataURL => new Promise(resolve => {
    const img = new window.Image();
    img.onload = () => {
        resolve({
            height: img.height,
            width: img.width
        });
    }
    img.src = dataURL;
});

const getPhotoURL = img => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function (e) {
        resolve({
            url: e.target.result
        });
    }
    reader.readAsDataURL(img);
});

const UploadedPhoto = ({ img, dimensions }) => {
    const [image] = useImage(img);
    return <Image {...dimensions} id="1000" image={image} />;
};

const getResponsiveDimensions = ({ width, height }, navbarHeight) => {
    const onMobile = window.innerWidth < window.innerHeight;

    // Window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.window.innerHeight - navbarHeight;

    // Media aspect ratio
    const ratio = width / height;

    const stageWidth = onMobile
        ? windowWidth
        : windowHeight * ratio;
    const stageHeight = onMobile
        ? windowWidth * (1 / ratio)
        : windowHeight;

    return { width: stageWidth, height: stageHeight };
}

const TestGlasses = ({ navbarHeight = 72.250 }) => {
    const [stageDims, setStageDims] = useState({ width: 0, height: 0 });
    const [selectedId, selectShape] = useState(null);
    const [selectedMount, setSelectedMount] = useState(null);
    const [uploadedPhoto, setUploadedPhoto] = useState(null);
    const [cameraState, setCameraState] = useState(1); // 0:Denied, 1:Questing ,2:Loading, 3:Allowed, 4:Photo
    const [loadingCamera, setLoadingCamera] = useState(false);
    const [pic, setPic] = useState({
        x: 0,
        y: 0
    });
    const [showMounts, setShowMounts] = useState(false);

    const webcamRef = useRef(null);
    const videoCanvasRef = useRef(null);

    const [image] = useImage(selectedMount);

    document.title = "Probar monturas";

    useEffect(() => {
        if (cameraState === 3) {

            const cameraWidth = webcamRef.current.video.videoWidth;
            const cameraHeight = webcamRef.current.video.videoHeight;

            setStageDims(getResponsiveDimensions({ width: cameraWidth, height: cameraHeight }, navbarHeight));
        }

        return () => { }
    }, [cameraState, loadingCamera, navbarHeight])

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === "1000";
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    const drawImge = () => {
        if (cameraState === 3) {
            if (webcamRef.current && videoCanvasRef.current) {
                const video = webcamRef.current;
                const canvas = videoCanvasRef.current.content.children[0];

                var ctx = canvas.getContext('2d');

                canvas.width = video.video.videoWidth;
                canvas.height = video.video.videoHeight;

                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video.video, 0, 0, canvas.width, canvas.height);
                ctx.scale(-1, 1);
                ctx.translate(-canvas.width, 0);

                setTimeout(drawImge, 50);
            }
        }
    }

    const handleUseCam = () => {
        setCameraState(2)
        setLoadingCamera(true)

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
            || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { video: true },
                () => {
                    setTimeout(() => {
                        setLoadingCamera(false)
                        setCameraState(3)
                    }, 1000);
                },
                () => {
                    setCameraState(0)
                }
            )
        } else {
            setTimeout(() => {
                setLoadingCamera(false)
                setCameraState(3)
            }, 1000);
        }
    }

    const HandleUsePhoto = async (e) => {
        const { url } = await getPhotoURL(e.target.files[0]);
        const { width, height } = await getPhotoDimensions(url);

        setCameraState(4);
        setUploadedPhoto(url);
        setStageDims(getResponsiveDimensions({ width, height }, navbarHeight));
    }

    const HandleUseTestPic = async () => {
        const url = 'https://image.freepik.com/free-photo/portrait-young-beautiful-woman-with-fresh-clean-skin-isolated-white_186202-1721.jpg';
        const { width, height } = await getPhotoDimensions(url);

        setCameraState(4);
        setUploadedPhoto(url);
        setStageDims(getResponsiveDimensions({ width, height }, navbarHeight));
    }

    const resetValues = () => {
        setCameraState(1);
        setLoadingCamera(false);
        setUploadedPhoto(null);
        setStageDims({ width: 0, height: 0 });
    }

    drawImge();

    return (
        <div className="Test row justify-content-center align-items-center mx-0 r-font principal-font">
            {cameraState !== 1 && cameraState !== 2 &&
                <>
                    <Mounts
                        toggleVisibility={setShowMounts}
                        visibility={showMounts}
                        onChange={(image) => setSelectedMount(image)}
                    />
                    <div className="test-actions-container">
                        <div className="test-actions">
                            <span className="material-icons btn-back" onClick={resetValues}>
                                arrow_back
                            </span>
                            <span className="material-icons btn-camera">
                                camera_alt
                            </span>
                            <span className="material-icons btn-search" onClick={() => {
                                setShowMounts(true);
                                document.body.classList.add("fix-overflow");
                            }}>
                                search
                            </span>
                        </div>
                    </div>
                </>
            }
            {cameraState === 0 &&
                <>
                    <div className="glitch-wrapper row mx-0">
                        <span className="material-icons">videocam_off</span>
                        <div className="glitch" data-text="Error :(">Error :(</div>
                        <h4>Puede ser debido a:</h4>
                        <ul>
                            <li>Denegaste los permisos de acceso a cámara.</li>
                            <li>Otra aplicación está utilizando la cámara.</li>
                        </ul>
                    </div>
                </>
            }
            {cameraState >= 1 && cameraState <= 2 &&
                <div className="menu-options row flex-column justify-content-center secondary-font">
                    <button className="btn btn-special" onClick={handleUseCam}>
                        {loadingCamera
                            ? <div className="spinner-border " role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            : <i className="material-icons">videocam</i>
                        }
                        <span>Usar mi camara</span>
                    </button>

                    <label className="btn btn-special custom-file-upload">
                        <input type="file" accept="image/*" onChange={HandleUsePhoto} />
                        <i className="material-icons">
                            add_photo_alternate
                        </i>
                        <span>Subir foto</span>
                    </label>

                    <button className="btn btn-special" onClick={HandleUseTestPic}>
                        <i className="material-icons">landscape</i>
                        <span>Usar foto de prueba</span>
                    </button>
                </div>
            }
            {cameraState >= 2 && cameraState <= 3 &&
                <>
                    < Webcam
                        audio={false}
                        ref={webcamRef}
                        mirrored
                        style={{
                            width: "0%", height: "0%"
                        }}
                    />
                    <Stage
                        ref={videoCanvasRef}
                        className=""
                        {...stageDims}
                        onMouseDown={checkDeselect}
                        onTouchStart={checkDeselect}
                    >
                        <Layer />
                        <Layer>
                            <PictureShape
                                image={image}
                                shapeProps={pic}
                                isSelected={pic.id === selectedId}
                                onSelect={() => {
                                    selectShape(pic.id);
                                }}
                                onChange={(newAttrs) => {
                                    setPic(newAttrs);
                                }}
                            />
                        </Layer>
                    </Stage>
                </>
            }
            {cameraState === 4 &&
                <>
                    <Stage
                        {...stageDims}
                        onMouseDown={checkDeselect}
                        onTouchStart={checkDeselect}
                    >
                        <Layer><UploadedPhoto img={uploadedPhoto} dimensions={stageDims}></UploadedPhoto></Layer>
                        <Layer>
                            <PictureShape
                                image={image}
                                shapeProps={pic}
                                isSelected={pic.id === selectedId}
                                onSelect={() => {
                                    selectShape(pic.id);
                                }}
                                onChange={(newAttrs) => {
                                    setPic(newAttrs);
                                }}
                            />
                        </Layer>
                    </Stage>
                </>
            }
        </div>
    );
}

export default TestGlasses;