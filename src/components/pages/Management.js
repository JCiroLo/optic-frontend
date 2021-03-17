import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import classnames from 'classnames';
import Slider from "react-slick";

import { validateToken, createGlasses, getAllGlasses, deleteGlasses } from '../utils/Actions';

import '../../css/Management.scss';
import UploadImg from '../../testPics/upload.png';

const MySwal = withReactContent(Swal)

const Management = ({ location }) => {
    const [loading, setLoading] = useState(true);
    // Validate access
    const [error, setError] = useState('');
    const [access, setAccess] = useState(false);
    // Create glasses
    const [createGlassesInfo, setCreateGlassesInfo] = useState({
        brand: '',
        color: 'no',
        shape: 'no',
        material: 'no',
        price: ''
    });
    const [thumbs, setThumbs] = useState([]);
    // Get all frame glasses
    const [allGlasses, setAllGlasses] = useState([]);

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

    const handleForm = e => {
        const { id, value } = e.target;
        setCreateGlassesInfo({ ...createGlassesInfo, [id]: value });
    }

    const handleUploadImages = e => {
        setThumbs([...e.target.files].map(item => URL.createObjectURL(item)));
    }

    const submitForm = async (e) => {
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

        setLoading(true);
        const { stateAction, newGlasses /* newGlasses es solo el ID */ } = await createGlasses(createGlassesInfo);
        setLoading(false);

        if (stateAction) {
            allGlasses.push(createGlassesInfo);

            setCreateGlassesInfo({
                brand: '',
                color: 'no',
                shape: 'no',
                material: 'no',
                price: ''
            })

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
        else {
            Swal.mixin({
                toast: true,
                position: 'top',
                showConfirmButton: true
            }).fire({
                icon: 'error',
                title: 'Ha ocurrido un error inesperado, intentalo de nuevo.'
            });
        }
    }

    const onEdit = async currentGlasses => {

    }

    const onDelete = async currentGlasses => {
        const { isConfirmed } = await MySwal.fire({
            title: `¿Quieres eliminar "${currentGlasses.brand}"?`,
            text: 'Esta acción no se puede deshacer.',
            showCancelButton: true,
            confirmButtonText: `Eliminar`,
            cancelButtonText: `Cancelar`,
            customClass: {
                popup: 'px-0 modal-config',
                header: 'align-items-start',
                content: 'text-left',
                actions: 'justify-content-end',
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        });

        if (!isConfirmed) return;

        setLoading(true);
        const { stateAction } = await deleteGlasses(currentGlasses._id);
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
    }

    const createGlassesSection = <div className="create secondary-font">
        <form className="container row mx-auto" noValidate onSubmit={submitForm}>
            <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="images" className="upload-images">
                    <Slider {...bestSellsSettings} className="slider">
                        {thumbs.map((img, index) =>
                            <span key={index}>
                                <div className="thumbs" style={{ backgroundImage: `url(${img})`, height: '100%' }} />
                            </span>
                        )}
                    </Slider>
                    <img src={UploadImg} alt="" style={{ visibility: thumbs.length > 0 ? 'hidden' : 'visible' }} />
                    <input type="file" id="images" accept="image/*" multiple onChange={handleUploadImages} />
                </label>
            </div>
            {/*  */}

            <div className="row mx-0 col-12 col-md-6 col-lg-9">
                <div className="form-group brand col-12">
                    <input
                        className="form-control"
                        style={{ borderColor: createGlassesInfo.brand ? '#56ab2f' : '#839192' }}
                        id="brand"
                        type="text"
                        spellCheck="false"
                        autoFocus='1'
                        value={createGlassesInfo.brand}
                        onChange={handleForm} />
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
                        onChange={handleForm}>
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
                        onChange={handleForm}>
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
                        onChange={handleForm}>
                        <option value="no">Material</option>
                        <option value="plastico">Plástico</option>
                        <option value="aluminio">Aluminio</option>
                        <option value="acetato">Acetato</option>
                    </select>
                </div>

                <div className="form-group price col-8">
                    <input
                        className="form-control"
                        style={{ borderColor: createGlassesInfo.price ? '#56ab2f' : '#839192' }}
                        id="price"
                        type="number"
                        spellCheck="false"
                        min="1"
                        value={createGlassesInfo.price}
                        onChange={handleForm} />
                    <label
                        className={classnames("placeholder", { 'active': createGlassesInfo.price })}
                        htmlFor="price">
                        Precio (COP)
                    </label>
                </div>

                <div className="col-4 form-group">
                    <button className="btn btn-create" type="submit">
                        Crear
                    </button>
                </div>
            </div>
        </form>
    </div>

    const manageGlassesSection = <div className="all-glasses row mx-0">
        {allGlasses.map((frame, index) =>
            <div key={index} className="frame col-6 col-md-4 col-lg-2">
                <span className="brand">{frame.brand}</span>
                <div className="thumb"></div>
                <span className="price">${new Intl.NumberFormat("de-DE").format(frame.price)}</span>

                <div className="actions">
                    <span className="material-icons" onClick={() => onEdit(frame)}>
                        edit
                    </span>
                    <span className="material-icons" onClick={() => onDelete(frame)}>
                        delete
                    </span>
                </div>
            </div>
        )}
    </div>

    return (
        <div className="Management principal-font">
            {loading &&
                <div className="loading">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }

            {error && <h1>{error}</h1>}

            {access && <div>
                <h5 className="title text-center mt-0">Agregar montura</h5>
                {createGlassesSection}
                <h5 className="title text-center">Gestionar mounturas</h5>
                {manageGlassesSection}
            </div>
            }
            <style type="text/css">
                {`
                    .navbar, footer {display: none}
                    .Content {margin-top: 0px;}
                `}
            </style>
        </div>
    )
}

export default Management;
