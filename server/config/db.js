import mongoose from 'mongoose';

async function connectDb() {
  const dbUrl = process.env.MONGO_URI;
  try {
    const db = await mongoose.connect(`${dbUrl}/shikshasetu_db`);

    if (db.STATES.connected === 1) {
      console.log('Connected To:-> ' + db.connection.name);
      console.log('Connected AT PORT:-> ' + db.connection.port);
    }

    return db;
  } catch (err) {
    console.error('Failed to connect to DB: ->', err);
    throw err;
  }
}

export default connectDb;
