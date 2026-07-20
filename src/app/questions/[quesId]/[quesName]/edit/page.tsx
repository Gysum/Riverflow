import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";
import { Question } from "./EditQues";

const Page = async ({
  params,
}: {
  params: Promise<{ quesId: string; quesName: string }>;
}) => {
  const { quesId } = await params;
  const question = await databases.getDocument<Question>(
    db,
    questionCollection,
    quesId,
  );

  return <EditQues question={question} />;
};

export default Page;
