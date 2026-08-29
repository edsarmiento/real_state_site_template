export type AccountSummary = {
  id: number;
  name: string;
  country: string;
  currency: string;
  timezone: string;
  plan?: "listings" | "crm" | string;
  subscription_status?: "free" | "trialing" | "active" | string;
  trial_ends_at?: string | null;
  crm_paid_until?: string | null;
  crm_operational?: boolean;
};

export type Membership = {
  id: number;
  role: string;
  status: string;
  tenant_id: number | null;
  property_owner_id: number | null;
  portal_profile_name: string | null;
  account: AccountSummary;
};

export type CurrentUserProfile = {
  id: number;
  email: string;
  created_at: string;
  email_confirmed?: boolean;
  memberships: Membership[];
};
