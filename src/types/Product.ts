export interface Product {
  id: string;
  name: string;
  price: number; // Assuming price in SGD, will format later
  image: string;
  category: string;
  brand: string;
  // Add other relevant fields from requirements if needed for filtering later
  // e.g., weightCapacity, keyFeatures, dateAdded
}
