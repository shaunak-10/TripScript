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
} from "@nextui-org/react";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function NavbarComponent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      if (!currentUser) {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Navbar position="static" className="shadow-md">
      <NavbarBrand>
        <Link
          color="foreground"
          href="/"
          className="font-bold text-xl hover:opacity-80 transition-opacity"
        >
          TripScript
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {["Features", "Customers", "Integrations"].map((item) => (
          <NavbarItem key={item}>
            <Link
              color="foreground"
              href="#"
              className="text-sm font-medium hover:underline transition-all"
            >
              {item}
            </Link>
          </NavbarItem>
        ))}
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
          <Avatar
            as="button"
            className="transition-transform hover:scale-110"
            name={user.displayName ? user.displayName : "User"}
            size="sm"
            src={
              user.photoURL
                ? user.photoURL
                : "https://cdn-icons-png.flaticon.com/256/59/59170.png"
            }
          />
        </NavbarContent>
      )}
    </Navbar>
  );
}
