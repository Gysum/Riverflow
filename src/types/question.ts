import { Models } from "appwrite";

export interface Author {
    $id: string;
    name: string;
    reputation: number;
}

export interface Question extends Models.Document {
    title: string;
    content: string;
    tags: string[];
    totalVotes: number;
    totalAnswers: number;
    authorId: string;
    author: Author;
    attachmentId: string;
}