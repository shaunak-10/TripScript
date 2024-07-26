"use client";
import { useState, useEffect } from "react";
import { auth } from "@/firebase"; // Import from firebase.ts
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import MessageBox from "@/components/messagebox";
import { useRouter } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleFileChange = (event: any) => {
    setError(null);
    const selectedFile = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile && selectedFile.size <= maxSize) {
      setFile(selectedFile);
    } else {
      setError("File size must be less than 5MB");
      event.target.value = "";
    }
  };

  const handleUpload = async (uid: string) => {
    if (!file) {
      return;
    }
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${uid}`);
    try {
      await uploadBytesResumable(storageRef, file);
    } catch (error) {
      setError("Failed to upload profile picture");
    }
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsFormLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsFormLoading(false);
      return;
    }
    if (name === "") {
      setError("Please enter your name");
      setIsFormLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const imageURL = await handleUpload(userCredential.user.uid);
      const updatedUser = {
        ...userCredential.user,
        photoURL: imageURL,
        displayName: name,
      };

      await updateProfile(userCredential.user, updatedUser);
      await sendEmailVerification(userCredential.user);

      await signOut(auth);
      setSuccessMessage(
        "Please check your email to verify your account, then login."
      );
    } catch (error: any) {
      const errorMessage = error.code.split("/").pop().replace(/-/g, " ");
      setError(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
    }
    setIsFormLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Sign Up to TripScript</h1>
      <form
        className="flex flex-col space-y-8 w-full max-w-md"
        onSubmit={handleSignup}
      >
        {" "}
        {/* Matched form container */}
        <Input
          type="text"
          id="name"
          label="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          id="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type={isVisible ? "text" : "password"}
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        />
        <Input
          type="password"
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex items-center">
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            as="label"
            htmlFor="profile-picture"
            color="primary"
            variant="flat"
          >
            Choose Profile Picture
          </Button>
          <span className="ml-3 text-sm text-gray-500">
            {file ? file.name : "No file chosen"}
          </span>
        </div>
        <Button
          type="submit"
          className="w-full inline-flex items-center px-4 py-2"
          color="primary"
          isLoading={isFormLoading}
        >
          Sign Up
        </Button>
        {error && <MessageBox message={error} type="error" />}
        {successMessage && (
          <MessageBox message={successMessage} type="success" />
        )}
      </form>
    </div>
  );
}

export default SignupPage;
