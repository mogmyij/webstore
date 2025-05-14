export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  weightCapacity: number;
  features: string[];
  dateAdded: Date;
}

export const products: Product[] = [
  {
    id: 1,
    name: "PowerGlide X500 Electric Wheelchair",
    price: 3599.99,
    image: "/images/powerglide-x500.jpg",
    brand: "MobilityPlus",
    category: "Power Wheelchair",
    weightCapacity: 180,
    features: ["Foldable", "Indoor/Outdoor", "Adjustable Armrests"],
    dateAdded: new Date("2025-03-15")
  },
  {
    id: 2,
    name: "EasyFold Lite Travel Wheelchair",
    price: 1299.99,
    image: "/images/easyfold-lite.jpg",
    brand: "TravelMobility",
    category: "Folding Wheelchair",
    weightCapacity: 120,
    features: ["Foldable", "Lightweight", "Travel Friendly"],
    dateAdded: new Date("2025-04-02")
  },
  {
    id: 3,
    name: "Explorer 4-Wheel Mobility Scooter",
    price: 2499.99,
    image: "/images/explorer-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    weightCapacity: 160,
    features: ["All-Terrain", "Long Battery Life", "Adjustable Seat"],
    dateAdded: new Date("2025-03-28")
  },
  {
    id: 4,
    name: "UltraGlide Powered Wheelchair",
    price: 4299.99,
    image: "/images/ultraglide.jpg",
    brand: "MobilityPlus",
    category: "Power Wheelchair",
    weightCapacity: 200,
    features: ["Indoor/Outdoor", "Adjustable", "High Weight Capacity"],
    dateAdded: new Date("2025-02-18")
  },
  {
    id: 5,
    name: "Compact Travel Scooter",
    price: 1899.99,
    image: "/images/compact-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    weightCapacity: 115,
    features: ["Foldable", "Lightweight", "Portable"],
    dateAdded: new Date("2025-04-10")
  },
  {
    id: 6,
    name: "All-Terrain Freedom Scooter",
    price: 3299.99,
    image: "/images/freedom-scooter.jpg",
    brand: "OutdoorMobility",
    category: "Mobility Scooter",
    weightCapacity: 180,
    features: ["All-Terrain", "Long Range", "Weather Resistant"],
    dateAdded: new Date("2025-03-05")
  },
  {
    id: 7,
    name: "EasyRise Power Lift Chair",
    price: 1599.99,
    image: "/images/easyrise-chair.jpg",
    brand: "ComfortPlus",
    category: "Lift Chair",
    weightCapacity: 150,
    features: ["Power Lift", "Reclining", "Comfortable"],
    dateAdded: new Date("2025-04-22")
  },
  {
    id: 8,
    name: "LightGlide Manual Wheelchair",
    price: 899.99,
    image: "/images/lightglide.jpg",
    brand: "TravelMobility",
    category: "Manual Wheelchair",
    weightCapacity: 110,
    features: ["Lightweight", "Foldable", "Portable"],
    dateAdded: new Date("2025-02-28")
  },
  {
    id: 9,
    name: "Bariatric Power Wheelchair",
    price: 4899.99,
    image: "/images/bariatric-power.jpg",
    brand: "MobilityPlus",
    category: "Power Wheelchair",
    weightCapacity: 250,
    features: ["High Weight Capacity", "Extra Wide Seat", "Durable"],
    dateAdded: new Date("2025-03-12")
  },
  {
    id: 10,
    name: "Compact Indoor Scooter",
    price: 1499.99,
    image: "/images/indoor-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    weightCapacity: 120,
    features: ["Indoor Use", "Tight Turning Radius", "Compact"],
    dateAdded: new Date("2025-04-15")
  },
  {
    id: 11,
    name: "Heavy Duty Outdoor Scooter",
    price: 3899.99,
    image: "/images/heavy-duty-scooter.jpg",
    brand: "OutdoorMobility",
    category: "Mobility Scooter",
    weightCapacity: 220,
    features: ["All-Terrain", "High Weight Capacity", "Long Range"],
    dateAdded: new Date("2025-02-05")
  },
  {
    id: 12,
    name: "Pediatric Wheelchair",
    price: 1299.99,
    image: "/images/pediatric-wheelchair.jpg",
    brand: "KidsMobility",
    category: "Manual Wheelchair",
    weightCapacity: 80,
    features: ["Adjustable", "Lightweight", "Kid-Friendly"],
    dateAdded: new Date("2025-03-20")
  },
  {
    id: 13,
    name: "Premium Power Recline Wheelchair",
    price: 5299.99,
    image: "/images/power-recline.jpg",
    brand: "MobilityPlus",
    category: "Power Wheelchair",
    weightCapacity: 180,
    features: ["Power Recline", "Headrest", "Leg Elevation"],
    dateAdded: new Date("2025-01-25")
  },
  {
    id: 14,
    name: "Portable Travel Scooter",
    price: 1099.99,
    image: "/images/travel-scooter.jpg",
    brand: "TravelMobility",
    category: "Mobility Scooter",
    weightCapacity: 100,
    features: ["Disassembles", "Lightweight", "Compact"],
    dateAdded: new Date("2025-04-05")
  },
  {
    id: 15,
    name: "Sports Active Wheelchair",
    price: 2199.99,
    image: "/images/sports-wheelchair.jpg",
    brand: "ActiveLife",
    category: "Manual Wheelchair",
    weightCapacity: 120,
    features: ["Lightweight", "Athletic Design", "Customizable"],
    dateAdded: new Date("2025-03-17")
  },
  {
    id: 16,
    name: "Deluxe Power Standing Wheelchair",
    price: 6999.99,
    image: "/images/standing-wheelchair.jpg",
    brand: "MobilityPlus",
    category: "Power Wheelchair",
    weightCapacity: 160,
    features: ["Standing Function", "Power Recline", "Advanced Controls"],
    dateAdded: new Date("2025-02-12")
  },
  {
    id: 17,
    name: "Economy Manual Wheelchair",
    price: 599.99,
    image: "/images/economy-wheelchair.jpg",
    brand: "BasicMobility",
    category: "Manual Wheelchair",
    weightCapacity: 120,
    features: ["Foldable", "Affordable", "Standard"],
    dateAdded: new Date("2025-04-18")
  },
  {
    id: 18,
    name: "Luxury Indoor/Outdoor Scooter",
    price: 3499.99,
    image: "/images/luxury-scooter.jpg",
    brand: "ScooterPro",
    category: "Mobility Scooter",
    weightCapacity: 170,
    features: ["Comfortable Seat", "Long Range", "Indoor/Outdoor"],
    dateAdded: new Date("2025-03-01")
  },
  {
    id: 19,
    name: "Ultra-Compact Folding Scooter",
    price: 2299.99,
    image: "/images/folding-scooter.jpg",
    brand: "TravelMobility",
    category: "Mobility Scooter",
    weightCapacity: 115,
    features: ["Auto-Folding", "Airline Approved", "Lightweight"],
    dateAdded: new Date("2025-02-22")
  },
  {
    id: 20,
    name: "All-Terrain Power Wheelchair",
    price: 4799.99,
    image: "/images/all-terrain-wheelchair.jpg",
    brand: "OutdoorMobility",
    category: "Power Wheelchair",
    weightCapacity: 200,
    features: ["Off-Road Capable", "All-Terrain Tires", "Rugged"],
    dateAdded: new Date("2025-01-30")
  }
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
