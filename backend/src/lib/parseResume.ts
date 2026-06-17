import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const parseResumeBuffer = async (buffer: Buffer, fileType: string): Promise<string> => {
  const normalizedType = fileType.toLowerCase();
  
  if (normalizedType === 'pdf' || normalizedType === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    normalizedType === 'docx' || 
    normalizedType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    normalizedType === 'doc' ||
    normalizedType === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error(`Unsupported file type for parsing: ${fileType}`);
  }
};

export default {
  parseResumeBuffer
};
