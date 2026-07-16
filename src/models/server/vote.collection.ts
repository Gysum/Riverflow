import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
  try {
    // Create Collection
    await databases.createCollection(db, voteCollection, voteCollection, [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);

    console.log("✅ Vote Collection Created");

    // Create Attributes
    await Promise.all([
      databases.createEnumAttribute(
        db,
        voteCollection,
        "type",
        ["question", "answer"],
        true,
      ),

      databases.createStringAttribute(db, voteCollection, "typeId", 50, true),

      databases.createEnumAttribute(
        db,
        voteCollection,
        "voteStatus",
        ["upvoted", "downvoted"],
        true,
      ),

      databases.createStringAttribute(
        db,
        voteCollection,
        "votedById",
        50,
        true,
      ),
    ]);

    console.log("✅ Vote Attributes Created");

    console.log(`
====================================================
Create these indexes manually in Appwrite Console

Collection: votes

1. Key: type
   Type: Key
   Attribute: type
   Order: ASC

2. Key: typeId
   Type: Key
   Attribute: typeId
   Order: ASC

3. Key: votedById
   Type: Key
   Attribute: votedById
   Order: ASC
====================================================
`);
  } catch (error) {
    console.error("❌ Error creating Vote Collection:", error);
  }
}
