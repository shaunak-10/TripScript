"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";

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
      getItineraries();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getItineraries = async () => {
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
          doc.data().trip,
        ]);
      });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {user ? (
            user.emailVerified ? (
              <Card className="w-full border border-default-200 shadow-md">
                <CardHeader className="justify-center pb-0">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar
                      isBordered
                      radius="full"
                      className="w-30 h-30"
                      src={user?.photoURL || "https://via.placeholder.com/150"}
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
          {itinerariesArray.length > 0 ? (
            <Accordion variant="shadow">
              {itinerariesArray.map((itinerary, index) => (
                <AccordionItem
                  key={index}
                  aria-label={itinerary.trip_name}
                  title={
                    <div className="flex items-center gap-2">
                      {/* <MapPin className="text-primary" size={20} /> */}
                      <span className="font-semibold">
                        {itinerary.trip_name}
                      </span>
                    </div>
                  }
                  subtitle={
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        {/* <Calendar size={16} className="text-default-400" /> */}
                        <span className="text-sm text-default-400">
                          {itinerary.itinerary.length} days
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* <DollarSign size={16} className="text-default-400" /> */}
                        <span className="text-sm text-default-400">
                          {itinerary.budget} {itinerary.currency}
                        </span>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <CustomCarousel
                      items={itinerary.itinerary.map(
                        (day: any, dayIndex: number) => (
                          <Card
                            key={dayIndex}
                            className="w-full h-[400px] shadow-md"
                          >
                            <CardHeader className="bg-primary-50">
                              <h3 className="text-lg font-semibold">
                                Day {day.day}: {day.theme}
                              </h3>
                            </CardHeader>
                            <CardBody className="overflow-y-auto">
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
