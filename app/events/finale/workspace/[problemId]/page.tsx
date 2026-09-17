"use client";

import React from "react";
import FinaleWorkspace from "@/components/sections/finale/FinaleWorkspace";

type PageProps = {
  params: Promise<{ problemId: string }>;
};

export default function FinaleWorkspacePage({ params }: PageProps) {
  const { problemId } = React.use(params);
  return <FinaleWorkspace problemId={problemId} />;
}
