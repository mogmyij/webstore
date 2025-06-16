# Karvana E-Commerce Project Documentation

## 1. Overview

This document provides an overview of the Karvana e-commerce project's codebase. The project is a Next.js application built with TypeScript, Tailwind CSS, and React Context API for state management. It serves as an online store for mobility products, with an initial focus on a desktop viewing experience and guest checkout functionality.

**Key Technologies:**
*   **Frontend Framework/Library:** React with Next.js (App Router)
*   **Programming Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** React Context API (primarily for the shopping cart)
*   **Routing:** Next.js built-in App Router
*   **Database Provider:** Neon (PostgreSQL)
*   **Data:** Mock product data (for initial build)

## 2. Project Structure

The project is organized into several key directories:

*   `app/`: Contains page components and layouts, following Next.js App Router conventions.
*   `components/`: Houses reusable UI components, categorized into `common/`, `homepage/`, `shop/`, and `checkout/`.
*   `context/`: Manages global state, notably the `CartContext`.
*   `data/`: Stores mock product data and related interfaces/functions.
*   `config/`: Contains configuration files, like constants.

## 3. Core Application Files and Logic

### 3.1. Root Layout and Global Styles

*   **`app/layout.tsx`**:
    *   This is the root layout for the entire application.
    *   It wraps all page content with `CartProvider` to make cart state available globally.
    *   Includes the global `Header` and `Footer` components.
    *   Sets up global fonts (Geist Sans and Geist Mono) and applies base CSS classes for the body, enabling a flex column layout that ensures the footer stays at the bottom (`min-h-screen`).
    *   Defines global metadata (title, description) for SEO.

*   **`app/globals.css`**:
    *   Imports Tailwind CSS base, components, and utilities.
    *   Defines root CSS variables for theming (e.g., `--background`, `--foreground`), including support for dark mode via `@media (prefers-color-scheme: dark)`.
    *   Sets a default background color and font family for the body.

### 3.2. Pages (`app/` directory)

*   **`app/page.tsx` (Homepage)**:
    *   Serves as the landing page of the application.
    *   Composed of several distinct homepage-specific components:
        *   `Banner`: A prominent hero banner, likely with a call to action.
        *   `Bestsellers`: A section to showcase top-selling products.
        *   `Benefits`: Highlights key advantages or statistics of the company/products.
        *   `Values`: Displays company values, possibly with imagery.

*   **`app/shop/page.tsx` (Shop Page / Product Listing Page)**:
    *   Displays a list of available products.
    *   Implements comprehensive filtering and sorting functionalities.
    *   **State Management**: Uses `useState` for:
        *   `searchTerm`: For text-based product search.
        *   `priceRange`: A tuple `[min, max]` for price filtering.
        *   `selectedBrands`, `selectedCategories`, `selectedFeatures`, `selectedWeightRanges`: Arrays of strings to hold active filter selections.
        *   `sortOption`: String indicating the current sorting criteria (e.g., 'newest', 'price-asc').
        *   `filteredProducts`: An array of `Product` objects that dynamically updates based on applied filters and sorting.
        *   `isSidebarOpen`: Boolean to control the visibility of the filter sidebar on mobile.
    *   **Filtering Logic**: An `useEffect` hook recalculates `filteredProducts` whenever any filter or sort state changes.
        *   **Search**: Matches `searchTerm` (case-insensitive) against product names.
        *   **Price**: Filters products within the selected `priceRange`.
        *   **Brand/Category/Features**: Filters products based on exact matches in `selectedBrands`, `selectedCategories`, and `selectedFeatures`. For features, it checks if *any* of the product's features are in the selected list.
        *   **Weight Capacity**: Filters products based on predefined weight ranges (e.g., "Under 100kg", "100-150kg") by comparing against `product.specifications.weightCapacity`.
    *   **Sorting Logic**: Sorts the `result` array based on `sortOption` (dateAdded, name, price).
    *   **UI Components**:
        *   `FilterSidebar`: Allows users to apply various filters. Receives filter states and setters as props.
        *   `SortDropdown`: Allows users to select sorting criteria.
        *   `ProductCard`: Used to display each product in the grid. Each card links to the product's detail page.
    *   Includes breadcrumbs for navigation and displays the count of found results.

*   **`app/shop/[productId]/page.tsx` (Product Detail Page)**:
    *   Dynamically displays details for a specific product, identified by `productId` in the URL.
    *   Uses `useParams` from `next/navigation` to get the `productId`.
    *   **Data Fetching**:
        *   `getProductById(id)`: Helper function (likely from `data/Products.ts`) to find a product by its ID from the mock data.
        *   `getRelatedProducts(currentProduct)`: Helper function to find related products (e.g., same category, excluding the current one).
    *   **State Management**:
        *   `product`: Holds the fetched `Product` object.
        *   `relatedProducts`: Array of related `Product` objects.
        *   `quantity`: Number representing the quantity to add to the cart, managed by `QuantitySelector`.
        *   `selectedImage`: String URL of the currently displayed image in the gallery.
    *   **User Actions**:
        *   `handleAddToCart()`: Adds the current product with the selected quantity to the cart using `useCart().addToCart()`.
        *   `handleBuyNow()`: Adds the product to the cart and then navigates the user to the shopping bag page (`/bag`).
    *   **UI Components**:
        *   Image gallery with main image zoom-on-hover (CSS driven `group-hover:scale-105`) and thumbnail selection.
        *   Product name, price, short description.
        *   `QuantitySelector`: For adjusting the quantity.
        *   "Add to Cart" and "Buy Now" buttons.
        *   `AccordionItem`: Used to display "Product Description" (long) and "Product Specifications" in collapsible sections.
        *   A section for "Related Products" using `ProductCard`.
    *   Includes breadcrumbs for navigation.

*   **`app/bag/page.tsx` (Shopping Cart Page)**:
    *   Displays the items currently in the user's shopping cart.
    *   Uses `useCart()` hook from `CartContext` to access cart items and functions (`cartItems`, `removeFromCart`, `updateQuantity`, `getCartTotal`).
    *   **Cart Item Display**:
        *   Renders a list of cart items. If the cart is empty, it shows a message and a "Continue Shopping" link.
        *   `CartItemRow` component: Displays individual cart item details (image, name, price, quantity selector, total price for the item, remove button).
            *   `QuantitySelector`: Allows updating item quantity directly in the cart.
            *   Remove button: Uses `removeFromCart` from `CartContext`.
    *   **Order Summary**:
        *   `OrderSummary` component: Displays subtotal and total.
        *   "Proceed to Checkout" button: Navigates to `/checkout`. Disabled if the cart is empty.
    *   Includes breadcrumbs.

*   **`app/checkout/page.tsx` (Checkout Page)**:
    *   Handles the collection of shipping information for guest checkout.
    *   **Form Data**: Defines `CheckoutFormData` interface for shipping details (fullName, email, phone, address1, address2, city, postalCode).
    *   **State Management**:
        *   `form`: Holds the current state of the checkout form. Initialized from `localStorage` (key: `karvanaCheckoutForm`) if available, otherwise with empty strings.
        *   `touched`: Tracks which fields have been interacted with, to control when validation errors are shown.
        *   `errors`: Stores validation error messages for each field.
        *   `submitAttempted`: Boolean to track if the user has tried to submit the form.
    *   **Form Persistence**: `useEffect` saves the `form` state to `localStorage` on every change.
    *   **Validation**:
        *   `validateField(name, value)`: Validates individual fields based on rules (e.g., required, email format via `emailRegex`, phone format via `phoneRegex`).
        *   `handleChange`, `handleBlur`: Update form state and trigger validation for specific fields.
        *   `validateForm()`: Validates all form fields.
        *   `isFormValid()`: Checks if the entire form is valid.
    *   **Submission**:
        *   `handleProceed(e)`: Prevents default form submission, marks all fields as touched, runs validation, and sets errors.
        *   If valid and cart is not empty, it currently logs checkout data and cart items to the console. (Payment integration is a future step).
    *   **UI Components**:
        *   A multi-step progress indicator (`StepIndicator`, `StepConnector`).
        *   Shipping information form with input fields for each piece of data. Error messages are displayed below inputs if validation fails.
        *   Country field is pre-filled ("Singapore") and disabled.
        *   "Return to Cart" link.
        *   Order summary section displaying items in the cart and total.
        *   "Proceed to Payment" button: Disabled if the form is invalid or cart is empty. Linked to the form submission via `form="checkout-form"` (although the form tag is `md:col-span-2` and the button is in `md:col-span-1`). The `onClick={handleProceed}` on the button itself also triggers submission logic.
    *   Includes breadcrumbs.

*   **`app/checkout/confirmation/page.tsx` (Order Confirmation Page)**:
    *   Displays the successful order confirmation after checkout completion.
    *   **Mock Data**: Uses comprehensive mock order data including transaction details, customer information, purchased items, pricing breakdown, and payment information.
    *   **Page Structure**:
        *   Progress breadcrumbs showing the checkout flow completion.
        *   Success message and order metadata display.
        *   Complete order details including purchased items list.
        *   Invoice details with pricing breakdown (subtotal, discount, shipping, total).
        *   Payment information showing payment method and order timestamp.
        *   Customer billing and shipping details.
        *   Email notification confirmation.
        *   "Continue Shopping" call-to-action button.
    *   **UI Components Used**:
        *   `OrderSuccessDisplay`: Shows success checkmark icon and confirmation message.
        *   `OrderMetaInfo`: Displays order date and customer name.
        *   `PurchasedItemsList`: Shows all purchased items with images, quantities, and prices.
        *   `InvoiceDetails`: Displays transaction ID and complete price breakdown.
        *   `PaymentInfo`: Shows payment method details and order timestamp.
        *   `CustomerDetails`: Displays both billing and shipping information.
        *   `EmailNotification`: Confirms email notification details.
        *   `ContinueShoppingButton`: Provides navigation back to shopping.
    *   **SEO**: Includes proper metadata for the confirmation page.

### 3.3. Reusable Components (`components/` directory)

*   **`components/common/`**:
    *   `Header.tsx`: Displays the company name/logo (linking to homepage) and navigation links (Shop, About). Includes a shopping cart icon (`ShoppingCartIcon`) that shows the number of items in the cart using `useCart().getItemCount()`. It's a sticky header.
    *   `Footer.tsx`: Displays copyright information and the company name.
    *   `Banner.tsx`: A banner component, likely for the homepage, with a background image, title, subtitle, and a "SHOP NOW" link.
    *   `AccordionItem.tsx`: A generic accordion component. Takes `title`, `children`, and `defaultOpen` props. Uses `ChevronUpIcon`/`ChevronDownIcon` to indicate state.

*   **`components/homepage/`**:
    *   `Bestsellers.tsx`: Renders a "Our bestsellers" section, maps over a slice of `products` data, and uses `ProductCard` for each. Includes a "More →" link to the shop.
    *   `Benefits.tsx`: Displays statistical benefits (e.g., "5+ years experience", "7k products").
    *   `Values.tsx`: Displays company values alongside images.

*   **`components/shop/`**:
    *   `ProductCard.tsx`: Displays a product's image, name, price, brand, and category in a card format. Image has a `hover:scale-105` effect.
    *   `FilterSidebar.tsx`:
        *   Provides UI for filtering products on the shop page.
        *   Manages filter states through props passed from `ShopPage`.
        *   Includes filters for:
            *   **Price Range**: Uses `rc-slider` for a draggable range slider.
            *   **Brand, Category, Features, Weight Capacity**: Uses checkboxes.
        *   Helper functions `getAllBrands()`, `getAllCategories()`, `getAllFeatures()` (from `data/Products.ts`) are used to populate checkbox options.
        *   `handleClearAllFilters`: Resets all filter states.
        *   Responsive: Includes a "Filters" button to toggle visibility on mobile (`isOpen`, `setIsOpen` props).
    *   `SortDropdown.tsx`: A dropdown menu for selecting product sort order. Manages its own open/close state (`isOpen`). Options include 'Newest', 'Name (A-Z)', 'Name (Z-A)', 'Price (Low to High)', 'Price (High to Low)'.
    *   `QuantitySelector.tsx`: A component with "+" and "-" buttons and a display for quantity. Used on product detail and cart pages. Takes `quantity`, `onQuantityChange`, `min` (default 1), `max` (default 99) as props.

*   **`components/checkout/`** (New):
    *   `OrderSuccessDisplay.tsx`: 
        *   Displays a prominent success message with green checkmark icon.
        *   Provides visual confirmation that the order was successfully placed.
        *   Uses consistent styling with green color scheme for success states.
    
    *   `OrderMetaInfo.tsx`:
        *   Shows essential order metadata (order date, customer name).
        *   Displays information in a clean, readable format below the success message.
    
    *   `PurchasedItemsList.tsx`:
        *   Renders a complete list of purchased items.
        *   Each item displays: product image, name, quantity, and individual price.
        *   Uses `PurchasedItemCard` sub-component for consistent item presentation.
        *   Integrates with Next.js Image component for optimized image loading.
    
    *   `InvoiceDetails.tsx`:
        *   Displays comprehensive pricing breakdown in a structured format.
        *   Shows transaction ID, subtotal, discount (if applicable), shipping costs, and final total.
        *   Uses Singapore Dollar (S$) currency formatting.
        *   Provides clear visual hierarchy with emphasized total amount.
    
    *   `PaymentInfo.tsx`:
        *   Shows payment method details including card type, last 4 digits, and brand.
        *   Displays formatted order date and time with proper localization.
        *   Uses credit card icon for visual clarity.
        *   Formats timestamps in GB locale with 12-hour format.
    
    *   `CustomerDetails.tsx`:
        *   Displays both billing and shipping information side-by-side.
        *   Handles optional company field in billing details.
        *   Uses responsive grid layout for mobile and desktop views.
        *   Provides clear section headers and consistent formatting.
    
    *   `EmailNotification.tsx`:
        *   Confirms that order confirmation email has been sent.
        *   Displays the email address where confirmation was sent.
        *   Provides reassurance about email delivery timing.
    
    *   `ContinueShoppingButton.tsx`:
        *   Provides clear call-to-action to return to shopping.
        *   Links back to the main shop page.
        *   Uses consistent button styling with the rest of the application.

### 3.4. State Management (`context/` directory)

*   **`context/CartContext.tsx`**:
    *   Provides global state management for the shopping cart using React Context API.
    *   **`CartItem` Interface**: Extends the `Product` interface by adding a `quantity` field.
    *   **`CartContextType` Interface**: Defines the shape of the context value, including:
        *   `cartItems: CartItem[]`
        *   `addToCart(product: Product, quantity: number)`: Adds a product or updates its quantity if already in cart.
        *   `removeFromCart(productId: number)`: Removes a product from the cart.
        *   `updateQuantity(productId: number, quantity: number)`: Updates a product's quantity. If quantity <= 0, removes the item.
        *   `clearCart()`: Empties the cart and removes it from localStorage.
        *   `getCartTotal()`: Calculates the total price of all items in the cart.
        *   `getItemCount()`: Calculates the total number of individual items in the cart.
    *   **`CartProvider` Component**:
        *   The provider component that wraps parts of the application needing cart access (typically the entire app via `RootLayout`).
        *   Manages `cartItems` state using `useState`.
        *   **Persistence**:
            *   `useEffect` (on mount): Loads cart data from `localStorage` (key: `karvanaCart`).
            *   `useEffect` (on `cartItems` change): Saves the current `cartItems` to `localStorage`. Avoids writing an empty array on initial load if nothing was previously stored.
    *   **`useCart()` Hook**: A custom hook to easily consume the `CartContext` within components. Throws an error if used outside a `CartProvider`.

### 3.5. Data (`data/` directory)

*   **`data/Products.ts`**:
    *   **`Product` Interface**: Defines the structure of a product object:
        *   `id: number`
        *   `name: string`
        *   `price: number`
        *   `image: string` (main image URL)
        *   `images?: string[]` (optional array of image URLs for a gallery)
        *   `brand: string`
        *   `category: string`
        *   `description: string` (short description)
        *   `longDescription: string` (detailed description)
        *   `specifications: { weightCapacity: number; dimensions?: string; batteryLife?: string; ... }`
        *   `features: string[]`
        *   `dateAdded: Date`
    *   **`products: Product[]`**: An array of mock product objects, serving as the product database for the initial build.
    *   **Helper Functions**:
        *   `getAllBrands()`: Returns an array of unique brand names from the `products` data.
        *   `getAllCategories()`: Returns an array of unique category names.
        *   `getAllFeatures()`: Returns an array of unique feature strings. These are used to populate filter options in `FilterSidebar`.

### 3.6. Configuration (`config/` directory)

*   **`config/constants.ts`**:
    *   Exports constants used across the application.
    *   Currently defines `COMPANY_NAME = "Karvana"`.

## 4. Core Data Types

### 4.1. Order Data Structure

The application now uses a standardized `Order` interface defined in `types/order.ts` to ensure data consistency across order-related functionality and prepare for future API and database integrations with the chosen Neon (PostgreSQL) database.

#### Order Interface

The main `Order` interface represents a complete order in the system:

```typescript
interface Order {
  // Core Order Identifiers
  id: string;                         // Unique system-generated order ID (UUID v4)
  userFacingOrderId?: string;         // Human-readable order number (e.g., "KV-20250001")
  createdAt: string;                  // ISO 8601: Order creation timestamp
  updatedAt: string;                  // ISO 8601: Order last update timestamp

  // Customer & Shipping Information
  customerDetails: OrderCustomerDetails;
  shippingAddress: OrderShippingAddress;

  // Order Items
  items: OrderItem[];

  // Financial Summary
  subtotal: number;                   // Sum of (item.price * item.quantity) for all items
  discountAmount?: number;            // Optional: Total discount applied to the order
  shippingCost?: number;              // Optional: Cost for shipping
  totalAmount: number;                // Final amount (subtotal - discountAmount + shippingCost)

  // Order Status
  status: 'pending_payment' | 'payment_failed' | 'awaiting_shipment' | 'shipped' | 'delivered' | 'cancelled';

  // Payment Information
  paymentDetails?: OrderPaymentDetails; // Will be populated/updated after payment attempts/webhooks

  // Optional Notes
  customerNotes?: string;             // Notes provided by the customer during checkout
}
```

#### Supporting Interfaces

**OrderItem**: Represents a single item in an order
- `productId: number` - Links to the product catalog
- `name: string` - Product name at time of purchase
- `price: number` - Price at time of purchase (preserves historical pricing)
- `quantity: number` - Number of items ordered
- `image: string` - Product image URL

**OrderCustomerDetails**: Customer information collected during checkout
- `fullName: string` - Customer's full name
- `email: string` - Customer's email address
- `phone: string` - Customer's phone number

**OrderShippingAddress**: Shipping destination details
- `address1: string` - Primary address line
- `address2?: string` - Optional secondary address line
- `city: string` - City name
- `postalCode: string` - Postal/ZIP code
- `country: string` - Country (defaults to "Singapore")

**OrderPaymentDetails**: Payment transaction information (designed for HitPay integration)
- `hitpayPaymentRequestId?: string` - HitPay payment request ID
- `hitpayPaymentId?: string` - HitPay payment ID from webhook
- `status?: string` - Payment status ('pending', 'succeeded', 'failed', 'requires_action')
- `amountCharged?: number` - Actual amount charged
- `currency?: string` - Payment currency (e.g., 'SGD')
- `paymentMethodType?: string` - Payment method (e.g., 'card', 'paynow_online')
- `paymentMethodBrand?: string` - Card brand (e.g., 'Visa')
- `paymentMethodLast4?: string` - Last 4 digits of payment method
- `transactionDate?: string` - ISO 8601 timestamp of transaction

#### Data Alignment with Checkout Flow

The Order structure is designed to align with data collected throughout the user journey:

1. **Cart Items → OrderItem[]**: Cart items from `CartContext` map directly to `OrderItem` objects
2. **Checkout Form → Customer/Shipping Details**: `CheckoutFormData` maps to `OrderCustomerDetails` and `OrderShippingAddress`
3. **Payment Integration → OrderPaymentDetails**: Structured to receive data from HitPay payment gateway
4. **Order Management → Order Status**: Supports complete order lifecycle tracking

This unified structure standardizes data handling and prepares the application for:
- Payment gateway integration (Block 3 & 4)
- Database integration (Block 5) with Neon (PostgreSQL)
- Order management features
- API development

## 5. Key Architectural Decisions & Patterns

*   **Client-Side Rendering with State Management (`"use client"`)**: Many components are marked with `"use client";` because they use React Hooks (`useState`, `useEffect`, `useContext`) or interact with browser APIs (like `localStorage` or `next/navigation`'s `useRouter`, `useParams`). This is standard for interactive components in Next.js App Router.
*   **Props Drilling vs. Context**:
    *   For global state like the shopping cart, React Context (`CartContext`) is used to avoid excessive props drilling.
    *   For local state or state shared between a parent and a few direct children (e.g., filter states in `ShopPage` passed to `FilterSidebar`), props are used.
*   **Component Reusability**: Components like `ProductCard`, `QuantitySelector`, `AccordionItem` are designed to be reusable in different parts of the application.
*   **Data Flow for Filters (Shop Page)**:
    1.  `ShopPage` maintains filter states.
    2.  These states and their setter functions are passed as props to `FilterSidebar`.
    3.  User interactions in `FilterSidebar` call these setters, updating the state in `ShopPage`.
    4.  The `useEffect` in `ShopPage` listens to these state changes and re-filters the `products` array to update `filteredProducts`.
    5.  The UI re-renders to display the `filteredProducts`.
*   **Persistence**:
    *   Shopping cart (`cartItems`) is persisted in `localStorage` via `CartContext`.
    *   Checkout form data (`form`) is persisted in `localStorage` directly within `CheckoutPage`.
*   **Mock Data**: Product information is currently hardcoded in `data/Products.ts`. In a real application, this would come from a backend API and database.
*   **Order Confirmation Flow**:
    *   The confirmation page uses comprehensive mock data to simulate a complete order processing system.
    *   Component composition allows for flexible layout and easy maintenance of individual sections.
    *   Each confirmation component is designed to be reusable and potentially data-driven in future implementations.
    *   The page maintains consistent styling and user experience with the rest of the checkout flow.

*   **Component Design for Checkout**:
    *   Checkout components are designed with clear separation of concerns.
    *   Each component handles a specific aspect of order confirmation (success display, invoice, payment info, etc.).
    *   Props-based design allows for easy testing and reusability.
    *   Consistent TypeScript interfaces ensure type safety across all checkout components.

## 5. Potential Areas for Future Development (based on code structure)

*   **API Integration for Products**: Replace mock data in `data/Products.ts` with API calls to a proper backend.
*   **Payment Gateway Integration**: Implement the actual payment processing logic in `app/checkout/page.tsx` by calling a backend API route that integrates with HitPay (as outlined in requirements).
*   **User Accounts**: The current setup is guest-checkout only. Adding user accounts would involve authentication, user profiles, and potentially linking carts/orders to users.
*   **Order Management Backend**: A backend system to store and manage orders created after successful checkout, using the Neon (PostgreSQL) database.
*   **Mobile Responsiveness**: While Tailwind CSS provides tools for responsiveness and some responsive classes are used (e.g. `md:` prefixes), a dedicated pass for mobile UX refinement might be needed.
*   **Error Handling & Loading States**: More robust error handling (e.g., for failed data fetching if APIs were used) and visual loading states (skeletons, spinners) could be added. The product detail page has a basic "Loading..." message.
*   **Order Confirmation Enhancements**:
    *   Replace mock order data with real order information from backend APIs.
    *   Implement order tracking functionality with tracking numbers and status updates.
    *   Add PDF invoice generation and download capability.
    *   Integrate with email service for automated order confirmation emails.
    *   Add order history access for returning customers when user accounts are implemented.

*   **Enhanced Payment Integration**:
    *   The current payment info display is designed to work with various payment methods.
    *   Future integration with HitPay or other payment providers can easily populate the payment information components.
    *   Support for additional payment methods (digital wallets, bank transfers) can be added through the existing PaymentInfo component structure.

*   **Order Management Features**:
    *   The confirmation page structure supports future features like order modifications, cancellations, or returns.
    *   Component architecture allows for easy addition of customer service contact information or support chat integration.
    *   The detailed order display can be extended to include estimated delivery dates and shipping tracking.
