import {
    CREATE_PROFESOR, DELETE_PROFESOR,
    RETRIEVE_PROFESORES, UPDATE_TUTORIAL
} from "./types";

import ProfesoresService from "../services/ProfesoresService";

// export const createProfesor = (nombreApellido,
//                                dni,
//                                edad,
//                                detalles,
//                                cbuCvu,
//                                experienciaPrevia,
//                                valorHoraDiferenciado,
//                                domicilio,
//                                telefono,
//                                email) => async (dispatch) => {
//     try {
//         const res = await ProfesoresService.create({ nombreApellido,
//             dni,
//             edad,
//             detalles,
//             cbuCvu,
//             experienciaPrevia,
//             valorHoraDiferenciado,
//             domicilio,
//             telefono,
//             email });
//
//         dispatch({
//             type: CREATE_PROFESOR,
//             payload: res.data,
//         });
//
//         return Promise.resolve(res.data);
//     } catch (err) {
//         return Promise.reject(err);
//     }
// };


export async function createProfesor(data) {
    try {
        console.log("estoy en createProfesor")
        const res = await ProfesoresService.create(data);

        return Promise.resolve(res);
    } catch (err) {
        return Promise.reject(err);
    }
};

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

export const updateProfesor = (id, data) => async (dispatch) => {
    try {
        const res = await ProfesoresService.update(id, data);

        dispatch({
            type: UPDATE_TUTORIAL,
            payload: data,
        });

        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteProfesor = (id) => async (dispatch) => {
    try {
      await ProfesoresService.delete(id);

      dispatch({
        type: DELETE_PROFESOR,
        payload: { id },
      });
    } catch (err) {
      console.log(err);
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
