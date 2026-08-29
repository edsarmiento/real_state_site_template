export type Tenant = {
  id: number;
  account_id: number;
  portal_user_id: number | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  tax_id: string | null;
  notes: string | null;
  archived_at: string | null;
  archived: boolean;
  lease_count: number;
  created_at: string;
  updated_at: string;
};
