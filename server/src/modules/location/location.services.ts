import { ILocation, LocationStatus } from './location.interfaces';
import LocationRepository from './location.repositories';

const LocationService = {
  createLocation: async (payload: ILocation) => {
    try {
      return await LocationRepository.createLocation(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Create Rent Location Service');
    }
  },

  handleGetLocation: async (payload: ILocation) => {
    try {
      
      return await LocationRepository.handleGetLocation(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get All Rent Locations Service');
    }
  },

  updateLocation: async (locationId: string, reqBody: ILocation) => {
    try {
      return await LocationRepository.updateLocation(locationId, reqBody);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Update Rent Location Service');
    }
  },
  deleteLocation: async (locationId: string) => {
    try {
      return await LocationRepository.deleteLocation(locationId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Delete Rent Location Service');
    }
  },

  handleGetLocationByStringSearch: async (string: string) => {
    try {
      return await LocationRepository.handleGetLocationByStringSearch(string);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Rent Location By ID Service');
    }
  },

  
};

export default LocationService;
