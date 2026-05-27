export interface CarImage {
  id: number;
  car: number;
  image_url: string;
  is_featured: boolean;
  caption: string;
  image: string;
  uploaded_at: string;
}

export interface CarBid {
  id: number;
  car_detail: {
    make: string;
    model: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    contact: string;
  };
  amount: string;
  created_at: string;
}

export interface Car {
  id: number;
  featured_image: string;
  make: string;
  model: string;
  year: number;
  price: string | number;
  model_ref: number;
  make_ref: number;
  body_type: string;
  sale_type: string;
  status: string;
  seller: string;
  created_at: string;
}

export interface CarDetail {
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

  images: Array<CarImage> | string[];
  dealer: number | null;
  broker: number | null;
  posted_by: number;
  make_ref: number;
  model_ref: number;
  vin?: string | null;
  origin?: string | null;
  verification_status: "pending" | "verified" | "rejected";
  dealer_average_rating: number | null;
  broker_average_rating: number | null;
  created_at: string;
  updated_at: string;
  bids: CarBid[];
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
    | "contacted"
    | "negotiation"
    | "closed"
    | "lost"
    | "cancelled";
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
  role: "seller" | "accountant" | "hr" | "finance";
  assigned_at: string;
  updated_at: string;
}

export interface CreateDealerStaffRequest {
  user_email: string;
  role: "seller" | "accountant" | "hr" | "finance";
}

export interface HREmployeeComponent {
  id: number;
  component_name: string;
  amount: string;
}

export interface HREmployee {
  id: number;
  user_email_display: string;
  full_name: string;
  hire_date: string;
  position: string;
  salary: string | null;
  components: HREmployeeComponent[];
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateHREmployeeRequest {
  user_email: string;
  position: string;
  hire_date: string;
  salary?: string | null;
}

export interface CarExpense {
  id: number;
  vin_code: string;
  origin: string;
  description: string;
  amount: string;
  currency: "USD" | "ETB" | string;
  converted_amount: string;
  created_at: string;
  company: number;
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

// HR Types — legacy shape for dedicated employee records (not dealer staff list).
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
  employee_type: "permanent" | "contract" | "temporary" | "intern";
  job_title: string;
  contract_salary: string;
  transport_allowance: string;
  start_date: string;
  probation_end_date: string;
  end_date: string;
  terms: string;
  status: "draft" | "sent_to_employee" | "active" | "inactive" | "terminated";
  draft_document_url: string | null;
  employee_signed_document_url: string | null;
  final_document_url: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateContractRequest {
  employee_email: string;
  employee_type: "permanent" | "contract" | "temporary" | "intern";
  job_title: string;
  contract_salary: string;
  transport_allowance: string;
  start_date: string;
  probation_end_date: string;
  end_date: string;
  terms: string;
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
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaveRequest {
  employee_email: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  rejection_reason?: string;
}
