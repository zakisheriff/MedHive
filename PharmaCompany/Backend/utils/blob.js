import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

dotenv.config(); // Ensure env variables are loaded

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

export const containerClient = blobServiceClient.getContainerClient("pharma-certificates");
