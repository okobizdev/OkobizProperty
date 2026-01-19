import { Request, Response } from "express";
import { AboutUs } from "./aboutUs.model";
import fs from "fs";
import path from "path";

interface ParsedPayload {
  companyOverview?: any;
  ceoSpeech?: any;
  services?: any[];
  [key: string]: any;
}

// Helper function to delete old image file
const deleteOldImage = (imagePath: string): void => {
  if (imagePath && typeof imagePath === 'string') {
    try {
      const fullPath = path.resolve(imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      } else {
      }
    } catch (error) {
      console.error(`❌ Failed to delete old image ${imagePath}:`, error);
    }
  }
};

export const upsertAboutUs = async (req: Request, res: Response): Promise<void> => {
  try {
    
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((file, index) => {
        });
      } else {
        Object.keys(req.files).forEach(key => {
          const fileArray = (req.files as any)[key];
          fileArray.forEach((file: any, index: number) => {
          });
        });
      }
    } else {
      console.log("📁 No files received");
    }
    
    const payload: any = req.body || {};
    
    // Handle files - could be array format or object format
    let files: { [key: string]: Express.Multer.File[] } = {};
    
    if (Array.isArray(req.files)) {
      (req.files as Express.Multer.File[]).forEach(file => {
        const fieldName = file.fieldname;
        if (!files[fieldName]) files[fieldName] = [];
        files[fieldName].push(file);
      });
    } else if (req.files) {
      files = req.files as { [key: string]: Express.Multer.File[] };
    }

    // Parse JSON strings if they exist
    const parsedPayload: ParsedPayload = { ...payload };
    try {
      if (typeof payload.companyOverview === 'string') {
        parsedPayload.companyOverview = JSON.parse(payload.companyOverview);
      }
      if (typeof payload.ceoSpeech === 'string') {
        parsedPayload.ceoSpeech = JSON.parse(payload.ceoSpeech);
      }
      if (typeof payload.services === 'string') {
        parsedPayload.services = JSON.parse(payload.services);
      }
    } catch (parseError) {
      console.log("❌ JSON parse error:", parseError);
    }

    // Find existing document
    let aboutUs = await AboutUs.findOne();
    const isUpdate: boolean = !!aboutUs;
    if (!aboutUs) {
      aboutUs = new AboutUs();
    } else {
        console.log("♻️  Updating existing AboutUs document");
    }
    if (parsedPayload.companyOverview || files.backgroundImage) {
      const existingCompanyOverview = aboutUs.companyOverview && typeof aboutUs.companyOverview === 'object' && 'toObject' in aboutUs.companyOverview
        ? (aboutUs.companyOverview as any).toObject()
        : aboutUs.companyOverview || {};

      aboutUs.companyOverview = {
        ...existingCompanyOverview,
        ...(parsedPayload.companyOverview || {}),
      };
      
      if (files.backgroundImage?.[0]?.path) {
        if (existingCompanyOverview.backgroundImage) {
          deleteOldImage(existingCompanyOverview.backgroundImage);
        }
        const newPath = files.backgroundImage[0].path.replace(/\\/g, '/');
        if (aboutUs.companyOverview) {
          aboutUs.companyOverview.backgroundImage = newPath;
        }
      }
    }
    if (parsedPayload.ceoSpeech || files.ceoImage) {
      const existingCeoSpeech = aboutUs.ceoSpeech && typeof aboutUs.ceoSpeech === 'object' && 'toObject' in aboutUs.ceoSpeech
        ? (aboutUs.ceoSpeech as any).toObject()
        : aboutUs.ceoSpeech || {};

      aboutUs.ceoSpeech = {
        ...existingCeoSpeech,
        ...(parsedPayload.ceoSpeech || {}),
      };
      
      if (files.ceoImage?.[0]?.path) {
        if (existingCeoSpeech.ceoImage) {
          deleteOldImage(existingCeoSpeech.ceoImage);
        }
        const newPath = files.ceoImage[0].path.replace(/\\/g, '/');
        if (aboutUs.ceoSpeech) {
          aboutUs.ceoSpeech.ceoImage = newPath;
        }
      }
    }

    if (parsedPayload.services && Array.isArray(parsedPayload.services)) {
      
      aboutUs.services = parsedPayload.services.map((service: any, i: number) => {
        
        const existingService = aboutUs.services?.[i] && typeof aboutUs.services[i] === 'object' && 'toObject' in aboutUs.services[i]
          ? (aboutUs.services[i] as any).toObject()
          : aboutUs.services?.[i] || {};
        
        const updatedService: any = {
          ...existingService,
          ...service,
        };

        // Look for service image files with different possible field names
        const possibleFieldNames = [
          `services[${i}]`,           // services[0], services[1], etc.
          `services.${i}`,            // services.0, services.1, etc.
          `service${i}`,              // service0, service1, etc.
          `serviceImage${i}`,         // serviceImage0, serviceImage1, etc.
          `service_${i}`,             // service_0, service_1, etc.
        ];

        let serviceFile: Express.Multer.File | null = null;
        let foundFieldName = '';
        for (const fieldName of possibleFieldNames) {
          if (files[fieldName]?.[0]) {
            serviceFile = files[fieldName][0];
            foundFieldName = fieldName;
            break;
          }
        }

        if (serviceFile) {
          
          if (existingService.image) {
            deleteOldImage(existingService.image);
          }
          
          const newPath = serviceFile.path.replace(/\\/g, '/');
          updatedService.image = newPath;
        } else {
          console.log(`    ⚠️  No image file found for service ${i}`);
        }

        return updatedService;
      });
    }

    const saved = await aboutUs.save();

    res.status(200).json({
      success: true,
      message: isUpdate ? "AboutUs updated successfully" : "AboutUs created successfully",
      data: saved,
    });
    
  } catch (error) {
    console.error("\n❌ ABOUTUS ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getAboutUs = async (req: Request, res: Response): Promise<void> => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      res.status(404).json({ success: false, message: "AboutUs not found" });
      return;
    }
    res.status(200).json({ success: true, data: aboutUs });
  }
  catch (error) { 
    console.error("\n❌ GET ABOUTUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
