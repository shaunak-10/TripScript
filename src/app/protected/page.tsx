"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Accordion,
  AccordionItem,
  Link,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import MessageBox from "@/components/messagebox";

function CustomCarousel({ items }: { items: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Card Content */}
      <div className="w-[90%] mx-auto mb-8">{items[currentIndex]}</div>

      {/* Previous Button */}
      <div className="absolute top-0 left-[-10px] bottom-0 flex items-center">
        <Button
          isIconOnly
          onClick={goToPrevious}
          className="bg-primary-50 transition-colors shadow-md w-10 h-10 rounded-full flex items-center justify-center"
        >
          <span className="text-2xl">&lsaquo;</span>
        </Button>
      </div>

      {/* Next Button */}
      <div className="absolute top-0 right-[-10px] bottom-0 flex items-center">
        <Button
          isIconOnly
          onClick={goToNext}
          className="bg-primary-50 transition-colors shadow-md w-10 h-10 rounded-full flex items-center justify-center"
        >
          <span className="text-2xl">&rsaquo;</span>
        </Button>
      </div>

      {/* Index Indicator outside the card */}
      <div className="bg-white/70 px-3 py-1 rounded-full text-sm shadow-md">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  );
}

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [itinerariesArray, setItinerariesArray] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  useEffect(() => {
    if (user) {
      console.log(user?.photoURL);
      getItineraries();
      checkAndCreateWishlist();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError("Failed to sign out");
    }
  };

  const checkAndCreateWishlist = async () => {
    const WishlistRef = collection(db, "favourites");
    const Wishlist = await getDocs(
      query(WishlistRef, where("userId", "==", user?.uid))
    );
    if (Wishlist.empty) {
      try {
        const docRef = await addDoc(collection(db, "favourites"), {
          wishlist: [],
          userId: user?.uid,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        setError("Failed to create wishlist");
      }
    } else {
      const WishlistRef = collection(db, "favourites");
      try {
        const Wishlist = await getDocs(
          query(WishlistRef, where("userId", "==", user?.uid))
        );
        const list = Wishlist.docs[0].data().wishlist;
        setWishlist(list);
      } catch (error) {
        setError("Failed to fetch wishlist");
      }
    }
  };

  const getItineraries = async () => {
    try {
      setItinerariesArray([]);
      const itinerariesRef = collection(db, "itineraries");
      const itineraries = await getDocs(
        query(itinerariesRef, where("userId", "==", user?.uid))
      );
      if (itineraries.empty) {
        console.log("No itineraries found");
      } else {
        itineraries.forEach((doc) => {
          setItinerariesArray((prevItineraries) => [
            ...prevItineraries,
            { trip: doc.data().trip, id: doc.id },
          ]);
        });
      }
    } catch (error) {
      setError("Failed to fetch itineraries");
    }
  };

  const deleteItinerary = async (id: string) => {
    try {
      setItinerariesArray((prevItineraries) =>
        prevItineraries.filter((itinerary) => itinerary.id !== id)
      );
      const itinerariesRef = collection(db, "itineraries");
      const docRef = doc(itinerariesRef, id);
      await deleteDoc(docRef);
    } catch (error) {
      setError("Failed to delete itinerary");
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {error && (
        <div className="mb-8">
          <MessageBox message={error} type="error" />
        </div>
      )}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {user ? (
            user.emailVerified ? (
              <>
                <Card className="w-full border border-default-200 shadow-md">
                  <CardHeader className="justify-center pb-0">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar
                        isBordered
                        radius="full"
                        className="w-30 h-30"
                        src={
                          user?.photoURL || "https://via.placeholder.com/150"
                        }
                      />
                      <div className="flex flex-col items-center">
                        <h4 className="text-xl font-bold text-default-900">
                          {user?.displayName || "User Name"}
                        </h4>
                        <h5 className="text-sm text-default-500">
                          {user?.email || "user@example.com"}
                        </h5>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="justify-center pt-5">
                    <Button
                      color="danger"
                      variant="flat"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="w-full border border-blue-200 shadow-lg my-4 bg-gradient-to-r from-blue-50 to-green-50">
                  <CardHeader className="justify-center pb-2 pt-6 bg-gradient-to-r from-blue-400 to-blue-600">
                    <div className="flex flex-col items-center">
                      <h4 className="text-2xl font-bold text-white">
                        Your Wishlist
                      </h4>
                    </div>
                  </CardHeader>
                  <CardBody className="px-4 py-5">
                    <div className="flex flex-col items-center max-h-[250px] min-h-[250px] overflow-auto pr-2">
                      {wishlist.length === 0 ? (
                        <p className="text-gray-500 text-lg font-medium text-center mt-8">
                          Select the heart icon on a destination to add it to
                          your wishlist.
                        </p>
                      ) : (
                        <ul className="flex flex-col gap-3 w-full">
                          {wishlist.map((item, index) => (
                            <Link key={item} href={`/destination?city=${item}`}>
                              <li
                                key={item}
                                className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                              >
                                <span className="text-blue-800">{item}</span>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </>
            ) : (
              <p className="text-lg font-medium">Email not verified</p>
            )
          ) : (
            <p className="text-lg font-medium">
              Please login to see your profile
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Your Itineraries</h2>
          {itinerariesArray.length > 0 && user ? (
            <Accordion variant="shadow">
              {itinerariesArray.map((itinerary) => (
                <AccordionItem
                  key={itinerary.id}
                  aria-label={itinerary.trip.trip_name}
                  title={
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {itinerary.trip.trip_name}
                        </span>
                      </div>
                    </div>
                  }
                  subtitle={
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        {/* <Calendar size={16} className="text-default-400" /> */}
                        <span className="text-sm text-default-400">
                          {itinerary.trip.itinerary.length} days
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* <DollarSign size={16} className="text-default-400" /> */}
                        <span className="text-sm text-default-400">
                          {itinerary.trip.budget} {itinerary.trip.currency}
                        </span>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <CustomCarousel
                      items={itinerary.trip.itinerary.map(
                        (day: any, dayIndex: number) => (
                          <Card
                            key={dayIndex}
                            className="w-full h-[400px]  border border-blue-200 shadow-lg my-4 bg-gradient-to-r from-blue-50 to-green-50"
                          >
                            <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-600">
                              <h3 className="text-lg text-white font-semibold">
                                Day {day.day}: {day.theme}
                              </h3>
                            </CardHeader>
                            <CardBody className="overflow-y-auto ">
                              <div className="space-y-3">
                                {day.activities.map(
                                  (activity: any, actIndex: number) => (
                                    <div
                                      key={actIndex}
                                      className="border-b border-gray-200 pb-2 last:border-b-0"
                                    >
                                      <h4 className="font-medium">
                                        {activity.name}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {activity.description}
                                      </p>
                                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                                        <span>
                                          Duration: {activity.duration}
                                        </span>
                                        <span>Cost: {activity.cost}</span>
                                      </div>
                                      {activity.notes && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Note: {activity.notes}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        )
                      )}
                    />
                    <div className="flex justify-end">
                      <Button color="danger" onPress={onOpen}>
                        Delete Itinerary
                      </Button>
                      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                {itinerary.trip.trip_name}
                              </ModalHeader>
                              <ModalBody>
                                <p>
                                  Are you sure you want to delete this
                                  itinerary?
                                </p>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="danger"
                                  onPress={() => {
                                    deleteItinerary(itinerary.id);
                                    onClose();
                                  }}
                                >
                                  Delete Itinerary
                                </Button>
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-lg text-default-500">No itineraries found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
