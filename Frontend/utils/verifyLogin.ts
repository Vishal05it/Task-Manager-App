import { baseURL } from "./baseURL";
export const verifyLogin = async () => {
  try {
    let response = await fetch(`${baseURL}/verifylogin/api/verify`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let verifyData = await response.json();
    // console.log(verifyData);
    if (verifyData.success) return true;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
