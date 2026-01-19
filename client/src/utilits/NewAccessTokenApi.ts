import axios from "axios";
import { apiBaseUrl } from "@/config/config";

const fetchNewAccessToken = async () => {
  try {
    const res = await axios.post<{ accessToken: string }>(
      `${apiBaseUrl}/refresh`,
      {},
      { withCredentials: true }
    );

    const accessToken = res.data.accessToken;
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    throw error;
  }
};

export default fetchNewAccessToken;
