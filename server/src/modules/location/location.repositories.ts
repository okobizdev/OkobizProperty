import Rent from '../location/location.models';
import { ILocation } from './location.interfaces';
import Location from './location.models';


const LocationRepository = {
  createLocation: async (payload: ILocation) => {
    try {
      // Validate required fields

      const { location } = payload;
      if (!location ) {
        throw new Error('Location is required.');
      }
      // chekc if location is valid data in location collection
      const locationExists = await Location.findOne({ location });
      if (locationExists) {
        throw new Error('Location already exists.');
      }
      
     
      const locaton = new Location(payload);
      await locaton.save();
      return locaton;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while creating location .');
      }
    }
  },

  handleGetLocation: async (payload: ILocation) => {
    try {
      const { page, limit } = payload;
      const curlocationPage = page ?? 1;
      const itemsPerPage = limit ?? 10;
      const skip = (curlocationPage - 1) * itemsPerPage;

      const [data, total] = await Promise.all([
        Location.find()
          .skip(skip)
          .limit(itemsPerPage)
          // .populate('location')
          ,
        Location.countDocuments(),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching location.');
      }
    }
  },

  updateLocation: async (locationId: string, reqBody: ILocation) => {
    try {
      const location = await Location.findById(locationId);
      if (!location) {
        throw new Error('Location not found');
      }
      const updatedLocation = await Location.findByIdAndUpdate(
        locationId,
        reqBody,
        { new: true, runValidators: true }
      );
      if (!updatedLocation) {
        throw new Error('Location not found.');
      }
      return updatedLocation;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while updating location.');
      }
    }
  },

  deleteLocation: async (locationId: string) => {
    try {
      const deletedLocation = await Location.findByIdAndDelete(locationId);
      if (!deletedLocation) {
        throw new Error('Location not found.');
      }
      return deletedLocation;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while deleting location.');
      }
    }
  },

  handleGetLocationByStringSearch: async (string: string) => {
    try {
      // return await Location.find();
      const location = await Location.find({
  location: { $regex: string, $options: 'i' }
}).select('-__v -createdAt -updatedAt');
return location;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching location.');
      }
    }
  },

 
};

export default LocationRepository;
