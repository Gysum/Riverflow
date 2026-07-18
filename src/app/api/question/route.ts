import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

import { databases, storage, users } from "@/models/server/config";
import {
    db,
    questionAttachmentBucket,
    questionCollection,
} from "@/models/name";

import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const authorId = formData.get("authorId") as string;

        const tags = JSON.parse(
            (formData.get("tags") as string) || "[]"
        ) as string[];

        const image = formData.get("image") as File | null;

        let attachmentId = "";

        // Upload image if provided
        if (image) {
            const uploaded = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                image
            );

            attachmentId = uploaded.$id;
        }

        const question = await databases.createDocument(
            db,
            questionCollection,
            ID.unique(),
            {
                title,
                content,
                authorId,
                tags,
                attachmentId,
            }
        );

        // Increase reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId);

        await users.updatePrefs(authorId, {
            reputation: Number(prefs.reputation) + 5,
        });

        return NextResponse.json(question, {
            status: 201,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Unable to create question",
            },
            {
                status: error?.code || error?.status || 500,
            }
        );
    }
}