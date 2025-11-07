export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string | number;
  mileage: number;
  fuel_type: "electric" | "hybrid" | "petrol" | "diesel";
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
  trim?: string;
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
  location?: string;
  description: string;
  features?: string[];

  // Feature flags
  air_conditioning: boolean;
  alarm_anti_theft: boolean;
  all_wheel_steering: boolean;
  am_fm_radio: boolean;
  anti_lock_brakes: boolean;
  aux_audio_in: boolean;
  bluetooth: boolean;
  body_kit: boolean;
  brush_guard: boolean;
  cassette_player: boolean;
  cd_player: boolean;
  climate_control: boolean;
  cooled_seats: boolean;
  cruise_control: boolean;
  dual_exhaust: boolean;
  dvd_player: boolean;
  fog_lights: boolean;
  front_airbags: boolean;
  heat: boolean;
  heated_seats: boolean;
  keyless_entry: boolean;
  keyless_start: boolean;
  leather_seats: boolean;
  moonroof: boolean;
  n2o_system: boolean;
  navigation_system: boolean;
  off_road_kit: boolean;
  off_road_tyres: boolean;
  parking_sensors: boolean;
  performance_tyres: boolean;
  power_locks: boolean;
  power_mirrors: boolean;
  power_seats: boolean;
  power_steering: boolean;
  power_sunroof: boolean;
  power_windows: boolean;
  premium_lights: boolean;
  premium_paint: boolean;
  premium_sound_system: boolean;
  premium_wheels_rims: boolean;
  racing_seats: boolean;
  rear_view_camera: boolean;
  roof_rack: boolean;
  satellite_radio: boolean;
  side_airbags: boolean;
  spoiler: boolean;
  sunroof: boolean;
  tiptronic_gears: boolean;
  vhs_player: boolean;
  winch: boolean;

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

export interface Expense {
  id: number;
  type: "maintenance" | "marketing" | "oprational" | "other";
  amount: string;
  dealer: number;
  description: string;
}

export interface FinancialReport {
  id: number;
  type: "profit_loss" | "balance_sheet" | "cash_flow";
  data: string;
  dealer: number;
  created_at: string;
}

export interface Sale {
  id: number;
  buyer: number;
  car: number;
  broker: number | null;
  price: string;
  date: string;
}

export interface Lead {
  id: number;
  name: string;
  contact: string;
  status:
    | "inquiry"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  assigned_sales: number | null;
  car: number;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface DealerStaff {
  id: number;
  user: User;
  role: "seller" | "accountant";
  assigned_at: string;
  updated_at: string;
}

export interface CreateDealerStaffRequest {
  user_email: string;
  role: "seller" | "accountant";
}

export interface CarExpense {
  id: number;
  description: string;
  amount: string;
  currency: "USD" | "ETB";
  converted_amount: string;
  date: string;
  dealer: number;
  car: number;
}

export interface ExchangeRate {
  id: number;
  rate: string;
  date: string;
}

export interface Revenue {
  id: number;
  source: "car_sale" | "broker_payment" | string;
  amount: string;
  currency: "USD" | "ETB";
  converted_amount: string;
  created_at: string;
  description: string;
  dealer: number;
}

// HR Types
export interface Employee {
  id: number;
  user_email_display: string;
  full_name: string;
  hire_date: string;
  position: string;
  salary: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  user_email: string;
  hire_date: string;
  position: string;
  salary: string;
  is_active: boolean;
}

export interface Attendance {
  id: number;
  employee_email_display: string;
  employee_full_name: string;
  entry_time: string;
  exit_time: string;
  date: string;
  status: "present" | "absent" | "late" | "on_leave";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAttendanceRequest {
  employee_email: string;
  entry_time: string;
  exit_time: string;
  date: string;
  status: "present" | "absent" | "late" | "on_leave";
  notes: string;
}

export interface Contract {
  id: number;
  employee_email_display: string;
  employee_full_name: string;
  start_date: string;
  end_date: string;
  terms: string;
  salary: string;
  status: "active" | "inactive" | "terminated";
  created_at: string;
  updated_at: string;
}

export interface CreateContractRequest {
  employee_email: string;
  start_date: string;
  end_date: string;
  terms: string;
  salary: string;
  status: "active" | "inactive" | "terminated";
}

export interface Leave {
  id: number;
  employee_email_display: string;
  employee_full_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  approved_by_email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaveRequest {
  employee_email: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "denied";
}
