import React, { useEffect, useState } from "react";
import config from "../../config"
import ProfesoresService from "../../services/ProfesoresService";
import swal from '@sweetalert/with-react';

function ProfesorDetail(props){

    const id = props && props.props ? props.props.params.id : undefined

    const navigateProfesores = `${config.appDns}/profesores`

    const [data, setData] = useState({ });

    useEffect(() => {
        if(id){
            ProfesoresService.get(id).then(
                res =>  {
                    setData(res.data);
                }).catch(err => {
                    console.log(err)
                    swal({
                        title: "Error",
                        text: 'Un error ocurrió al buscar el profesor requerido. Por favor verificá que el mismo exista o contacta al administrador.',
                        icon: "error",
                        button: "OK"
                    }).then(() => {
                        window.location = navigateProfesores
                    })
            });
        }
    },[id])


    return(
        <div className="list row col-md-12" >
            <div className="col-md-12">
                <h2>Profesor</h2>
            </div>
            <div className="col-md-6">
                <h5>Nombre</h5>
                <label>{data.nombreApellido}</label>
                <h5>DNI</h5>
                <label>{data.dni}</label>
                <h5>Fecha de Nacimiento</h5>
                <label>{data.fechaDeNacimiento}</label>
                <h5>Detalles</h5>
                <label>{data.detalles}</label>
                <h5>CBU / CVU</h5>
                <label>{data.cbuCvu}</label>
                <h5>Valor de hora diferenciado</h5>
                <label>{data.valorHoraDiferenciado ? 'Si' : 'No'}</label>
                <h5>Clases asignadas</h5>
                {data.clases &&
                data.clases.map((clase) => (
                    <label>{clase}</label>
                ))}
            </div>
            <div className="col-md-6">

                <h5>Experiencia previa</h5>
                <label>{data.experienciaPrevia}</label>
                <h3>Datos de contacto</h3>
                <h5>Domicilio</h5>
                <label>{data.domicilio}</label>
                <h5>Teléfono</h5>
                <label>{data.telefono}</label>
                <h5>Email</h5>
                <label>{data.email}</label>
            </div>
        </div>
    )

}

export default ProfesorDetail
