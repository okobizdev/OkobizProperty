import { apiBaseUrl } from "@/config/config";

export const identityVerification = async (formData: FormData, accessToken: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/identity-document`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    console.log("FormData:", formData);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in verification:", error);
    throw error;
  }
};
