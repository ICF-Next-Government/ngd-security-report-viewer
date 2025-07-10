import { ERROR_MESSAGES, MAX_FILE_SIZE, VALID_FILE_EXTENSIONS } from "../../constants";
import { FileValidationResult } from "../../types/common";

/**
 * Validates a file based on extension and size
 * @param file - The file to validate
 * @returns Validation result with isValid flag and optional error message
 */
export function validateFile(file: File): FileValidationResult {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = VALID_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Extracts the file extension from a filename
 * @param filename - The filename to extract extension from
 * @returns The file extension including the dot, or empty string if no extension
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return "";
  }
  return filename.slice(lastDotIndex).toLowerCase();
}

/**
 * Generates a safe filename for downloads
 * @param originalName - The original filename
 * @param timestamp - Optional timestamp to include
 * @returns A sanitized filename safe for downloads
 */
export function generateSafeFilename(originalName: string, timestamp?: Date): string {
  // Remove extension
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");

  // Sanitize the name (remove special characters)
  const sanitized = nameWithoutExt
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  // Add timestamp if provided
  if (timestamp) {
    const dateStr = timestamp.toISOString().split("T")[0];
    return `${sanitized}_${dateStr}`;
  }

  return sanitized;
}

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Checks if a file appears to be JSON based on content
 * @param content - File content as string
 * @returns True if content appears to be valid JSON
 */
export function isJsonContent(content: string): boolean {
  if (!content || typeof content !== "string") {
    return false;
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return false;
  }

  // Check if it starts with { or [ and ends with } or ]
  const startsWithJson = trimmed[0] === "{" || trimmed[0] === "[";
  const endsWithJson = trimmed[trimmed.length - 1] === "}" || trimmed[trimmed.length - 1] === "]";

  return startsWithJson && endsWithJson;
}

/**
 * Safely reads a file as text with error handling
 * @param file - The file to read
 * @returns Promise that resolves to file content or rejects with error
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Creates a File object from text content
 * @param content - The text content
 * @param filename - The filename to use
 * @param mimeType - The MIME type (defaults to application/json)
 * @returns A File object
 */
export function createFileFromText(
  content: string,
  filename: string,
  mimeType = "application/json",
): File {
  const blob = new Blob([content], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}
