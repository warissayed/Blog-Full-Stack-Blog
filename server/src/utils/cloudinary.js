import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // File has been uploaded successfully
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the local save temp file as its fail
    console.log("Error uploading file on Cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary };
