import http from "../http-common";

class ProfesoresService {

    executeWithCatch(request){
        return request.catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getAll() {
        return http.get("/profesores").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    get(id) {
        return this.executeWithCatch(http.get(`/profesores/${id}`))
    }

    create(data) {
        return this.executeWithCatch(http.post("/profesores", data))
    }

    update(id, data) {
        return this.executeWithCatch(http.patch(`/profesores/${id}`, data))
    }

    delete(id) {
        return this.executeWithCatch(http.delete(`/profesores/${id}`))
    }

//   findByTitle(title) {
//     return http.get(`/tutorials?title=${title}`);
//   }
}

export default new ProfesoresService();
