import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './Create.css';
import { GrHomeRounded } from "react-icons/gr";
import { BiSave } from "react-icons/bi";
import { TbLetterT } from "react-icons/tb";
import { FaImage } from "react-icons/fa6";
import { PiSquaresFourLight } from "react-icons/pi";
import { GoFileDirectory } from "react-icons/go";
import Logo from '../components/Logo';
import { FaTag } from "react-icons/fa6";


function Create() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [etiqueta, setEtiqueta] = useState([]);
    const [showTypoPanel, setShowTypoPanel] = useState(false);
    const [fontStyle, setFontStyle] = useState('default');
    const [smallText, setSmallText] = useState(false);
    const [fullWidth, setFullWidth] = useState(false);
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.6);
    const [customFont, setCustomFont] = useState('');
    const [diretorioAtual, setDiretorioAtual] = useState(null);
    const [dirExpanded, setDirExpanded] = useState({});
    const [notasDiretorio, setNotasDiretorio] = useState({});
    const [isDirty, setIsDirty] = useState(false);
    const [savedAt, setSavedAt] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [initialValues, setInitialValues] = useState(null);
    const DIRETORIOS = [
        { key: 'pessoal', label: 'PESSOAL' },
        { key: 'trabalho', label: 'TRABALHO/FACULDADE' },
        { key: 'esporte', label: 'ESPORTES' }
    ];

    const FONT_STYLES = {
        default: { family: "'Inter', 'Segoe UI', sans-serif", label: 'Default' },
        serif:   { family: "'Georgia', 'Times New Roman', serif", label: 'Serif' },
        mono:    { family: "'Courier New', 'Fira Code', monospace", label: 'Mono' },
    };

    const FONT_OPTIONS = [
        'Inter', 'Montserrat', 'Bebas Neue', 'Georgia', 'Courier New', 'Lato', 'Roboto', 'Poppins'
    ];

    const getActiveFont = () => {
        if (customFont) return customFont;
        return FONT_STYLES[fontStyle].family;
    };
 
    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        api.get(`api/etiquetas/${userId}/`)
            .then(response => {
                setEtiqueta(response.data);
            })
            .catch(error => {
                console.error("Erro ao buscar etiqueta no backend:", error);
            });

        if (id) {
            api.get(`api/notas/detalhe/${id}/`)
                .then(response => {
                    const data = response.data;
                    setTitulo(data.titulo || '');
                    setDescricao(data.descricao || '');
                    setConteudo(data.conteudo || '');
                    setDiretorioAtual(data.diretorio || null);
                    setInitialValues({
                        titulo: data.titulo || '',
                        descricao: data.descricao || '',
                        conteudo: data.conteudo || ''
                    });
                })
                .catch(error => {
                    console.error("Erro ao buscar a nota", error);
                });
        } else {
            setTitulo('');
            setDescricao('');
            setConteudo('');
            setDiretorioAtual(null);
            setInitialValues({ titulo: '', descricao: '', conteudo: '' });
        }

    }, [id]);

    useEffect(() => {
        if (initialValues) {
            if (titulo !== initialValues.titulo || 
                descricao !== initialValues.descricao || 
                conteudo !== initialValues.conteudo) {
                setIsDirty(true);
            } else {
                setIsDirty(false);
            }
        }
    }, [titulo, descricao, conteudo, initialValues]);

    const fetchNotasDiretorio = (dirKey) => {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        setDirExpanded(prev => ({
            ...prev,
            [dirKey]: !prev[dirKey]
        }));

        if (notasDiretorio[dirKey]) return; 

        api.get(`api/notas/${userId}/?diretorio=${dirKey}`)
            .then(res => {
                setNotasDiretorio(prev => ({ ...prev, [dirKey]: res.data }));
            })
            .catch(err => console.error('Erro ao buscar notas do diretório:', err));
    };


    const handleCreateNewTag = () => {
        const userId = localStorage.getItem('user_id');
        const nomeTag = prompt("Digite o nome da nova tag:");

        if (!nomeTag || !userId)
            return;

        const cores = ["#34C759", "#FF3B30", "#007AFF", "#AF52DE", "#FF9500"];
        const corTag = cores[Math.floor(Math.random() * cores.length)];

        api.post(`api/etiquetas/${userId}/`, { nome: nomeTag, cor: corTag })
            .then(response => {
                setEtiqueta([...etiqueta, response.data]);
            })
            .catch(error => console.error("Erro ao criar etiqueta", error));
    }

    const handleSave = () => {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        const notaData = {
            titulo: titulo || 'Sem Título',
            descricao: descricao || '',
            conteudo: conteudo,
        };

        if (id) {
            api.put(`api/notas/detalhe/${id}/`, notaData)
                .then(() => {
                    setSavedAt(new Date()); 
                    setIsDirty(false);
                    setInitialValues({ titulo, descricao, conteudo });
                })
                .catch(error => console.error("Erro ao atualizar:", error))
        } else {
            api.post(`api/notas/${userId}/`, notaData)
                .then((response) => {
                    setSavedAt(new Date()); 
                    setIsDirty(false);     
                    setInitialValues({ titulo, descricao, conteudo });
                    navigate(`/create/${response.data.id}`);
                })
                .catch(error => console.error("Erro ao criar: ", error));
        }
    }


    const getRelativeTime = (date) =>{
        if(!date) return 'RASCUNHO';
        const diffMs = Date.now() - date.getTime();
        const diffMin = Math.floor(diffMs/60000);
        if (diffMin < 1) return "SALVO HÁ POUCO TEMPO";
        if (diffMin === 1) return 'SALVO HÁ 1 MIN';
        return `SALVO HÁ ${diffMin} MIN`;
    }


    return (
        <div className="create-container">
            {/*Sidebar */}
            <div className="create-sidebar">
                <div className='create-logo'>
                    <Logo />
                    <h1 className='create-logo-text'>LUMINOS</h1>

                </div>
                <div className='create-section'>
                    <div className='create-section-title'>
                        <h2 className='create-section-subtitle'>DIRETÓRIO</h2>
                        {diretorioAtual && (
                            <span className='create-dir-badge'>
                                {DIRETORIOS.find(d => d.key === diretorioAtual)?.label || diretorioAtual.toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className='create-section-list'>
                        {DIRETORIOS.map(dir => (
                            <div key={dir.key}>
                                <div
                                    className={`create-diretorio ${diretorioAtual === dir.key ? 'active' : ''}`}
                                    onClick={() => {
                                        if (diretorioAtual === dir.key) {
                                            setDiretorioAtual(null);
                                        } else {
                                            setDiretorioAtual(dir.key);
                                        }
                                        if (!dirExpanded[dir.key]) {
                                            fetchNotasDiretorio(dir.key);
                                        }
                                    }}
                                >
                                    <span 
                                        className='create-dir-arrow'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fetchNotasDiretorio(dir.key);
                                        }}
                                    >
                                        {dirExpanded[dir.key] ? '▾' : '▸'}
                                    </span>
                                    <GoFileDirectory className='create-logo-icon' />
                                    {dir.label}
                                </div>

                                {dirExpanded[dir.key] && (
                                    <div className='create-dir-notas'>
                                        {!notasDiretorio[dir.key] ? (
                                            <div className='create-dir-nota-item muted'>Carregando...</div>
                                        ) : notasDiretorio[dir.key].length === 0 ? (
                                            <div className='create-dir-nota-item muted'>Nenhuma nota</div>
                                        ) : (
                                            notasDiretorio[dir.key].map(nota => (
                                                <div
                                                    key={nota.id}
                                                    className={`create-dir-nota-item ${String(nota.id) === String(id) ? 'current' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/create/${nota.id}`);
                                                    }}
                                                >
                                                    ↳ {nota.titulo ? nota.titulo.toUpperCase() : 'SEM TÍTULO'}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <hr className='create-sidebar-divider' />

                <div className='create-section-list'>
                    <div className='create-section-subtitle'>ETIQUETAS</div>

                    <button className="create-btn-add-tag" onClick={handleCreateNewTag}>
                        + ADICIONAR ETIQUETA
                    </button>

                    <div className="create-tags-container">
                        {etiqueta.map(tag => (
                            <div key={tag.id} className='create-tag-item' style={{ color: tag.cor }}>
                                <FaTag size={16} color={tag.cor} />{tag.nome.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>

                <hr className='create-sidebar-divider' />


                <div className='create-section-list'>
                    <div className='create-section-subtitle'>HIERARQUIA</div>
                    <div className='create-hierarchy-title'>
                        T1 - "{titulo ? titulo.toUpperCase() : "SEM TÍTULO"}"
                    </div>
                    <div className="create-hierarchy-item sub">
                        P - "{conteudo ? (conteudo.slice(0, 18) + '...') : 'ESPAÇO PARA...'}"
                    </div>
                </div>
            </div>


            <div className="editor-area">

                <div className="create-header-bar">
                    <div className='create-header-actions'>
                        <div className='create-header-btn' onClick={() => navigate('/home')}>
                            <GrHomeRounded size={24} />
                            HOME
                        </div>

                        <div className='create-header-btn' onClick={handleSave}>
                            <BiSave size={28} />
                            SALVAR
                        </div>

                        <div className="create-header-status">
                            {titulo ? titulo.toUpperCase() : "SEM TÍTULO"} - {isDirty ? "RASCUNHO" : getRelativeTime(savedAt)}
                        </div>

                        <div className='create-header-btn' onClick={() => setShowTypoPanel(!showTypoPanel)}>
                            <TbLetterT size={28} />
                            TIPOGRAFIA
                        </div>

                        <div className='create-header-btn'>
                            <FaImage size={24} />
                            IMAGEM
                        </div>

                        <div className='create-header-btn'>
                            <PiSquaresFourLight size={24} />
                            ESTILO
                        </div>
                    </div>
                </div>

                {showTypoPanel && (
                    <div className='notion-typo-overlay' onClick={() => setShowTypoPanel(false)}>
                        <div className='notion-typo-menu' onClick={(e) => e.stopPropagation()}>
                            <div className='notion-typo-row-section'>
                                <span className='notion-typo-section-title'>Tipografia</span>
                                <div className='notion-font-picker'>
                                    {FONT_OPTIONS.map(f => (
                                        <div
                                            key={f}
                                            className={`notion-font-option ${customFont === f ? 'active' : ''}`}
                                            onClick={() => { setCustomFont(f); setFontStyle(''); }}
                                            style={{ fontFamily: f }}
                                        >
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                {customFont && (
                                    <div
                                        className='notion-font-reset'
                                        onClick={() => { setCustomFont(''); setFontStyle('default'); }}
                                    >
                                        ✕ Resetar para Default
                                    </div>
                                )}
                            </div>

                            <div className='notion-typo-divider' />

                            <div className='notion-typo-row-section'>
                                <div className='notion-slider-header'>
                                    <span className='notion-typo-section-title'>Tamanho do texto</span>
                                    <span className='notion-slider-value'>{fontSize}px</span>
                                </div>
                                <input
                                    type='range'
                                    min={12}
                                    max={36}
                                    step={1}
                                    value={fontSize}
                                    onInput={(e) => setFontSize(Number(e.target.value))}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className='notion-slider'
                                />
                            </div>

                            <div className='notion-typo-row-section'>
                                <div className='notion-slider-header'>
                                    <span className='notion-typo-section-title'>Espaçamento</span>
                                    <span className='notion-slider-value'>{lineHeight}</span>
                                </div>
                                <input
                                    type='range'
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={lineHeight}
                                    onInput={(e) => setLineHeight(Number(e.target.value))}
                                    onChange={(e) => setLineHeight(Number(e.target.value))}
                                    className='notion-slider'
                                />
                            </div>

                            <div className='notion-typo-divider' />


                            <div className='notion-typo-row'>
                                <div className='notion-typo-row-left'>
                                    <span className='notion-typo-icon'>A↓</span>
                                    <span>Small text</span>
                                </div>
                                <label className='notion-toggle'>
                                    <input type='checkbox' checked={smallText} onChange={() => { setSmallText(!smallText); if (!smallText) setFontSize(14); else setFontSize(18); }} />
                                    <span className='notion-toggle-slider' />
                                </label>
                            </div>

                            <div className='notion-typo-row'>
                                <div className='notion-typo-row-left'>
                                    <span className='notion-typo-icon'>↔</span>
                                    <span>Full width</span>
                                </div>
                                <label className='notion-toggle'>
                                    <input type='checkbox' checked={fullWidth} onChange={() => setFullWidth(!fullWidth)} />
                                    <span className='notion-toggle-slider' />
                                </label>
                            </div>

                        </div>
                    </div>
                )}

                <div className={`create-main ${fullWidth ? 'full-width' : ''}`}>
                    <div className="editor-cover-section">
                        <FaImage className="editor-cover-placeholder" />
                        <button className="editor-btn-add-cover" onClick={() => alert('Inserir imagem de capa')}>
                            + ADICIONAR CAPA
                        </button>
                    </div>
                    <textarea
                        className="editor-content-textarea"
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                        placeholder="CAMPO CRIATIVO"
                        onKeyDown={(e) => {
                            if (e.key === 'Tab' || e.key === 'TAB'){
                                e.preventDefault();
                                const start = e.target.selectionStart;
                                const end = e.target.selectionEnd;
                                const novoConteudo = conteudo.substring(0, start) + '\t' + conteudo.substring(end);
                                setConteudo(novoConteudo);
                                requestAnimationFrame(() => {
                                    e.target.selectionStart = start + 1;
                                    e.target.selectionEnd = start + 1;
                                });
                            }
                        }}
                        style={{
                            fontFamily: getActiveFont(),
                            fontSize: `${fontSize}px`,
                            lineHeight: lineHeight,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}


export default Create
