import { RETRIEVE_PROFESORES } from "../actions/types";

const initialState = [];

function profesorReducer(profesores = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case RETRIEVE_PROFESORES:
            return payload;

        default:
            return profesores;
    }
};

export default profesorReducer;
