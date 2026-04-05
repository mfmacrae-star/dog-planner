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
      "https://images.unsplash.com/photo-1713898007012-355894896bc0?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1724989755339-6d76cbbe93db?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1608515922288-bc072d9ead4c?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1648948302801-d992ea007b55?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=700&auto=format&fit=crop&q=60",
    ],
  },
  2: {
    breed: "Siberian Husky",
    photos: [
      "https://images.unsplash.com/photo-1542222721-4728992b54cc?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1627220832671-b8fbf262f5cb?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1629246999471-f0cf6b30ceae?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1558099089-ba08c0364321?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?w=700&auto=format&fit=crop&q=60",
    ],
  },
  3: {
    breed: "Old English Sheepdog",
    photos: [
      "https://images.unsplash.com/photo-1645725750938-50ccea52c12b?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1676744005029-b53dcd3cd0aa?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1729014202973-840bbd077b9b?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&auto=format&fit=crop&q=60",
    ],
  },
  4: {
    breed: "Belgian Malinois",
    photos: [
      "https://images.unsplash.com/photo-1603724121245-661e39b69a14?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1615663482725-e4f675183c03?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581614061245-05764a727edc?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1647087602470-886d2be417c1?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=700&auto=format&fit=crop&q=60",
    ],
  },
  5: {
    breed: "Pekingese",
    photos: [
      "https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=60",
    ],
  },
  6: {
    breed: "Whippet",
    photos: [
      "https://images.unsplash.com/photo-1625992095709-b74d6be8b422?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1615714927995-e638cc7d9bc2?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1633835078597-d5daeecbcb7e?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1637666462118-474947bb8e2c?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=700&auto=format&fit=crop&q=60",
    ],
  },
  7: {
    breed: "Labrador Retriever",
    photos: [
      "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1630053905273-2dd2f41f0127?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1623052940978-051d2c0fb4be?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1672838564788-e1e502b0cf54?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=700&auto=format&fit=crop&q=60",
    ],
  },
  8: {
    breed: "Border Collie",
    photos: [
      "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=700&auto=format&fit=crop&q=60",
    ],
  },
  9: {
    breed: "Bloodhound",
    photos: [
      "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=700&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1664392217772-295bf3254121?w=700&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1664303034905-2e850c5430a0?w=700&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1661962979021-34716df17f01?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=700&auto=format&fit=crop&q=60",
    ],
  },
  10: {
    breed: "Scottish Terrier",
    photos: [
      "https://images.unsplash.com/photo-1691564808249-33654b07aef5?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1501751405784-6c8590d6b897?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1605897472359-85e4b94d685d?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=700&auto=format&fit=crop&q=60",
    ],
  },
  11: {
    breed: "Australian Cattle Dog",
    photos: [
      "https://images.unsplash.com/photo-1732520984449-9941cd1fcddb?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1732520976413-e19870244565?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1732520970519-bd096746960f?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=700&auto=format&fit=crop&q=60",
    ],
  },
  12: {
    breed: "Saint Bernard",
    photos: [
      "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=700&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=700&auto=format&fit=crop&q=60",
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