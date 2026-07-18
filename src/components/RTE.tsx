"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import dynamic from "next/dynamic";
import MDEditor, { type MDEditorProps } from "@uiw/react-md-editor";

const RTE = dynamic<MDEditorProps>(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export const MarkdownPreview = MDEditor.Markdown;

export default RTE;