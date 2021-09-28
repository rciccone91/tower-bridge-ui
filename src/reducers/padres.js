import { RETRIEVE_PADRES } from "../actions/types";

const initialState = [];

function padreReducer(padres = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case RETRIEVE_PADRES:
            return payload;
        default:
            return padres;
    }
}

export default padreReducer;
