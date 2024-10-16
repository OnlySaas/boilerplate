import mongoose, { Connection } from "mongoose";

let cachedMongoConn: Promise<typeof mongoose> | null = null;

export default function connectDatabase(): Promise<typeof mongoose> {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;

    mongoose.connection
      .on("error", (error: Error) => {
        console.error("Error: connection to DB failed");
        reject(error);
      })
      .on("close", () => {
        console.error("Error: Connection to DB lost");
        process.exit(1);
      })
      .once("open", () => {
        const infos: Connection[] = mongoose.connections;

        infos.forEach((info) => {
          console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
        });

        resolve(cachedMongoConn!);
      });

    const mongoUri = process.env.MONGODB_URI as string;
    if (!cachedMongoConn) {
      cachedMongoConn = mongoose.connect(mongoUri, {
        connectTimeoutMS: 10000,
        bufferCommands: false,
      });
    } else {
      console.log("MongoDB: using cached database instance");
      resolve(cachedMongoConn);
    }
  });
}
