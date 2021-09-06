import axios from "axios";
import config from "./config"


export default axios.create({
  baseURL: `${config.serviceEndpoint}/api`,
  headers: {
    "Content-type": "application/json"
  }
});

export function handleResponse(expectedStatusCode,response,navigate,errorMsg)
{
  if (response.status !== expectedStatusCode) {
    alert(errorMsg+". Detalles: "+response.statusText+". "+response.data)
  } else {
    window.location = navigate
  }
}

