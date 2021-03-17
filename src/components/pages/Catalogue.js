import React, { useEffect } from 'react';

import '../../css/Catalogue.scss';

const mounts = [
    { id: 1, title: 'Gucci T2', price: 50000 },
    { id: 2, title: 'Torus 3k', price: 45900 },
    { id: 3, title: 'Arnette', price: 20000 },
    { id: 4, title: 'Carolina Herrera', price: 149900 },
    { id: 5, title: 'Polaroid', price: 75000 },
    { id: 6, title: 'Oakley', price: 40000 },
    { id: 7, title: 'Gucci Kl', price: 500000 },
]

const Catalogue = () => {

    useEffect(() => {
        document.title = 'Catálogo';
        return () => { }
    }, [])

    return (
        <div className="Catalogue row mx-0">
            <div className="filters col-12 col-md-3 principal-font">
                <hr />
                <p className=""><strong>Selecciona un color</strong></p>
                <div className="colors row mx-0">
                    <span className="red col"></span>
                    <span className="white col"></span>
                    <span className="gold col"></span>
                    <span className="violet col"></span>
                    <span className="black col"></span>
                    <span className="green col"></span>
                </div>
                <hr />
                <p className=""><strong>Selecciona un material</strong></p>
                <div className="materials d-flex secondary-font">
                    <div><span>Acetato</span> <strong>(43)</strong></div>
                    <div><span>Aluminio</span><strong>(21)</strong></div>
                    <div><span>Metal</span><strong>(32)</strong></div>
                    <div><span>TR90</span><strong>(20)</strong></div>
                </div>
                <hr />
                <p className=""><strong>Selecciona un estilo</strong></p>
                <div className="styles d-flex secondary-font">
                    <div><span>Agatada</span> <strong>(16)</strong></div>
                    <div><span>De aviador</span><strong>(13)</strong></div>
                    <div><span>Rectangular</span><strong>(32)</strong></div>
                    <div><span>Redonda</span><strong>(31)</strong></div>
                    <div><span>Vintage</span><strong>(11)</strong></div>
                    <div><span>Wayfarer</span><strong>(5)</strong></div>
                </div>
            </div>
            <div className="shop col-12 col-md-9 row mx-0">
                {mounts.map(frame => (
                    <div key={frame.id} className="frame col-6 col-md-4 secondary-font">
                        <span className="offert">En oferta</span>
                        <div className="thumb" />
                        <div className="info">
                            <h5 className="principal-font">{frame.title}</h5>
                            <p>
                                <span>${new Intl.NumberFormat("de-DE").format(frame.price * 1.25)}</span> <strong>${new Intl.NumberFormat("de-DE").format(frame.price)}</strong>
                            </p>
                        </div>
                        <div className="actions">
                            <button className="btn">Comprar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Catalogue
