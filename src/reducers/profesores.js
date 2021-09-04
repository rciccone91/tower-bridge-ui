import {
    CREATE_PROFESOR,
    RETRIEVE_PROFESORES,
    UPDATE_PROFESOR,
    DELETE_PROFESOR,
    DELETE_ALL_PROFESORES,
} from "../actions/types";

const initialState = [];

function profesorReducer(profesores = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case CREATE_PROFESOR:
            return [...profesores, payload];

        case RETRIEVE_PROFESORES:
            return payload;

        case UPDATE_PROFESOR:
            return profesores.map((profesor) => {
                if (profesor.id === payload.id) {
                    return {
                        ...profesor,
                        ...payload,
                    };
                } else {
                    return profesor;
                }
            });

        case DELETE_PROFESOR:
            return profesores.filter(({ id }) => id !== payload.id);

        case DELETE_ALL_PROFESORES:
            return [];

        default:
            return profesores;
    }
};

export default profesorReducer;
