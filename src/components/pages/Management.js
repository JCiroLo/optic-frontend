import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import classnames from 'classnames';
import Slider from 'react-slick';
import Modal from '../layout/Modal';

import { validateToken, createGlasses, getAllGlasses, deleteGlasses } from '../utils/Actions';
import { storage } from '../utils/Firebase';
import LoadingScreen from '../layout/LoadingScreen';

import '../../css/Management.scss';
import UploadImg from '../../testPics/upload.png';

const Management = ({ location }) => {
    const [loading, setLoading] = useState(true);
    // Validate access
    const [error, setError] = useState('');
    const [access, setAccess] = useState(false);
    // Create glasses
    const [createGlassesInfo, setCreateGlassesInfo] = useState({
        brand: '', color: 'no', shape: 'no', material: 'no', price: ''
    });
    const [uploadProgress, setUploadProgress] = useState({
        model: 0, testing: 0, status: false
    });
    const [thumbs, setThumbs] = useState([]);
    // Editing glasses
    const [editGlassesInfo, seteditGlassesInfo] = useState({})
    // Deleting glasses
    const [deleteGlassesInfo, setDeleteGlassesInfo] = useState({})
    // Get all frame glasses
    const [allGlasses, setAllGlasses] = useState([]);
    // Modals
    const [stateModals, toggleStateModals] = useState({ 'create': false, 'edit': false, 'delete': false });

    const bestSellsSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        swipeToSlide: true
    };

    useEffect(() => {
        document.title = 'Admin section';
        const token = new URLSearchParams(location.search).get('token');

        (async () => {
            const { validate } = await validateToken(token);

            if (validate) {
                setAccess(true);

                const { stateAction, allGlasses } = await getAllGlasses();

                if (stateAction) { setAllGlasses(allGlasses) }
                else { setError('Error: Cargar monturas.') }

                setLoading(false);
            }
            else {
                setError('Error: No tienes acceso.');
                setLoading(false);
            }
        })()

        return () => { }
    }, [location.search]);

    const handleCreateForm = e => {
        const { id, value } = e.target;
        setCreateGlassesInfo({ ...createGlassesInfo, [id]: value });
    }

    const handleUploadImages = e => {
        const { files } = e.target;

        if (files.length < 2) {
            Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: true
            }).fire({
                icon: 'error',
                title: 'Te falta otra imagen.'
            });
            return;
        }

        if (files.length > 2) {
            Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: true
            }).fire({
                icon: 'error',
                title: 'No puedes subir mas de 2 imagenes.'
            });
            return;
        }

        setThumbs([...files]);
    }

    const openModal = (type, param) => {
        if (type === 'create') {
            toggleStateModals({ 'create': true, 'edit': false, 'delete': false });
        }
        else if (type === 'edit') {
            toggleStateModals({ 'create': false, 'edit': true, 'delete': false });
        }
        else if (type === 'delete') {
            toggleStateModals({ 'create': false, 'edit': false, 'delete': true });
            setDeleteGlassesInfo(param)
        }
    }

    const closeModal = () => {
        toggleStateModals({ 'create': false, 'edit': false, 'delete': false });
    }

    const onCreate = async (e) => {
        e.preventDefault();

        // Varify empty inputs
        let emptyFields = false;

        if (createGlassesInfo.brand.trim() === "" || createGlassesInfo.price === 0 || createGlassesInfo.color === "no"
            || createGlassesInfo.material === "no" || createGlassesInfo.shape === "no") {
            emptyFields = true;
        }

        if (emptyFields) {
            Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: true
            }).fire({
                icon: 'error',
                title: 'No pueden haber campos vacíos o sin seleccionar.'
            });
            return;
        }

        if (thumbs.length === 0) {
            Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: true
            }).fire({
                icon: 'error',
                title: 'No has seleccionado imagenes.'
            });
            return;
        }

        setLoading(true);

        closeModal();
        const { /* stateAction */newGlasses } = await createGlasses(createGlassesInfo);

        setLoading(false);

        await uploadFiles(newGlasses);

        allGlasses.push({ ...createGlassesInfo, _id: newGlasses });

        // Reset values
        setCreateGlassesInfo({
            brand: '',
            color: 'no',
            shape: 'no',
            material: 'no',
            price: ''
        });

        setThumbs([]);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setUploadProgress({ status: false, model: 0, testing: 0 })

        Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        }).fire({
            icon: 'success',
            title: `Mountura creada correctamente.`
        });
    }

    const uploadModelFile = id => {
        return new Promise(resolve => {
            const taskModel = storage.child(`/${id}_model.png`).put(thumbs[0]);
            taskModel.on('state_changed',
                (snapshot) => {
                    setUploadProgress({
                        ...uploadProgress,
                        status: true,
                        model: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    })
                }, (error) => {
                    console.log(error.message);
                }, () => {
                    resolve()
                }
            )
        })
    }

    const uploadTestingFile = id => {
        return new Promise(resolve => {
            const taskModel = storage.child(`/${id}_testing.png`).put(thumbs[1]);
            taskModel.on('state_changed',
                (snapshot) => {
                    setUploadProgress({
                        ...uploadProgress,
                        status: true,
                        model: 100,
                        testing: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    })
                }, (error) => {
                    console.log(error.message);
                }, () => {
                    resolve()
                }
            )
        })
    }

    const uploadFiles = async id => {
        await uploadModelFile(id);
        await uploadTestingFile(id);
    }

    const onEdit = async currentGlasses => {

    }

    const onDelete = async currentGlasses => {
        setLoading(true);
        const { stateAction } = await deleteGlasses(currentGlasses._id);
        try {
            await storage.child(`${currentGlasses._id}_model.png`).delete();
            await storage.child(`${currentGlasses._id}_testing.png`).delete();
        }
        catch (e) {
            console.log('Esta montura no tenía imagen.')
        }

        setLoading(false);

        if (!stateAction) {
            Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: true
            }).fire({
                icon: 'error',
                title: 'Ha ocurrido un error inesperado, intentalo de nuevo.'
            });
            return;
        }

        Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        }).fire({
            icon: 'success',
            title: `Mountura eliminada correctamente.`
        });

        setAllGlasses(prev => prev.filter(item => item._id !== currentGlasses._id));
        closeModal();
    }

    const createGlassesSection =
        <div className="create secondary-font">
            <form className="container row mx-auto" noValidate>
                <div className="col-12 col-md-6 col-lg-3">
                    <label htmlFor="images" className="upload-images">
                        <Slider {...bestSellsSettings} className="slider">
                            {thumbs.map(item => URL.createObjectURL(item)).map((img, index) =>
                                <span key={index}>
                                    <div className="thumbs" style={{ backgroundImage: `url(${img})`, height: '100%' }} />
                                </span>
                            )}
                        </Slider>
                        <img src={UploadImg} alt="" style={{ visibility: thumbs.length > 0 ? 'hidden' : 'visible' }} />
                        <input type="file" id="images" accept="image/*" multiple onChange={handleUploadImages} />
                    </label>
                </div>
                <div className="inputs row mx-0 col-12 col-md-6 col-lg-9">
                    <div className="form-group brand col-12">
                        <input
                            className="form-control"
                            style={{ borderColor: createGlassesInfo.brand ? '#56ab2f' : '#839192' }}
                            id="brand"
                            type="text"
                            spellCheck="false"
                            autoFocus='1'
                            value={createGlassesInfo.brand}
                            onChange={handleCreateForm} />
                        <label
                            className={classnames("placeholder", { 'active': createGlassesInfo.brand })}
                            htmlFor="brand">
                            Marca
                        </label>
                    </div>

                    <div className="form-group color col-12 col-lg-4">
                        <select
                            className="custom-select"
                            style={{ borderColor: createGlassesInfo.color !== 'no' ? '#56ab2f' : '#839192' }}
                            id='color'
                            onChange={handleCreateForm}>
                            <option value="no">Color</option>
                            <option value="rojo">Rojo</option>
                            <option value="amarillo">Amarillo</option>
                            <option value="verde">Verde</option>
                        </select>
                    </div>

                    <div className="form-group shape col-12 col-lg-4">
                        <select
                            className="custom-select"
                            style={{ borderColor: createGlassesInfo.shape !== 'no' ? '#56ab2f' : '#839192' }}
                            id='shape'
                            onChange={handleCreateForm}>
                            <option value="no">Forma</option>
                            <option value="rectangular">Rectangular</option>
                            <option value="agatada">Agatada</option>
                            <option value="semiAgatada">Semi-Agatada</option>
                        </select>
                    </div>

                    <div className="form-group material col-12 col-lg-4">
                        <select
                            className="custom-select"
                            style={{ borderColor: createGlassesInfo.material !== 'no' ? '#56ab2f' : '#839192' }}
                            id='material'
                            onChange={handleCreateForm}>
                            <option value="no">Material</option>
                            <option value="plastico">Plástico</option>
                            <option value="aluminio">Aluminio</option>
                            <option value="acetato">Acetato</option>
                        </select>
                    </div>

                    <div className="form-group price col-12">
                        <input
                            className="form-control"
                            style={{ borderColor: createGlassesInfo.price ? '#56ab2f' : '#839192' }}
                            id="price"
                            type="number"
                            spellCheck="false"
                            min="1"
                            value={createGlassesInfo.price}
                            onChange={handleCreateForm} />
                        <label
                            className={classnames("placeholder", { 'active': createGlassesInfo.price })}
                            htmlFor="price">
                            Precio (COP)
                        </label>
                    </div>
                </div>
            </form>
        </div>

    return (
        <div className="Management principal-font">
            <div className="modals secondary-font">
                <Modal show={stateModals.create} >
                    <div type='title'>Agregar montura</div>
                    <div type='body'>{createGlassesSection}</div>
                    <button type='action' className="confirm" onClick={onCreate}>
                        Crear
                    </button>
                    <button type='action' className="cancel" onClick={closeModal}>
                        Cancelar
                    </button>
                </Modal>

                <Modal show={stateModals.edit} >
                    <div type='title'>Editando "{editGlassesInfo.brand}"</div>
                    <div type='body'>Esta acción no se podrá revertir en el futuro.</div>
                    <button type='action' className="confirm" onClick={() => onDelete(deleteGlassesInfo)}>
                        Eliminar
                    </button>
                    <button type='action' className="cancel" onClick={closeModal}>
                        Cancelar
                    </button>
                </Modal>

                <Modal show={stateModals.delete} >
                    <div type='title'>¿Estas seguro que deseas eliminar "{deleteGlassesInfo.brand}" ?</div>
                    <div type='body'>Esta acción no se podrá revertir en el futuro.</div>
                    <button type='action' className="confirm" onClick={() => onDelete(deleteGlassesInfo)}>
                        Eliminar
                    </button>
                    <button type='action' className="cancel" onClick={closeModal}>
                        Cancelar
                    </button>
                </Modal>

                <Modal show={uploadProgress.status}>
                    <div type='title'></div>
                    <div type='body'>
                        <div className="uploading-progress secondary-font">
                            <h2>Creando montura</h2>
                            <div className="progress">
                                <div
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    aria-valuenow={((uploadProgress.model / 2) + (uploadProgress.testing / 2))}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{ width: `${((uploadProgress.model / 2) + (uploadProgress.testing / 2))}%` }}
                                />
                            </div>
                            <small className="mt-2"><h4>{((uploadProgress.model / 2) + (uploadProgress.testing / 2))}%</h4></small>
                        </div>
                    </div>
                </Modal>
            </div>
            {loading &&
                <LoadingScreen />
            }

            {error && <h1>{error}</h1>}

            {access && <>
                <h5 className="title text-center">Gestionar mounturas</h5>
                <div className="manage-actions secondary-font">
                    <button className="btn" onClick={() => openModal('create')}>
                        <span className="material-icons">
                            add
                    </span> Agregar montura
                </button>
                    <button className="btn">
                        <span className="material-icons">
                            insert_link
                    </span> Otra acción
                </button>
                </div>
                <div className="row mx-0">
                    {allGlasses.map((frame, index) =>
                        <div key={index} className="frame col-6 col-md-4 col-lg-2">
                            <span className="brand">{frame.brand}</span>
                            <div className="thumb" style={{ backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc)` }}></div>
                            <span className="price">${new Intl.NumberFormat("de-DE").format(frame.price)}</span>

                            <div className="actions">
                                <span className="material-icons" onClick={() => onEdit(frame)}>
                                    edit
                            </span>
                                <span className="material-icons" onClick={() => openModal('delete', frame)}>
                                    delete
                            </span>
                            </div>
                        </div>
                    )}
                </div>
            </>
            }
            <style type="text/css">
                {`
                    footer {display: none}
                `}
            </style>
        </div>
    )
}

export default Management;
