import { mapModel } from "../models/mapModel.js";

class MapController {
  //posting new coords
  static async sendCoords(req, res) {
    try {
      const { latitude, longitude } = req.body;
      const today = new Date();

      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
      const day = today.getDate().toString().padStart(2, "0");

      const date = `${year}-${month}-${day}`;

      const updatedDoc = await mapModel.findOneAndUpdate(
        {
          date,
          user: req.user._id,
        },
        { $addToSet: { points: { latitude, longitude } } },
        { upsert: true, new: true }
      );

      res.status(201).json(updatedDoc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  //fetching coords
  static async fetchCoords(req, res) {
    try {
      const { date } = req.query;

      const doc = await mapModel.findOne({
        date,
        user: req.user._id,
      });

      if (!doc) {
        throw new Error("Cannot find history for that date");
      }

      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export { MapController };
