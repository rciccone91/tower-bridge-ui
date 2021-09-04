import http from "../http-common";

class ProfesoresService {
    getAll() {
        return http.get("/profesores");
    }

    get(id) {
        return http.get(`/profesores/${id}`);
    }

    create(data) {
        return http.post("/profesores", data);
    }

    update(id, data) {
        return http.put(`/profesores/${id}`, data);
    }

    delete(id) {
        return http.delete(`/profesores/${id}`);
    }

//   deleteAll() {
//     return http.delete(`/tutorials`);
//   }

//   findByTitle(title) {
//     return http.get(`/tutorials?title=${title}`);
//   }
}

export default new ProfesoresService();
