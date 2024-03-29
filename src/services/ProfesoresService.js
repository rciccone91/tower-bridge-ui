import http from "../http-common";
import { executeWithCatch } from "../http-common";

class ProfesoresService {

    getAll(params) {
        return http.get("/profesores",{ params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    get(id) {
        return executeWithCatch(http.get(`/profesores/${id}`))
    }

    getAllAAsignar() {
        return executeWithCatch(http.get(`/profesores/a-asignar`))
    }

    create(data) {
        return executeWithCatch(http.post("/profesores", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/profesores/${id}`, data))
    }

    delete(id) {
        return executeWithCatch(http.delete(`/profesores/${id}`))
    }

//   findByTitle(title) {
//     return http.get(`/tutorials?title=${title}`);
//   }
}

export default new ProfesoresService();
