import React, {useEffect, useState} from "react";
import {createProfesor, updateProfesor} from "../../actions/profesores";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import ProfesoresService from "../../services/ProfesoresService";
import swal from '@sweetalert/with-react';
import  validDateRegex from '../../commons/commons'
import Loader from "react-loader-spinner";
import UsuariosService from "../../services/UsuariosService";


Yup.addMethod(Yup.string, "edadMinima", function (errorMessage) {
  return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
    let anio = value.split('/')[2];
    let anioActual = new Date().getFullYear();
    return anio && (anioActual - parseInt(anio, 10)) >= 18 ;
  });
});

Yup.addMethod(Yup.string, "edadMaxima", function (errorMessage) {
  return this.test(`fechaDeNacimiento`, errorMessage, function (value) {
    let anio = value.split('/')[2];
    let anioActual = new Date().getFullYear();
    return anio && (anioActual - parseInt(anio, 10)) <= 65 ;
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
      .matches('^(?!\\s*$).+',{message: 'El nombre y apellido no puede estar vacío'}),
  dni: Yup.number()
      .typeError('El DNI debe ser un número')
      .required('DNI es requerido')
      .max(200000000, 'El DNI debe ser un numero válido')
      .integer('El DNI debe ser un número')
      .positive('El DNI debe ser un numero válido'),

  fechaDeNacimiento: Yup.string()
      .required('La fecha de nacimiento es requerida')
      .matches(validDateRegex,{message: 'La fecha de nacimiento debe tener el formato dd/mm/yyyy'})
      .anioValido("Fecha de nacimiento incorrecta. Verificar el año ingresado")
      .edadMinima("Fecha de nacimiento incorrecta. La edad mínima permitida es de 18 años.")
      .edadMaxima("Fecha de nacimiento incorrecta. La edad máxima permitida es de 65 años."),


  email: Yup.string()
      .required('El email es requerido')
      .email('El email es invalido'),

  cbuCvu: Yup.string()
      .required('El CBU / CVU es requerido')
      .matches('^(?!\\s*$).+',{message: 'El CBU / CVU no puede estar vacío'}),

  experienciaPrevia: Yup.string()
      .required('Los datos de experiencia previa son requeridos')
      .matches('^(?!\\s*$).+',{message: 'Los datos de experiencia previa no pueden estar vacío'}),

  domicilio: Yup.string()
      .required('El domicilio es requerido.')
      .matches('^(?!\\s*$).+',{message: 'El domicilio no puede estar vacío'}),

  telefono: Yup.string()
      .required('El teléfono es requerido.')
      .matches('^(?!\\s*$).+',{message: 'El teléfono no puede estar vacío'}),

  usuarioId: Yup.number()
      .typeError('El usuario es requerido. Por favor, cree un nuevo usuario si el mismo no existe.')
      .required('El usuario es requerido. Por favor, cree un nuevo usuario si el mismo no existe.')
      .min(1, 'Se debe seleccionar una opción'),

});

const navigateProfesores = `${config.appDns}/profesores`

function ProfesorForm(props){

  const id = props && props.props ? props.props.params.id : undefined
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nombreApellido:"",
      dni:"",
      fechaDeNacimiento:"",
      detalles:"",
      cbuCvu:"",
      experienciaPrevia:"",
      valorHoraDiferenciado:false,
      domicilio:"",
      telefono:"",
      email:"",
      cv: undefined,
      usuarioId: undefined,
    }});

  const retrieveUsuarios = () => {
    UsuariosService.getAllAAsignar('PROFESOR').then(
        res =>  {
          setUsuarios(res.data)
        }).catch(err => {
      console.log(err)
      swal({
        title: "Error",
        text: 'Un error ocurrió al buscar los usuarios a asignar. Por favor contacta al administrador.',
        icon: "error",
        button: "OK"
      }).then(() => {
        window.location = navigateProfesores
      })
    });
  };

  useEffect(() => {
    retrieveUsuarios();
    if(id){
      ProfesoresService.get(id).then(
          res =>  {
            if(res.data.usuario){
              setUsuario(res.data.usuario)
            }
            setIsLoading(false)
            reset(res.data)
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
    } else {
      setIsLoading(false)
    }
  },[id,reset])

  function usuariosOptions() {
    return usuarios.map( u => <option value={u.id}>{u.username}</option>)
  }

  const onSubmit = (data) => {
    if(id){
      updateProfesor(id,data).then((response) => {
        handleResponse(200,response,navigateProfesores, "El profesor fue correctamente actualizado.")
      }).catch(err => {
        console.log(err)
        handleError(err,navigateProfesores,"Hubo un error al actualizar el profesor")
      })
    } else {
      createProfesor(data).then((response) => {
        handleResponse(201,response,navigateProfesores, "El profesor fue correctamente dado de alta.")
      }).catch(err => {
        console.log(err)
        handleError(err,navigateProfesores,"Hubo un error al agregar el profesor")
      })
    }
  };

  // function renderSelectedOption() {
  //   if(id && id !== 0){
  //     let value = getValues("usuarioId");
  //     let find = usuarios.find(u => u.id === value);
  //     setSelectedUsuario(find)
  //   } else {
  //     return <option value="0" selected disabled hidden>
  //       Seleccione un usuario a asignar</option>
  //   }
  // }

  function getUsuariosSelect() {
    return usuario ?
        <div className="form-group">
          <label>Usuario</label>
          <select
              name="usuarioId"
              {...register('usuarioId')}
              className={`form-control ${errors.usuarioId ? 'is-invalid' : ''}`}>
            <option value={usuario.id} selected >{usuario.username}</option>
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
              className={`form-control ${errors.usuarioId ? 'is-invalid' : ''}`}>
            <option value="0" selected disabled hidden>Seleccione un usuario a asignar</option>
            {usuariosOptions()}
          </select>
          <div className="invalid-feedback">{errors.usuarioId?.message}</div>
        </div>
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
              <label>DNI</label>
              <input
                  name="dni"
                  type="text"
                  {...register('dni')}
                  className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.dni?.message}</div>
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
              <label>Detalles</label>
              <input
                  name="detalles"
                  type="textarea"
                  {...register('detalles')}
                  className={`form-control ${errors.detalles ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.detalles?.message}</div>
            </div>


            <div className="form-group">
              <label>CBU / CVU</label>
              <input
                  name="cbuCvu"
                  type="text"
                  {...register('cbuCvu')}
                  className={`form-control ${errors.cbuCvu ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.cbuCvu?.message}</div>
            </div>

            <div className="form-group">
              <label>Experiencia previa </label>
              <input
                  name="experienciaPrevia"
                  type="text"
                  {...register('experienciaPrevia')}
                  className={`form-control ${errors.experienciaPrevia ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.experienciaPrevia?.message}</div>
            </div>


            {/*// TODO - Carga de CV*/}
            {/*<div className="form-group">*/}
            {/*  <label>Cargar CV </label>*/}
            {/*  <input*/}
            {/*      name="cv"*/}
            {/*      type="file"*/}
            {/*      {...register('image', {*/}
            {/*        validate: {*/}
            {/*          lessThan5MB: files => files[0]?.size < 5000000 || 'Máximo 5 MB',*/}
            {/*          acceptedFormats: files =>*/}
            {/*              ['application/pdf'].includes(*/}
            {/*                  files[0]?.type*/}
            {/*              ) || 'Solo se permiten subir archivos PDF',*/}
            {/*        },*/}
            {/*      })}*/}
            {/*      // className={`form-control ${errors.cv ? 'is-invalid' : ''}`}*/}
            {/*  />*/}
            {/*  <div className="invalid-feedback">{errors.cv?.message}</div>*/}
            {/*</div>*/}

            <div className="form-group form-check">
              <input
                  name="valorHoraDiferenciado"
                  type="checkbox"
                  {...register('valorHoraDiferenciado')}
                  className={`form-check-input ${
                      errors.valorHoraDiferenciado ? 'is-invalid' : ''
                  }`}
              />
              <label htmlFor="acceptTerms" className="form-check-label">
                Valor de hora diferenciado
              </label>
              <div className="invalid-feedback">{errors.valorHoraDiferenciado?.message}</div>
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

export default ProfesorForm
