import { apiRequest } from "./queryClient";

interface UploadResponse {
  id: number;
  userId: number;
  type: "image" | "video" | "audio";
  url: string;
  purpose: "skill_verification" | "listing" | "profile";
  skillId?: number;
  listingId?: number;
  createdAt: string;
}

export async function uploadFile(
  file: File,
  purpose: "skill_verification" | "listing" | "profile",
  skillId?: number,
  listingId?: number
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", purpose);
  
  if (skillId) {
    formData.append("skillId", String(skillId));
  }
  
  if (listingId) {
    formData.append("listingId", String(listingId));
  }
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      // No Content-Type header for multipart/form-data
      // The browser will set it with the boundary parameter
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }
  
  return response.json();
}

export function getFileTypeFromMime(mimeType: string): "image" | "video" | "audio" | "unknown" {
  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("video/")) {
    return "video";
  } else if (mimeType.startsWith("audio/")) {
    return "audio";
  } else {
    return "unknown";
  }
}

export function isAllowedFileType(file: File): boolean {
  const type = getFileTypeFromMime(file.type);
  return type !== "unknown";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}
