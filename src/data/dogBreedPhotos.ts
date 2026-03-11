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
      "https://images.unsplash.com/photo-1713898007012-355894896bc0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1724989755339-6d76cbbe93db?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1608515922288-bc072d9ead4c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBvb2RsZXN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1648948302801-d992ea007b55?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHBvb2RsZXN8ZW58MHx8MHx8fDA%3D",
      "https://plus.unsplash.com/premium_photo-1665956593069-4d1e37194c06?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI3fHxwb29kbGVzfGVufDB8fDB8fHww",
    ],
  },
  2: {
    breed: "Siberian Husky",
    photos: [
      "https://images.unsplash.com/photo-1542222721-4728992b54cc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2liZXJpYW4lMjBodXNreXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1627220832671-b8fbf262f5cb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2liZXJpYW4lMjBodXNreXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1629246999471-f0cf6b30ceae?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNpYmVyaWFuJTIwaHVza3l8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1558099089-ba08c0364321?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNpYmVyaWFuJTIwaHVza3l8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2liZXJpYW4lMjBodXNreXxlbnwwfHwwfHx8MA%3D%3D",
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
      "https://images.unsplash.com/photo-1603724121245-661e39b69a14?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlbGdpYW4lMjBtYWxpbm9pc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1615663482725-e4f675183c03?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJlbGdpYW4lMjBtYWxpbm9pc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.pexels.com/photos/9862315/pexels-photo-9862315.jpeg",
      "https://images.unsplash.com/photo-1581614061245-05764a727edc?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVsZ2lhbiUyMG1hbGlub2lzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1647087602470-886d2be417c1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVsZ2lhbiUyMG1hbGlub2lzfGVufDB8fDB8fHww",
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