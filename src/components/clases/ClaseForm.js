import React, {useEffect, useState, us} from "react";
import {createClase, getClases, updateClase} from "../../actions/clases";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Loader from "react-loader-spinner";
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import ClasesService from "../../services/ClasesService";
import swal from '@sweetalert/with-react';
import ProfesoresService from "../../services/ProfesoresService";
import AlumnoService from "../../services/AlumnoService";
import CursosService from "../../services/CursosService";


const validationSchema = Yup.object().shape({
    nombre: Yup.string()
        .required('El nombre de la clase es requerido')
        .matches('^(?!\\s*$).+', {message: 'El nombre de la clase no puede estar vacío'}),

    curso: Yup.number()
        .typeError('Se debe seleccionar una opción')
        .required('Se debe seleccionar una opción')
        .min(1, 'Se debe seleccionar una opción'),

    profesorId: Yup.number()
        .typeError('Se debe seleccionar una opción')
        .required('Se debe seleccionar una opción')
        .min(1, 'Se debe seleccionar una opción'),

    alumnosIds: Yup.array().ensure().min(1, 'Se debe seleccionar un alumno').max(6, "La cantidad de alumnos debe ser menor o igual a 6."),

    linkVideollamada: Yup.string()
        .required('El link de la videollamada de la clase es requerido')
        .matches('^(?!\\s*$).+', {message: 'El link de la videollamada de la clase no estar vacío'}),

    claveVideollamada: Yup.string()
        .required('La clave de la videollamada de la clase es requerida')
        .matches('^(?!\\s*$).+', {message: 'La clave de la videollamada de la clase no puede estar vacía'}),

    linkClassroom: Yup.string()
        .required('El link del classroom de la clase es requerido')
        .matches('^(?!\\s*$).+', {message: 'El link del classroom de la clase no estar vacío'}),

    claveClassroom: Yup.string()
        .required('La clave del classroom de la clase es requerida')
        .matches('^(?!\\s*$).+', {message: 'La clave del classroom de la clase no puede estar vacía'}),

});

const navigateClases = `${config.appDns}/clases`

function ClaseForm(props) {

    const id = props && props.props ? props.props.params.id : undefined
    const [profesores, setProfesores] = useState([]);
    const [alumnos, setAlumnos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [profesor, setProfesor] = useState();
    const [selectedCurso, setSelectedCurso] = useState();
    const [selectedAlumnos, setSelectedAlumnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            nombre: "",
            curso: undefined,
            descripcion: "",
            dia: undefined,
            horarioInicio: undefined,
            horarioFin: undefined,
            linkVideollamada: "",
            claveVideollamada: "",
            linkClassroom: "",
            claveClassroom: "",
            alumnosIds: undefined,
            profesorId: undefined,
        }
    });

    const retrievePrfesores = () => {
        ProfesoresService.getAllAAsignar().then(
            res => {
                setProfesores(res.data)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los profesores a asignar. Por favor contacta al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateClases
            })
        });
    };


    const retrieveAlumnos = () => {
        AlumnoService.getAllAAsignar().then(
            res => {
                setAlumnos(res.data)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los alumnos a asignar. Por favor contacta al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateClases
            })
        });
    };

    const retrieveCursos = () => {
        CursosService.getAllAAsignar().then(
            res => {
                setCursos(res.data)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los cursos a asignar. Por favor contacta al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateClases
            })
        });
    };

    useEffect(() => {
        retrievePrfesores();
        retrieveAlumnos();
        retrieveCursos();
        if (id) {
            ClasesService.get(id).then(
                res => {
                    if (res.data.curso) {
                        console.log("en useEffect ")
                        console.log(res.data.curso)
                        setSelectedCurso(res.data.curso)
                    }
                    if (res.data.profesor) {
                        setProfesor(res.data.profesor)
                    }
                    if (res.data.alumnos) {
                        setSelectedAlumnos(res.data.alumnos)
                    }
                    reset(res.data)
                    setIsLoading(false)
                }).catch(err => {
                console.log(err)
                swal({
                    title: "Error",
                    text: 'Un error ocurrió al buscar la clase requerida. Por favor verificá que la misma exista o contacta al administrador.',
                    icon: "error",
                    button: "OK"
                }).then(() => {
                    window.location = navigateClases
                })
            });
        } else {
            setIsLoading(false)
        }
    }, [id, reset])


    const onSubmit = (data) => {
        if (data.horarioFin <= data.horarioInicio) {
            swal({
                text: 'Horario incorrecto. El horario de finalización de la clase debe ser posterior al de inicio',
                icon: "warning",
                button: "OK"
            })
        } else if ((data.horarioFin - data.horarioInicio) > 4) {
            swal({
                text: 'Horario incorrecto. Las clases no deben extenderse mas allá de cuatros horas. ',
                icon: "warning",
                button: "OK"
            })
        } else if ((data.horarioFin - data.horarioInicio) < 2) {
            swal({
                text: 'Horario incorrecto. Las clases deben al menos ser de 2 horas. ',
                icon: "warning",
                button: "OK"
            })
        } else if (id) {
            updateClase(id, data).then((response) => {
                handleResponse(200, response, navigateClases, "La clase fue correctamente actualizada.")
            }).catch(err => {
                console.log(err)
                handleError(err, navigateClases, "Hubo un error al actualizar la clase")
            })
        } else {
            createClase(data).then((response) => {
                handleResponse(201, response, navigateClases, "La clase fue correctamente dada de alta.")
            }).catch(err => {
                console.log(err)
                handleError(err, navigateClases, "Hubo un error al agregar la clase")
            })
        }
    };

    function profesoresOptions() {
        return profesores.map(p => <option value={p.id}>{p.nombre}</option>)
    }

    function alumnosOptions() {
        return alumnos.map(a => <option value={a.id}>{a.nombre}</option>)
    }

    function cursosOptions() {
        return cursos.map(c => <option value={c.id}>{c.nombre}</option>)
    }

    function getProfesoresSelect() {
        return profesor ?
            <div className="form-group">
                <label>Profesor</label>
                <select
                    name="profesorId"
                    {...register('profesorId')}
                    defaultValue={profesor.id}
                    className={`form-control ${errors.profesorId ? 'is-invalid' : ''}`}>
                    {profesoresOptions()}
                </select>
                <div className="invalid-feedback">{errors.profesorId?.message}</div>
            </div>
            : <div className="form-group">
                <label>Profesor</label>
                <select
                    name="profesorId"
                    {...register('profesorId')}
                    className={`form-control ${errors.profesorId ? 'is-invalid' : ''}`}>
                    <option value="0" selected disabled hidden>
                        Seleccione un profesor
                    </option>
                    {profesoresOptions()}
                </select>
                <div className="invalid-feedback">{errors.profesorId?.message}</div>
            </div>;
    }

    function getAlumnosSelect() {
        let values = selectedAlumnos.map(sa => sa.id);
        return selectedAlumnos ?
            <div className="form-group">
                <label>Alumnos</label>
                <select
                    multiple={true}
                    defaultValue={values}
                    name="alumnosIds"
                    {...register('alumnosIds')}
                    className={`form-control ${errors.alumnosIds ? 'is-invalid' : ''}`}>
                    {alumnosOptions()}
                </select>
                <div className="invalid-feedback">{errors.alumnosIds?.message}</div>
            </div>
            :
            <div className="form-group">
                <label>Alumnos</label>
                <select
                    multiple={true}
                    name="alumnosIds"
                    {...register('alumnosIds')}
                    className={`form-control ${errors.alumnosIds ? 'is-invalid' : ''}`}>
                    {alumnosOptions()}
                </select>
                <div className="invalid-feedback">{errors.alumnosIds?.message}</div>
            </div>;
    }

    function getCursosSelect() {
        // TODO - porque no funciona el default value? Por cuestión de sanidad mental, lo voy a revisar mas adelante
        // return selectedCurso ?
        //     <div className="form-group">
        //         <label>Curso</label>
        //         <select
        //             name="curso"
        //             {...register('curso')}
        //             defaultValue={selectedCurso.id}
        //             className={`form-control ${errors.curso ? 'is-invalid' : ''}`}>
        //             {cursosOptions()}
        //         </select>
        //         <div className="invalid-feedback">{errors.curso?.message}</div>
        //     </div>
        //     :
        return <div className="form-group">
            <label>Curso</label>
            <select
                name="curso"
                {...register('curso')}
                className={`form-control ${errors.curso ? 'is-invalid' : ''}`}>
                <option value="0" selected disabled hidden>
                    Seleccione un curso
                </option>
                {cursosOptions()}
            </select>
            <div className="invalid-feedback">{errors.curso?.message}</div>
        </div>;
    }

    return (
        <div className="register-form">
            {isLoading && <Loader
                type="Rings"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs
            />
            }
            {!isLoading &&
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        name="nombre"
                        type="text"
                        {...register('nombre')}
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.nombre?.message}</div>
                </div>
                {getCursosSelect()}
                <div className="form-group">
                    <label>Descripcion</label>
                    <input
                        name="descripcion"
                        type="text"
                        {...register('descripcion')}
                        className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.descripcion?.message}</div>
                </div>
                <div className="form-group">
                    <label>Dia</label>
                    <select
                        name="dia"
                        {...register('dia')}
                        className={`form-control ${errors.dia ? 'is-invalid' : ''}`}>
                        <option value="LUNES">Lunes</option>
                        <option value="MARTES">Martes</option>
                        <option value="MIERCOLES">Miercoles</option>
                        <option value="JUEVES">Jueves</option>
                        <option value="VIERNES">Viernes</option>
                        <option value="SABADO">Sabado</option>
                    </select>
                    <div className="invalid-feedback">{errors.dia?.message}</div>
                </div>
                <div className="form-group">
                    <label>Horario de Inicio</label>
                    <select
                        name="horarioInicio"
                        type="text"
                        {...register('horarioInicio')}
                        className={`form-control ${errors.horarioInicio ? 'is-invalid' : ''}`}
                    >
                        <option value={9}>9</option>
                        <option value={10}>10</option>
                        <option value={11}>11</option>
                        <option value={12}>12</option>
                        <option value={13}>13</option>
                        <option value={14}>14</option>
                        <option value={15}>15</option>
                        <option value={16}>16</option>
                        <option value={17}>17</option>
                        <option value={18}>18</option>
                        <option value={19}>19</option>
                    </select>
                    <div className="invalid-feedback">{errors.horarioInicio?.message}</div>
                </div>

                <div className="form-group">
                    <label>Horario de Fin</label>
                    <select
                        name="horarioFin"
                        type="text"
                        {...register('horarioFin')}
                        className={`form-control ${errors.horarioFin ? 'is-invalid' : ''}`}
                    >
                        <option value={10}>10</option>
                        <option value={11}>11</option>
                        <option value={12}>12</option>
                        <option value={13}>13</option>
                        <option value={14}>14</option>
                        <option value={15}>15</option>
                        <option value={16}>16</option>
                        <option value={17}>17</option>
                        <option value={18}>18</option>
                        <option value={19}>19</option>
                        <option value={20}>20</option>
                        <option value={21}>21</option>
                    </select>
                    <div className="invalid-feedback">{errors.horarioFin?.message}</div>
                </div>

                <div className="form-group">
                    <label>Link Videollamada</label>
                    <input
                        name="linkVideollamada"
                        type="text"
                        {...register('linkVideollamada')}
                        className={`form-control ${errors.linkVideollamada ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.linkVideollamada?.message}</div>
                </div>

                <div className="form-group">
                    <label>Clave Videollamada</label>
                    <input
                        name="claveVideollamada"
                        type="text"
                        {...register('claveVideollamada')}
                        className={`form-control ${errors.claveVideollamada ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.claveVideollamada?.message}</div>
                </div>

                <div className="form-group">
                    <label>Link Classroom</label>
                    <input
                        name="linkClassroom"
                        type="text"
                        {...register('linkClassroom')}
                        className={`form-control ${errors.linkClassroom ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.linkClassroom?.message}</div>
                </div>

                <div className="form-group">
                    <label>Clave Classroom</label>
                    <input
                        name="claveClassroom"
                        type="text"
                        {...register('claveClassroom')}
                        className={`form-control ${errors.claveClassroom ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.claveClassroom?.message}</div>
                </div>
                {getAlumnosSelect()}
                {getProfesoresSelect()}


                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </form>
            }
        </div>);
}

export default ClaseForm
