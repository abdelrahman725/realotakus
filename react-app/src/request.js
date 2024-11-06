import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default async function MakeRequest({
  path = "",
  method = "GET",
  request_data = null,
} = {}) {
  try {
    const request_options = {
      method: method,
      headers: {
        "Content-type": "application/json",
      },
    };

    if (request_data !== null) {
      request_options.body = JSON.stringify(request_data);
    }

    const response = await fetch(`${API_URL}/${path}`, request_options);

    if (response.status === 500) {
      toast.error("server error");
      return null;
    }

    const json_result = await response.json();
    console.log(json_result);

    return {
      payload: json_result,
      status_code: response.status,
    };
  } catch (error) {
    toast.error("unexpected error occurred");
    console.log(error);
    return null;
  }
}
