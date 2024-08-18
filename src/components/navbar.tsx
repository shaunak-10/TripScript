"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut, User, deleteUser } from "firebase/auth";
import MessageBox from "@/components/messagebox";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

export default function NavbarComponent() {
  const [user, setUser] = useState<User | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const placeholders = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Toronto",
    "Vancouver",
    "Montreal",
    "Paris",
    "London",
    "Berlin",
    "Madrid",
    "Rome",
    "Amsterdam",
    "Vienna",
    "Sydney",
    "Melbourne",
    "Tokyo",
    "Osaka",
    "Seoul",
    "Hong Kong",
    "Shanghai",
    "Beijing",
    "Singapore",
    "Bangkok",
    "Mumbai",
    "Delhi",
    "Istanbul",
    "Dubai",
    "Jeddah",
    "Cairo",
    "Lagos",
    "Nairobi",
    "Buenos Aires",
    "Sao Paulo",
    "Rio de Janeiro",
    "Lima",
    "Bogota",
    "Santiago",
    "Mexico City",
    "Toronto",
    "San Salvador",
    "Guatemala City",
    "Managua",
    "Havana",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/destination?city=${searchTerm}`);
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    setError(null);
    try {
      if (user) {
        await deleteUser(user);
      }
      setUser(null);
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        setError("Please sign in again to delete your account.");
      } else {
        setError("Failed to delete account.");
      }
    }
    setIsDeleteLoading(false);
  };

  return (
    <Navbar
      position="static"
      className="bg-gradient-to-r from-blue-50 to-green-50 shadow-lg py-2"
    >
      <NavbarBrand>
        <Link
          color="foreground"
          href="/"
          className="font-bold text-2xl text-blue-800 hover:text-blue-600 transition-colors duration-200"
        >
          TripScript
        </Link>
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem className="w-full">
          <form onSubmit={handleSubmit}>
            <Input
              placeholder={placeholders[currentPlaceholder]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              endContent={<SearchIcon />}
              color="primary"
            />
          </form>
        </NavbarItem>
      </NavbarContent>

      {!user ? (
        <NavbarContent justify="end" className="space-x-4">
          <NavbarItem className="hidden lg:flex">
            <Link
              href="/login"
              className="text-sm font-medium hover:underline transition-all"
            >
              Login
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href="/signup" color="primary" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <Popover>
            <PopoverTrigger>
              <Avatar
                as="button"
                className="transition-transform hover:scale-110"
                name={user.displayName ? user.displayName : "User"}
                size="md"
                src={
                  user.photoURL
                    ? user.photoURL
                    : "https://cdn-icons-png.flaticon.com/256/59/59170.png"
                }
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex m-4">
                <Avatar
                  src={
                    user.photoURL
                      ? user.photoURL
                      : "https://cdn-icons-png.flaticon.com/256/59/59170.png"
                  }
                  size="lg"
                />
                <div className="flex flex-col ml-4">
                  <p className="text-lg font-bold">{user.displayName}</p>
                  <p className="text-md">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since{" "}
                    {user.metadata.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Unknown"}
                  </p>
                </div>
              </div>
              <Divider />
              <div className="m-4 w-full flex flex-col gap-2">
                <Button
                  color="danger"
                  variant="flat"
                  className="w-full"
                  onClick={async () => await signOut(auth)}
                >
                  Sign Out
                </Button>
                <Button color="danger" className="w-full" onPress={onOpen}>
                  Delete Account
                </Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Delete your account?
                      </ModalHeader>
                      <ModalBody>
                        <p>
                          Once you delete your account, it cannot be undone.
                        </p>
                        {error && <MessageBox type="error" message={error} />}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          isLoading={isDeleteLoading}
                          onClick={handleDelete}
                        >
                          Delete Account
                        </Button>
                      </ModalFooter>
                    </>
                  </ModalContent>
                </Modal>
              </div>
            </PopoverContent>
          </Popover>
        </NavbarContent>
      )}
    </Navbar>
  );
}
