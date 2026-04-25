// lib/utils/adobe.js
import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExportPDFJob,
  ExportPDFParams,
  ExportPDFTargetFormat,
  ExportPDFResult
} from "@adobe/pdfservices-node-sdk";
import { Readable } from 'stream';

/**
 * Converts a PDF buffer to a DOCX buffer using Adobe PDF Services Export operation.
 * @param {Buffer} pdfBuffer - The buffer of the PDF to convert.
 * @returns {Promise<Buffer>} - The buffer of the generated DOCX file.
 */
export async function convertPdfToDocx(pdfBuffer) {
  const clientId = process.env.ADOBE_CLIENT_ID;
  const clientSecret = process.env.ADOBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Adobe credentials missing (ADOBE_CLIENT_ID or ADOBE_CLIENT_SECRET)');
  }

  try {
    // 1. Initialize credentials
    const credentials = new ServicePrincipalCredentials({
      clientId,
      clientSecret
    });

    const pdfServices = new PDFServices({ credentials });

    // 2. Upload source file (using buffer converted to stream)
    const readStream = Readable.from(pdfBuffer);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF
    });

    // 3. Create job parameters for DOCX export
    const params = new ExportPDFParams({
      targetFormat: ExportPDFTargetFormat.DOCX
    });

    // 4. Create and submit the job
    const job = new ExportPDFJob({ inputAsset, params });
    const pollingURL = await pdfServices.submit({ job });

    // 5. Get the result
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExportPDFResult
    });

    if (pdfServicesResponse.status === 'failed') {
      throw new Error(`Adobe Export job failed: ${JSON.stringify(pdfServicesResponse.error)}`);
    }

    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    // 6. Convert result stream back to buffer
    const chunks = [];
    for await (const chunk of streamAsset.readStream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('[Adobe Service] Error:', error.message);
    throw error;
  }
}
