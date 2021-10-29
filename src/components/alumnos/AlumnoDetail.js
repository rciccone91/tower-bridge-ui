import React, { useEffect, useState } from "react";
import config from "../../config"
import AlumnoService from "../../services/AlumnoService";
import swal from '@sweetalert/with-react';

function AlumnoDetail(props){

    const id = props && props.props ? props.props.params.id : undefined

    const navigateAlumnos = `${config.appDns}/alumnos`

    const [data, setData] = useState({ });

    useEffect(() => {
        if(id){
            AlumnoService.get(id).then(
                res =>  {
                    setData(res.data);
                }).catch(err => {
                console.log(err)
                swal({
                    title: "Error",
                    text: 'Un error ocurrió al buscar el alumno requerido. Por favor verificá que el mismo exista o contacta al administrador.',
                    icon: "error",
                    button: "OK"
                }).then(() => {
                    window.location = navigateAlumnos
                })
            });
        }
    },[id])


    return(
        <div className="list row col-md-12" >
            <div className="col-md-12">
                <h2>Alumno</h2>
            </div>
            <div className="col-md-4">
                <h5>Nombre</h5>
                <label>{data.nombreApellido}</label>
                <h5>DNI</h5>
                <label>{data.dni}</label>
                <h5>Fecha de Nacimiento</h5>
                <label>{data.fechaDeNacimiento}</label>
                <h5>Detalles</h5>
                <label>{data.detalles}</label>
                <h5>Año Escolar</h5>
                <label>{data.anioEscolar}</label>
                <h5>Colegio</h5>
                <label>{data.colegio}</label>
                <h5>Nivel de Ingles</h5>
                <label>{data.nivelIngles}</label>
                <h5>Rinde Examen</h5>
                <label>{data.rindeExamen ? 'Si' : 'No'}</label>
            </div>
            <div className="col-md-4">
                <h5>Instituciones Previas</h5>
                <label>{data.institucionesPrevias}</label>
                <h5>Clases asignadas</h5>
                {data.clases &&
                data.clases.map((clase) => (
                    <label>{clase}</label>
                ))}
                <h5>Descuento Aplicado</h5>
                <label>{data.descuentoAplicado ? data.descuentoAplicado : 'Ninguno'}</label>
                <h5>Padres / Tutores</h5>
                {data.padres &&
                data.padres.map((padre) => (
                    <label>{padre}</label>
                ))}
            </div>
            <div className="col-md-4">

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

export default AlumnoDetail
