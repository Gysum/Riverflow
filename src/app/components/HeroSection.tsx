import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases } from "@/models/server/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import { storage } from "@/models/server/config";
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
  const questions = await databases.listDocuments(db, questionCollection, [
    Query.orderDesc("$createdAt"),
    Query.limit(15),
  ]);

  return (
    <HeroParallax
      header={<HeroSectionHeader />}
      products={questions.documents
        .filter((q) => q.attachmentId)
        .map((q) => ({
          title: q.title,
          link: `/questions/${q.$id}/${slugify(q.title)}`,
          thumbnail: `${process.env.NEXT_PUBLIC_APPWRITE_HOST_URL}/storage/buckets/${questionAttachmentBucket}/files/${q.attachmentId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        }))}

    />
  );

  console.log(
    `${process.env.NEXT_PUBLIC_APPWRITE_HOST_URL}/storage/buckets/${questionAttachmentBucket}/files/${questions.documents[0].attachmentId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  );
}
