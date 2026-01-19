import { Request, Response } from "express";
import CompanyContacts from "./contacts.models";

export const getCompanyContacts = async (req: Request, res: Response) => {
    try {
        const contacts = await CompanyContacts.findOne();
        if (!contacts) {
            res.status(404).json({
                success: false,
                message: "Company contacts not found"
            });
            return
        }
        res.status(200).json({
            success: true,
            message: "Company contacts retrieved successfully",
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve company contacts",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const createCompanyContacts = async (req: Request, res: Response) => {
    try {
        const { mobile, whatsapp, email, address } = req.body;

        const contacts = new CompanyContacts({
            mobile,
            whatsapp,
            email,
            address,

        });

        await contacts.save();

        res.status(201).json({
            success: true,
            message: "Company contacts created successfully",
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create company contacts",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const updateCompanyContacts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const contacts = await CompanyContacts.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!contacts) {
            res.status(404).json({
                success: false,
                message: "Company contacts not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Company contacts updated successfully",
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update company contacts",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
export const deleteCompanyContacts = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const contacts = await CompanyContacts.findByIdAndDelete(id);
        if (!contacts) {
            res.status(404).json({
                success: false,
                message: "Company contacts not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Company contacts deleted successfully",
            data: contacts
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete company contacts",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
