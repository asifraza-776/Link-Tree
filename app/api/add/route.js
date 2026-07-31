

import clientPromise from "@/lib/mongodb";

// ✅ CREATE (already correct)
export async function POST(request) {
  const body = await request.json();

  const client = await clientPromise;
  const db = client.db("bittree");
  const collection = db.collection("links");

  // handle uniqueness check
  const doc = await collection.findOne({ handle: body.handle });

  if (doc) {
    return Response.json({
      success: false,
      error: true,
      message: "This Bittree already exists!",
    });
  }

  const result = await collection.insertOne(body);

  return Response.json({
    success: true,
    error: false,
    message: "Your Bittree has been generated!",
    result,
  });
}

import { ObjectId } from "mongodb";

export async function PUT(request) {
  const body = await request.json();

  const client = await clientPromise;
  const db = client.db("bittree");
  const collection = db.collection("links");

  await collection.updateOne(
    { _id: new ObjectId(body.id) },
    {
      $set: {
        links: body.links,
        pic: body.pic,
        desc: body.desc,
      },
    }
  );

  return Response.json({
    success: true,
    message: "Bittree updated successfully",
  });
}


// ✅ READ (THIS FIXES RELOAD ISSUE)
export async function GET() {
  const client = await clientPromise;
  const db = client.db("bittree");
  const collection = db.collection("links");

  const data = await collection.find({}).toArray();

  return Response.json(data);
}

// ✅ DELETE (for delete icon)
export async function DELETE(request) {
  const body = await request.json();

  const client = await clientPromise;
  const db = client.db("bittree");
  const collection = db.collection("links");

  await collection.deleteOne({ handle: body.handle });

  return Response.json({ success: true });
}
