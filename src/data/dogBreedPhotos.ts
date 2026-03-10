// Dog breed photos by month - one photo per week
// Week 1 = days 1-7, Week 2 = days 8-14, Week 3 = days 15-21, Week 4 = days 22-28, Week 5 = days 29-31

export interface MonthBreedPhotos {
  breed: string;
  photos: [string, string, string, string, string]; // 5 weekly photos
}

export const dogBreedPhotos: Record<number, MonthBreedPhotos> = {
  1: {
    breed: "Poodle",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL", // week 1
      "REPLACE_WITH_UNSPLASH_URL", // week 2
      "REPLACE_WITH_UNSPLASH_URL", // week 3
      "REPLACE_WITH_UNSPLASH_URL", // week 4
      "REPLACE_WITH_UNSPLASH_URL", // week 5
    ],
  },
  2: {
    breed: "Siberian Husky",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  3: {
    breed: "Old English Sheepdog",
    photos: [
      "https://images.unsplash.com/photo-1596972561180-ff5770ea2ca5?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8T2xkJTIwRW5nbGlzaCUyMFNoZWVwZG9nfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1622536623059-8277a04654f5?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2xkJTIwZW5nbGlzaCUyMHNoZWVwZG9nfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1676744005029-b53dcd3cd0aa?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b2xkJTIwZW5nbGlzaCUyMHNoZWVwZG9nfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1645725750938-50ccea52c12b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b2xkJTIwZW5nbGlzaCUyMHNoZWVwZG9nfGVufDB8fDB8fHww",
      "https://images.pexels.com/photos/35260897/pexels-photo-35260897.jpeg",
    ],
  },
  4: {
    breed: "Belgian Malinois",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  5: {
    breed: "Pekingese",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  6: {
    breed: "Whippet",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  7: {
    breed: "Labrador Retriever",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  8: {
    breed: "Border Collie",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  9: {
    breed: "Bloodhound",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  10: {
    breed: "Scottish Terrier",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  11: {
    breed: "Australian Cattle Dog",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
  12: {
    breed: "Saint Bernard",
    photos: [
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
      "REPLACE_WITH_UNSPLASH_URL",
    ],
  },
};

// Helper: get photo URL for a specific day of the month
export function getDogPhotoForDate(month: number, day: number): string {
  const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
  return dogBreedPhotos[month]?.photos[weekIndex] ?? "";
}

// Helper: get breed name for a month
export function getBreedForMonth(month: number): string {
  return dogBreedPhotos[month]?.breed ?? "";
}