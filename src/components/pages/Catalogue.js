import React, { useState, useEffect } from 'react';

import { getAllGlasses } from '../utils/Actions';
import LoadingScreen from '../layout/LoadingScreen';
import Frame from '../layout/Frame';

import '../../css/Catalogue.scss';

const Catalogue = () => {
    const [mounts, setMounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterMode, setFilterMode] = useState('none');
    const [searchQuery, setSearch] = useState('');

    useEffect(() => {
        document.title = 'Catálogo';
        (async () => {
            const { stateAction, allGlasses } = await getAllGlasses();
            if (stateAction) {
                setMounts(allGlasses);
            }
            setLoading(false);
        })()
        return () => { }
    }, [])

    const handleSearch = e => {
        setSearch(e.target.value);
    }

    const submitSearch = e => {
        e.preventDefault();

        alert('Buscando: ' + searchQuery);
    }

    return (
        <div className="Catalogue row mx-0">
            {loading && <LoadingScreen />}
            
            <div className="filters col-12 col-md-3 principal-font">
                <p style={{ marginTop: '1em' }}><strong>Filtrar por color</strong></p>
                <div className="colors row mx-0">
                    <span className="red col"></span>
                    <span className="white col"></span>
                    <span className="gold col"></span>
                    <span className="violet col"></span>
                    <span className="black col"></span>
                    <span className="green col"></span>
                </div>
                <hr />
                <p className=""><strong>Filtrar por material</strong></p>
                <div className="materials d-flex secondary-font">
                    <div><span>Acetato</span> <strong>(43)</strong></div>
                    <div><span>Aluminio</span><strong>(21)</strong></div>
                    <div><span>Metal</span><strong>(32)</strong></div>
                    <div><span>TR90</span><strong>(20)</strong></div>
                </div>
                <hr />
                <p className=""><strong>Filtrar por estilo</strong></p>
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
                <div className="filter-actions col-12 row mx-0 secondary-font">
                    <form className="search-bar" noValidate onSubmit={submitSearch}>
                        <input type="text" value={searchQuery} onChange={handleSearch} />
                        <label className={searchQuery !== '' ? 'active' : undefined}>Buscar</label>
                        <button><span className="material-icons">search</span></button>
                    </form>

                    <div className='results-info'>
                        Mostrando 8 de 8 resultados
                    </div>

                    <div className="sorting-dropdown">
                        <div className="dropdown-title">
                            {filterMode === 'recent' ? 'Más recientes' :
                                filterMode === 'popular' ? 'Más populares' :
                                    filterMode === 'lowToHigh' ? 'Más baratos' :
                                        filterMode === 'highToLow' ? 'Más caros' : 'Ordenar por'
                            } <span className="material-icons">
                                arrow_drop_down
                            </span>
                        </div>
                        <div className="dropdown-items">
                            <div className="dropdown-action" onClick={() => setFilterMode('recent')}>Más recientes</div>
                            <div className="dropdown-action" onClick={() => setFilterMode('popular')}>Más populares</div>
                            <div className="dropdown-action" onClick={() => setFilterMode('lowToHigh')}>Más baratos</div>
                            <div className="dropdown-action" onClick={() => setFilterMode('highToLow')}>Más caros</div>
                            <div className="dropdown-action" onClick={() => setFilterMode('none')}>Ninguno</div>
                        </div>
                    </div>

                </div>

                {mounts.map((frame, index) => (
                    <Frame
                        className="col-6 col-md-4 col-lg-3 my-2"
                        key={index}
                        offer={true}
                        discount={true}
                        image={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                        frameInfo={frame}
                    />
                ))}
            </div>
        </div >
    )
}

export default Catalogue
