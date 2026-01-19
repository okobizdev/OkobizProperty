import Testimonial from "./testimonial.model";
import ITestimonial from "./testimonial.type";
import { Request, Response } from "express";

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonialData: ITestimonial = req.body;
    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to create testimonial" });
  }
};
export const getTestimonials = async (req: Request, res: Response) : Promise<void> =>  {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

export const featuredTestimonial = async (req: Request, res: Response) : Promise<void> =>  {
  try {
    const testimonials = await Testimonial.find({isFeatured: true});
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

export const getTestimonialById = async (req: Request, res: Response) : Promise<void> =>  {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
     res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonial" });
  }
};
export const updateTestimonial = async (req: Request, res: Response) : Promise<void> =>  {
  try {
    const testimonialData: ITestimonial = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      testimonialData,
      { new: true }
    );
    if (!testimonial) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to update testimonial" });
  }
};
export const deleteTestimonial = async (req: Request, res: Response) : Promise<void> =>  {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
};