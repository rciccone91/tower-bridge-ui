import React, {useEffect, useState} from "react";
import {createAlumno, updateAlumno} from "../../actions/alumnos";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Loader from "react-loader-spinner";
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import AlumnoService from "../../services/AlumnoService";
import swal from '@sweetalert/with-react';
import validDateRegex from "../../commons/commons";
import UsuariosService from "../../services/UsuariosService";
import PadresService from "../../services/PadresService";

const currentDate = new Date();

Yup.addMethod(Yup.string, "edadMinima", function (errorMessage) {
    return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
        let anio = value.split('/')[2];
        let anioActual = new Date().getFullYear();
        return anio && (anioActual - parseInt(anio, 10)) >= 5;
    });
});

Yup.addMethod(Yup.string, "edadMaxima", function (errorMessage) {
    return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
        let anio = value.split('/')[2];
        let anioActual = new Date().getFullYear();
        return anio && (anioActual - parseInt(anio, 10)) <= 80;
    });
});

Yup.addMethod(Yup.string, "anioValido", function (errorMessage) {
    return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
        let anio = value.split('/')[2];
        let anioActual = new Date().getFullYear();
        return parseInt(anio, 10) < anioActual;
    });
});

const validationSchema = Yup.object().shape({
    nombreApellido: Yup.string()
        .required('El nombre y apellido es requerido')
        .matches('^(?!\\s*$).+', {message: 'El nombre y apellido no puede estar vacío'}),
    fechaDeNacimiento: Yup.string()
        .required('La fecha de nacimiento es requerida')
        .matches(validDateRegex, {message: 'La fecha de nacimiento debe tener el formato dd/mm/yyyy'})
        .anioValido("Fecha de nacimiento incorrecta. Verificar el año ingresado")
        .edadMinima("Fecha de nacimiento incorrecta. La edad mínima permitida es de 5 años.")
        .edadMaxima("Fecha de nacimiento incorrecta. La edad máxima permitida es de 80 años."),

    dni: Yup.number()
        .typeError('El DNI debe ser un número')
        .required('DNI es requerido')
        .max(200000000, 'El DNI debe ser un numero válido')
        .integer('El DNI debe ser un número')
        .positive('El DNI debe ser un numero válido'),

    email: Yup.string()
        .required('El email es requerido')
        .email('El email es invalido'),

    domicilio: Yup.string()
        .required('El domicilio es requerido.')
        .matches('^(?!\\s*$).+', {message: 'El domicilio no puede estar vacío'}),

    telefono: Yup.string()
        .required('El teléfono es requerido.')
        .matches('^(?!\\s*$).+', {message: 'El teléfono no puede estar vacío'}),

    nivelIngles: Yup.string()
        .required('Los datos sobre el nivel del alumno son requeridos.')
        .matches('^(?!\\s*$).+', {message: 'Este campo no puede estar vacío'}),

    institucionesPrevias: Yup.string()
        .required('Los datos sobre las instituciones previas son requeridos.')
        .matches('^(?!\\s*$).+', {message: 'Este campo no puede estar vacío'}),

    usuarioId: Yup.number()
        .typeError('El usuario es requerido. Por favor, cree un nuevo usuario si el mismo no existe.')
        .required('El usuario es requerido. Por favor, cree un nuevo usuario si el mismo no existe.')
        .min(1, 'Se debe seleccionar una opción. Si no hay usuarios para seleccionar, cree uno nuevo.'),

    fechaInscripcion: Yup.date()
        .typeError('Se debe seleccionar la fecha de inscripción')
        .required('Se debe seleccionar la fecha de inscripción')
        .max(currentDate, 'La fecha de inscripción no puede ser posterior al dia de hoy'),

});

const navigateAlumnos = `${config.appDns}/alumnos`


function toStringDate(fecha) {
    let date = new Date(fecha);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`
}

function AlumnoForm(props) {

    const id = props && props.props ? props.props.params.id : undefined
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [padres, setPadres] = useState([]);
    const [selectedPadres, setSelectedPadres] = useState([]);
    const [usuario, setUsuario] = useState(undefined);
    const [fechaInscripcion, setFechaInscripcion] = useState(undefined);


    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            nombreApellido: "",
            fechaDeNacimiento: "",
            dni: "",
            anioEscolar: "",
            colegio: "",
            nivelIngles: "",
            institucionesPrevias: "",
            detalles: "",
            rindeExamen: false,
            padresACargo: undefined,
            usuarioId: undefined,
            domicilio: "",
            telefono: "",
            email: "",
            fechaInscripcion: undefined
        }
    });


    const retrievePadres = () => {
        PadresService.getAllForSelect().then(
            res => {
                setPadres(res.data)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los padres a asignar. Por favor contacta al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateAlumnos
            })
        });
    };

    const retrieveUsuarios = () => {
        UsuariosService.getAllAAsignar('ALUMNO').then(
            res => {
                setUsuarios(res.data)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los usuarios a asignar. Por favor contacta al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateAlumnos
            })
        });
    };

    useEffect(() => {
        retrieveUsuarios();
        retrievePadres();
        if (id) {
            AlumnoService.get(id).then(
                res => {
                    if (res.data.usuario) {
                        setUsuario(res.data.usuario)
                    }
                    if (res.data.padres) {
                        setSelectedPadres(res.data.padres)
                    }
                    const inscripcion = toStringDate(res.data.fechaInscripcion);
                    setFechaInscripcion(inscripcion)
                    setIsLoading(false)
                    reset(res.data)
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
        } else {
            setIsLoading(false)
        }
    }, [id, reset])


    const onSubmit = (data) => {
        if (id) {
            updateAlumno(id, data).then((response) => {
                handleResponse(200, response, navigateAlumnos, "El alumno fue correctamente actualizado.")
            }).catch(err => {
                console.log(err)
                handleError(err, navigateAlumnos, "Hubo un error al actualizar el alumno")
            })
        } else {
            createAlumno(data).then((response) => {
                handleResponse(201, response, navigateAlumnos, "El alumno fue correctamente dado de alta.")
            }).catch(err => {
                console.log(err)
                handleError(err, navigateAlumnos, "Hubo un error al agregar el alumno")
            })
        }
    };

    function getPadresSelect() {
        let values = selectedPadres.map(sp => sp.id);
        return selectedPadres ?
            <div className="form-group">
                <label>Padres</label>
                <select
                    multiple={true}
                    name="padresACargo"
                    {...register('padresACargo')}
                    defaultValue={values}
                    className={`form-control ${errors.padresACargo ? 'is-invalid' : ''}`}>
                    {padresOptions()}
                </select>
                <div className="invalid-feedback">{errors.padresACargo?.message}</div>
            </div>
            :
            <div className="form-group">
                <label>Padres</label>
                <select
                    multiple={true}
                    name="padresACargo"
                    {...register('padresACargo')}
                    className={`form-control ${errors.padresACargo ? 'is-invalid' : ''}`}>
                    {padresOptions()}
                </select>
                <div className="invalid-feedback">{errors.padresACargo?.message}</div>
            </div>
    }

    function getUsuariosSelect() {
        return usuario ?
            <div className="form-group">
                <label>Usuario</label>
                <select
                    name="usuarioId"
                    {...register('usuarioId')}
                    // defaultValue={usuario.id}
                    className={`form-control ${errors.usuarioId ? 'is-invalid' : ''}`}>
                    <option value={usuario.id} selected>{usuario.username}</option>
                    {usuariosOptions()}
                </select>
                <div className="invalid-feedback">{errors.usuarioId?.message}</div>
            </div>
            :
            <div className="form-group">
                <label>Usuario</label>
                <select
                    name="usuarioId"
                    {...register('usuarioId')}
                    className={`form-control ${errors.usuarioId ? 'is-invalid' : ''}`}
                    defaultValue={0}>
                    <option value="0" selected disabled>Seleccione un usuario a asignar</option>
                    {usuariosOptions()}
                </select>
                <div className="invalid-feedback">{errors.usuarioId?.message}</div>
            </div>
    }

    function padresOptions() {
        return padres.map(u => <option value={u.id}>{u.nombre}</option>)
    }

    function usuariosOptions() {
        return usuarios.map(u => <option value={u.id}>{u.username}</option>)
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
                    <label>Nombre y Apellido </label>
                    <input
                        name="nombreApellido"
                        type="text"
                        {...register('nombreApellido')}
                        className={`form-control ${errors.nombreApellido ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.nombreApellido?.message}</div>
                </div>
                <div className="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input
                        name="fechaDeNacimiento"
                        type="text"
                        {...register('fechaDeNacimiento')}
                        className={`form-control ${errors.fechaDeNacimiento ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.fechaDeNacimiento?.message}</div>
                </div>

                <div className="form-group">
                    <label>DNI</label>
                    <input
                        name="dni"
                        type="text"
                        {...register('dni')}
                        className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.dni?.message}</div>
                </div>
                {!fechaInscripcion &&
                <div className="form-group">
                    <label>Fecha de inscripción</label>
                    <input
                        name="fechaInscripcion"
                        value={fechaInscripcion}
                        type="date"
                        {...register('fechaInscripcion')}
                        className={`form-control ${errors.fechaInscripcion ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.fechaInscripcion?.message}</div>
                </div>}

                <div className="form-group">
                    <label>Año Escolar </label>
                    <input
                        name="anioEscolar"
                        type="text"
                        {...register('anioEscolar')}
                        className={`form-control ${errors.anioEscolar ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.anioEscolar?.message}</div>
                </div>

                <div className="form-group">
                    <label>Colegio </label>
                    <input
                        name="colegio"
                        type="text"
                        {...register('colegio')}
                        className={`form-control ${errors.colegio ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.colegio?.message}</div>
                </div>

                <div className="form-group">
                    <label>Nivel de Inglés </label>
                    <input
                        name="nivelIngles"
                        type="text"
                        {...register('nivelIngles')}
                        className={`form-control ${errors.nivelIngles ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.nivelIngles?.message}</div>
                </div>

                <div className="form-group">
                    <label>Instituciones previas </label>
                    <input
                        name="institucionesPrevias"
                        type="text"
                        {...register('institucionesPrevias')}
                        className={`form-control ${errors.institucionesPrevias ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.institucionesPrevias?.message}</div>
                </div>


                <div className="form-group">
                    <label>Detalles</label>
                    <input
                        name="detalles"
                        type="textarea"
                        {...register('detalles')}
                        className={`form-control ${errors.detalles ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.detalles?.message}</div>
                </div>


                <div className="form-group form-check">
                    <input
                        name="rindeExamen"
                        type="checkbox"
                        {...register('rindeExamen')}
                        className={`form-check-input ${
                            errors.rindeExamen ? 'is-invalid' : ''
                        }`}
                    />
                    <label htmlFor="acceptTerms" className="form-check-label">
                        Rinde examen internacional
                    </label>
                    <div className="invalid-feedback">{errors.rindeExamen?.message}</div>
                </div>

                <div className="form-group">
                    <label>Domicilio</label>
                    <input
                        name="domicilio"
                        type="text"
                        {...register('domicilio')}
                        className={`form-control ${errors.domicilio ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.domicilio?.message}</div>
                </div>

                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        name="telefono"
                        type="text"
                        {...register('telefono')}
                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.telefono?.message}</div>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="text"
                        {...register('email')}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>

                {getPadresSelect()}

                {getUsuariosSelect()}

                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </form>
            }
        </div>);
}

export default AlumnoForm
