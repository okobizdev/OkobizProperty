import axiosClient from "@/lib/axios.config";

const ListingImageApis = {
  uploadImage: (featureType: string, listingId: string, formData: FormData) => {
    return axiosClient.patch(
      `/host/${featureType}/image/${listingId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  deleteImage: (
    featureType: string,
    listingId: string,
    body: { imageUrl: string; images: string[] }
  ) =>
    axiosClient.delete(`/host/${featureType}/image/${listingId}`, {
      data: body,
    } as any),
};

export default ListingImageApis;
