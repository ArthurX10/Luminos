import React from 'react'
import Side from '../components/Side'
import './Home.css'
function Home() {
  return (
    <div className='home-container'>
      <Side/>
      <main className="home-content">
        {/* Criar uma função para trocar o conteúdo, (Bom dia, boa tarde, boa noite)*/}
        <div className="home-header">
          {/*Criar uma logica que pegue o nome do usuário */}
            <h1 className="home-greeting">BOM DIA, Nome do usúario</h1>
        </div>
      </main>
    </div>
  )
}

export default Home
