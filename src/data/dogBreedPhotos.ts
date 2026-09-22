// Dog breed photos by month - one photo per week
// Week 1 = days 1-7, Week 2 = days 8-14, Week 3 = days 15-21, Week 4 = days 22-28, Week 5 = days 29-31

export interface MonthBreedPhotos {
  breed: string;
  photos: [string, string, string, string, string]; // 5 weekly photos
  // Optional per-week CSS object-position overrides (e.g. "center 20%") for
  // photos whose subject sits off-center — keeps faces in frame when the
  // tile/modal crops with object-fit: cover. Undefined = "center".
  positions?: [string?, string?, string?, string?, string?];
}

export const dogBreedPhotos: Record<number, MonthBreedPhotos> = {
  1: {
    breed: "Poodle",
    photos: [
      "https://images.unsplash.com/photo-1713898007012-355894896bc0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1724989755339-6d76cbbe93db?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9vZGxlc3xlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1608515922288-bc072d9ead4c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBvb2RsZXN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1648948302801-d992ea007b55?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHBvb2RsZXN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1771858594034-4239c978c9cb?crop=entropy&cs=srgb&fm=jpg&q=85",
    ],
    // w1: portrait, head near crop top
    positions: ["center 40%", undefined, undefined, undefined, undefined],
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
    // w1: portrait, head cut by center crop
    positions: ["center 30%", undefined, undefined, undefined, undefined],
  },
  3: {
    breed: "Old English Sheepdog",
    photos: [
      "https://images.unsplash.com/photo-1645725750938-50ccea52c12b",
      "https://images.pexels.com/photos/106916/pexels-photo-106916.jpeg",
      "https://images.pexels.com/photos/3367616/pexels-photo-3367616.jpeg",
      "https://images.unsplash.com/photo-1676744005029-b53dcd3cd0aa",
      "https://images.unsplash.com/photo-1729014202973-840bbd077b9b",
    ],
    // w4: portrait, face in top third
    positions: [undefined, undefined, undefined, "center 25%", undefined],
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
    // w4: dog looking up, head at top
    positions: [undefined, undefined, undefined, "center 22%", undefined],
  },
  5: {
    breed: "Pekingese",
    photos: [
      "https://images.pexels.com/photos/6075441/pexels-photo-6075441.jpeg",
      "https://images.pexels.com/photos/20144217/pexels-photo-20144217.jpeg",
      "https://images.pexels.com/photos/12630565/pexels-photo-12630565.jpeg",
      "https://images.pexels.com/photos/283014/pexels-photo-283014.jpeg",
      "https://images.pexels.com/photos/12650783/pexels-photo-12650783.jpeg",
    ],
    // w3: crown of head at crop edge; w5 was a duplicate of w1 - replaced 9/12
    // with close-up Pekingese (12650783), centers fine by default
    positions: [undefined, undefined, "center 35%", undefined, undefined],
  },
  6: {
    breed: "Whippet",
    photos: [
      "https://images.unsplash.com/photo-1625992095709-b74d6be8b422?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2hpcHBldHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1615714927995-e638cc7d9bc2?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2hpcHBldHxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1633835078597-d5daeecbcb7e?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdoaXBwZXR8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1637666462118-474947bb8e2c?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdoaXBwZXR8ZW58MHx8MHx8fDA%3D",
      "https://images.pexels.com/photos/14653227/pexels-photo-14653227.jpeg",
    ],
    // w5: portrait, face in top quarter
    positions: [undefined, undefined, undefined, undefined, "center 15%"],
  },
  7: {
    breed: "Labrador Retriever",
    photos: [
      "https://images.pexels.com/photos/94829/pexels-photo-94829.jpeg",
      "https://images.unsplash.com/photo-1630053905273-2dd2f41f0127?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxhYnJhZG9yJTIwcmV0cmlldmVyfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1623052940978-051d2c0fb4be?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhYnJhZG9yJTIwcmV0cmlldmVyfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1672838564788-e1e502b0cf54?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFicmFkb3IlMjByZXRyaWV2ZXIlMjBwdXBwaWVzfGVufDB8fDB8fHww",
      "https://images.pexels.com/photos/20020145/pexels-photo-20020145.jpeg",
    ],
    // w1/w2: close-up portraits, eyes above center crop
    positions: ["center 18%", "center 20%", undefined, undefined, undefined],
  },
  8: {
    breed: "Border Collie",
    photos: [
      "https://images.pexels.com/photos/35960838/pexels-photo-35960838.jpeg",
      "https://images.pexels.com/photos/16995263/pexels-photo-16995263.jpeg",
      "https://images.pexels.com/photos/15794775/pexels-photo-15794775.jpeg",
      "https://images.pexels.com/photos/19296593/pexels-photo-19296593.jpeg",
      "https://images.pexels.com/photos/8734476/pexels-photo-8734476.jpeg",
    ],
    // w1: portrait, head above crop
    positions: ["center 30%", undefined, undefined, undefined, undefined],
  },
  9: {
    breed: "Bloodhound",
    photos: [
      "https://upload.wikimedia.org/wikipedia/commons/2/22/Bloodhound_black_and_tan.jpg",
      "https://plus.unsplash.com/premium_photo-1664392217772-295bf3254121?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ymxvb2Rob3VuZHxlbnwwfHwwfHx8MA%3D%3D",
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/Cooper_is_a_bloodhound.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/Bloodhound-Female.jpg",
      "https://images.pexels.com/photos/7340691/pexels-photo-7340691.jpeg",
    ],
    // w1: Wikimedia Commons "Bloodhound black and tan.jpg" (1458x1033, PUBLIC
    //     DOMAIN). Replaced pexels 127993, which was a lean long-legged hound
    //     with no dewlap or wrinkles - a great dane or pointer type, not a
    //     bloodhound. Head is on the right in the upper third -> "center 30%".
    // w2: dog low in frame (empty wall above) - bias up to keep the head
    // w3: Wikimedia Commons "Cooper is a bloodhound.jpg" (985x1340) by Nancy
    //     Wong, **CC BY-SA 4.0 - ATTRIBUTION REQUIRED**, credited in BreedBook.
    //     Replaced an unsplash frame-filling close-up cropped at the ears; this
    //     one is pulled back and centred, head in the upper third -> "center 25%".
    // w4: Wikimedia Commons "Bloodhound-Female.jpg" (804x838, PUBLIC DOMAIN,
    //     author Ltshears). Head sits in the upper third, hence "center 20%".
    //     Replaced the original w4 (unsplash premium_photo-1661962979021), which
    //     was a VIZSLA, not a bloodhound, and was live in production until
    //     2026-09-21. All five verified that day by downloading and viewing.
    // w5: dog standing in snow, head in the upper third
    positions: ["center 30%", "center 38%", "center 25%", "center 20%", "center 30%"],
  },
  10: {
    breed: "Scottish Terrier",
    photos: [
      "https://images.unsplash.com/photo-1691564808249-33654b07aef5?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NvdHRpc2glMjB0ZXJyaWVyfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1501751405784-6c8590d6b897?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2NvdHRpc2glMjB0ZXJyaWVyfGVufDB8fDB8fHww",
      "https://images.pexels.com/photos/7755249/pexels-photo-7755249.jpeg",
      "https://images.pexels.com/photos/27897286/pexels-photo-27897286.jpeg",
      "https://images.pexels.com/photos/16872864/pexels-photo-16872864.jpeg",
    ],
    // w5 was a duplicate of w4 - replaced 9/12 with beach Scottie (16872864)
    // w4: face low in frame  w5: face upper-middle
    positions: [undefined, undefined, undefined, "center 60%", "center 40%"],
  },
  11: {
    breed: "Australian Cattle Dog",
    photos: [
      "https://images.unsplash.com/photo-1732520984449-9941cd1fcddb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVzdHJhaWxpYW4lMjBjYXR0bGUlMjBkb2d8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1732520976413-e19870244565?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXVzdHJhaWxpYW4lMjBjYXR0bGUlMjBkb2d8ZW58MHx8MHx8fDA%3D",
      "https://images.pexels.com/photos/1436134/pexels-photo-1436134.jpeg",
      "https://images.pexels.com/photos/29102445/pexels-photo-29102445.jpeg",
      "https://images.unsplash.com/photo-1732520970519-bd096746960f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YXVzdHJhaWxpYW4lMjBjYXR0bGUlMjBkb2d8ZW58MHx8MHx8fDA%3D",
    ],
    // w5: two dogs left of frame
    positions: [undefined, undefined, undefined, undefined, "30% center"],
  },
  12: {
    breed: "Saint Bernard",
    photos: [
      "https://images.pexels.com/photos/12345219/pexels-photo-12345219.jpeg",
      "https://images.pexels.com/photos/10253852/pexels-photo-10253852.jpeg",
      "https://images.pexels.com/photos/5225527/pexels-photo-5225527.jpeg",
      "https://images.pexels.com/photos/6721024/pexels-photo-6721024.jpeg",
      "https://images.pexels.com/photos/11654187/pexels-photo-11654187.jpeg",
    ],
    // w1 crown at edge; w4 head in top third
    positions: ["center 35%", undefined, undefined, "center 25%", undefined],
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

// Helper: CSS object-position / background-position for a day's photo
export function getDogPhotoPositionForDate(month: number, day: number): string {
  const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
  return dogBreedPhotos[month]?.positions?.[weekIndex] ?? "center";
}