"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearFormDraft,
  mergeWithDraft,
  profileDraftKey,
  readFormDraft,
  writeFormDraft,
} from "@/lib/form-draft";

type ProfileScope = "client" | "freelancer";

export function useProfileDraft<T extends Record<string, unknown>>(
  scope: ProfileScope,
  userId: string,
  saved: T,
  clearOnSuccess?: boolean,
) {
  const draftKey = profileDraftKey(scope, userId);

  const [values, setValues] = useState(saved);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const draft = readFormDraft<T>(draftKey);
    // Restore unsaved work after refresh (client-only localStorage).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration from localStorage
    setValues(mergeWithDraft(saved, draft));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per user draft key
  }, [draftKey]);

  useEffect(() => {
    if (clearOnSuccess) {
      clearFormDraft(draftKey);
    }
  }, [clearOnSuccess, draftKey]);

  const update = useCallback(
    (patch: Partial<T>) => {
      setValues((prev) => {
        const next = { ...prev, ...patch };
        writeFormDraft(draftKey, next);
        return next;
      });
    },
    [draftKey],
  );

  const clearDraft = useCallback(() => {
    clearFormDraft(draftKey);
  }, [draftKey]);

  return { values, update, ready, clearDraft };
}
