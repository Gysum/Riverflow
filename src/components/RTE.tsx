"use client";

import dynamic from "next/dynamic";
import type { MDEditorProps } from "@uiw/react-md-editor";
import MDEditor from "@uiw/react-md-editor";

const RTE = dynamic<MDEditorProps>(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
  },
);

export const MarkdownPreview = MDEditor.Markdown;

export default RTE;
