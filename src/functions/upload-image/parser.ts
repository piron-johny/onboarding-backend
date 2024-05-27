import { APIGatewayProxyEvent } from 'aws-lambda';
import busboy, {
  Busboy,
  BusboyEvents,
  FileInfo,
  FieldInfo,
  Info,
} from 'busboy';

interface ParsedFile {
  content: Buffer;
  filename: string;
  contentType: string;
  encoding: string;
  // fieldname: string;
}

interface ParserResult {
  files: ParsedFile[];
  [key: string]: string | ParsedFile[];
}

export const formParser = (
  event: APIGatewayProxyEvent,
  fileSize: number,
): Promise<ParserResult> =>
  new Promise((resolve, reject) => {
    const bb = busboy({
      headers: {
        'content-type':
          event.headers['content-type'] || event.headers['Content-Type'],
      },
      limits: {
        fileSize,
      },
    });

    const result: ParserResult = {
      files: [],
    };

    bb.on('file', (name, file, info) => {
      const { encoding, filename, mimeType } = info;
      const uploadFile: ParsedFile = {
        content: Buffer.from(''),
        filename,
        contentType: mimeType,
        encoding,
      };

      file.on('data', (data) => {
        uploadFile.content = Buffer.concat([uploadFile.content, data]);
      });

      file.on('end', () => {
        if (uploadFile.content.length > 0) {
          result.files.push(uploadFile);
        }
      });
    });

    bb.on('field', (fieldname, value) => {
      result[fieldname] = value;
    });

    bb.on('error', (error) => {
      reject(error);
    });

    bb.on('finish', () => {
      resolve(result);
    });

    bb.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    bb.end();
  });
