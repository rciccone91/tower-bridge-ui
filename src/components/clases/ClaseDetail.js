import React, {useEffect, useState} from "react";
import config from "../../config"
import ClasesService from "../../services/ClasesService";
import swal from '@sweetalert/with-react';
import Loader from "react-loader-spinner";


function ClaseDetail(props) {

    const id = props && props.props ? props.props.params.id : undefined

    const navigateClases = `${config.appDns}/clases`

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (id) {
            ClasesService.get(id).then(
                res => {
                    setData(res.data);
                    setIsLoading(false)
                }).catch(err => {
                console.log(err)
                swal({
                    title: "Error",
                    text: 'Un error ocurrió al buscar la clase requerido. Por favor verificá que la misma exista o contacta al administrador.',
                    icon: "error",
                    button: "OK"
                }).then(() => {
                    window.location = navigateClases
                })
            });
        }
    }, [id])


    return (
        <div>
            {isLoading &&
            <div className="list row col-md-12">
                <Loader
                    type="Rings"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
            </div>}
            {!isLoading &&
            <div className="list row col-md-12">
                <div className="col-md-12">
                    <h2>Clase</h2>
                </div>
                <div className="col-md-4">
                    <h5>Nombre</h5>
                    <label>{data.nombre}</label>
                    <h5>Descripción</h5>
                    <label>{data.descripcion}</label>
                    <h5>Día</h5>
                    <label>{data.dia}</label>
                    <h5>Horario</h5>
                    <label>{data.horarioInicio} - {data.horarioFin} hs</label>
                    <h5>Curso</h5>
                    <label>{data.curso.nombre}</label>
                </div>
                <div className="col-md-4">
                    <h4>Classroom</h4>
                    <h5>Link</h5>
                    <label>{data.linkClassroom}</label>
                    <h5>Password</h5>
                    <label>{data.claveClassroom}</label>
                    <h4>Videollamada</h4>
                    <h5>Link</h5>
                    <label>{data.linkVideollamada}</label>
                    <h5>Password</h5>
                    <label>{data.claveVideollamada}</label>
                    <h3>Profesor</h3>
                    <label>{data.profesor.nombre}</label>

                </div>
                <div className="col-md-4">

                    <h3>Alumnos</h3>
                    {data.alumnos &&
                    data.alumnos.map((alumno) => (
                        <label>{alumno.nombre}</label>
                    ))}

                </div>
            </div>
            }
        </div>
    )

}

export default ClaseDetail
