import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import { IContactsPayload, IGetAllContactsQuery } from './contacts.interfaces';
import ContactsServices from './contacts.services';
import mongoose from 'mongoose';
import { documentPerPage } from '../../const';
const { processCreateContactMessage, processDeleteContactMessage, processFindAllContactsMessages } =
  ContactsServices;
const ContactsControllers = {
  handleCreateContactMessage: async (req: Request, res: Response, next: NextFunction) => {
    console.log("request body: req.body", req.body);
    try {
      const payload = req.body as IContactsPayload;
      await processCreateContactMessage(payload);
      res.status(200).json({
        status: 'success',
        message: 'Message sent successful',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteContactMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid faq ID' });
        return;
      }
      const contactMessageId = new mongoose.Types.ObjectId(id);
      await processDeleteContactMessage({ contactMessageId });
      res.status(200).json({
        status: 'success',
        message: 'Message sent successful',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleFindAllContactsMessages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, search, sort } = req.query as IGetAllContactsQuery;
      const { data, total } = await processFindAllContactsMessages({
        page,
        search,
        sort,
      });
      const totalPages = Math.ceil(total / documentPerPage);
      const totalFlat = total;
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

      const buildQuery = (pageNumber: number) => {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (sort) query.set('sort', String(sort));
        if (pageNumber !== 1) query.set('page', String(pageNumber));

        const queryString = query.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
      };
      const currentPage = Number(page) || 1;
      const currentPageUrl = buildQuery(currentPage);
      const nextPageUrl = currentPage < totalPages ? buildQuery(currentPage + 1) : null;
      const previousPageUrl = currentPage > 1 ? buildQuery(currentPage - 1) : null;
      res.status(200).json({
        status: 'success',
        message: `All Contacts Message Retrieve successful`,
        totalFlat,
        totalPages,
        currentPageUrl,
        nextPageUrl,
        previousPageUrl,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default ContactsControllers;
