import React, {useEffect, useState} from "react";
import {createCurso, updateCurso} from "../../actions/cursos";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import CursosService from "../../services/CursosService";
import swal from '@sweetalert/with-react';
import  validDateRegex from '../../commons/commons'
import Loader from "react-loader-spinner";
import UsuariosService from "../../services/UsuariosService";


// Yup.addMethod(Yup.string, "edadMinima", function (errorMessage) {
//     return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
//         let anio = value.split('/')[2];
//         let anioActual = new Date().getFullYear();
//         return anio && (anioActual - parseInt(anio, 10)) >= 18 ;
//     });
// });
//
// Yup.addMethod(Yup.string, "edadMaxima", function (errorMessage) {
//     return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
//         let anio = value.split('/')[2];
//         let anioActual = new Date().getFullYear();
//         return anio && (anioActual - parseInt(anio, 10)) <= 65 ;
//     });
// });
//
// Yup.addMethod(Yup.string, "anioValido", function (errorMessage) {
//     return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
//         let anio = value.split('/')[2];
//         let anioActual = new Date().getFullYear();
//         return parseInt(anio, 10) < anioActual;
//     });
// });
Yup.addMethod(Yup.number, 'emptyValor', function () {
    return this.transform((value) => (value === 0 ? undefined : value));
});

const validationSchema = Yup.object().shape({
    nombre: Yup.string()
        .required('El nombre del curso es requerido')
        .matches('^(?!\\s*$).+',{message: 'El nombre no puede estar vacío'}),

    tipoDeCurso: Yup.string()
        .required('El tipo de curso es requerido')
        .matches('^(?!\\s*$).+',{message: 'El tipo de curso no puede estar vacío'}),

    valorArancel: Yup.number()
        .typeError('El valor del arancel debe ser un número')
        .required('El valor del arancel es requerido')
        .max(40000, 'El valor del arancel debe ser un número valido')
        .integer('El valor del arancel debe ser un número')
        .positive('El valor del arancel debe ser un número válido'),

    valorExamen: Yup.number().emptyValor()
        .typeError('El valor del examen debe ser un número')
        .max(40000, 'El valor del examen debe ser un número valido')
        .integer('El valor del examen debe ser un número')
        .positive('El valor del examen debe ser un número válido'),

    valorHoraProfesor: Yup.number()
        .typeError('El valor de la hora del profesor debe ser un número')
        .required('El valor de la hora del profesor es requerido')
        .max(20000, 'El valor de la hora del profesor debe ser un número valido')
        .integer('El valor de la hora del profesor debe ser un número')
        .positive('El valor de la hora del profesor debe ser un número válido'),
});

const navigateCursos = `${config.appDns}/cursos`

function CursoForm(props){

    const id = props && props.props ? props.props.params.id : undefined
    const [libros, setLibros] = useState([]);
    const [selectedLibros, setSelectedLibros] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            nombre:"",
            descripcion:"",
            tipoDeCurso: "",
            librosDelCurso: [],
            valorArancel: undefined,
            valorExamen: undefined,
            valorHoraProfesor: undefined,
        }});


    useEffect(() => {
        if(id){
            CursosService.get(id).then(
                res =>  {
                    setIsLoading(false)
                    reset(res.data)
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
        } else {
            setIsLoading(false)
        }
    },[id,reset])

    const onSubmit = (data) => {
        if(id){
            updateCurso(id,data).then((response) => {
                handleResponse(200,response,navigateCursos, "El curso fue correctamente actualizado.")
            }).catch(err => {
                console.log(err)
                handleError(err,navigateCursos,"Hubo un error al actualizar el curso")
            })
        } else {
            createCurso(data).then((response) => {
                handleResponse(201,response,navigateCursos, "El curso fue correctamente dado de alta.")
            }).catch(err => {
                console.log(err)
                handleError(err,navigateCursos,"Hubo un error al agregar el curso")
            })
        }
    };

    function librosSelect() {
        let values = selectedLibros.map(sl => sl.id);
        return selectedLibros ?
            <div className="form-group">
                <label>Libros</label>
                <select
                    multiple={true}
                    defaultValue={values}
                    name="librosDelCurso"
                    {...register('librosDelCurso')}
                    className={`form-control ${errors.librosDelCurso ? 'is-invalid' : ''}`}>
                    {librosSelect()}
                </select>
                <div className="invalid-feedback">{errors.librosDelCurso?.message}</div>
            </div>
            :
            <div className="form-group">
                <label>Libros</label>
                <select
                    multiple={true}
                    name="librosDelCurso"
                    {...register('librosDelCurso')}
                    className={`form-control ${errors.librosDelCurso ? 'is-invalid' : ''}`}>
                    {librosSelect()}
                </select>
                <div className="invalid-feedback">{errors.librosDelCurso?.message}</div>
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

                <div className="form-group">
                    <label>Descripción</label>
                    <input
                        name="descripcion"
                        type="text"
                        {...register('descripcion')}
                        className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.descripcion?.message}</div>
                </div>

                <div className="form-group">
                    <label>Tipo de Curso</label>
                    <select
                        name="tipoDeCurso"
                        {...register('tipoDeCurso')}
                        className={`form-control ${errors.tipoDeCurso ? 'is-invalid' : ''}`}>
                        <option value="CAMBRIDGE_INTERNATIONAL">Cambridge</option>
                        <option value="ADULTOS">Adultos</option>
                        <option value="ESPECIFICOS">Específicos</option>
                    </select>
                    <div className="invalid-feedback">{errors.tipoDeCurso?.message}</div>
                </div>

                <div className="form-group">
                    <label>Arancel mensual</label>
                    <input
                        name="valorArancel"
                        type="text"
                        {...register('valorArancel')}
                        className={`form-control ${errors.valorArancel ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.valorArancel?.message}</div>
                </div>

                <div className="form-group">
                    <label>Valor examen internacional(USD)</label>
                    <input
                        name="valorExamen"
                        type="text"
                        defaultValue={0}
                        {...register('valorExamen')}
                        className={`form-control ${errors.valorExamen ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.valorExamen?.message}</div>
                </div>


                <div className="form-group">
                    <label>Valor de hora del profesor</label>
                    <input
                        name="valorHoraProfesor"
                        type="text"
                        {...register('valorHoraProfesor')}
                        className={`form-control ${errors.valorHoraProfesor ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.valorHoraProfesor?.message}</div>
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

export default CursoForm
