import React, { useState } from 'react';
import Style from './style.module.css';

function Pagination({ data }) {
  const [atendimento, setAtendimento] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginateData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Abre o modal de confirmação
  const abrirModal = (atendimento) => {
    setAtendimento(atendimento);
    setShowModal(true);
  };

  // Fecha o modal
  const fecharModal = () => {
    setShowModal(false);
    setAtendimento(null);
  };

  // Confirmação e atualização do status
  const confirmarAtualizacao = async () => {
    fecharModal(); // Fecha o modal antes de atualizar

    try {
      const response = await fetch('http://localhost:3000/api/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atendimento, status: 'REAVALIACAO' })
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (response.ok) {
        alert("Status atualizado com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao atualizar status: " + data.message);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      alert("Erro na requisição!");
    }
  };

  return (
    <div className={Style.continerPagination}>
      {paginateData.length ? (
        <ul className={Style.listaAtentimento}>
          {paginateData.map((atendimento, index) => (
            <li key={index} className={Style.itemListaAtentimento}>
              <span>{atendimento[0]}</span>
              <span
                className={Style.status}
                style={{
                  background:
                    atendimento[1] === 'AGUARDANDO' ? '#F0E68C' :
                    atendimento[1] === 'REAVALIACAO' ? '#FF4500' :
                    atendimento[1] === 'CHEGOU' ? '#ADD8E6' :
                    atendimento[1] === 'ATENDIDO' ? '#90EE90' : 'gray',
                  padding: '5px',
                  color: atendimento[1] === 'REAVALIACAO' ? '#FFF' : '#4375a3',
                  height: 'max-content',
                  borderRadius: '3px'
                }}
              >
                {atendimento[1]}
              </span>
              <span>{atendimento[2]}</span>
              <button onClick={() => abrirModal(atendimento[0])} className={Style.btn}>
                Reavaliação
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={Style.legenda}>Sem pacientes aguardando.</p>
      )}

      {/* Botões de paginação */}
      <div className="pagination-controls">
        <button className={Style.btnPaginacao} onClick={previousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button className={Style.btnPaginacao} onClick={nextPage} disabled={currentPage === totalPages}>
          Próxima
        </button>
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className={Style.modalOverlay}>
          <div className={Style.modalContent}>
            <h3>Confirmar Atualização</h3>
            <p>Tem certeza que deseja atualizar o status do atendimento <strong>{atendimento}</strong> para "REAVALIAÇÃO"?</p>
            <div className={Style.modalButtons}>
              <button className={Style.btnConfirm} onClick={confirmarAtualizacao}>Confirmar</button>
              <button className={Style.btnCancel} onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagination;
