import {
    CREATE_PROFESOR, DELETE_PROFESOR,
    RETRIEVE_PROFESORES, UPDATE_TUTORIAL, SELECT_PROFESOR
} from "./types";

import ProfesoresService from "../services/ProfesoresService";

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
        const res = await ProfesoresService.getAll();
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
};

//   export const deleteAllTutorials = () => async (dispatch) => {
//     try {
//       const res = await TutorialDataService.deleteAll();

//       dispatch({
//         type: DELETE_ALL_TUTORIALS,
//         payload: res.data,
//       });

//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   };

//   export const findTutorialsByTitle = (title) => async (dispatch) => {
//     try {
//       const res = await TutorialDataService.findByTitle(title);

//       dispatch({
//         type: RETRIEVE_TUTORIALS,
//         payload: res.data,
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };
