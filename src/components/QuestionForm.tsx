"use client";

import RTE from "@/components/RTE";
import Meteors from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";

interface QuestionDocument extends Models.Document {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  attachmentId: string;
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
        className,
      )}
    >
      <Meteors number={30} />
      {children}
    </div>
  );
};

const QuestionForm = ({ question }: { question?: QuestionDocument }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  const [tag, setTag] = React.useState("");

  const [formData, setFormData] = React.useState({
    title: question?.title ?? "",
    content: question?.content ?? "",
    authorId: user?.$id ?? "",
    tags: new Set(question?.tags ?? []),
    attachment: null as File | null,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (user?.$id) {
      setFormData((prev) => ({
        ...prev,
        authorId: user.$id,
      }));
    }
  }, [user]);

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });

      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const create = async () => {
    if (!formData.attachment) {
      throw new Error("Please upload an image");
    }

    const storageResponse = await storage.createFile(
      questionAttachmentBucket,
      ID.unique(),
      formData.attachment,
    );

    const response = await databases.createDocument<QuestionDocument>(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: storageResponse.$id,
      },
    );

    loadConfetti();

    return response;
  };

  const update = async () => {
    if (!question) {
      throw new Error("Please provide a question");
    }

    const attachmentId = await (async () => {
      if (!formData.attachment) {
        return question.attachmentId;
      }

      await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );

      return file.$id;
    })();

    const response = await databases.updateDocument<QuestionDocument>(
      db,
      questionCollection,
      question.$id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId,
      },
    );

    return response;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("User:", user);
    console.log("Form Data:", formData);

    if (!formData.title || !formData.content || !formData.authorId) {
      setError("Please fill out all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = question ? await update() : await create();

      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {error && (
        <LabelInputContainer>
          <div className="text-center">
            <span className="text-red-500">{error}</span>
          </div>
        </LabelInputContainer>
      )}

      <LabelInputContainer>
        <Label htmlFor="title">
          Title
          <br />
          <small>
            Be specific and imagine you're asking another developer.
          </small>
        </Label>

        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="content">Description</Label>

        <RTE
          value={formData.content}
          onChange={(value?: string) =>
            setFormData((prev) => ({
              ...prev,
              content: value ?? "",
            }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="image">Image</Label>

        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setFormData((prev) => ({
              ...prev,
              attachment: file,
            }));
          }}
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="tag">Tags</Label>

        <div className="flex gap-4">
          <Input
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <button
            type="button"
            onClick={() => {
              if (!tag.trim()) return;

              setFormData((prev) => ({
                ...prev,
                tags: new Set([...prev.tags, tag]),
              }));

              setTag("");
            }}
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[...formData.tags].map((tag) => (
            <div key={tag}>
              <span>{tag}</span>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: new Set([...prev.tags].filter((t) => t !== tag)),
                  }))
                }
              >
                <IconX size={12} />
              </button>
            </div>
          ))}
        </div>
      </LabelInputContainer>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Publishing..."
          : question
            ? "Update Question"
            : "Publish Question"}
      </Button>
    </form>
  );
};

export default QuestionForm;
