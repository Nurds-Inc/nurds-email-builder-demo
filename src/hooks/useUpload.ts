import { useCallback } from "react";
import { uploadEmailBuilderAsset } from "@/services/nurdsEmailBuilderApi";
export function useUpload() {
  const upload = useCallback(uploadEmailBuilderAsset, []);

  return {
    upload,
  };
}
