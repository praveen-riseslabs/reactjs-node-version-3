import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomFileName } from "../utils/randomFileName.js";
import { fileModel } from "../models/fileModel.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//aws config
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

class FileController {
  //uploading a file
  static async uploadFile(req, res) {
    try {
      const filename = randomFileName() + "_" + req.file.originalname;
      //put/post object to params
      const params = {
        Bucket: bucketName,
        Key: filename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(params);

      await s3.send(command);

      const newFile = new fileModel({ filename });

      await newFile.save();

      res.status(201).json(newFile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //retriveing all files
  static async getFiles(req, res) {
    try {
      const files = await fileModel.find().sort({ createdAt: -1 });

      const updatedFiles = await Promise.all(
        files.map(async (file) => {

            //get object parma
          const params = {
            Bucket: bucketName,
            Key: file.filename,
          };

          const command = new GetObjectCommand(params);
          const signedUrl = await getSignedUrl(s3, command, {
            expiresIn: Number(process.env.SIGNED_URL_EXPIRATION_VALUE),
          });

          return { ...file.toObject(), fileUrl: signedUrl };
        })
      );

      res.status(200).json(updatedFiles);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //deleting a file
  static async deleteFile(req, res) {
    try {
      const { id } = req.params;

      const file = await fileModel.findById(id);

      if (!file) {
        throw new Error(`Couldn't find the file`);
      }

      //delete object params
      const params = {
        Bucket: bucketName,
        Key: file.filename,
      };
      const command = new DeleteObjectCommand(params);
      await s3.send(command);

      await fileModel.findByIdAndDelete(id);

      res.status(200).json(file);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { FileController };
