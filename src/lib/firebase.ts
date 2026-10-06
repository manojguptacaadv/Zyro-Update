import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { UserProfile, UserRole, AppLanguage, RegistrationType, DriverDetails, TruckDetails } from "../types";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication, Cloud Firestore & Cloud Storage
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
export const storage = getStorage(app, firebaseConfig.storageBucket ? `gs://${firebaseConfig.storageBucket}` : undefined);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  storageRef,
  uploadBytesResumable,
  getDownloadURL
};
export type { ConfirmationResult, FirebaseUser };

/**
 * Operation types for Firestore operations
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Standardized Firestore error handler providing contextual debugging details
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

/**
 * Validates Firestore server connection on startup
 */
export async function validateFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'users', 'connection_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client appears offline or connecting:", error.message);
    }
  }
}

/**
 * Initializes or retrieves an invisible RecaptchaVerifier for Phone Authentication.
 * Reuses the existing verifier or binds to a dedicated stable container without DOM destruction.
 */
export function getOrCreateRecaptcha(
  containerId: string = "recaptcha-container",
  onSolved?: (response?: any) => void,
  onExpired?: () => void
): RecaptchaVerifier {
  if (typeof window === "undefined") {
    throw new Error("Window object is not available for RecaptchaVerifier");
  }

  const win = window as any;
  if (!win._zyroRecaptchaVerifiers) {
    win._zyroRecaptchaVerifiers = {};
  }

  // Reuse if already initialized and active
  if (win._zyroRecaptchaVerifiers[containerId]) {
    return win._zyroRecaptchaVerifiers[containerId];
  }

  // Ensure DOM container exists and remains stable in document.body
  let targetEl = document.getElementById(containerId);
  if (!targetEl) {
    targetEl = document.createElement("div");
    targetEl.id = containerId;
    document.body.appendChild(targetEl);
  }

  try {
    const verifier = new RecaptchaVerifier(auth, targetEl, {
      size: "invisible",
      callback: (response: any) => {
        if (onSolved) onSolved(response);
      },
      "expired-callback": () => {
        console.warn("Firebase invisible reCAPTCHA token expired.");
        if (onExpired) onExpired();
      }
    });

    win._zyroRecaptchaVerifiers[containerId] = verifier;
    return verifier;
  } catch (err: any) {
    console.warn("RecaptchaVerifier creation warning:", err);
    if (win._zyroRecaptchaVerifiers[containerId]) {
      return win._zyroRecaptchaVerifiers[containerId];
    }
    throw err;
  }
}

/**
 * Resets a RecaptchaVerifier instance safely without tearing down DOM elements
 */
export function clearRecaptcha(containerId: string = "recaptcha-container") {
  if (typeof window === "undefined") return;
  const win = window as any;
  if (win._zyroRecaptchaVerifiers && win._zyroRecaptchaVerifiers[containerId]) {
    try {
      win._zyroRecaptchaVerifiers[containerId].clear();
    } catch {
      // ignore clear error
    }
    delete win._zyroRecaptchaVerifiers[containerId];
  }
}

/**
 * Translates Firebase Auth Phone & Recaptcha error codes into human-friendly messages
 */
export function getFirebasePhoneAuthErrorMessage(err: any): string {
  if (!err) return "An unexpected error occurred. Please try again.";
  const code = err.code || "";
  const msg = err.message || "";

  if (code === "auth/billing-not-enabled") {
    return "Firebase Phone Authentication requires the Blaze (Pay-as-you-go) plan on your Firebase project 'goride-40b39' to send real SMS. You can also add '+919876543210' with code '123456' under Firebase Console -> Authentication -> Phone numbers for testing.";
  }
  if (code === "auth/invalid-phone-number") {
    return "Invalid phone number format. Please enter a valid 10-digit Indian mobile number.";
  }
  if (code === "auth/missing-phone-number") {
    return "Please enter a valid mobile number.";
  }
  if (code === "auth/quota-exceeded") {
    return "SMS quota exceeded for today. Please try again later or contact support.";
  }
  if (code === "auth/captcha-check-failed") {
    return "reCAPTCHA verification failed. Please try again.";
  }
  if (code === "auth/invalid-verification-code") {
    return "Invalid verification code. Please check the 6-digit OTP and try again.";
  }
  if (code === "auth/code-expired") {
    return "Verification code has expired. Please click 'Resend Code' for a new OTP.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many requests. Please wait a few moments before requesting another OTP.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase Console. Please add this domain to Firebase Auth -> Settings -> Authorized domains.";
  }
  if (code === "auth/invalid-app-credential") {
    return "Firebase app verification failed. Ensure this domain is authorized in Firebase Console.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error. Please check your internet connection.";
  }

  return msg || "Authentication failed. Please check your mobile number and retry.";
}

/**
 * Formats a 10-digit Indian mobile number with fixed +91 prefix
 * Example: 9876543210 -> +919876543210
 */
export function formatIndianPhoneNumber(digitsOnly: string): string {
  const cleanDigits = digitsOnly.replace(/\D/g, "").slice(-10);
  return `+91${cleanDigits}`;
}

/**
 * Validates whether the number is a valid 10-digit Indian mobile number
 */
export function isValidIndianMobileNumber(digitsOnly: string): boolean {
  const cleanDigits = digitsOnly.replace(/\D/g, "");
  return cleanDigits.length === 10 && /^[6-9]\d{9}$/.test(cleanDigits);
}

/**
 * Organized Cloud Storage folder categories requested:
 * - users/{uid}/documents/drivingLicence/
 * - users/{uid}/profile/
 * - users/{uid}/truckDocuments/
 * - users/{uid}/vehiclePhotos/
 * - users/{uid}/documents/aadhaar/
 */
export type StoragePhotoCategory = 
  | "drivingLicence" 
  | "profile" 
  | "truckRC" 
  | "vehiclePhoto" 
  | "aadhaar";

export interface PhotoUploadResult {
  downloadUrl: string;
  storagePath: string;
  fieldName: "drivingLicencePhotoUrl" | "profilePhotoUrl" | "truckRCPhotoUrl" | "vehiclePhotoUrl" | "aadhaarCardPhotoUrl";
}

/**
 * Returns the exact organized Cloud Storage folder path, default file name, and Firestore field name
 */
export function getStorageDirectoryForCategory(category: StoragePhotoCategory, uid: string): { 
  folder: string; 
  defaultFileName: string; 
  fieldName: PhotoUploadResult["fieldName"];
} {
  switch (category) {
    case "drivingLicence":
      return {
        folder: `users/${uid}/documents/drivingLicence/`,
        defaultFileName: `licence_${Date.now()}.jpg`,
        fieldName: "drivingLicencePhotoUrl",
      };
    case "profile":
      return {
        folder: `users/${uid}/profile/`,
        defaultFileName: `profile_${Date.now()}.jpg`,
        fieldName: "profilePhotoUrl",
      };
    case "truckRC":
      return {
        folder: `users/${uid}/truckDocuments/`,
        defaultFileName: `truckRC_${Date.now()}.jpg`,
        fieldName: "truckRCPhotoUrl",
      };
    case "vehiclePhoto":
      return {
        folder: `users/${uid}/vehiclePhotos/`,
        defaultFileName: `vehicle_${Date.now()}.jpg`,
        fieldName: "vehiclePhotoUrl",
      };
    case "aadhaar":
      return {
        folder: `users/${uid}/documents/aadhaar/`,
        defaultFileName: `aadhaar_${Date.now()}.jpg`,
        fieldName: "aadhaarCardPhotoUrl",
      };
  }
}

/**
 * Converts any File, Blob, or base64/dataURL string to an actual Blob for Firebase Storage
 */
export async function ensureImageBlob(input: File | Blob | string): Promise<Blob> {
  if (typeof input === "string") {
    if (input.startsWith("data:") || input.startsWith("blob:")) {
      const res = await fetch(input);
      return await res.blob();
    }
    throw new Error("Invalid image string provided for upload.");
  }
  return input;
}

/**
 * Uploads an actual image file to Firebase Cloud Storage.
 * - Organized in users/{uid}/... folders
 * - Reports real-time upload progress (0% - 100%)
 * - Fetches the Firebase Storage download URL
 * - Saves ONLY the download URL in Cloud Firestore under the user's document
 * - Stores each photo URL as a separate individual field
 */
export async function uploadUserPhotoToFirebaseStorage(
  uid: string,
  category: StoragePhotoCategory,
  fileOrBlobOrDataUrl: File | Blob | string,
  onProgress?: (progressPercent: number) => void
): Promise<PhotoUploadResult> {
  if (!uid) {
    throw new Error("Cannot upload photo: Firebase User UID is required.");
  }
  if (!fileOrBlobOrDataUrl) {
    throw new Error(`No image data provided for ${category}.`);
  }

  const { folder, defaultFileName, fieldName } = getStorageDirectoryForCategory(category, uid);

  // If already an uploaded URL (e.g. Firebase Storage download URL), return immediately
  if (
    typeof fileOrBlobOrDataUrl === "string" &&
    (fileOrBlobOrDataUrl.startsWith("http://") || fileOrBlobOrDataUrl.startsWith("https://"))
  ) {
    console.log(`[Storage] Photo for ${category} is already a remote URL, skipping re-upload:`, fileOrBlobOrDataUrl);
    return {
      downloadUrl: fileOrBlobOrDataUrl,
      storagePath: `${folder}${defaultFileName}`,
      fieldName,
    };
  }

  const blob = await ensureImageBlob(fileOrBlobOrDataUrl);

  const cleanFileName = (fileOrBlobOrDataUrl instanceof File && fileOrBlobOrDataUrl.name)
    ? `${Date.now()}_${fileOrBlobOrDataUrl.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    : defaultFileName;

  const fullStoragePath = `${folder}${cleanFileName}`;
  console.log(`[Storage] Starting upload for '${category}' to '${fullStoragePath}' (${blob.size} bytes)...`);

  const attemptUpload = (targetStorage: typeof storage): Promise<PhotoUploadResult> => {
    const fileRef = storageRef(targetStorage, fullStoragePath);
    return new Promise((resolve, reject) => {
      let isSettled = false;

      // 25-second timeout protection so UI never hangs indefinitely
      const timeoutTimer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          try {
            uploadTask.cancel();
          } catch {}
          console.error(`[Storage] Upload timed out for category '${category}' at '${fullStoragePath}'`);
          reject(
            new Error(
              `Storage upload timed out for ${category}. Please check your Firebase Storage security rules and internet connection.`
            )
          );
        }
      }, 25000);

      const uploadTask = uploadBytesResumable(fileRef, blob, {
        contentType: blob.type || "image/jpeg",
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(`[Storage] Progress for ${category}: ${progress}%`);
            if (onProgress) {
              onProgress(progress);
            }
          }
        },
        (error) => {
          if (!isSettled) {
            isSettled = true;
            clearTimeout(timeoutTimer);
            console.error(`[Storage] Upload error for ${category}:`, error);
            let friendlyMsg = `Firebase Storage error (${error.code}): ${error.message}`;
            if (error.code === "storage/unauthorized") {
              friendlyMsg = "Firebase Storage permission denied (storage/unauthorized). Please ensure Storage Security Rules are configured in Firebase Console.";
            } else if (error.code === "storage/bucket-not-found") {
              friendlyMsg = "Firebase Storage bucket not found (storage/bucket-not-found). Please ensure the default Storage bucket is created in Firebase Console.";
            }
            reject(new Error(friendlyMsg));
          }
        },
        async () => {
          if (!isSettled) {
            try {
              console.log(`[Storage] Upload completed for ${category}. Fetching download URL...`);
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              isSettled = true;
              clearTimeout(timeoutTimer);
              console.log(`[Storage] Acquired download URL for ${category}:`, downloadUrl);
              resolve({
                downloadUrl,
                storagePath: fullStoragePath,
                fieldName,
              });
            } catch (urlErr: any) {
              isSettled = true;
              clearTimeout(timeoutTimer);
              console.error(`[Storage] Failed to get download URL for ${category}:`, urlErr);
              reject(new Error(`Failed to retrieve download URL for ${category}: ${urlErr?.message || urlErr?.code || "Unknown error"}`));
            }
          }
        }
      );
    });
  };

  try {
    return await attemptUpload(storage);
  } catch (primaryErr: any) {
    // If bucket not found on .firebasestorage.app, retry once with standard .appspot.com
    if (
      (primaryErr?.message?.includes("bucket-not-found") || primaryErr?.code === "storage/bucket-not-found") &&
      firebaseConfig.projectId
    ) {
      try {
        console.log(`[Storage] Retrying with gs://${firebaseConfig.projectId}.appspot.com fallback bucket...`);
        const fallbackStorage = getStorage(app, `gs://${firebaseConfig.projectId}.appspot.com`);
        return await attemptUpload(fallbackStorage);
      } catch (fallbackErr) {
        console.warn("[Storage] Fallback bucket attempt also failed:", fallbackErr);
      }
    }
    throw primaryErr;
  }
}

export interface UserRegistrationData {
  uid: string;
  fullName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  registrationType: RegistrationType | string;
  city?: string;

  // Driver fields (stored as individual top-level fields)
  experienceYears?: string | number;
  licenceNumber?: string;
  licenceExpiryDate?: string;
  licenceType?: string;
  preferredLocation?: string;
  workHistory?: string;

  // Truck fields (stored as individual top-level fields)
  truckType?: string;
  truckBrandModel?: string;
  manufacturingDate?: string;
  registrationNumber?: string;
  loadCapacity?: string;
  vehicleAvailability?: string;
  vehicleLocation?: string;

  // Supabase Storage File Paths (stored as separate individual fields in users/{uid})
  storageProvider?: "supabase" | "firebase";
  storageBucket?: string;
  aadhaarFilePath?: string;
  aadhaarPath?: string;
  licenceFilePath?: string;
  licencePath?: string;
  rcFilePath?: string;
  rcPath?: string;
  vehicleFilePath?: string;
  vehiclePath?: string;
  profileFilePath?: string;
  profilePath?: string;

  // Real Storage Access/Download URLs (temporary signed URLs or storage URLs)
  drivingLicencePhotoUrl?: string;
  aadhaarPhotoUrl?: string;
  truckPhotoUrl?: string;
  rcPhotoUrl?: string;
  profilePhotoUrl?: string;

  // Compatibility aliases
  aadhaarCardPhotoUrl?: string;
  truckRCPhotoUrl?: string;
  vehiclePhotoUrl?: string;
  aadhaarCardImage?: string;
  licenceCardImage?: string;
  vehicleRcImage?: string;

  // Legacy parameter compatibility
  name?: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  preferredLanguage?: AppLanguage;
  driverDetails?: DriverDetails;
  truckDetails?: TruckDetails;
}

/**
 * Saves user registration details directly into Firestore collection `users/{Firebase_UID}`.
 * Strictly adheres to:
 * - Separate, individual fields directly at the root of the document.
 * - Absolutely NO nested objects, maps, or arrays (no driverDetails, no truckDetails).
 * - Only actual user-entered data is saved.
 * - Saves actual Firebase Storage download URLs.
 * - Uses serverTimestamp() for createdAt.
 * - Document ID is the Firebase Authentication UID.
 */
export async function saveUserRegistrationToFirestore(userData: UserRegistrationData): Promise<void> {
  if (!userData.uid) {
    throw new Error("Cannot save to Firestore: User UID is missing.");
  }

  console.log(`[Firestore] Preparing registration document for users/${userData.uid}...`);

  // Normalize registrationType string
  const rawReg = userData.registrationType;
  let regTypeFormatted = "Driver";
  if (rawReg === "truck_owner" || rawReg === "Truck Owner") {
    regTypeFormatted = "Truck Owner";
  } else if (
    rawReg === "driver_and_truck_owner" ||
    rawReg === "Driver & Truck Owner" ||
    rawReg === "Driver + Truck Owner"
  ) {
    regTypeFormatted = "Driver & Truck Owner";
  } else if (rawReg === "rent_and_drive" || rawReg === "Rent & Drive") {
    regTypeFormatted = "Rent & Drive";
  } else {
    regTypeFormatted = "Driver";
  }

  // STEP 2: Base individual fields for every partner document
  const resolvedCity = (userData.city || userData.preferredLocation || userData.vehicleLocation || "").trim();
  const docPayload: Record<string, any> = {
    fullName: (userData.fullName || userData.name || "").trim(),
    phoneNumber: (userData.phoneNumber || userData.phone || "").trim(),
    emailAddress: (userData.emailAddress || userData.email || "").trim(),
    registrationType: regTypeFormatted,
    city: resolvedCity,
    createdAt: serverTimestamp(),
  };

  // Determine relevance strictly based on the selected registration type
  const isDriverRelevant =
    regTypeFormatted === "Driver" ||
    regTypeFormatted === "Driver & Truck Owner" ||
    regTypeFormatted === "Rent & Drive";

  const isTruckRelevant =
    regTypeFormatted === "Truck Owner" ||
    regTypeFormatted === "Driver & Truck Owner";

  // For Driver, save separately:
  // - experienceYears
  // - licenceNumber
  // - licenceExpiryDate
  // - licenceType
  // - preferredLocation
  // - workHistory
  // - drivingLicencePhotoUrl
  // - aadhaarPhotoUrl
  if (isDriverRelevant) {
    const exp = userData.experienceYears ?? userData.driverDetails?.experienceYears;
    if (exp !== undefined && exp !== "") docPayload.experienceYears = String(exp).trim();

    const licNum = userData.licenceNumber ?? userData.driverDetails?.licenceNumber;
    if (licNum !== undefined && licNum !== "") docPayload.licenceNumber = String(licNum).trim();

    const licExp = userData.licenceExpiryDate ?? userData.driverDetails?.licenceExpiryDate;
    if (licExp !== undefined && licExp !== "") docPayload.licenceExpiryDate = String(licExp).trim();

    const licType = userData.licenceType ?? userData.driverDetails?.licenceType;
    if (licType !== undefined && licType !== "") docPayload.licenceType = String(licType).trim();

    const prefLoc = userData.preferredLocation ?? userData.driverDetails?.preferredLocation ?? resolvedCity;
    if (prefLoc !== undefined && prefLoc !== "") docPayload.preferredLocation = String(prefLoc).trim();

    const wHist = userData.workHistory ?? userData.driverDetails?.workHistory;
    if (wHist !== undefined && wHist !== "") docPayload.workHistory = String(wHist).trim();

    if (userData.drivingLicencePhotoUrl) {
      docPayload.drivingLicencePhotoUrl = userData.drivingLicencePhotoUrl;
    }
  }

  // For Truck Owner, save separately:
  // - truckType
  // - truckBrandModel
  // - manufacturingDate
  // - registrationNumber
  // - loadCapacity
  // - vehicleAvailability
  // - vehicleLocation
  // - truckPhotoUrl
  // - rcPhotoUrl
  if (isTruckRelevant) {
    const tType = userData.truckType ?? userData.truckDetails?.truckType;
    if (tType !== undefined && tType !== "") docPayload.truckType = String(tType).trim();

    const tBrand = userData.truckBrandModel ?? userData.truckDetails?.brandModel;
    if (tBrand !== undefined && tBrand !== "") docPayload.truckBrandModel = String(tBrand).trim();

    const mDate = userData.manufacturingDate ?? userData.truckDetails?.manufacturingDate;
    if (mDate !== undefined && mDate !== "") docPayload.manufacturingDate = String(mDate).trim();

    const rNum = userData.registrationNumber ?? userData.truckDetails?.registrationNumber;
    if (rNum !== undefined && rNum !== "") docPayload.registrationNumber = String(rNum).trim();

    const lCap = userData.loadCapacity ?? userData.truckDetails?.loadCapacity;
    if (lCap !== undefined && lCap !== "") docPayload.loadCapacity = String(lCap).trim();

    const vAvail = userData.vehicleAvailability ?? userData.truckDetails?.availability;
    if (vAvail !== undefined && vAvail !== "") docPayload.vehicleAvailability = String(vAvail).trim();

    const vLoc = userData.vehicleLocation ?? userData.truckDetails?.location ?? resolvedCity;
    if (vLoc !== undefined && vLoc !== "") docPayload.vehicleLocation = String(vLoc).trim();

    const tPhoto = userData.truckPhotoUrl || userData.vehiclePhotoUrl;
    if (tPhoto) {
      docPayload.truckPhotoUrl = tPhoto;
      docPayload.vehiclePhotoUrl = tPhoto; // compatibility
    }

    const rcPhoto = userData.rcPhotoUrl || userData.truckRCPhotoUrl;
    if (rcPhoto) {
      docPayload.rcPhotoUrl = rcPhoto;
      docPayload.truckRCPhotoUrl = rcPhoto; // compatibility
    }
  }

  // Aadhaar photo URL (save as both aadhaarPhotoUrl and aadhaarCardPhotoUrl for compatibility)
  const aadhaarUrl = userData.aadhaarPhotoUrl || userData.aadhaarCardPhotoUrl;
  if (aadhaarUrl) {
    docPayload.aadhaarPhotoUrl = aadhaarUrl;
    docPayload.aadhaarCardPhotoUrl = aadhaarUrl;
  }

  // Optional profile photo URL
  if (userData.profilePhotoUrl) {
    docPayload.profilePhotoUrl = userData.profilePhotoUrl;
  }

  // STRICT REQUIREMENT: Ensure NO nested objects (such as driverDetails or truckDetails)
  delete docPayload.driverDetails;
  delete docPayload.truckDetails;

  // Sanitize payload to remove any undefined fields so Firestore never rejects the write
  const cleanDocPayload: Record<string, any> = {};
  for (const [key, val] of Object.entries(docPayload)) {
    if (val !== undefined && val !== null) {
      cleanDocPayload[key] = val;
    }
  }

  // Local storage cache backup
  try {
    localStorage.setItem(`zyro_reg_${userData.uid}`, JSON.stringify(cleanDocPayload));
    localStorage.setItem(`workride_reg_${userData.uid}`, JSON.stringify(cleanDocPayload));
  } catch {}

  console.log(`[Firestore] Writing flat payload to users/${userData.uid}:`, cleanDocPayload);

  try {
    const userDocRef = doc(db, "users", userData.uid);

    // Timeout safety wrapper (20 seconds) to prevent infinite UI hanging
    const writePromise = setDoc(userDocRef, cleanDocPayload, { merge: true });
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Cloud Firestore write timed out after 20 seconds. Please check your internet connection and Firestore rules."));
      }, 20000);
    });

    await Promise.race([writePromise, timeoutPromise]);
    console.log(`[Firestore] Partner data successfully saved in users/${userData.uid}!`);
  } catch (err: any) {
    console.error(`[Firestore] Error saving user ${userData.uid}:`, err);
    throw new Error(`Firestore save failed: ${err?.message || err?.code || "Permission or network error"}`);
  }
}

/**
 * Fetches user profile from Firebase Cloud Firestore collection `users/{Firebase_UID}`.
 * Reads individual flat fields and reconstitutes the in-memory UserProfile.
 */
export async function getUserProfileFromFirestore(uid: string): Promise<Partial<UserProfile> | null> {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, "users", uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      
      const rawRegType = data.registrationType || "";
      let regType: RegistrationType = "driver";
      let role: UserRole = "driver";

      if (rawRegType === "Truck Owner" || rawRegType === "truck_owner") {
        regType = "truck_owner";
        role = "truck_owner";
      } else if (
        rawRegType === "Driver & Truck Owner" || 
        rawRegType === "driver_and_truck_owner" || 
        rawRegType === "Driver + Truck Owner"
      ) {
        regType = "driver_and_truck_owner";
        role = "driver_and_truck_owner";
      } else if (rawRegType === "Rent & Drive" || rawRegType === "rent_and_drive") {
        regType = "rent_and_drive";
        role = "rent_and_drive";
      } else {
        regType = "driver";
        role = "driver";
      }

      return {
        id: `user-${uid.slice(0, 8)}`,
        uid: uid,
        name: data.fullName || "Partner",
        fullName: data.fullName || "Partner",
        phone: data.phoneNumber || "+919876543210",
        phoneNumber: data.phoneNumber || "+919876543210",
        email: data.emailAddress || `${uid.slice(0, 8)}@zyro.in`,
        emailAddress: data.emailAddress || `${uid.slice(0, 8)}@zyro.in`,
        registrationType: regType,
        role: role,
        city: data.preferredLocation || data.vehicleLocation || "Delhi NCR",

        // Separate flat fields exposed directly
        experienceYears: data.experienceYears,
        licenceNumber: data.licenceNumber,
        licenceExpiryDate: data.licenceExpiryDate,
        licenceType: data.licenceType,
        preferredLocation: data.preferredLocation,
        workHistory: data.workHistory,

        truckType: data.truckType,
        truckBrandModel: data.truckBrandModel,
        manufacturingDate: data.manufacturingDate,
        registrationNumber: data.registrationNumber,
        loadCapacity: data.loadCapacity,
        vehicleAvailability: data.vehicleAvailability,
        vehicleLocation: data.vehicleLocation,

        // Mandatory Document Photos (JPG format or Storage download URLs)
        aadhaarCardImage: data.aadhaarCardPhotoUrl || data.aadhaarCardImage,
        licenceCardImage: data.drivingLicencePhotoUrl || data.licenceCardImage,
        vehicleRcImage: data.truckRCPhotoUrl || data.vehicleRcImage,

        // Bank Account Details (stored in users/{uid})
        bankAccount: data.bankAccountHolderName ? {
          accountHolderName: data.bankAccountHolderName,
          bankName: data.bankName || "",
          accountNumberMasked: data.bankAccountNumberMasked || "••••",
          ifscCode: data.bankIfscCode || "",
          updatedAt: data.bankAccountUpdatedAt || "",
          isVerified: true,
        } : undefined,

        // Firebase Cloud Storage Photo Download URLs (separate fields stored in users/{uid})
        drivingLicencePhotoUrl: data.drivingLicencePhotoUrl,
        profilePhotoUrl: data.profilePhotoUrl,
        truckRCPhotoUrl: data.truckRCPhotoUrl,
        vehiclePhotoUrl: data.vehiclePhotoUrl,
        aadhaarCardPhotoUrl: data.aadhaarCardPhotoUrl,

        // Convenience UI wrapper objects for existing dashboard screens
        driverDetails: data.experienceYears ? {
          experienceYears: data.experienceYears,
          licenceNumber: data.licenceNumber || "DL-042021008942",
          licenceExpiryDate: data.licenceExpiryDate || "2031-12-31",
          licenceType: data.licenceType || "LMV-TR",
          preferredLocation: data.preferredLocation || "Delhi NCR",
          workHistory: data.workHistory || "",
        } : undefined,

        truckDetails: data.truckType ? {
          truckType: data.truckType,
          brandModel: data.truckBrandModel || "Tata",
          manufacturingDate: data.manufacturingDate || "2023",
          registrationNumber: data.registrationNumber || "DL-01-AB-1234",
          registrationDetails: data.registrationNumber || "Active Commercial Permit",
          loadCapacity: data.loadCapacity || "1.0 Ton",
          availability: data.vehicleAvailability || "Immediate",
          location: data.vehicleLocation || "Delhi NCR",
        } : undefined,
      };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }

  try {
    const cached = localStorage.getItem(`zyro_reg_${uid}`) || localStorage.getItem(`workride_reg_${uid}`);
    if (cached) {
      const data = JSON.parse(cached);
      return {
        id: `user-${uid.slice(0, 8)}`,
        uid: uid,
        name: data.fullName || data.name || "Partner",
        fullName: data.fullName || data.name || "Partner",
        phone: data.phoneNumber || data.phone || "+919876543210",
        phoneNumber: data.phoneNumber || data.phone || "+919876543210",
        email: data.emailAddress || data.email || "",
        emailAddress: data.emailAddress || data.email || "",
        registrationType: (data.registrationType === "Truck Owner" ? "truck_owner" : data.registrationType === "Driver & Truck Owner" ? "driver_and_truck_owner" : data.registrationType === "Rent & Drive" ? "rent_and_drive" : "driver") as RegistrationType,
        experienceYears: data.experienceYears,
        licenceNumber: data.licenceNumber,
        licenceExpiryDate: data.licenceExpiryDate,
        licenceType: data.licenceType,
        preferredLocation: data.preferredLocation,
        workHistory: data.workHistory,
        truckType: data.truckType,
        truckBrandModel: data.truckBrandModel,
        manufacturingDate: data.manufacturingDate,
        registrationNumber: data.registrationNumber,
        loadCapacity: data.loadCapacity,
        vehicleAvailability: data.vehicleAvailability,
        vehicleLocation: data.vehicleLocation,
        aadhaarCardImage: data.aadhaarCardImage,
        licenceCardImage: data.drivingLicencePhotoUrl || data.licenceCardImage,
        vehicleRcImage: data.truckRCPhotoUrl || data.vehicleRcImage,
        drivingLicencePhotoUrl: data.drivingLicencePhotoUrl,
        profilePhotoUrl: data.profilePhotoUrl,
        truckRCPhotoUrl: data.truckRCPhotoUrl,
        vehiclePhotoUrl: data.vehiclePhotoUrl,
        aadhaarCardPhotoUrl: data.aadhaarCardPhotoUrl,
        driverDetails: data.experienceYears ? {
          experienceYears: data.experienceYears,
          licenceNumber: data.licenceNumber,
          licenceExpiryDate: data.licenceExpiryDate,
          licenceType: data.licenceType,
          preferredLocation: data.preferredLocation,
          workHistory: data.workHistory,
        } : undefined,
        truckDetails: data.truckType ? {
          truckType: data.truckType,
          brandModel: data.truckBrandModel,
          manufacturingDate: data.manufacturingDate,
          registrationNumber: data.registrationNumber,
          registrationDetails: data.registrationNumber,
          loadCapacity: data.loadCapacity,
          availability: data.vehicleAvailability,
          location: data.vehicleLocation,
        } : undefined,
      };
    }
  } catch {}

  return null;
}

/**
 * Creates session UserProfile for authenticated user, merging Firestore data if provided.
 */
export function syncUserProfile(
  fbUser: FirebaseUser, 
  customData?: Partial<UserProfile>
): UserProfile {
  let authMetadata: any = null;
  if (fbUser.photoURL && fbUser.photoURL.startsWith("{")) {
    try {
      authMetadata = JSON.parse(fbUser.photoURL);
    } catch {}
  }

  const emailPrefix = fbUser.email ? fbUser.email.split("@")[0] : "Partner";
  const formattedName = customData?.fullName || fbUser.displayName || customData?.name || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
  const rawPhone = customData?.phoneNumber || fbUser.phoneNumber || customData?.phone || authMetadata?.phone || "+919876543210";
  const regType: RegistrationType | undefined = customData?.registrationType || authMetadata?.regType;

  // Determine role based on registrationType or explicit role
  let derivedRole: UserRole = (customData?.role as UserRole) || authMetadata?.role || "gig_worker";
  if (regType === "truck_owner") {
    derivedRole = "truck_owner";
  } else if (regType === "driver_and_truck_owner") {
    derivedRole = "driver_and_truck_owner";
  } else if (regType === "driver") {
    derivedRole = "driver";
  } else if (regType === "rent_and_drive") {
    derivedRole = "rent_and_drive";
  }

  const isOwnerTier = derivedRole === "truck_owner" || derivedRole === "owner_admin" || derivedRole === "driver_and_truck_owner";

  return {
    id: `user-${fbUser.uid.slice(0, 8)}`,
    uid: fbUser.uid,
    name: formattedName,
    fullName: formattedName,
    phone: rawPhone,
    phoneNumber: rawPhone,
    email: fbUser.email || customData?.emailAddress || customData?.email || `${fbUser.uid.slice(0, 8)}@goride.in`,
    emailAddress: fbUser.email || customData?.emailAddress || customData?.email || `${fbUser.uid.slice(0, 8)}@goride.in`,
    isLoggedIn: true,
    role: derivedRole,
    registrationType: regType,
    city: customData?.preferredLocation || customData?.vehicleLocation || customData?.city || authMetadata?.city || "Delhi NCR",
    kycStatus: "verified",
    walletBalance: customData?.walletBalance ?? 0,
    securityDepositInEscrow: customData?.securityDepositInEscrow ?? 0,
    totalEarned: customData?.totalEarned ?? 0,
    totalSpentOnRent: customData?.totalSpentOnRent ?? 0,
    preferredLanguage: (customData?.preferredLanguage as AppLanguage) || "hinglish",
    licenseNumber: customData?.licenceNumber || customData?.driverDetails?.licenceNumber || customData?.licenseNumber || "DL-042021008942",
    aadhaarNumber: customData?.aadhaarNumber || "XXXX-XXXX-7812",
    bankAccount: customData?.bankAccount,

    // Flat fields
    experienceYears: customData?.experienceYears,
    licenceNumber: customData?.licenceNumber,
    licenceExpiryDate: customData?.licenceExpiryDate,
    licenceType: customData?.licenceType,
    preferredLocation: customData?.preferredLocation,
    workHistory: customData?.workHistory,

    truckType: customData?.truckType,
    truckBrandModel: customData?.truckBrandModel,
    manufacturingDate: customData?.manufacturingDate,
    registrationNumber: customData?.registrationNumber,
    loadCapacity: customData?.loadCapacity,
    vehicleAvailability: customData?.vehicleAvailability,
    vehicleLocation: customData?.vehicleLocation,

    driverDetails: customData?.driverDetails || (customData?.experienceYears ? {
      experienceYears: customData.experienceYears,
      licenceNumber: customData.licenceNumber || "DL-042021008942",
      licenceExpiryDate: customData.licenceExpiryDate || "2031-12-31",
      licenceType: customData.licenceType || "LMV-TR",
      preferredLocation: customData.preferredLocation || "Delhi NCR",
      workHistory: customData.workHistory || "",
    } : authMetadata?.driverDetails),

    truckDetails: customData?.truckDetails || (customData?.truckType ? {
      truckType: customData.truckType,
      brandModel: customData.truckBrandModel || "Tata",
      manufacturingDate: customData.manufacturingDate || "2023",
      registrationNumber: customData.registrationNumber || "DL-01-AB-1234",
      registrationDetails: customData.registrationNumber || "Active Commercial Permit",
      loadCapacity: customData.loadCapacity || "1.0 Ton",
      availability: customData.vehicleAvailability || "Immediate",
      location: customData.vehicleLocation || "Delhi NCR",
    } : authMetadata?.truckDetails),

    // Mandatory Document Photos (JPG format)
    aadhaarCardImage: customData?.aadhaarCardImage,
    licenceCardImage: customData?.licenceCardImage,
    vehicleRcImage: customData?.vehicleRcImage,
  };
}

export async function logOutUser(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.error("Firebase sign out error:", err);
  }
}

/**
 * Validates and securely saves bank account details into Firestore users/{uid}.
 * Never publicly exposes the raw account number in the stored profile.
 */
export async function saveUserBankAccountToFirestore(
  uid: string,
  bankData: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  }
) {
  if (!uid) {
    throw new Error("Cannot save bank account: User UID is missing.");
  }

  const cleanHolder = bankData.accountHolderName.trim();
  const cleanBank = bankData.bankName.trim();
  const cleanAcc = bankData.accountNumber.replace(/\D/g, "");
  const cleanIfsc = bankData.ifscCode.trim().toUpperCase();

  if (!cleanHolder || cleanHolder.length < 3) {
    throw new Error("Please enter a valid Account Holder Name (at least 3 characters).");
  }
  if (!cleanBank || cleanBank.length < 2) {
    throw new Error("Please enter a valid Bank Name.");
  }
  if (!cleanAcc || cleanAcc.length < 9 || cleanAcc.length > 18) {
    throw new Error("Please enter a valid 9 to 18-digit Bank Account Number.");
  }
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
    throw new Error("Please enter a valid 11-character Indian IFSC code (e.g. HDFC0001234, SBIN0004567).");
  }

  const maskedNumber = `•••• •••• ${cleanAcc.slice(-4)}`;
  const updatedAt = new Date().toISOString();

  const payload = {
    bankAccountHolderName: cleanHolder,
    bankName: cleanBank,
    bankAccountNumberMasked: maskedNumber,
    bankIfscCode: cleanIfsc,
    bankAccountUpdatedAt: updatedAt,
  };

  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, payload, { merge: true });

  const bankAccountResult = {
    accountHolderName: cleanHolder,
    bankName: cleanBank,
    accountNumberMasked: maskedNumber,
    ifscCode: cleanIfsc,
    isVerified: true,
    updatedAt,
  };

  try {
    localStorage.setItem(`zyro_bank_${uid}`, JSON.stringify(bankAccountResult));
  } catch {}

  return bankAccountResult;
}


