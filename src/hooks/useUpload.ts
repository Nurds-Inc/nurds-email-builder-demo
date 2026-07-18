import { useCallback } from "react";
export function useUpload() {
  const upload = useCallback(async (_blob: Blob): Promise<string> => {
    throw new Error("Image uploads are disabled in this staging build");
  }, []);

  return {
    upload,
  };
}
