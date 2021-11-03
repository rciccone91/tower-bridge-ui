import React, { useEffect, useState } from "react";
import config from "../../config"
import CursosService from "../../services/CursosService";
import swal from '@sweetalert/with-react';

function CursoDetail(props){

    const id = props && props.props ? props.props.params.id : undefined

    const navigateCursos = `${config.appDns}/cursos`

    const [data, setData] = useState({ });

    useEffect(() => {
        if(id){
            CursosService.get(id).then(
                res =>  {
                    setData(res.data);
                }).catch(err => {
                console.log(err)
                swal({
                    title: "Error",
                    text: 'Un error ocurrió al buscar el curso requerido. Por favor verificá que el mismo exista o contacta al administrador.',
                    icon: "error",
                    button: "OK"
                }).then(() => {
                    window.location = navigateCursos
                })
            });
        }
    },[id])


    return(
        <div className="list row col-md-12" >
            <div className="col-md-12">
                <h2>Curso</h2>
            </div>
            <div className="col-md-6">
                <h5>Nombre</h5>
                <label>{data.nombre}</label>
                <h5>Descripción</h5>
                <label>{data.descripcion}</label>
                <h5>Tipo de curso</h5>
                <label>{data.tipoDeCurso}</label>
                {/*<h5>Detalles</h5>*/}
                {/*<label>{data.detalles}</label>*/}
                {/*<h5>CBU / CVU</h5>*/}
                {/*<label>{data.cbuCvu}</label>*/}
                {/*<h5>Valor de hora diferenciado</h5>*/}
                {/*<label>{data.valorHoraDiferenciado ? 'Si' : 'No'}</label>*/}
            </div>
            <div className="col-md-6">
                <h5>Arancel</h5>
                <label>{data.valorArancel}</label>
                <h5>Valor examen internacional(USD)</h5>
                <label>{data.valorExamen}</label>
                <h5>Valor de hora de profesor</h5>
                <label>{data.valorHoraProfesor}</label>
                <h5>Libros</h5>
                {data.librosDelCurso &&
                data.librosDelCurso.map((libro) => (
                    <label>{libro.nombre - libro.tipoDeLibro}</label>
                ))}
            </div>
        </div>
    )

}

export default CursoDetail
