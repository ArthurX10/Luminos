import React, { useState, useEffect, useRef } from 'react';
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
import { FaTag, FaRegSquare, FaRegCircle, FaRegTrashCan } from "react-icons/fa6";
import { TbTriangle } from "react-icons/tb";
import { FiLink } from "react-icons/fi";


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
    const [showEtiquetasModal, setShowEtiquetasModal] = useState(false);
    const [novaEtiquetaNome, setNovaEtiquetaNome] = useState('');
    const [novaEtiquetaCor, setNovaEtiquetaCor] = useState('#007AFF');
    const CORES_ETIQUETA = ['#007AFF', '#34C759', '#FF3B30', '#AF52DE', '#FF9500', '#FF2D55', '#5AC8FA'];

    const [showImageModal, setShowImageModal] = useState(false);
    const [imagemUrl, setImagemUrl] = useState('');
    const [tempImagemUrl, setTempImagemUrl] = useState('');
    const [activeNoteTags, setActiveNoteTags] = useState([]);

    const [tipoLayout, setTipoLayout] = useState('TEXTO');
    const [canvasElements, setCanvasElements] = useState([]);
    const [canvasConnections, setCanvasConnections] = useState([]);
    const [deletedElements, setDeletedElements] = useState([]);
    const [deletedConnections, setDeletedConnections] = useState([]);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [selectedConnectionId, setSelectedConnectionId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectStartElementId, setConnectStartElementId] = useState(null);

    const [selectedFillColor, setSelectedFillColor] = useState('#FFFFFF');
    const [selectedBorderColor, setSelectedBorderColor] = useState('#000000');
    const [selectedLineColor, setSelectedLineColor] = useState('#000000');

    const [draggingElementId, setDraggingElementId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [editingTextElementId, setEditingTextElementId] = useState(null);
    const [editingTextValue, setEditingTextValue] = useState('');

    const canvasRef = useRef(null);

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
                    setImagemUrl(data.imagem_url || '');
                    setDiretorioAtual(data.diretorio || null);
                    setActiveNoteTags(data.etiquetas || []);
                    setTipoLayout(data.tipo_layout || 'TEXTO');
                    setCanvasElements(data.elementos || []);
                    setCanvasConnections(data.conexoes || []);
                    setDeletedElements([]);
                    setDeletedConnections([]);
                    setSelectedElementId(null);
                    setSelectedConnectionId(null);
                    setIsConnecting(false);
                    setConnectStartElementId(null);
                    setInitialValues({
                        titulo: data.titulo || '',
                        descricao: data.descricao || '',
                        conteudo: data.conteudo || '',
                        imagemUrl: data.imagem_url || '',
                        diretorio: data.diretorio || null,
                        tipoLayout: data.tipo_layout || 'TEXTO'
                    });
                })
                .catch(error => {
                    console.error("Erro ao buscar a nota", error);
                });
        } else {
            setTitulo('');
            setDescricao('');
            setConteudo('');
            setImagemUrl('');
            setDiretorioAtual(null);
            setActiveNoteTags([]);
            setTipoLayout('TEXTO');
            setCanvasElements([]);
            setCanvasConnections([]);
            setDeletedElements([]);
            setDeletedConnections([]);
            setSelectedElementId(null);
            setSelectedConnectionId(null);
            setIsConnecting(false);
            setConnectStartElementId(null);
            setInitialValues({ titulo: '', descricao: '', conteudo: '', imagemUrl: '', diretorio: null, tipoLayout: 'TEXTO' });
        }

    }, [id]);

    useEffect(() => {
        if (initialValues) {
            if (titulo !== initialValues.titulo || 
                descricao !== initialValues.descricao || 
                conteudo !== initialValues.conteudo ||
                imagemUrl !== initialValues.imagemUrl ||
                diretorioAtual !== initialValues.diretorio ||
                tipoLayout !== initialValues.tipoLayout) {
                setIsDirty(true);
            } else {
                setIsDirty(false);
            }
        }
    }, [titulo, descricao, conteudo, imagemUrl, diretorioAtual, tipoLayout, initialValues]);

    useEffect(() => {
        if (id) {
            const savedFontStyle = localStorage.getItem(`typo_fontStyle_${id}`);
            const savedSmallText = localStorage.getItem(`typo_smallText_${id}`);
            const savedFullWidth = localStorage.getItem(`typo_fullWidth_${id}`);
            const savedFontSize = localStorage.getItem(`typo_fontSize_${id}`);
            const savedLineHeight = localStorage.getItem(`typo_lineHeight_${id}`);
            const savedCustomFont = localStorage.getItem(`typo_customFont_${id}`);

            if (savedFontStyle !== null) setFontStyle(savedFontStyle);
            if (savedSmallText !== null) setSmallText(savedSmallText === 'true');
            if (savedFullWidth !== null) setFullWidth(savedFullWidth === 'true');
            if (savedFontSize !== null) setFontSize(Number(savedFontSize));
            if (savedLineHeight !== null) setLineHeight(Number(savedLineHeight));
            if (savedCustomFont !== null) setCustomFont(savedCustomFont);
        } else {
            setFontStyle('default');
            setSmallText(false);
            setFullWidth(false);
            setFontSize(18);
            setLineHeight(1.6);
            setCustomFont('');
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            localStorage.setItem(`typo_fontStyle_${id}`, fontStyle);
            localStorage.setItem(`typo_smallText_${id}`, String(smallText));
            localStorage.setItem(`typo_fullWidth_${id}`, String(fullWidth));
            localStorage.setItem(`typo_fontSize_${id}`, String(fontSize));
            localStorage.setItem(`typo_lineHeight_${id}`, String(lineHeight));
            localStorage.setItem(`typo_customFont_${id}`, customFont);
        }
    }, [id, fontStyle, smallText, fullWidth, fontSize, lineHeight, customFont]);

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
        if (!novaEtiquetaNome.trim() || !userId) return;

        api.post(`api/etiquetas/${userId}/`, { nome: novaEtiquetaNome.trim(), cor: novaEtiquetaCor })
            .then(response => {
                setEtiqueta(prev => [...prev, response.data]);
                setNovaEtiquetaNome('');
            })
            .catch(error => console.error("Erro ao criar etiqueta", error));
    };


    const handleDeleteTag = (etiquetaId) => {
        api.delete(`api/etiqueta/${etiquetaId}/`)
            .then(() => {
                setEtiqueta(prev => prev.filter(e => e.id !== etiquetaId));
            })
            .catch(error => console.error('Erro ao excluir etiqueta:', error));
    };

    const hexToRgb = (hex) => {
        if (!hex) return '255, 255, 255';
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        return `${r}, ${g}, ${b}`;
    };

    const handleToggleTag = (tag) => {
        const isActive = activeNoteTags.some(t => t.id === tag.id);
        if (id) {
            if (isActive) {
                api.post(`api/anotacao/${id}/desvincular-etiqueta/`, { etiqueta_id: tag.id })
                    .then(() => {
                        setActiveNoteTags(prev => prev.filter(t => t.id !== tag.id));
                    })
                    .catch(err => console.error("Erro ao desvincular etiqueta:", err));
            } else {
                api.post(`api/anotacao/${id}/vincular-etiqueta/`, { etiqueta_id: tag.id })
                    .then(() => {
                        setActiveNoteTags(prev => [...prev, tag]);
                    })
                    .catch(err => console.error("Erro ao vincular etiqueta:", err));
            }
        } else {
            if (isActive) {
                setActiveNoteTags(prev => prev.filter(t => t.id !== tag.id));
            } else {
                setActiveNoteTags(prev => [...prev, tag]);
            }
        }
    };

    const handleAddShape = (type) => {
        setIsDirty(true);
        const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const newShape = {
            id: tempId,
            tipo_forma: type,
            texto_interno: type === 'QUADRADO' ? 'Quadrado' : type === 'CIRCULO' ? 'Círculo' : 'Triângulo',
            posicao_x: 200 + Math.floor(Math.random() * 80),
            posicao_y: 150 + Math.floor(Math.random() * 80),
            largura: 120,
            altura: 80,
            cor_preenchimento: selectedFillColor,
            cor_borda: selectedBorderColor
        };
        setCanvasElements(prev => [...prev, newShape]);
        setSelectedElementId(tempId);
        setSelectedConnectionId(null);
    };

    const handleDeleteSelected = () => {
        if (selectedElementId) {
            setIsDirty(true);
            const elId = selectedElementId;
            if (!String(elId).startsWith('temp_')) {
                setDeletedElements(prev => [...prev, elId]);
            }
            setCanvasElements(prev => prev.filter(el => el.id !== elId));

            const associatedConnections = canvasConnections.filter(c => c.elemento_origem === elId || c.elemento_destino === elId);
            associatedConnections.forEach(c => {
                if (!String(c.id).startsWith('temp_')) {
                    setDeletedConnections(prev => [...prev, c.id]);
                }
            });
            setCanvasConnections(prev => prev.filter(c => c.elemento_origem !== elId && c.elemento_destino !== elId));
            setSelectedElementId(null);
        } else if (selectedConnectionId) {
            setIsDirty(true);
            const cId = selectedConnectionId;
            if (!String(cId).startsWith('temp_')) {
                setDeletedConnections(prev => [...prev, cId]);
            }
            setCanvasConnections(prev => prev.filter(c => c.id !== cId));
            setSelectedConnectionId(null);
        }
    };

    const handleShapeClick = (e, shapeId) => {
        e.stopPropagation();
        if (isConnecting) {
            if (!connectStartElementId) {
                setConnectStartElementId(shapeId);
            } else if (connectStartElementId !== shapeId) {
                setIsDirty(true);
                const tempCId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                const newConnection = {
                    id: tempCId,
                    elemento_origem: connectStartElementId,
                    elemento_destino: shapeId,
                    tipo_linha: 'RETA',
                    cor_linha: selectedLineColor,
                    espessura: 2,
                    texto_rotulo: ''
                };
                setCanvasConnections(prev => [...prev, newConnection]);
                setIsConnecting(false);
                setConnectStartElementId(null);
                setSelectedConnectionId(tempCId);
                setSelectedElementId(null);
            }
        } else {
            setSelectedElementId(shapeId);
            setSelectedConnectionId(null);
            const element = canvasElements.find(el => el.id === shapeId);
            if (element) {
                setSelectedFillColor(element.cor_preenchimento || '#FFFFFF');
                setSelectedBorderColor(element.cor_borda || '#000000');
            }
        }
    };

    const handleUpdateElementColors = (fill, border) => {
        if (!selectedElementId) return;
        setIsDirty(true);
        setCanvasElements(prev => prev.map(el => {
            if (el.id === selectedElementId) {
                return {
                    ...el,
                    cor_preenchimento: fill !== null ? fill : el.cor_preenchimento,
                    cor_borda: border !== null ? border : el.cor_borda
                };
            }
            return el;
        }));
    };

    const handleElementMouseDown = (e, shapeId) => {
        if (isConnecting || editingTextElementId === shapeId) return;
        e.stopPropagation();
        const element = canvasElements.find(el => el.id === shapeId);
        if (!element) return;

        setSelectedElementId(shapeId);
        setSelectedConnectionId(null);
        setDraggingElementId(shapeId);
        setDragOffset({
            x: e.clientX - parseFloat(element.posicao_x),
            y: e.clientY - parseFloat(element.posicao_y)
        });
    };

    const handleCanvasMouseMove = (e) => {
        if (draggingElementId) {
            setIsDirty(true);
            const rect = canvasRef.current.getBoundingClientRect();
            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;

            newX = Math.max(10, Math.min(newX, rect.width - 130));
            newY = Math.max(10, Math.min(newY, rect.height - 90));

            setCanvasElements(prev => prev.map(el => {
                if (el.id === draggingElementId) {
                    return {
                        ...el,
                        posicao_x: newX,
                        posicao_y: newY
                    };
                }
                return el;
            }));
        }
    };

    const handleCanvasMouseUp = () => {
        setDraggingElementId(null);
    };

    const handleElementDoubleClick = (e, shapeId, currentText) => {
        e.stopPropagation();
        setEditingTextElementId(shapeId);
        setEditingTextValue(currentText);
    };

    const handleTextEditBlur = (shapeId) => {
        setIsDirty(true);
        setCanvasElements(prev => prev.map(el => {
            if (el.id === shapeId) {
                return { ...el, texto_interno: editingTextValue };
            }
            return el;
        }));
        setEditingTextElementId(null);
    };

    const handleSave = () => {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        const notaData = {
            titulo: titulo || 'Sem Título',
            descricao: descricao || '',
            conteudo: conteudo,
            imagem_url: imagemUrl,
            diretorio: diretorioAtual || null,
            tipo_layout: tipoLayout,
        };

        const processVisuals = (notaId) => {
            const elementDeletes = deletedElements.map(elId => api.delete(`api/elemento/${elId}/`));
            const connectionDeletes = deletedConnections.map(cId => api.delete(`api/conexao/${cId}/`));

            return Promise.all([...elementDeletes, ...connectionDeletes])
                .then(() => {
                    const existingElements = canvasElements.filter(el => !String(el.id).startsWith('temp_'));
                    const newElements = canvasElements.filter(el => String(el.id).startsWith('temp_'));

                    const elementUpdates = existingElements.map(el =>
                        api.put(`api/elemento/${el.id}/`, {
                            tipo_forma: el.tipo_forma,
                            texto_interno: el.texto_interno,
                            posicao_x: el.posicao_x,
                            posicao_y: el.posicao_y,
                            largura: el.largura,
                            altura: el.altura,
                            cor_preenchimento: el.cor_preenchimento,
                            cor_borda: el.cor_borda
                        })
                    );

                    const elementCreates = newElements.map(el =>
                        api.post(`api/anotacao/${notaId}/elemento/`, {
                            tipo_forma: el.tipo_forma,
                            texto_interno: el.texto_interno,
                            posicao_x: el.posicao_x,
                            posicao_y: el.posicao_y,
                            largura: el.largura,
                            altura: el.altura,
                            cor_preenchimento: el.cor_preenchimento,
                            cor_borda: el.cor_borda
                        }).then(res => ({ tempId: el.id, realId: res.data.id }))
                    );

                    return Promise.all([
                        Promise.all(elementUpdates),
                        Promise.all(elementCreates)
                    ]);
                })
                .then(([updatesRes, createdMappings]) => {
                    const idMap = {};
                    createdMappings.forEach(mapping => {
                        idMap[mapping.tempId] = mapping.realId;
                    });

                    const getRealId = (id) => {
                        if (String(id).startsWith('temp_')) {
                            return idMap[id];
                        }
                        return id;
                    };

                    const existingConnections = canvasConnections.filter(c => !String(c.id).startsWith('temp_'));
                    const newConnections = canvasConnections.filter(c => String(c.id).startsWith('temp_'));

                    const connectionUpdates = existingConnections.map(c =>
                        api.put(`api/conexao/${c.id}/`, {
                            elemento_origem: getRealId(c.elemento_origem),
                            elemento_destino: getRealId(c.elemento_destino),
                            tipo_linha: c.tipo_linha,
                            cor_linha: c.cor_linha,
                            espessura: c.espessura,
                            texto_rotulo: c.texto_rotulo
                        })
                    );

                    const connectionCreates = newConnections.map(c =>
                        api.post(`api/anotacao/${notaId}/conexao/`, {
                            elemento_origem: getRealId(c.elemento_origem),
                            elemento_destino: getRealId(c.elemento_destino),
                            tipo_linha: c.tipo_linha,
                            cor_linha: c.cor_linha,
                            espessura: c.espessura,
                            texto_rotulo: c.texto_rotulo
                        })
                    );

                    return Promise.all([...connectionUpdates, ...connectionCreates]);
                });
        };

        if (id) {
            api.put(`api/notas/detalhe/${id}/`, notaData)
                .then(() => processVisuals(id))
                .then(() => {
                    setSavedAt(new Date()); 
                    setIsDirty(false);
                    setInitialValues({ titulo, descricao, conteudo, imagemUrl, diretorio: diretorioAtual, tipoLayout: tipoLayout });
                    navigate('/home');
                })
                .catch(error => console.error("Erro ao salvar nota e elementos:", error));
        } else {
            api.post(`api/notas/${userId}/`, notaData)
                .then((response) => {
                    const novaNotaId = response.data.id;
                    let tagLinkPromise = Promise.resolve();
                    if (activeNoteTags.length > 0) {
                        const vinculacoes = activeNoteTags.map(tag =>
                            api.post(`api/anotacao/${novaNotaId}/vincular-etiqueta/`, { etiqueta_id: tag.id })
                        );
                        tagLinkPromise = Promise.all(vinculacoes);
                    }

                    return tagLinkPromise
                        .then(() => processVisuals(novaNotaId))
                        .then(() => {
                            setSavedAt(new Date()); 
                            setIsDirty(false);     
                            setInitialValues({ titulo, descricao, conteudo, imagemUrl, diretorio: diretorioAtual, tipoLayout: tipoLayout });
                            navigate('/home');
                        });
                })
                .catch(error => console.error("Erro ao criar nota e elementos: ", error));
        }
    }

    const handleOpenImageModal = () => {
        setTempImagemUrl(imagemUrl);
        setShowImageModal(true);
    };

    const handleSaveImage = () => {
        setImagemUrl(tempImagemUrl);
        setShowImageModal(false);
    };


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
                    <div className="create-section-etiquetas-header">
                        <div className='create-section-subtitle'>ETIQUETAS</div>


                        <button
                            className="create-btn-add-tag"
                            onClick={() => setShowEtiquetasModal(true)}
                        >
                            + GERENCIAR
                        </button>
                    </div>

                    <div className="create-tags-container">
                        {etiqueta.map(tag => {
                            const isActive = activeNoteTags.some(t => t.id === tag.id);
                            return (
                                <div
                                    key={tag.id}
                                    className={`create-tag-item ${isActive ? 'active' : 'inactive'}`}
                                    style={{
                                        '--tag-color': tag.cor,
                                        '--tag-color-rgb': hexToRgb(tag.cor)
                                    }}
                                    onClick={() => handleToggleTag(tag)}
                                >
                                    <FaTag size={14} color={isActive ? tag.cor : '#666666'} />
                                    {tag.nome.toUpperCase()}
                                </div>
                            );
                        })}
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

                        <div className='create-header-btn' onClick={handleOpenImageModal}>
                            <FaImage size={24} />
                            IMAGEM
                        </div>

                        <div className={`create-header-btn ${tipoLayout === 'MAPA' ? 'active' : ''}`} onClick={() => setTipoLayout(tipoLayout === 'TEXTO' ? 'MAPA' : 'TEXTO')}>
                            <PiSquaresFourLight size={24} />
                            {tipoLayout === 'TEXTO' ? 'MAPA MENTAL' : 'TEXTO'}
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
                    <div 
                        className={`editor-cover-section ${imagemUrl ? 'has-cover' : ''}`}
                        style={imagemUrl ? { backgroundImage: `url(${imagemUrl})` } : {}}
                    >
                        {!imagemUrl && <FaImage className="editor-cover-placeholder" />}
                        <button className="editor-btn-add-cover" onClick={handleOpenImageModal}>
                            {imagemUrl ? 'ALTERAR CAPA' : '+ ADICIONAR CAPA'}
                        </button>
                        {imagemUrl && (
                            <button className="editor-btn-remove-cover" onClick={() => setImagemUrl('')}>
                                REMOVER CAPA
                            </button>
                        )}
                    </div>
                    {tipoLayout === 'TEXTO' ? (
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
                    ) : (
                        <>
                            <div className="canvas-toolbar">
                                <div className="toolbar-section">
                                    <span className="toolbar-label">FORMAS:</span>
                                    <button type="button" className="toolbar-btn" onClick={() => handleAddShape('QUADRADO')}>
                                        <FaRegSquare size={16} /> QUADRADO
                                    </button>
                                    <button type="button" className="toolbar-btn" onClick={() => handleAddShape('CIRCULO')}>
                                        <FaRegCircle size={16} /> CÍRCULO
                                    </button>
                                    <button type="button" className="toolbar-btn" onClick={() => handleAddShape('TRIANGULO')}>
                                        <TbTriangle size={18} /> TRIÂNGULO
                                    </button>
                                </div>
                                <div className="toolbar-section">
                                    <button 
                                        type="button" 
                                        className={`toolbar-btn ${isConnecting ? 'active' : ''}`} 
                                        onClick={() => {
                                            setIsConnecting(!isConnecting);
                                            setConnectStartElementId(null);
                                        }}
                                    >
                                        <FiLink size={16} /> {isConnecting ? 'CONECTANDO...' : 'CONECTAR'}
                                    </button>
                                    {(selectedElementId || selectedConnectionId) && (
                                        <button type="button" className="toolbar-btn delete" onClick={handleDeleteSelected}>
                                            <FaRegTrashCan size={16} /> EXCLUIR
                                        </button>
                                    )}
                                </div>
                                {selectedElementId && (
                                    <div className="toolbar-section colors">
                                        <span className="toolbar-label">CORES:</span>
                                        <div className="color-picker-group">
                                            <label>Fundo:</label>
                                            <input 
                                                type="color" 
                                                value={selectedFillColor} 
                                                onChange={(e) => {
                                                    setSelectedFillColor(e.target.value);
                                                    handleUpdateElementColors(e.target.value, null);
                                                }} 
                                            />
                                        </div>
                                        <div className="color-picker-group">
                                            <label>Borda:</label>
                                            <input 
                                                type="color" 
                                                value={selectedBorderColor} 
                                                onChange={(e) => {
                                                    setSelectedBorderColor(e.target.value);
                                                    handleUpdateElementColors(null, e.target.value);
                                                }} 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div 
                                ref={canvasRef} 
                                className="canvas-container" 
                                onMouseMove={handleCanvasMouseMove}
                                onMouseUp={handleCanvasMouseUp}
                                onMouseLeave={handleCanvasMouseUp}
                                onClick={() => {
                                    setSelectedElementId(null);
                                    setSelectedConnectionId(null);
                                    setIsConnecting(false);
                                    setConnectStartElementId(null);
                                }}
                            >
                                {/* SVG Connection Lines */}
                                <svg className="canvas-svg-overlay">
                                    {canvasConnections.map(c => {
                                        const fromEl = canvasElements.find(el => el.id === c.elemento_origem);
                                        const toEl = canvasElements.find(el => el.id === c.elemento_destino);
                                        if (!fromEl || !toEl) return null;

                                        const x1 = parseFloat(fromEl.posicao_x) + parseFloat(fromEl.largura) / 2;
                                        const y1 = parseFloat(fromEl.posicao_y) + parseFloat(fromEl.altura) / 2;
                                        const x2 = parseFloat(toEl.posicao_x) + parseFloat(toEl.largura) / 2;
                                        const y2 = parseFloat(toEl.posicao_y) + parseFloat(toEl.altura) / 2;

                                        const isLineSelected = selectedConnectionId === c.id;

                                        return (
                                            <g key={c.id} onClick={(e) => { e.stopPropagation(); setSelectedConnectionId(c.id); setSelectedElementId(null); }}>
                                                <line 
                                                    x1={x1} y1={y1} x2={x2} y2={y2} 
                                                    stroke="transparent" 
                                                    strokeWidth={15} 
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <line 
                                                    x1={x1} y1={y1} x2={x2} y2={y2} 
                                                    stroke={isLineSelected ? '#007AFF' : (c.cor_linha || '#666666')} 
                                                    strokeWidth={isLineSelected ? 4 : (c.espessura || 2)} 
                                                    strokeDasharray={isLineSelected ? "5,5" : ""}
                                                    style={{ cursor: 'pointer', transition: 'stroke 0.2s' }}
                                                />
                                                <circle cx={x1} cy={y1} r={4} fill={c.cor_linha || '#666666'} />
                                                <circle cx={x2} cy={y2} r={4} fill={c.cor_linha || '#666666'} />
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Geometric Shapes */}
                                {canvasElements.map(el => {
                                    const isElSelected = selectedElementId === el.id;
                                    const isElConnectingStart = connectStartElementId === el.id;
                                    
                                    let shapeSvg = null;
                                    if (el.tipo_forma === 'TRIANGULO') {
                                        shapeSvg = (
                                            <svg className="shape-svg-bg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <polygon 
                                                    points="50,5 5,95 95,95" 
                                                    fill={el.cor_preenchimento || '#FFFFFF'} 
                                                    stroke={isElSelected ? '#007AFF' : (el.cor_borda || '#000000')} 
                                                    strokeWidth={isElSelected ? 3 : 2}
                                                />
                                            </svg>
                                        );
                                    } else if (el.tipo_forma === 'CIRCULO') {
                                        shapeSvg = (
                                            <svg className="shape-svg-bg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <circle 
                                                    cx="50" cy="50" r="45" 
                                                    fill={el.cor_preenchimento || '#FFFFFF'} 
                                                    stroke={isElSelected ? '#007AFF' : (el.cor_borda || '#000000')} 
                                                    strokeWidth={isElSelected ? 3 : 2}
                                                />
                                            </svg>
                                        );
                                    } else {
                                        shapeSvg = (
                                            <svg className="shape-svg-bg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <rect 
                                                    x="5" y="5" width="90" height="90" 
                                                    fill={el.cor_preenchimento || '#FFFFFF'} 
                                                    stroke={isElSelected ? '#007AFF' : (el.cor_borda || '#000000')} 
                                                    strokeWidth={isElSelected ? 3 : 2}
                                                    rx="8" ry="8"
                                                />
                                            </svg>
                                        );
                                    }

                                    return (
                                        <div
                                            key={el.id}
                                            className={`canvas-shape-item ${isElSelected ? 'selected' : ''} ${isElConnectingStart ? 'connecting-start' : ''}`}
                                            style={{
                                                left: `${el.posicao_x}px`,
                                                top: `${el.posicao_y}px`,
                                                width: `${el.largura}px`,
                                                height: `${el.altura}px`,
                                            }}
                                            onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                                            onClick={(e) => handleShapeClick(e, el.id)}
                                            onDoubleClick={(e) => handleElementDoubleClick(e, el.id, el.texto_interno)}
                                        >
                                            {shapeSvg}
                                            
                                            <div className="shape-content-wrapper">
                                                {editingTextElementId === el.id ? (
                                                    <input
                                                        type="text"
                                                        className="shape-text-input"
                                                        value={editingTextValue}
                                                        onChange={(e) => setEditingTextValue(e.target.value)}
                                                        onBlur={() => handleTextEditBlur(el.id)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') handleTextEditBlur(el.id); }}
                                                        autoFocus
                                                        onClick={(e) => e.stopPropagation()}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <span className="shape-text-label">
                                                        {el.texto_interno || ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showEtiquetasModal && (
                <div className='modal-overlay fade-in' onClick={() => setShowEtiquetasModal(false)}>
                    <div className='modal-container etiquetas-modal-container' onClick={(e) => e.stopPropagation()}>
                        <h2 className='modal-title'>ETIQUETAS</h2>

                        {/* Formulário de criação */}
                        <div className="etiqueta-criar-form">
                            <div className="etiqueta-input-row">
                                <input
                                    type="text"
                                    className="etiqueta-nome-input"
                                    placeholder="Nome da etiqueta..."
                                    value={novaEtiquetaNome}
                                    onChange={(e) => setNovaEtiquetaNome(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateNewTag(); } }}
                                    maxLength={30}
                                    autoFocus
                                />
                                <button
                                    type='button'
                                    className="btn-criar-etiqueta"
                                    onClick={handleCreateNewTag}
                                    disabled={!novaEtiquetaNome.trim()}
                                >
                                    CRIAR
                                </button>
                            </div>

                            <div className="etiqueta-cor-picker">
                                <span className="etiqueta-cor-label">COR:</span>
                                {CORES_ETIQUETA.map(cor => (
                                    <div
                                        key={cor}
                                        className={`etiqueta-cor-dot ${novaEtiquetaCor === cor ? 'selecionada' : ''}`}
                                        style={{ backgroundColor: cor }}
                                        onClick={() => setNovaEtiquetaCor(cor)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="etiqueta-divider" />

                        {/* Lista de etiquetas existentes */}
                        <div className="etiquetas-lista">
                            {etiqueta.length === 0 ? (
                                <p className="etiqueta-empty-hint">Nenhuma etiqueta criada ainda.</p>
                            ) : (
                                etiqueta.map(tag => (
                                    <div key={tag.id} className="etiqueta-list-item">
                                        <div className="etiqueta-list-info">
                                            <span className="etiqueta-cor-preview" style={{ backgroundColor: tag.cor }} />
                                            <FaTag size={14} color={tag.cor} />
                                            <span className="etiqueta-list-nome">{tag.nome.toUpperCase()}</span>
                                        </div>
                                        <button
                                            type='button'
                                            className="btn-excluir-etiqueta"
                                            onClick={() => handleDeleteTag(tag.id)}
                                            title="Excluir etiqueta"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="etiqueta-modal-footer">
                            <button
                                type='button'
                                className="btn-voltar-criar-nota"
                                onClick={() => setShowEtiquetasModal(false)}
                            >
                                ✕ FECHAR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showImageModal && (
                <div className='modal-overlay fade-in' onClick={() => setShowImageModal(false)}>
                    <div className='modal-container' onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <h2 className='modal-title'>IMAGEM DE CAPA</h2>
                        
                        <div className="etiqueta-criar-form" style={{ gap: '20px' }}>
                            <div className="modal-form-group">
                                <label htmlFor="imageUrlInput">URL DA IMAGEM:</label>
                                <input
                                    id="imageUrlInput"
                                    type="text"
                                    className="etiqueta-nome-input"
                                    placeholder="Cole o link da imagem aqui..."
                                    value={tempImagemUrl}
                                    onChange={(e) => setTempImagemUrl(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSaveImage(); } }}
                                    autoFocus
                                />
                            </div>

                            {tempImagemUrl && (
                                <div className="image-preview-container" style={{
                                    width: '100%',
                                    height: '150px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid #444',
                                    backgroundImage: `url(${tempImagemUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#151515'
                                }} />
                            )}

                            <div className="modal-actions-container" style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setShowImageModal(false)}
                                    style={{ flex: 1, backgroundColor: '#3e3e3e', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontFamily: 'Bebas Neue', fontSize: '18px', cursor: 'pointer', letterSpacing: '1px' }}
                                >
                                    CANCELAR
                                </button>
                                <button
                                    type="button"
                                    className="btn-save"
                                    onClick={handleSaveImage}
                                    style={{ flex: 1, backgroundColor: '#ffffff', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontFamily: 'Bebas Neue', fontSize: '18px', cursor: 'pointer', letterSpacing: '1px' }}
                                >
                                    CONFIRMAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Create
