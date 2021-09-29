import React, { useEffect, useState } from "react";
import config from "../config"
import PadresService from "../services/PadresService";
import swal from '@sweetalert/with-react';

function PadreDetail(props){

    const id = props && props.props ? props.props.params.id : undefined

    const navigatePadres = `${config.appDns}/padres`

    const [data, setData] = useState({ });

    useEffect(() => {
        if(id){
            PadresService.get(id).then(
                res =>  {
                    setData(res.data);
                }).catch(err => {
                    console.log(err)
                    swal({
                        title: "Error",
                        text: 'Un error ocurrió al buscar el padre requerido. Por favor verificá que el mismo exista o contacta al administrador.',
                        icon: "error",
                        button: "OK"
                    }).then(() => {
                        window.location = navigatePadres
                    })
            });
        }
    },[id])


    return(
        <div className="list row col-md-12" >
            <div className="col-md-12">
                <h2>Padre</h2>
            </div>
            <div className="col-md-6">
                <h5>Nombre</h5>
                <label>{data.nombreApellido}</label>
                <h5>DNI</h5>
                <label>{data.dni}</label>
                <h5>Detalles</h5>
                <label>{data.detalles}</label>
                <h5>Alumnos a cargo</h5>
                {data.alumnosACargo &&
                data.alumnosACargo.map((alumno) => (
                    <label>{alumno}</label>
                ))}
            </div>
            <div className="col-md-6">
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

export default PadreDetail
