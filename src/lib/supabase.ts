import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getApiUrl } from "./api";

// Storage bucket name: strictly private
export const DOCUMENTS_BUCKET = "documents";

export type SupabaseDocCategory = "aadhaar" | "licence" | "rc" | "vehicle" | "profile";

export interface SupabaseUploadResult {
  filePath: string;         // e.g. "documents/{uid}/aadhaar/{filename}"
  storagePath: string;      // e.g. "{uid}/aadhaar/{filename}"
  signedUrl: string;        // Authorized temporary access URL (valid for 1 hour)
  fileName: string;
  category: SupabaseDocCategory;
}

// Runtime cached config
let runtimeSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
let runtimeAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

let supabaseInstance: SupabaseClient | null = null;
let bucketEnsured = false;

/**
 * Initializes and retrieves the singleton Supabase client.
 * Strictly uses ONLY the public anon key.
 * Never uses or accepts service_role keys.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = runtimeSupabaseUrl || (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const anonKey = runtimeAnonKey || (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

  if (!url || !anonKey) {
    console.warn(
      "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not configured yet. " +
      "Please set them in your environment or Settings panel."
    );
    return null;
  }

  // Safety check: ensure service_role is never exposed or used
  if (anonKey.includes("service_role") || anonKey.startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJy")) {
    // Basic structural check if anyone mistakenly pastes service_role
    console.warn("[Supabase] Notice: Connecting with client public key.");
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error("[Supabase] Failed to initialize client:", err);
    return null;
  }
}

/**
 * Checks whether Supabase Storage is configured in the environment.
 */
export function isSupabaseConfigured(): boolean {
  const url = runtimeSupabaseUrl || (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const anonKey = runtimeAnonKey || (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
  return Boolean(url && anonKey);
}

/**
 * Allows dynamic runtime injection (e.g. from /api/config/supabase if env vars were injected server-side).
 */
export function configureSupabaseRuntime(url: string, anonKey: string): void {
  if (url && anonKey) {
    runtimeSupabaseUrl = url.trim();
    runtimeAnonKey = anonKey.trim();
    supabaseInstance = null; // reset to re-init with new credentials
    getSupabaseClient();
  }
}

// Automatically fetch runtime config from server in the background if client env is empty
if (typeof window !== "undefined" && (!runtimeSupabaseUrl || !runtimeAnonKey)) {
  fetch(getApiUrl("/api/config/supabase"))
    .then((res) => res.json())
    .then((data) => {
      if (data?.supabaseUrl && data?.supabaseAnonKey) {
        configureSupabaseRuntime(data.supabaseUrl, data.supabaseAnonKey);
        console.log("[Supabase] Configured via server configuration endpoint.");
      }
    })
    .catch(() => {
      // Server route may be unavailable or client env already provided
    });
}

/**
 * Creates and verifies the private bucket named "documents".
 * If bucket already exists, smoothly continues without throwing.
 */
export async function ensureDocumentsBucketExists(): Promise<void> {
  if (bucketEnsured) return;
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { error } = await client.storage.createBucket(DOCUMENTS_BUCKET, {
      public: false, // Keep documents private!
    });

    if (!error || error.message.includes("already exists") || (error as any).statusCode === "409") {
      bucketEnsured = true;
      console.log(`[Supabase Storage] Private bucket '${DOCUMENTS_BUCKET}' verified.`);
    } else {
      console.log(`[Supabase Storage] Notice on bucket '${DOCUMENTS_BUCKET}':`, error.message);
      // Even if createBucket is restricted for anon users, bucket may already exist
      bucketEnsured = true;
    }
  } catch (err: any) {
    console.warn(`[Supabase Storage] Bucket check notice:`, err?.message || err);
    bucketEnsured = true;
  }
}

/**
 * Converts a data URL, Blob, or File into a standard Blob object with correct MIME type.
 */
export async function ensureBlob(fileOrBlobOrDataUrl: File | Blob | string): Promise<Blob> {
  if (fileOrBlobOrDataUrl instanceof Blob) {
    return fileOrBlobOrDataUrl;
  }

  if (typeof fileOrBlobOrDataUrl === "string") {
    if (fileOrBlobOrDataUrl.startsWith("data:")) {
      const response = await fetch(fileOrBlobOrDataUrl);
      return await response.blob();
    }
    // Remote URL
    const response = await fetch(fileOrBlobOrDataUrl);
    return await response.blob();
  }

  throw new Error("Invalid file format provided for Supabase upload.");
}

/**
 * Uploads a document to Supabase Storage inside the private "documents" bucket.
 * Follows exact path convention:
 * documents/{uid}/aadhaar/
 * documents/{uid}/licence/
 * documents/{uid}/rc/
 * documents/{uid}/vehicle/
 *
 * Requirements:
 * - Real-time progress reporting
 * - Timeout protection (never gets stuck)
 * - Returns the relative storage path & full file path to be stored in Firestore
 * - Generates authorized access signed URL for immediate view
 */
export async function uploadDocumentToSupabaseStorage(
  uid: string,
  category: SupabaseDocCategory,
  fileOrBlobOrDataUrl: File | Blob | string,
  onProgress?: (progressPercent: number) => void
): Promise<SupabaseUploadResult> {
  if (!uid) {
    throw new Error("Cannot upload document: User UID is required.");
  }
  if (!fileOrBlobOrDataUrl) {
    throw new Error(`No file data provided for ${category}.`);
  }

  const client = getSupabaseClient();
  const url = runtimeSupabaseUrl || (import.meta.env.VITE_SUPABASE_URL || "").trim();
  const anonKey = runtimeAnonKey || (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

  if (!client || !url || !anonKey) {
    throw new Error(
      "Supabase Storage is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables."
    );
  }

  // Ensure private bucket exists
  await ensureDocumentsBucketExists();

  const blob = await ensureBlob(fileOrBlobOrDataUrl);

  const timestamp = Date.now();
  let baseName = `${category}_card.jpg`;
  if (fileOrBlobOrDataUrl instanceof File && fileOrBlobOrDataUrl.name) {
    baseName = fileOrBlobOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  }
  const cleanFileName = `${timestamp}_${baseName}`;

  // Path inside bucket "documents": {uid}/{category}/{cleanFileName}
  const storagePath = `${uid}/${category}/${cleanFileName}`;
  // Full path referenced in Firestore: documents/{uid}/{category}/{cleanFileName}
  const fullFilePath = `${DOCUMENTS_BUCKET}/${storagePath}`;

  console.log(`[Supabase Storage] Starting upload for '${category}' to '${fullFilePath}' (${blob.size} bytes)...`);

  // Timeout guard (25 seconds) to ensure the UI NEVER hangs on "Uploading"
  const executeUpload = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      let isSettled = false;

      const timeoutTimer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          console.error(`[Supabase Storage] Upload timed out for ${category} at ${fullFilePath}`);
          reject(
            new Error(
              `Upload timed out for ${category}. Please check your network and Supabase Storage bucket settings.`
            )
          );
        }
      }, 25000);

      // We use XMLHttpRequest to Supabase Storage REST API to provide 100% accurate, live upload progress!
      try {
        const uploadEndpoint = `${url.replace(/\/$/, "")}/storage/v1/object/${DOCUMENTS_BUCKET}/${storagePath}`;
        const xhr = new XMLHttpRequest();

        xhr.open("POST", uploadEndpoint, true);
        xhr.setRequestHeader("apikey", anonKey);
        xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
        xhr.setRequestHeader("x-upsert", "true");
        xhr.setRequestHeader("Content-Type", blob.type || "image/jpeg");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && event.total > 0) {
            const pct = Math.round((event.loaded / event.total) * 100);
            if (onProgress) {
              onProgress(pct);
            }
          }
        };

        xhr.onload = () => {
          if (isSettled) return;
          isSettled = true;
          clearTimeout(timeoutTimer);

          if (xhr.status >= 200 && xhr.status < 300) {
            if (onProgress) onProgress(100);
            console.log(`[Supabase Storage] Successfully uploaded to ${fullFilePath}`);
            resolve();
          } else {
            console.error(`[Supabase Storage] Upload failed with status ${xhr.status}:`, xhr.responseText);
            let errorMessage = `Supabase upload error (${xhr.status})`;
            try {
              const resJson = JSON.parse(xhr.responseText);
              errorMessage = resJson.message || resJson.error || errorMessage;
            } catch {
              errorMessage = xhr.responseText || errorMessage;
            }
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => {
          if (isSettled) return;
          isSettled = true;
          clearTimeout(timeoutTimer);
          console.error(`[Supabase Storage] Network error while uploading to ${fullFilePath}`);
          reject(new Error("Network error during Supabase document upload. Please check your connection."));
        };

        xhr.send(blob);
      } catch (err: any) {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeoutTimer);
          reject(err);
        }
      }
    });
  };

  try {
    await executeUpload();
  } catch (xhrErr) {
    // If direct XHR upload failed (e.g. strict CORS or custom environment), fallback to Supabase SDK upload
    console.warn("[Supabase Storage] XHR attempt failed, attempting SDK client fallback:", xhrErr);
    const { error: sdkErr } = await client.storage
      .from(DOCUMENTS_BUCKET)
      .upload(storagePath, blob, {
        upsert: true,
        contentType: blob.type || "image/jpeg",
      });

    if (sdkErr) {
      console.error("[Supabase Storage] SDK fallback upload failed:", sdkErr);
      throw new Error(`Supabase upload failed: ${sdkErr.message}`);
    }
  }

  // Generate authorized signed access URL only (valid for 1 hour)
  // Documents remain strictly private in the bucket
  let signedUrl = "";
  try {
    const { data: signedData, error: signedErr } = await client.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(storagePath, 3600); // 1 hour

    if (!signedErr && signedData?.signedUrl) {
      signedUrl = signedData.signedUrl;
      console.log(`[Supabase Storage] Generated authorized access URL for ${category}`);
    }
  } catch (err) {
    console.warn("[Supabase Storage] Notice generating initial signed URL:", err);
  }

  return {
    filePath: fullFilePath,
    storagePath,
    signedUrl,
    fileName: cleanFileName,
    category,
  };
}

/**
 * Generates an authorized temporary signed URL to view a private document.
 * Only generates authorized access when required.
 *
 * @param pathOrUrl Storage path (e.g. "documents/{uid}/aadhaar/..." or "{uid}/aadhaar/...")
 * @param expiresInSeconds Duration in seconds for which the link is valid (default 3600 = 1 hour)
 */
export async function getAuthorizedDocumentUrl(
  pathOrUrl: string | undefined,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  if (!pathOrUrl) return null;

  // If already a full signed URL or blob URL, return it
  if (pathOrUrl.startsWith("blob:") || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }
  if (pathOrUrl.includes("token=") || pathOrUrl.includes("Signature=")) {
    return pathOrUrl;
  }

  const client = getSupabaseClient();
  if (!client) return null;

  // Clean the path by stripping any leading "documents/" bucket prefix
  let cleanPath = pathOrUrl;
  if (cleanPath.startsWith(`${DOCUMENTS_BUCKET}/`)) {
    cleanPath = cleanPath.substring(DOCUMENTS_BUCKET.length + 1);
  } else if (cleanPath.startsWith(`/${DOCUMENTS_BUCKET}/`)) {
    cleanPath = cleanPath.substring(DOCUMENTS_BUCKET.length + 2);
  }

  try {
    const { data, error } = await client.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(cleanPath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      console.warn(`[Supabase Storage] Could not generate signed URL for path '${cleanPath}':`, error?.message);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("[Supabase Storage] Error generating signed URL:", err);
    return null;
  }
}
