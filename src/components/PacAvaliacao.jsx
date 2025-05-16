import React, { useState, useEffect, useRef } from "react";
import Style from "./style.module.css";
import Pagination from "./paginacao/Paginacao";

function PacAvaliacao() {
  const [pacientes, setPacientes] = useState([]);
  const clockRef = useRef(null); // Referência para o elemento do relógio

 const [recepcao, setRecepcao] = React.useState(() => {
      const valorSalvo = Number(window.localStorage.getItem('recepcao'));
      return valorSalvo ? valorSalvo : 1; // ou outro valor padrão como 1
  });



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
      const pacRevisao = await fetch(`http://localhost:3000/api/data?recepcao=${recepcao}`);
      const data = await pacRevisao.json();
      setPacientes(data);
    }

    listaPaciente();
  }, [recepcao]);

  const handleRec = (e) => {
      const valor = Number(e.target.value);
      if(valor){
        setRecepcao(valor);
        window.localStorage.setItem('recepcao', valor)
      }
  };

  return (
    <section className={Style.sectionListaPaciente}>
      <h2>Situação do Paciente - Emergência Adulto</h2>
      <div className={Style.relogio}>Horário Atual: <span ref={clockRef}></span></div>

      <div>
             <span>Recepção:</span>
             <label htmlFor="adulto">
                <input type="radio" name="recepcao" id="adulto" value={1} checked={recepcao === 1} onChange={handleRec}/>
                Adulto
             </label>
      
             <label htmlFor="pediatria">
                <input type="radio" name="recepcao" id="pediatria" value={11} checked={recepcao === 11} onChange={handleRec}/>
                Pediatria
             </label>
      </div>
      <Pagination data={pacientes} />
    </section>
  );
}

export default PacAvaliacao;
