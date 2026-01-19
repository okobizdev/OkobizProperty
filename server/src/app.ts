import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { morganMessageFormat, streamConfig } from './configs/morgan.configs';
import corsConfiguration from './configs/cors.configs';
import { baseUrl } from './const';
import { globalErrorMiddleware } from './middlewares/globalError.middleware';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(multer().none());
app.use(cookieParser());
app.use(cors(corsConfiguration));
app.use(express.static('public'));
app.use('/api/v1/uploads', express.static('uploads'));
app.use('/api/v1/public', express.static('public'));


app.use(
  morgan(morganMessageFormat, {
    stream: {
      write: (message: string) => streamConfig(message),
    },
  })
);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server Is Running' });
});

import {
  ProfileRoutes,
  UserRoutes,
  Team,
  Location,
  Contacts,
  WhyChooseUs,
  MissionRoutes,
  VissionRoutes,
  Partner,
  Banner,
  ContactInfo,
  BlogRoutes,
  HostingGuideRoutes,
} from './routes/v1';

app.use(baseUrl.v1, UserRoutes);
app.use(baseUrl.v1, ProfileRoutes);
app.use(baseUrl.v1, Contacts);
app.use(baseUrl.v1, MissionRoutes);
app.use(baseUrl.v1, VissionRoutes);
app.use(baseUrl.v1, WhyChooseUs);
app.use(baseUrl.v1, Partner);
app.use(baseUrl.v1, Banner);
app.use(baseUrl.v1, Location);
app.use(baseUrl.v1, Team);
app.use(baseUrl.v1, BlogRoutes);
app.use(baseUrl.v1, HostingGuideRoutes);

// Import and mount new module routers
import amenitiesConfigRoutes from './modules/amenities/amenitiesConfig.routes';
import amenitiesRoutes from './modules/amenities/amenities.routes';
import subcategoryRoutes from './routes/v1/subcategory.routes';
import propertyRoutes from './routes/v1/property.routes';
import propertyFiltersRoutes from './modules/filter/property.filters.routes';
import categoryRoutes from './routes/v1/category.route';
import bookingsRoutes from './routes/v1/booking.routes.v2';
import earningRoutes from './modules/earnings/earnings.routes';
import paymentRoutes from './routes/v1/payment.routes';
import testimonialRoutes from './routes/v1/testimonial.route';
import aboutUsRoutes from './modules/aboutUs_v2/aboutUs.routes'

app.use(baseUrl.v1 + '/amenities-config', amenitiesConfigRoutes);
app.use(baseUrl.v1 + '/amenities', amenitiesRoutes);
app.use(baseUrl.v1 + '/subcategories', subcategoryRoutes);
app.use(baseUrl.v1 + '/properties', propertyRoutes);
app.use(baseUrl.v1 + '/property-filters', propertyFiltersRoutes);
app.use(baseUrl.v1 + '/categories', categoryRoutes);
app.use(baseUrl.v1 + '/bookings', bookingsRoutes);
app.use(baseUrl.v1 + '/earnings', earningRoutes);
app.use(baseUrl.v1 + '/contactinfo', ContactInfo);
app.use(baseUrl.v1 + '/payments', paymentRoutes);
app.use(baseUrl.v1 + '/testimonials', testimonialRoutes);
app.use(baseUrl.v1 + '/about-us', aboutUsRoutes);

app.use(globalErrorMiddleware);

export default app;
