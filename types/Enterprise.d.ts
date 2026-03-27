export interface EnterpriseProfile {
  id: number;
  first_name: string;
  last_name: string;
  contact: string;
  address: string;
  image: string;
}

export interface Enterprise {
  id: number;
  profile: EnterpriseProfile;
  company_name: string;
  license_number: string;
  tax_id: string;
  telebirr_account: string;
  is_verified: boolean;
  role: string;
}

export type DealerAction = "approve" | "reactivate" | "reject" | "suspend" | "verify";
