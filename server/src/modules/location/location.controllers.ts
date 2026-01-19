import { Request, Response, NextFunction } from 'express';
import logger from '../../configs/logger.configs';
import LocationService from './location.services';


const LocationController = {
  handleCreateLocation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = { ...req.body };
      console.log('Location Data:', payload); // Debugging line to check location data
      const location = await LocationService.createLocation(payload);
      res.status(201).json({
        status: 'success',
        message: 'location create successfully',
        data: location,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleGetLocation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10
      }
      console.log('Fetching Rent Locations with Payload:', payload); // Debugging line to check payload
      const { data, total } = await LocationService.handleGetLocation(payload as any);
      res.status(200).json({
        status: 'success',
        message: `All location retrieved successfully`,
        totalContacts: total,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleUpdateLocation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locationId = req.params.id;
      const payload = { ...req.body };
      console.log('Updating Rent Location ID:', locationId, 'with Payload:', payload); // Debugging line to check update data
      const updatedLocation = await LocationService.updateLocation(locationId, payload);
      res.status(200).json({
        status: 'success',
        message: 'Rent location updated successfully',
        data: updatedLocation,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleDeleteLocation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locationId = req.params.id;
      console.log('Deleting Rent Location ID:', locationId); // Debugging line to check location ID
      const deletedLocation = await LocationService.deleteLocation(locationId);
      res.status(200).json({
        status: 'success',
        message: 'Rent location deleted successfully',
        data: deletedLocation,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },

  handleGetLocationByStringSearch: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const location = await LocationService.handleGetLocationByStringSearch(req.params.string);

      res.status(200).json({
        status: 'success',
        message: 'Rent location fetched successfully',
        data: location,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(err);
    }
  },



};

export default LocationController;
