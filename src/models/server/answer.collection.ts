import { Permission } from "node-appwrite";
import { answerCollection, db } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  try {
    // Create Collection
    await databases.createCollection(db, answerCollection, answerCollection, [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);

    console.log("✅ Answer collection created successfully");

    // Create Attributes
    await Promise.all([
      databases.createStringAttribute(
        db,
        answerCollection,
        "content",
        10000,
        true,
      ),

      databases.createStringAttribute(
        db,
        answerCollection,
        "questionId",
        50,
        true,
      ),

      databases.createStringAttribute(
        db,
        answerCollection,
        "authorId",
        50,
        true,
      ),
    ]);

    console.log("✅ Answer attributes created successfully");

    console.log(`
====================================================
Create these indexes manually in Appwrite Console

Collection: answers

1. Key: questionId
   Type: Key
   Attribute: questionId
   Order: ASC

2. Key: authorId
   Type: Key
   Attribute: authorId
   Order: ASC
====================================================
`);
  } catch (error) {
    console.error("❌ Error creating Answer collection:", error);
  }
}
