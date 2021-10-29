import React, { useEffect } from "react";
import {createUsuario, updateUsuario} from "../../actions/usuarios";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {handleError, handleResponse} from "../../http-common";
import config from "../../config"
import UsuariosService from "../../services/UsuariosService";
import swal from '@sweetalert/with-react';


const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('El usuario es requerido')
        .matches('^(?!\\s*$).+',{message: 'El usuario no puede estar vacío'}),
    password: Yup.string()
        .required('El password es requerido')
        .matches('^(?!\\s*$).+',{message: 'El password no puede estar vacío'}),
    perfil: Yup.string()
        .required('El perfil es requerido')
        .matches('^(?!\\s*$).+',{message: 'El perfil no puede estar vacío'}),

});

const navigateUsuarios = `${config.appDns}/usuarios`

function UsuarioForm(props){

    const id = props && props.props ? props.props.params.id : undefined

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            username:"",
            password:"",
            perfil: undefined
        }});

    useEffect(() => {
        if(id){
            UsuariosService.get(id).then(
                res =>  {
                    reset(res.data)
                }).catch(err => {
                console.log(err)
                swal({
                    title: "Error",
                    text: 'Un error ocurrió al buscar el usuario requerido. Por favor verificá que el mismo exista o contacta al administrador.',
                    icon: "error",
                    button: "OK"
                }).then(() => {
                    window.location = navigateUsuarios
                })
            });
        }
    },[id,reset])


    const onSubmit = (data) => {
        if(id){
            updateUsuario(id,data).then((response) => {
                handleResponse(200,response,navigateUsuarios, "El usuario fue correctamente actualizado.")
            }).catch(err => {
                console.log(err)
                handleError(err,navigateUsuarios,"Hubo un error al actualizar el usuario")
            })
        } else {
            createUsuario(data).then((response) => {
                handleResponse(201,response,navigateUsuarios, "El usuario fue correctamente dado de alta.")
            }).catch(err => {
                console.log(err)
                handleError(err,navigateUsuarios,"Hubo un error al agregar el usuario")
            })
        }
    };

    return (
        <div className="register-form">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        name="username"
                        type="text"
                        {...register('username')}
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        {...register('password')}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <div className="form-group">
                    <label>Perfil</label>
                    <select
                        name="perfil"
                        {...register('perfil')}
                        className={`form-control ${errors.perfil ? 'is-invalid' : ''}`}>
                        <option value="ADMIN">Admin</option>
                        <option value="PROFESOR">Prosfesor</option>
                        <option value="ALUMNO">Alumno</option>
                    </select>
                    <div className="invalid-feedback">{errors.perfil?.message}</div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                </div>
            </form>
        </div>);
}

export default UsuarioForm
