"use client";

import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const PROJECT_ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;
const ACCEPTED_MIME = "application/pdf";
const BUCKET = "project-files";

type AttachmentStatus = "idle" | "uploading" | "ready" | "error";

type ProjectAttachmentFieldProps = {
  initialPath?: string | null;
  onUploadingChange?: (isUploading: boolean) => void;
  className?: string;
};

export function ProjectAttachmentField({
  initialPath = null,
  onUploadingChange,
  className,
}: ProjectAttachmentFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<AttachmentStatus>("idle");
  const [path, setPath] = useState<string | null>(initialPath);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onUploadingChange?.(status === "uploading");
  }, [status, onUploadingChange]);

  const reset = (nextPath: string | null = null) => {
    setStatus(nextPath ? "ready" : "idle");
    setPath(nextPath);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      reset(initialPath ?? null);
      return;
    }

    const isPdfMime = file.type === ACCEPTED_MIME;
    const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfMime && !isPdfExt) {
      setError("Only PDF files are allowed.");
      setStatus("error");
      setPath(null);
      setFileName(file.name);
      return;
    }

    if (file.size > PROJECT_ATTACHMENT_MAX_BYTES) {
      setError(
        `File is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed is 25 MB.`,
      );
      setStatus("error");
      setPath(null);
      setFileName(file.name);
      return;
    }

    setError(null);
    setFileName(file.name);
    setStatus("uploading");

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be signed in to upload an attachment.");
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uploadPath = `${user.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(uploadPath, file, {
          upsert: false,
          contentType: "application/pdf",
        });

      if (uploadError) throw uploadError;

      setPath(uploadPath);
      setStatus("ready");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setError(message);
      setStatus("error");
      setPath(null);
    }
  };

  return (
    <div className={className}>
      <input type="hidden" name="attachment_path" value={path ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleChange}
        className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-1 file:text-indigo-700"
      />
      <div className="mt-1 min-h-4 text-xs">
        {status === "uploading" ? (
          <span className="text-indigo-700">Uploading {fileName}&hellip;</span>
        ) : null}
        {status === "ready" ? (
          <span className="text-emerald-700">
            Attached: {fileName ?? path}{" "}
            <button
              type="button"
              onClick={() => reset(null)}
              className="ml-2 underline"
            >
              Remove
            </button>
          </span>
        ) : null}
        {status === "error" && error ? (
          <span className="text-rose-700">{error}</span>
        ) : null}
        {status === "idle" && initialPath ? (
          <span className="text-muted-foreground">
            Current file kept. Pick a new PDF to replace it.
          </span>
        ) : null}
        {status === "idle" && !initialPath ? (
          <span className="text-muted-foreground">PDF only, up to 25 MB.</span>
        ) : null}
      </div>
    </div>
  );
}
