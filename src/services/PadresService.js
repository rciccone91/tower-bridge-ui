import http from "../http-common";

class PadresService {

    getAll(params) {
        return http.get("/padres", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

}

export default new PadresService();
