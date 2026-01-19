"use server";
import { apiBaseUrl } from "@/config/config";

export const getProfileWork = async (accessToken: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/work`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("profile datta == ", data);
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getProfileLocation = async (accessToken: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/location`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getProfileLanguage = async (accessToken: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/language`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getProfileBio = async (accessToken: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/bio`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getProfileAvatar = async (accessToken: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/avatar`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfileWork = async (
  token: string,
  data: { worksAt: string }
) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/work`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating work:", error);
    throw error;
  }
};

export const updateProfileLocation = async (
  token: string,
  data: { location: string }
) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/location`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

export const updateProfileLanguage = async (
  token: string,
  data: { languages: string[] }
) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/language`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating language:", error);
    throw error;
  }
};

export const updateProfileBio = async (
  token: string,
  data: { bio: string }
) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/bio`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating bio:", error);
    throw error;
  }
};

export const updateProfileAvatar = async (
  token: string,
  formData: FormData
) => {
  try {
    const res = await fetch(`${apiBaseUrl}/profile/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};
