import { ChangeEvent, FC, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import classnames from 'classnames';
import Slider from 'react-slick';
import Modal from '../layout/Modal';
import { Link } from 'react-router-dom';

import Input from '../layout/Input';
import Frame from '../layout/Frame';
import { formatText, validateToken, createGlasses, getAllGlasses, deleteGlasses, updateMount } from '../utils/Actions';
import { storage } from '../utils/Firebase';
import LoadingScreen from '../layout/LoadingScreen';
import { COLORS, MATERIALS, SHAPES, FrameType } from '../utils/Consts';

import '../../css/Management.scss';
import UploadImg from '../../testPics/upload.png';

const toast = Swal.mixin({
    toast: true, position: 'top', showConfirmButton: false, timer: 3000, timerProgressBar: true
});

interface ManagementProps { location: { search: string } };

const Management: FC<ManagementProps> = ({ location }) => {
    const [loading, setLoading] = useState(true);
    // Validate access
    const [error, setError] = useState('');
    const [access, setAccess] = useState(false);
    // Create glasses
    const [createGlassesInfo, setCreateGlassesInfo] = useState<FrameType>({
        _id: '', brand: '', color: 'no', shape: 'no', material: 'no', price: 0, description: '', discount: 0, createdAt: new Date(), updatedAt: new Date()
    });
    const [uploadProgress, setUploadProgress] = useState({
        model: 0, testing: 0, status: false
    });
    const [thumbs, setThumbs] = useState<File[]>([]);
    // Updating and Deleting glasses
    const [selectedFrame, setSelectedFrame] = useState<FrameType>({
        _id: '', brand: '', color: 'no', shape: 'no', material: 'no', price: 0, description: '', discount: 0, createdAt: new Date(), updatedAt: new Date()
    })
    // Get all frame glasses
    const [allGlasses, setAllGlasses] = useState<FrameType[]>([]);
    // Modals
    const [stateModals, toggleStateModals] = useState({
        'create': false, 'update': false, 'delete': false
    });

    const emptyFrame: FrameType = { _id: '', brand: '', color: 'no', shape: 'no', material: 'no', price: 0, description: '', discount: 0, createdAt: new Date(), updatedAt: new Date() }

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
        const token: string = new URLSearchParams(location.search).get('token')!;

        (async () => {
            if (!sessionStorage.token) {
                const { validate } = await validateToken(token);

                if (validate) {
                    sessionStorage.setItem('token', JSON.stringify(token))
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
            }
            else {
                if (token === JSON.parse(sessionStorage.getItem('token')!)) {
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
            }
        })()

        return () => { }
    }, [location.search]);

    const validateForm = (action: string): { error: boolean, message: string } => {
        if (action === 'create') {
            const { brand, price, color, material, shape, description, discount } = createGlassesInfo;

            if (brand.trim() === "" || price === 0 || color === "no" || material === "no" || shape === "no" || description.trim() === "") {
                return { error: true, message: 'No pueden haber campos vacíos' };
            }
            else if (price < 0) {
                return { error: true, message: 'El precio no puede ser negativo' };
            }
            else if (discount < 0) {
                return { error: true, message: 'El descuento no puede ser negativo' };
            }
            else if (discount > 100) {
                return { error: true, message: 'El descuento no puede superar 100%' };
            }
            else if (thumbs.length === 0) {
                return { error: true, message: 'No has seleccionado imagenes' };
            }
        }
        else if (action === 'update') {
            const { brand, price, color, material, shape, description, discount } = selectedFrame;

            if (brand.trim() === "" || price === 0 || color === "no" || material === "no" || shape === "no" || description.trim() === "") {
                return { error: true, message: 'No pueden haber campos vacíos' };
            }
            else if (price < 0) {
                return { error: true, message: 'El precio no puede ser negativo' };
            }
            else if (discount < 0) {
                return { error: true, message: 'El descuento no puede ser negativo' };
            }
            /* if (thumbs.length === 0) {
                return { error: true, message: 'No has seleccionado imagenes' };
            } */
        }
        return { error: false, message: '' }
    }

    const openModal = (type: string, obj?: FrameType) => {
        if (type === 'create') {
            toggleStateModals({ 'create': true, 'update': false, 'delete': false });
        }
        else if (type === 'update') {
            toggleStateModals({ 'create': false, 'update': true, 'delete': false });
            setSelectedFrame(obj!)
        }
        else if (type === 'delete') {
            toggleStateModals({ 'create': false, 'update': false, 'delete': true });
            setSelectedFrame(obj!)
        }
    }

    const closeModal = () => {
        toggleStateModals({ 'create': false, 'update': false, 'delete': false });
    }

    const onCreate = async () => {
        const { error, message } = validateForm('create');

        if (error) {
            toast.fire({
                icon: 'error',
                title: message
            });
            return;
        }

        setLoading(true);

        const { stateAction, newGlasses } = await createGlasses(createGlassesInfo);

        setLoading(false);

        if (!stateAction) {
            toast.fire({
                icon: 'error',
                title: 'Ha ocurrido un error inesperado, vuelve a intentarlo.'
            });
            return;
        }

        closeModal();

        await uploadFiles(newGlasses);

        allGlasses.unshift({ ...createGlassesInfo, _id: newGlasses });

        resetValues('create');

        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.fire({
            icon: 'success',
            title: `Mountura creada correctamente.`
        });
    }

    const handleForm = (e: ChangeEvent<HTMLInputElement>, action: string) => {
        const { id, value } = e.target;

        if (action === 'create') setCreateGlassesInfo({ ...createGlassesInfo, [id]: value });
        else if (action === 'update') setSelectedFrame({ ...selectedFrame, [id]: value });
    }

    const handleUploadImages = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;

        if (files === null) return;

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

        setThumbs(Array.from(files));
    }

    const uploadModelFile = (id: string): Promise<void> => {
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

    const uploadTestingFile = (id: string): Promise<void> => {
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

    const uploadFiles = async (id: string) => {
        await uploadModelFile(id);
        await uploadTestingFile(id);
    }

    const onUpdate = async () => {
        const { error, message } = validateForm('update');

        if (error) {
            toast.fire({
                icon: 'error',
                title: message
            });
            return;
        }

        setLoading(true);

        const { stateAction } = await updateMount(selectedFrame);

        setLoading(false);

        if (!stateAction) {
            toast.fire({
                icon: 'error',
                title: 'Ha ocurrido un error inesperado, vuelve a intentarlo.'
            });
            return;
        }

        const newGlasses = allGlasses.map(frame => {
            if (frame._id === selectedFrame._id) return selectedFrame;
            else return frame;
        })

        setAllGlasses(newGlasses);

        closeModal();

        resetValues('update');

        toast.fire({
            icon: 'success',
            title: `Mountura actualizada correctamente.`
        });
    }

    const onDelete = async (currentGlasses: FrameType) => {
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

    const resetValues = (action: string) => {
        if (action === 'create') {
            setCreateGlassesInfo(emptyFrame);
            setUploadProgress({ status: false, model: 0, testing: 0 });
            setThumbs([]);
        }
        else if (action === 'update') {
            setSelectedFrame(emptyFrame);
            //RESET THUMBS
        }
    }

    const formSection = (action: string, frame: FrameType): JSX.Element =>
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
                    <Input
                        id="brand"
                        className="form-group my-2 col-12"
                        formType="input"
                        inputType="text"
                        inputClassName={classnames("form-control", {
                            active: frame.brand !== ""
                        })}
                        autoFocus={true}
                        value={frame.brand}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleForm(e, action)}
                        labelClassName={classnames("placeholder", {
                            active: frame.brand
                        })}
                        labelText="Marca"
                    />

                    <Input
                        id="color"
                        className="form-group my-2 pr-lg-2 col-12 col-lg-4"
                        formType="select"
                        inputClassName={classnames("custom-select", {
                            active: frame.color !== "no"
                        })}
                        autoFocus={false}
                        value={frame.color}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleForm(e, action)}
                        labelText="Color"
                        labelClassName={classnames("placeholder", {
                            active: frame.color !== "no"
                        })}
                    >
                        <option value="no">Color</option>
                        {COLORS.map(({ id, color, style }) => <option key={id} style={style}>{color}</option>)}
                    </Input>

                    <Input
                        id="shape"
                        className="form-group my-2 px-lg-2 col-12 col-lg-4"
                        formType="select"
                        inputClassName={classnames("custom-select", {
                            active: frame.shape !== "no"
                        })}
                        autoFocus={false}
                        value={frame.shape}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleForm(e, action)}
                        labelText="Forma"
                        labelClassName={classnames("placeholder", {
                            active: frame.shape !== "no"
                        })}
                    >
                        <option value="no">Forma</option>
                        {SHAPES.map(({ id, shape }) => <option key={id} value={shape}>{formatText(shape)}</option>)}
                    </Input>

                    <Input
                        id="material"
                        className="form-group my-2 pl-lg-2 col-12 col-lg-4"
                        formType="select"
                        inputClassName={classnames("custom-select", {
                            active: frame.material !== "no"
                        })}
                        autoFocus={false}
                        value={frame.material}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleForm(e, action)}
                        labelText="Material"
                        labelClassName={classnames("placeholder", {
                            active: frame.material !== "no"
                        })}
                    >
                        <option value="no">Material</option>
                        {MATERIALS.map(({ id, material }) => <option key={id}>{material}</option>)}
                    </Input>

                    <Input
                        id="price"
                        className="form-group my-3 pr-md-2 col-12 col-md-6"
                        formType="input"
                        inputType="number"
                        inputClassName={classnames("form-control", {
                            active: frame.price,
                            invalid: frame.price < 0
                        })}
                        autoFocus={false}
                        value={frame.price}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleForm(e, action)}
                        labelClassName={classnames("placeholder", {
                            active: frame.price !== 0
                        })}
                        labelText="Precio (COP)"
                    />

                    <Input
                        id="discount"
                        className="form-group my-3 pl-md-2 col-12 col-md-6"
                        formType="input"
                        inputType="number"
                        inputClassName={classnames("form-control", {
                            active: frame.discount,
                            invalid: frame.discount < 0
                        })}
                        autoFocus={false}
                        value={frame.discount}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleForm(e, action)}
                        labelClassName={classnames("placeholder", {
                            active: frame.discount !== 0
                        })}
                        labelText="Descuento (%)"
                    />

                    <Input
                        id="description"
                        className="form-group my-2 col-12"
                        formType="textarea"
                        inputClassName={classnames("form-control", {
                            active: frame.description
                        })}
                        autoFocus={false}
                        value={frame.description}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleForm(e, action)}
                        labelClassName={classnames("placeholder", {
                            active: frame.description
                        })}
                        labelText="Descripción"
                    />
                </div>
            </form>
        </div >

    return (
        <div className="Management principal-font">
            <div className="modals secondary-font">
                {stateModals.create &&
                    <Modal
                        Title={<div>Agregar montura</div>}
                        Body={<>{formSection('create', createGlassesInfo)}</>}
                        Actions={<>
                            <button className="confirm" onClick={onCreate}>
                                Crear
                            </button>
                            <button className="cancel" onClick={closeModal}>
                                Cancelar
                            </button>
                        </>}
                    />
                }
                {stateModals.update &&
                    <Modal
                        Title={<div>Actualizando "{selectedFrame.brand}"</div>}
                        Body={<div>{formSection('update', selectedFrame)}</div>}
                        Actions={<>
                            <button className="confirm" onClick={onUpdate}>
                                Actualizar
                            </button>
                            <button className="cancel" onClick={closeModal}>
                                Cancelar
                            </button>
                        </>}
                    />

                }
                {stateModals.delete &&
                    <Modal
                        Title={<div>¿Estas seguro que deseas eliminar "{selectedFrame.brand}" ?</div>}
                        Body={<div>Esta acción no se podrá revertir en el futuro.</div>}
                        Actions={<>
                            <button className="confirm" onClick={() => onDelete(selectedFrame)}>
                                Eliminar
                            </button>
                            <button className="cancel" onClick={closeModal}>
                                Cancelar
                            </button>
                        </>}
                    />
                }

                <Modal
                    show={uploadProgress.status}
                    Title={<div>Creando montura</div>}
                    Body={<div>
                        <div className="uploading-progress secondary-font">
                            <div className="progress">
                                <div
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    aria-valuenow={((uploadProgress.model / 2) + (uploadProgress.testing / 2))}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    style={{ width: `${((uploadProgress.model / 2) + (uploadProgress.testing / 2))}%` }}
                                />
                            </div>
                            <small className="mt-2"><h4>{((uploadProgress.model / 2) + (uploadProgress.testing / 2))}%</h4></small>
                        </div>
                    </div>}
                />
            </div>

            {
                loading &&
                <LoadingScreen />
            }

            { error && <h1>{error}</h1>}

            {
                access && <>
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
                            <Frame
                                key={index}
                                className="frame col-6 col-md-4 col-lg-2"
                                image={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                                frameInfo={frame}
                            >
                                <span className="material-icons" onClick={() => openModal('update', frame)}>
                                    edit
                            </span>
                                <span className="material-icons" onClick={() => openModal('delete', frame)}>
                                    delete
                            </span>
                                <Link to={`/detail/${frame._id}`} target='_blank'>
                                    <span className="material-icons">open_in_new</span>
                                </Link>
                            </Frame>
                        )}
                    </div>
                </>
            }
            <style type="text/css">
                {`
                    footer {display: none}
                `}
            </style>
        </div >
    )
}

export default Management;
