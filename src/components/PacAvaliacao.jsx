import React, { useState, useEffect, useRef } from "react";
import Style from "./style.module.css";
import Pagination from "./paginacao/Paginacao";

function PacAvaliacao() {
  const [pacientes, setPacientes] = useState([]);
  const clockRef = useRef(null); // Referência para o elemento do relógio

  // Atualiza a hora sem re-renderizar o componente
  useEffect(() => {
    const updateClock = () => {
      if (clockRef.current) {
        clockRef.current.innerText = new Date().toLocaleTimeString();
      }
    };

    const interval = setInterval(updateClock, 1000);
    updateClock(); // Atualiza imediatamente ao montar

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  useEffect(() => {
    async function listaPaciente() {
      const pacRevisao = await fetch("http://localhost:3001/api/data");
      const data = await pacRevisao.json();
      setPacientes(data);
    }

    listaPaciente();
  }, []);

  return (
    <section className={Style.sectionListaPaciente}>
      <h2>Situação do Paciente - Emergência Adulto</h2>
      <div className={Style.relogio}>Horário Atual: <span ref={clockRef}></span></div>
      <Pagination data={pacientes} />
    </section>
  );
}

export default PacAvaliacao;
