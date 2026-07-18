import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
  try {
    // Check if bucket already exists
    await storage.getBucket(questionAttachmentBucket);

    console.log("✅ Storage Connected");
  } catch (error) {
    try {
      // Create bucket
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false, // File Security
        undefined, // Enabled
        undefined, // Maximum File Size
        ["jpg", "jpeg", "png", "gif", "heic", "webp"], // Allowed Extensions
      );

      console.log("✅ Storage Bucket Created");
      console.log("✅ Storage Connected");
    } catch (err) {
      console.error("❌ Error creating storage bucket:", err);
    }
  }
}
