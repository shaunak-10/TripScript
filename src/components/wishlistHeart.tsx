"use client";
import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  arrayRemove,
  updateDoc,
  arrayUnion,
  doc,
  where,
  getDocs,
  query,
} from "firebase/firestore";

const WishlistHeart = ({ city }: { city: string }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkIsFavourite();
    }
  }, [user]);

  const checkIsFavourite = async () => {
    const WishlistRef = collection(db, "favourites");
    const Wishlist = await getDocs(
      query(WishlistRef, where("userId", "==", user?.uid))
    );
    const list = Wishlist.docs[0].data().wishlist;
    if (list.includes(city)) {
      setIsLiked(true);
    }
  };

  const handleLike = async () => {
    setIsLiked(true);
    const WishlistRef = collection(db, "favourites");
    const Wishlist = await getDocs(
      query(WishlistRef, where("userId", "==", user?.uid))
    );
    const docid = Wishlist.docs[0].id;
    await updateDoc(doc(db, "favourites", docid), {
      wishlist: arrayUnion(city),
    });
  };
  const handleDislike = async () => {
    setIsLiked(false);
    const WishlistRef = collection(db, "favourites");
    const Wishlist = await getDocs(
      query(WishlistRef, where("userId", "==", user?.uid))
    );
    const docid = Wishlist.docs[0].id;
    await updateDoc(doc(db, "favourites", docid), {
      wishlist: arrayRemove(city),
    });
  };

  if (!user) {
    return <p>Login to add this destination to your wishlist</p>;
  }

  return (
    <div>
      {isLiked ? (
        <FavoriteIcon
          className="text-red-500 text-4xl"
          onClick={handleDislike}
        />
      ) : (
        <FavoriteBorderIcon
          className="text-red-500 text-4xl"
          onClick={handleLike}
        />
      )}
    </div>
  );
};

export default WishlistHeart;
