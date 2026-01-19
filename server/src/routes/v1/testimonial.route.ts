import { Router } from "express";
import {
    createTestimonial,
    getTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    featuredTestimonial
} from "../../modules/testimonial/testimonial.controller";

const router = Router();

router.post("/", createTestimonial);
router.get("/", getTestimonials);
router.get("/featured", featuredTestimonial)
router.get("/:id", getTestimonialById);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router; 