import { Permission } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  try {
    // Create Collection
    await databases.createCollection(
      db,
      questionCollection,
      questionCollection,
      [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
      ],
    );

    console.log("✅ Question Collection Created");

    // Create Attributes
    await Promise.all([
      databases.createStringAttribute(
        db,
        questionCollection,
        "title",
        100,
        true,
      ),

      databases.createStringAttribute(
        db,
        questionCollection,
        "content",
        10000,
        true,
      ),

      databases.createStringAttribute(
        db,
        questionCollection,
        "authorId",
        50,
        true,
      ),

      // tags (String[])
      databases.createStringAttribute(
        db,
        questionCollection,
        "tags",
        50,
        true,
        undefined,
        true,
      ),

      databases.createStringAttribute(
        db,
        questionCollection,
        "attachmentId",
        50,
        false,
      ),
    ]);

    console.log("✅ Question Attributes Created");

    console.log(`
====================================================
Create these indexes manually in Appwrite Console

Collection: questions

1. Key: title
   Type: Fulltext
   Attribute: title
   Order: ASC

2. Key: content
   Type: Fulltext
   Attribute: content
   Order: ASC
====================================================
`);
  } catch (error) {
    console.error("❌ Error creating Question Collection:", error);
  }
}
