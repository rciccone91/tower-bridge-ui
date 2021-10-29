import { RETRIEVE_PROFESORES } from "./types";

import ProfesoresService from "../services/ProfesoresService";
import {handleError} from "../http-common";
import config from "../config";

export async function getProfesores(params) {
    try {
        console.log("estoy en getProfesores")
        const res = await ProfesoresService.getAll(params);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}


export async function createProfesor(data) {
    try {
        console.log("estoy en createProfesor")
        const res = await ProfesoresService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function updateProfesor(id,data) {
    try {
        console.log("estoy en updateProfesor")
        const res = await ProfesoresService.update(id,data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}

export const retrieveProfesores = () => async (dispatch) => {
    try {
        const res = await ProfesoresService.getAll().catch(err => {
            console.log(err)
            handleError(err,`${config.appDns}/profesores`,"Hubo un error al buscar los datos de los profesores")
        });
        dispatch({
            type: RETRIEVE_PROFESORES,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
    }
};

export async function deleteProfesor(id){
    try {
        console.log("estoy en deleteProfesor")
        const res = await ProfesoresService.delete(id);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
}
