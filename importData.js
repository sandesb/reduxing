import 'dotenv/config';
import { ConvexHttpClient } from 'convex/browser';
import data from './db.json' assert { type: 'json' };

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function importData() {
  for (const course of data.courses) {
    await client.mutation('insertCourse', course);
  }
  console.log('Data imported successfully!');
}

importData().catch(console.error);
