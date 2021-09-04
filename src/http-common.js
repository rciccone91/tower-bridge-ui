import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/api",
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

