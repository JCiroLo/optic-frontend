import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

import SlickCustomArrow from '../layout/SlickCustomArrow';
import LoadingScreen from '../layout/LoadingScreen';
import { getMount } from '../utils/Actions';

import '../../css/DetailMount.scss';

const DetailMount = ({ match }) => {
    const [loading, setLoading] = useState(true);
    const [mountDetail, setMountDetail] = useState({});

    const { id } = match.params;

    const detailMountImgConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        swipeToSlide: true,
        prevArrow: <SlickCustomArrow styleName={{ left: '0', transform: 'rotate(180deg)' }} />,
        nextArrow: <SlickCustomArrow styleName={{ right: '0' }} />,
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            const { mount } = await getMount(id);
            setMountDetail(mount);
            document.title = `${mount.brand} - ${mount.material} - ${mount.shape}`;
            setLoading(false);
        })()
        return () => { }
    }, [])

    return (
        <div className="DetailMount">
            {loading && <LoadingScreen />}
            {!loading &&
                <div className="secondary-font row mx-0">
                    <div className="detail-thumbs col-12 col-md-6">
                        <Slider {...detailMountImgConfig} className="slide-shop">
                            <img
                                className='slide-thumb'
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
                        <h4 className="font-weight-bold">Forma: <span className="font-weight-normal">{mountDetail.shape}</span></h4>
                        <h4 className="font-weight-bold">Material: <span className="font-weight-normal">{mountDetail.material}</span></h4>

                        <h4 className="font-weight-bold">Precio: <span className="font-weight-normal h2 text-premium">
                            ${new Intl.NumberFormat("de-DE").format(mountDetail.price)}
                        </span></h4>

                        <div className="row mx-0">
                            <button className="btn btn-action my-4" onClick={() => alert('Comprando')}>
                                <span className="material-icons">
                                    shop
                            </span> Comprar ahora
                        </button>
                            <button className="btn btn-outlined my-4" onClick={() => alert('Reportado')}>
                                <span className="material-icons">
                                    report
                            </span> Reportar problema
                        </button>
                        </div>

                        <h4 className="font-weight-bold">Sobre esta montura: </h4>
                        <h5 className="font-weight-normal">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit ligula, luctus vivamus augue tristique fusce sapien est dictumst, phasellus feugiat ante lacus fames magna dui. Nostra congue tempus arcu integer montes quisque primis nisi posuere, cum suspendisse tristique platea blandit nullam ultrices dapibus velit, natoque ad at justo vestibulum magna felis penatibus. Aptent luctus interdum risus magna penatibus netus, velit in porttitor congue dui eget, dignissim diam vulputate non dis.
                            Viverra placerat in ullamcorper sodales orci per vehicula vulputate posuere fusce, vitae eleifend leo nunc sagittis dui facilisis magna feugiat est, nisl felis magnis molestie tempus natoque habitasse nascetur porttitor. In facilisis tortor feugiat consequat semper quis varius ante euismod, vivamus rutrum eget molestie nisl porta urna suspendisse, aptent nam tincidunt platea praesent congue auctor commodo. Purus aptent nunc pretium integer sodales nisi taciti imperdiet, volutpat fames eleifend potenti litora nulla leo praesent duis, enim vel diam magna porta aliquet placerat.
                        </h5>
                    </div>
                </div>
            }
        </div>
    )
}

export default DetailMount;