import mongoose from "mongoose";

async function connectDb(connectionString, dbName) {
  try {
    await mongoose.connect(connectionString, { dbName });

    console.log("Db connection established...");
  } catch (err) {
    console.log(`${err}:failed establish connection with db...`);
  }
}

export { connectDb };
