const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

async function uploadToAzure(filePath, originalName, patientId = "unknown") {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient.createIfNotExists({ access: 'blob' });

    const cleanFileName = originalName
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');

    const blobName = `patients/${patientId}/prescriptions/${Date.now()}_${cleanFileName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(filePath);

    return blockBlobClient.url;
}

module.exports = { uploadToAzure };