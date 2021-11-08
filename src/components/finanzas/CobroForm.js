import React, {useEffect, useState, us} from "react";
import {createMovimiento} from "../../actions/movimientos";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import Loader from "react-loader-spinner";
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import swal from '@sweetalert/with-react';
import AlumnoService from "../../services/AlumnoService";
import CursosService from "../../services/CursosService";

const currentYear = new Date().getFullYear();
const currentDate = new Date();

const validationSchema = Yup.object().shape({

    alumnosId: Yup.number().typeError('Se debe seleccionar una opción')
        .required('Se debe seleccionar una opción')
        .min(1, 'Se debe seleccionar una opción'),

    cursoId: Yup.number()
        .typeError('Se debe seleccionar una opción')
        .required('Se debe seleccionar una opción')
        .min(1, 'Se debe seleccionar una opción'),

    fechaDeCobro: Yup.date()
        .typeError('Se debe seleccionar la fecha del cobro')
        .required('Se debe seleccionar la fecha del cobro')
        .max(currentDate, 'La fecha de cobro no puede ser posterior al dia de hoy'),

    mesArancel: Yup.number().typeError('Se debe seleccionar una opción')
        .required('Se debe seleccionar una opción')
        .min(2, 'Se debe seleccionar un mes válido')
        .max(12, 'Se debe seleccionar un mes válido'),

    anioArancel: Yup.number().typeError('Se debe seleccionar una opción')
        .required('Se debe seleccionar una opción')
        .min(2017, 'Se debe seleccionar un año válido')
        .max(currentYear, 'Se debe seleccionar un año válido'),

    medioDePago: Yup.string()
        .typeError('Se debe seleccionar una opción')
        .required('EL medio de pago es requerido'),

    detalle: Yup.string()
        .required('El detalle del cobro es requrido')
        .matches('^(?!\\s*$).+', {message: 'El detalle del cobro no puede estar vacío'}),

    monto: Yup.number()
        .typeError('El monto del cobro debe ser un número')
        .required('El monto del cobro es requerido')
        .integer('El monto del cobro debe ser un número')
        .positive('El monto del cobro debe ser un número válido'),

});

const navigateFinanzas = `${config.appDns}/finanzas`


function CobroForm(props) {

    const [alumnos, setAlumnos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            cursoId: undefined,
            alumnosId: undefined,
            fechaDeCobro: undefined,
            mesArancel: undefined,
            anioArancel: undefined,
            medioDePago: undefined,
            usuarioId: parseInt(localStorage.getItem("usuarioId"),10),
            detalle: '',
            tipoMovimiento: 'COBRO',
            monto: undefined
            //    COBRO,
            //     PAGO,
            //     ENTRADA_MANUAL,
            //     SALIDA_MANUAL
        }
    });


    const retrieveAlumnos = () => {
        AlumnoService.getAllAAsignar().then(
            res => {
                setAlumnos(res.data)
                setIsLoading(false)
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los alumnos a asignar. Por favor contacta al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateFinanzas
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
                window.location = navigateFinanzas
            })
        });
    };

    useEffect(() => {
        retrieveAlumnos();
        retrieveCursos();
    }, [])


    const onSubmit = (data) => {
        const mesAbonado = {mesAbonado: new Date().setFullYear(data.anioArancel, data.mesArancel-1)}
        let updatedData = Object.assign(data,mesAbonado);
        createMovimiento(updatedData).then((response) => {
            handleResponse(201, response, navigateFinanzas, "El cobro fue correctamente registrado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateFinanzas, "Hubo un error al registrar el cobro")
        })
    };

    function alumnosOptions() {
        return alumnos.map(a => <option value={a.id}>{a.nombre}</option>)
    }

    function cursosOptions() {
        return cursos.map(c => <option value={c.id}>{c.nombre}</option>)
    }

    function loadCurso(e) {
        console.log(e)
        return null
    }

    function anioOptions() {
        let anio = 2017;
        let anios = []
        while (anio <= currentYear) {
            anios.push(anio)
            anio = anio + 1
        }
        return anios.map(a => <option value={a}>{a}</option>)
    }

    function getAlumnosSelect() {
        return <div className="form-group">
            <label>Alumno</label>
            <select
                name="alumnosId"
                {...register('alumnosId')}
                className={`form-control ${errors.alumnosId ? 'is-invalid' : ''}`}>
                <option value="0" selected disabled hidden>
                    Seleccione un alumno
                </option>
                {alumnosOptions()}
            </select>
            <div className="invalid-feedback">{errors.alumnosId?.message}</div>
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
                {getAlumnosSelect()}
                <div className="form-group">
                    <label>Fecha de cobro</label>
                    <input
                        name="fechaDeCobro"
                        type="date"
                        {...register('fechaDeCobro')}
                        className={`form-control ${errors.fechaDeCobro ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.fechaDeCobro?.message}</div>
                </div>
                <div className="form-group">
                    <label>Mes y año arancel cobrado</label>
                    <select
                        name="mesArancel"
                        {...register('mesArancel')}
                        className={`form-control ${errors.mesArancel ? 'is-invalid' : ''}`}
                    >
                        <option selected value={2}>Febrero</option>
                        <option value={3}>Marzo</option>
                        <option value={4}>Abril</option>
                        <option value={5}>Mayo</option>
                        <option value={6}>Junio</option>
                        <option value={7}>Julio</option>
                        <option value={8}>Agosto</option>
                        <option value={9}>Septiembre</option>
                        <option value={10}>Octubre</option>
                        <option value={11}>Noviembre</option>
                        <option value={12}>Diciembre</option>
                    </select>
                    <div className="invalid-feedback">{errors.mesArancel?.message}</div>
                </div>
                <div className="form-group">
                    <select
                        name="anioArancel"
                        {...register('anioArancel')}
                        className={`form-control ${errors.anioArancel ? 'is-invalid' : ''}`}
                    >
                        {anioOptions()}
                    </select>
                    <div className="invalid-feedback">{errors.anioArancel?.message}</div>
                </div>
                <div className="form-group">
                    <label>Monto</label>
                    <input
                        name="monto"
                        type="text"
                        {...register('monto')}
                        className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
                        onChange={loadCurso}
                    />
                    <div className="invalid-feedback">{errors.monto?.message}</div>
                </div>


                <div className="form-group">
                    <label>Curso</label>
                    <select
                        name="cursoId"
                        {...register('cursoId')}
                        className={`form-control ${errors.cursoId ? 'is-invalid' : ''}`}>
                        <option value="0" selected disabled hidden>
                            Seleccione un curso
                        </option>
                        {cursosOptions()}
                    </select>
                    <div className="invalid-feedback">{errors.cursoId?.message}</div>
                </div>

                <div className="form-group">
                    <label>Detalle</label>
                    <input
                        name="detalle"
                        type="text"
                        {...register('detalle')}
                        className={`form-control ${errors.detalle ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.detalle?.message}</div>
                </div>
                <div className="form-group">
                    <label>Medio de Pago</label>
                    <select
                        name="medioDePago"
                        {...register('medioDePago')}
                        className={`form-control ${errors.medioDePago ? 'is-invalid' : ''}`}
                    >
                        <option selected value={'EFECTIVO'}>Efectivo</option>
                        <option value={'TRANSFERENCIA_BANCARIA'}>Transferencia</option>
                        <option value={'MERCADO_PAGO'}>Mercado Pago</option>
                    </select>
                    <div className="invalid-feedback">{errors.medioDePago?.message}</div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </form>
            }
        </div>);
}

export default CobroForm
