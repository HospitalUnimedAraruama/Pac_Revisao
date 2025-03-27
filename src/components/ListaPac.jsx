import React from 'react'
// import connection from './../../API/db.js'

function ListaPac() {

    const [pacientes, setPacientes] = React.useState([])
    const [id, setId] = React.useState('')

    console.log(pacientes);
    

    

  return (
    <div>
        <h1>Lista de Pacientes</h1>
    </div>
  )
}

export default ListaPac