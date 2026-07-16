import { Permission } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  try {
    // Create Collection
    await databases.createCollection(db, commentCollection, commentCollection, [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);

    console.log("✅ Comment Collection Created");

    // Create Attributes
    await Promise.all([
      databases.createStringAttribute(
        db,
        commentCollection,
        "content",
        10000,
        true,
      ),

      databases.createEnumAttribute(
        db,
        commentCollection,
        "type",
        ["answer", "question"],
        true,
      ),

      databases.createStringAttribute(
        db,
        commentCollection,
        "typeId",
        50,
        true,
      ),

      databases.createStringAttribute(
        db,
        commentCollection,
        "authorId",
        50,
        true,
      ),
    ]);

    console.log("✅ Comment Attributes Created");

    console.log(`
====================================================
Create these indexes manually in Appwrite Console

Collection: comments

1. Key: type
   Type: Key
   Attribute: type
   Order: ASC

2. Key: typeId
   Type: Key
   Attribute: typeId
   Order: ASC

3. Key: authorId
   Type: Key
   Attribute: authorId
   Order: ASC
====================================================
`);
  } catch (error) {
    console.error("❌ Error creating Comment Collection:", error);
  }
}
