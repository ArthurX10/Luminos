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
import logo from '../assets/images.png'


function Create() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [etiqueta, setEtiqueta] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if(!userId) return;

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
                    setTitulo(response.data.titulo || '');
                    setConteudo(response.data.conteudo || '');
                })
                .catch(error => {
                    console.error("Erro ao buscar a nota", error);
                });
        }

    }, [id]);


    const handleCreateNewTag = () => {
        const userId = localStorage.getItem('user_id');
        const nomeTag = prompt("Digite o nome da nova tag:");

        if (!nomeTag || !userId) 
            return;

        const cores = ["#34C759", "#FF3B30", "#007AFF", "#AF52DE", "#FF9500"];
        const corTag = cores[Math.floor(Math.random() * cores.length)];

        api.post(`api/etiquetas/${userId}/`, {nome: nomeTag, cor: corTag})
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
            conteudo: conteudo,
        };

        if (id) {
            api.put(`api/notas/detalhe/${id}/`, notaData)
                .then(() => {
                    alert("Anotação Atualizada");
                    navigate('/home');
                })
                .catch(error => console.error("Erro ao atualizar:", error))
        } else {
            api.post(`api/notas/${userId}/`, notaData)
                .then(() => {
                    alert("Anotação Criada!");
                    navigate('/home');
                })
                .catch(error => console.error("Erro ao criar: ", error));
        }
    }

    return (
        <div className="create-container">
            {/*Sidebar */}
            <div className="create-sidebar">
                <div className='create-logo'>
                    <img src = {logo} style = {{width: '60px', height: '60px'}}/>
                    <h1 className='create-logo-text'>LUMINOS</h1>

                </div>
                <div className='create-section'>
                    <div className='create-section-title'>
                        <h2 className='create-section-subtitle'>DIRETÓRIO</h2>
                        <span className='create-section-nome'>NOME</span>
                    </div>

                    <div className='create-section-list'>
                        <div className='create-diretorio'>
                            <GoFileDirectory className='create-logo-icon' />
                            PESSOAL
                        </div>
                        <div className='create-diretorio'>
                            <GoFileDirectory className='create-logo-icon' />
                            TRABALHO/FACULDADE
                        </div>
                        <div className='create-diretorio'>
                            <GoFileDirectory className='create-logo-icon' />
                            ESPORTES
                        </div>
                    </div>
                </div>

                <hr className='create-sidebar-divider'/>

                <div className='create-section-list'>
                    <div className='create-section-subtitle'>ETIQUETAS</div>
                    
                    <button className="create-btn-add-tag" onClick={handleCreateNewTag}>
                        + ADICIONAR ETIQUETA
                    </button>

                    <div className="create-tags-container">
                        {etiqueta.map(tag => (
                            <div key={tag.id} className='create-tag-item' style={{ color: tag.cor }}>
                                ● {tag.nome.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>

                <hr className='create-sidebar-divider'/>


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

                        <div className='create-header-status'>
                            {titulo ? `${titulo.toUpperCase()} - STATUS` : "SEM TÍTULO - STATUS"}
                        </div>

                        <div className='create-header-btn'>
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

                <div className="create-main">
                    <div className="editor-cover-section">
                        <FaImage className="editor-cover-placeholder" />
                        <button className="editor-btn-add-cover" onClick={() => alert('Inserir imagem de capa')}>
                            + ADICIONAR CAPA
                        </button>
                    </div>
                    <input 
                        type="text"
                        className="editor-title-input"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="SEM TÍTULO"
                    />
                    <textarea 
                        className="editor-content-textarea"
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                        placeholder="CAMPO CRIATIVO"
                    />
                </div>
            </div>
        </div>
    );
}


export default Create
