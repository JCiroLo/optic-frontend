import { FC, useEffect, useState } from 'react';
import Slider from 'react-slick';
import nl2br from 'react-nl2br';

import SlickCustomArrow from '../layout/SlickCustomArrow';
import LoadingScreen from '../layout/LoadingScreen';
import { getMount, formatText } from '../utils/Actions';
import { FrameType, COLORS } from '../utils/Consts';
import Error from '../layout/Error';

import '../../css/DetailMount.scss';

interface DetailMountProps {
    match: { params: { id: string } },
    history: { push: Function }
}

const DetailMount: FC<DetailMountProps> = ({ match, history }) => {
    const [loading, setLoading] = useState(true);
    const [mountDetail, setMountDetail] = useState<FrameType>({
        _id: '', brand: '', color: 'no', shape: 'no', material: 'no', price: 0, description: '', discount: 0, createdAt: new Date(0), updatedAt: new Date(0)
    });
    const [error, setError] = useState({ status: false, message: '' });

    const { id } = match.params;

    const detailMountImgConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        swipeToSlide: true,
        prevArrow: <SlickCustomArrow styles={{ left: '0', transform: 'rotate(180deg)' }} />,
        nextArrow: <SlickCustomArrow styles={{ right: '0' }} />,
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            if (id !== undefined) {
                const { mount, stateAction } = await getMount(id);
                if (stateAction) {
                    setMountDetail(mount);
                    document.title = `${mount.brand} - ${mount.material} - ${mount.shape}`;
                } else {
                    setError({ status: true, message: 'El sitio al que estás intentando acceder no está disponible o ha sido eliminado.' })
                    document.title = `Error :(`;
                }
            } else {
                setError({ status: true, message: 'El sitio al que estás intentando acceder no está disponible o ha sido eliminado.' })
                document.title = `Error :(`;
            }

            setLoading(false);
        })()
        return () => { }
    }, [id])

    const formatList = (text: string): string => {
        return text.replaceAll('-', ' ● ');
    }

    const testFrame = () => {
        history.push({ pathname: "/test", state: { frame: mountDetail._id } })
    }

    return (
        <div className="DetailMount">
            {loading && <LoadingScreen />}
            {error.status &&
                <Error
                    icon="visibility_off"
                    message="Error :("
                    className="w-75 mx-auto text-muted secondary-font h1"
                    iconClassName="display-2"
                >
                    <h4>{error.message}</h4>
                </Error>
            }
            {!loading && !error.status &&
                <div className="secondary-font row mx-0">
                    <div className="detail-thumbs col-12 col-md-6">
                        <Slider {...detailMountImgConfig} className="slide-shop">
                            <img
                                className='slide-thumb slick-zoomable'
                                alt='model'
                                src={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${mountDetail._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                            />
                            <img
                                className='slide-thumb'
                                alt='testing'
                                src={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${mountDetail._id}_testing.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                            />
                        </Slider>
                    </div>
                    <div className="detail-content col-12 col-md-6">
                        <h3 className="text-uppercase font-weight-bold principal-font">{mountDetail.brand}</h3>
                        <h4 className="font-weight-bold">Forma: <span className="font-weight-normal">{formatText(mountDetail.shape)}</span></h4>
                        <h4 className="font-weight-bold">Material: <span className="font-weight-normal">{formatText(mountDetail.material)}</span></h4>
                        <h4 className="font-weight-bold ">Color: {COLORS.map(({ color, style }, index) =>
                            mountDetail.color === color && <span
                                key={index}
                                className="col-1 rounded-circle mx-2"
                                style={style}
                            />
                        )}</h4>


                        <h4 className="font-weight-bold">Precio: <span className="font-weight-normal h2 text-premium with-line">
                            {mountDetail.discount ?
                                <>
                                    <small>${new Intl.NumberFormat("de-DE").format(mountDetail.price)}</small> <strong>
                                        ${new Intl.NumberFormat("de-DE").format(mountDetail.price * (1 - mountDetail.discount / 100))}
                                    </strong>
                                </> :
                                <strong>
                                    ${new Intl.NumberFormat("de-DE").format(mountDetail.price)}
                                </strong>
                            }
                        </span></h4>

                        <div className="actions">
                            <button className="btn btn-shop my-4" onClick={() => alert('Comprando')}>
                                <span className="material-icons">
                                    shop
                            </span> Comprar ahora
                            </button>

                            <div className="text-premium" onClick={testFrame}>
                                <span className="material-icons">
                                    face
                            </span> <span>Probar montura</span>
                            </div>

                            <div className="text-muted mb-3" onClick={() => alert('Reportado')}>
                                <span className="material-icons">
                                    report
                            </span> <span>Reportar problema</span>
                            </div>
                        </div>

                        <h4 className="font-weight-bold">Sobre esta montura: </h4>
                        <h5 className="font-weight-normal">
                            {nl2br(formatList(mountDetail.description))}
                        </h5>
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailMount;