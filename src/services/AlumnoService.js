import http from "../http-common";
import { executeWithCatch } from "../http-common";


class AlumnoService {

    getAllAAsignar(){
        return executeWithCatch(http.get(`/alumnos/a-asignar`))
    }

    getAll(params) {
        return http.get("/alumnos", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    get(id) {
        return executeWithCatch(http.get(`/alumnos/${id}`))
    }

    create(data) {
        return executeWithCatch(http.post("/alumnos", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/alumnos/${id}`, data))
    }

    delete(id) {
        return executeWithCatch(http.delete(`/alumnos/${id}`))
    }

}

export default new AlumnoService();
