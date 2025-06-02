export interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // Main image
  images?: string[]; // Optional: for gallery if multiple images exist
  brand: string;
  category: string;
  description: string; // Short description
  longDescription: string; // Detailed description
  specifications: {
    weightCapacity: number; // kg
    dimensions?: string; // e.g., "110cm x 60cm x 100cm"
    batteryLife?: string; // e.g., "Up to 25km"
    // Add other relevant specifications
  };
  features: string[];
  dateAdded: Date;
}

export const products: Product[] = [
  {
    id: 1,
    name: "zander chair",
    price: 3599.99,
    image: "/powerglide-x500.jpg", // Ensure this image exists in /public
    images: ["/powerglide-x500.jpg", "/easyfold-lite.jpg", "/explorer-scooter.jpg", "/powerglide-x500.jpg"], // Example for gallery
    brand: "MobilityPlus",
    category: "Power Wheelchair",
    description: "Experience unparalleled freedom with the PowerGlide X500, a robust and reliable electric wheelchair designed for active users.",
    longDescription: "The PowerGlide X500 Electric Wheelchair offers a perfect blend of comfort, performance, and durability. Its powerful motors and advanced suspension system provide a smooth ride on various terrains. With an ergonomic design and customizable features, it ensures maximum comfort for daily use. Long-lasting battery life keeps you going all day.",
    specifications: {
      weightCapacity: 180,
      dimensions: "115cm x 64cm x 98cm",
      batteryLife: "Up to 30km",
    },
    features: ["Foldable Frame", "Indoor/Outdoor Use", "Adjustable Armrests", "LED Lighting"],
    dateAdded: new Date("2025-03-15")
  },
  {
    id: 2,
    name: "EasyFold Lite Travel Wheelchair",
    price: 1299.99,
    image: "/easyfold-lite.jpg", // Ensure this image exists in /public
    brand: "TravelMobility",
    category: "Folding Wheelchair",
    description: "The EasyFold Lite is your perfect companion for travel, offering exceptional portability and ease of use.",
    longDescription: "Designed for those on the go, the EasyFold Lite Travel Wheelchair combines a lightweight aluminum frame with a simple folding mechanism. It fits easily into car trunks and is ideal for vacations or day trips. Despite its light weight, it doesn't compromise on comfort or stability.",
    specifications: {
      weightCapacity: 120,
      dimensions: "90cm x 55cm x 92cm (unfolded)",
      batteryLife: "N/A (Manual)",
    },
    features: ["Ultra Lightweight", "Quick Fold", "Travel Friendly", "Compact Design"],
    dateAdded: new Date("2025-04-02")
  },
  // ... (add description, longDescription, and specifications to other products)
  // For products where these fields are not yet added, provide sensible defaults or empty strings.
  // Example for product 3:
  {
    id: 3,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },
  {
    id: 4,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },
  {
    id: 5,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },{
    id: 6,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },{
    id: 7,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },{
    id: 8,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },{
    id: 9,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },{
    id: 10,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    description: "Navigate your world with confidence on the Explorer 4-Wheel Mobility Scooter, built for stability and range.",
    longDescription: "The Explorer 4-Wheel Mobility Scooter provides exceptional stability and comfort for outdoor adventures. It features large, pneumatic tires, a full suspension system, and a powerful motor to tackle various terrains. The captain's seat offers all-day comfort, and the intuitive controls make operation simple.",
    specifications: {
      weightCapacity: 160,
      batteryLife: "Up to 40km",
      dimensions: "130cm x 65cm x 110cm"
    },
    features: ["All-Terrain", "Long Battery Life", "Adjustable Captain's Seat", "Front & Rear Lights"],
    dateAdded: new Date("2025-03-28")
  },
];

export const getAllBrands = (): string[] => {
  return [...new Set(products.map(product => product.brand))];
};

export const getAllCategories = (): string[] => {
  return [...new Set(products.map(product => product.category))];
};

export const getAllFeatures = (): string[] => {
  const allFeatures = products.flatMap(product => product.features);
  return [...new Set(allFeatures)];
};
