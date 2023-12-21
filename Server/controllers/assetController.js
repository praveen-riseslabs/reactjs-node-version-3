import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomFileName } from "../utils/randomFileName.js";
import { assetModel } from "../models/assetModel.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//aws config
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const urlExpiry = process.env.SIGNED_URL_EXPIRATION_VALUE;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const baseFolder = "assets";

class AssetController {
  //creating new assets
  static async createNewAsset(req, res) {
    try {
      const { name, type, description } = req.body;
      const files = req.files;

      if (!name || !type || type === "None" || !files.length) {
        throw new Error(
          "name, type and files are required to create a new asset"
        );
      }

      //craeting an array of filenames to genarate random filenames
      const filenames = files.map(
        (file) =>
          baseFolder +
          "/" +
          type +
          "/" +
          randomFileName() +
          "_" +
          file.originalname
      );

      //post/put object param
      await Promise.all(
        files.map(async (file, i) => {
          const putParams = {
            Bucket: bucketName,
            Key: filenames[i],
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          const command = new PutObjectCommand(putParams);
          await s3.send(command);
        })
      );

      //ssving the file into Db
      const newFile = new assetModel({
        user: req.user,
        name,
        type,
        description,
        files: filenames,
      });
      await newFile.save();

      const signedFiles = await Promise.all(
        newFile.files.map(async (file) => {
          //get object parma
          const getParams = {
            Bucket: bucketName,
            Key: file,
          };

          const getCommand = new GetObjectCommand(getParams);
          const signedUrl = await getSignedUrl(s3, getCommand, {
            expiresIn: Number(urlExpiry),
          });

          return { filename: file, url: signedUrl };
        })
      );
      newFile.populate("user", "-password -googleId -facebookId -emailToken");
      res.status(201).json({ ...newFile.toObject(), files: signedFiles });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //get all assets of the user
  static async getAllAssets(req, res) {
    try {
      const { trashed = false } = req.query;

      const assets = await assetModel
        .find({ user: req.user._id, trashed })
        .sort({ createdAt: -1 })
        .populate("user", "-password -googleId -facebookId -emailToken");

      const updatedAssets = await Promise.all(
        assets.map(async (asset) => {
          const signedFiles = await Promise.all(
            asset.files.map(async (file) => {
              //get object parma
              const getParams = {
                Bucket: bucketName,
                Key: file,
              };

              const getCommand = new GetObjectCommand(getParams);
              const signedUrl = await getSignedUrl(s3, getCommand, {
                expiresIn: Number(urlExpiry),
              });

              return { filename: file, url: signedUrl };
            })
          );
          return { ...asset.toObject(), files: signedFiles };
        })
      );
      res.status(201).json(updatedAssets);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //delete asset permanently
  static async deletePermanently(req, res) {
    try {
      const { assetId } = req.params;
      const asset = await assetModel.findById(assetId);

      if (!asset) {
        throw new Error(`Couldn't find the file`);
      }

      await Promise.all(
        asset.files.map(async (file) => {
          //delete object params
          const params = {
            Bucket: bucketName,
            Key: file,
          };
          const command = new DeleteObjectCommand(params);
          await s3.send(command);
        })
      );

      await assetModel.findByIdAndDelete(assetId);

      res.status(201).json(asset);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //put asset to trash
  static async trashAsset(req, res) {
    try {
      const { assetId } = req.params;
      const asset = await assetModel.findById(assetId);

      if (!asset) {
        throw new Error(`Couldn't find the file`);
      }

      const updatedAsset = await assetModel.findByIdAndUpdate(
        assetId,
        { $set: { trashed: true } },
        { new: true }
      );

      res.status(201).json(updatedAsset);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //restoring assets from trash
  static async restoreAsset(req, res) {
    try {
      const { assetId } = req.params;
      const asset = await assetModel.findById(assetId);

      if (!asset) {
        throw new Error(`Couldn't find the file`);
      }

      const updatedAsset = await assetModel.findByIdAndUpdate(
        assetId,
        { $set: { trashed: false } },
        { new: true }
      );

      res.status(201).json(updatedAsset);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //updating assets
  static async updateAsset(req, res) {
    try {
      const { name, type, description, id } = req.body;

      if (!name || !type || type === "None") {
        throw new Error("name, type and files are required to UPDATE asset");
      }

      //ssving the file into Db
      const newFile = await assetModel.findByIdAndUpdate(
        id,
        {
          name,
          type,
          description,
        },
        { new: true }
      );

      const signedFiles = await Promise.all(
        newFile.files.map(async (file) => {
          //get object parma
          const getParams = {
            Bucket: bucketName,
            Key: file,
          };

          const getCommand = new GetObjectCommand(getParams);
          const signedUrl = await getSignedUrl(s3, getCommand, {
            expiresIn: Number(urlExpiry),
          });

          return { filename: file, url: signedUrl };
        })
      );
      newFile.populate("user", "-password -googleId -facebookId -emailToken");
      res.status(201).json({ ...newFile.toObject(), files: signedFiles });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { AssetController };
