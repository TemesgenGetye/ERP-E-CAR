export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string | number;
  mileage: number;
  fuel_type: "electric" | "hybrid" | "petrol" | "diesel";
  // Added to align with API responses (e.g., "new", "used")
  condition?: string;
  body_type:
    | "sedan"
    | "suv"
    | "truck"
    | "coupe"
    | "hatchback"
    | "convertible"
    | "wagon"
    | "van"
    | "other";
  exterior_color: string;
  interior_color: string;
  engine: string;
  bluetooth: boolean;
  drivetrain: "fwd" | "rwd" | "awd" | "4wd";
  status:
    | "available"
    | "reserved"
    | "sold"
    | "pending_inspection"
    | "under_maintenance"
    | "delivered"
    | "archived";
  sale_type: "fixed_price" | "auction";
  auction_end: string | null;
  priority: boolean;
  location: string;
  description: string;
  features: string[];
  images:
    | Array<{
        id: number;
        car: number;
        image_url: string;
        is_featured: boolean;
        caption: string;
        uploaded_at: string;
      }>
    | string[];
  dealer: number | null;
  broker: number | null;
  posted_by: number;
  make_ref: number;
  model_ref: number;
  verification_status: "pending" | "verified" | "rejected";
  dealer_average_rating: number | null;
  broker_average_rating: number | null;
  created_at: string;
  updated_at: string;
  bids: any[];
}
