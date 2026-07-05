const BASE_URL = "http://127.0.0.1:8000";

export type OrganizationType = "hospital" | "retail_store" | "private_doctor";

export interface Organization {
  id: number;
  name: string;
  type: OrganizationType;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  created_at: string;
}

export interface Medicine {
  id: number;
  name: string;
  manufacturer?: string | null;
}

export interface Activity {
  id: number;
  contact_id: number;
  description: string;
  medicine_id?: number | null;
  medicine?: Medicine | null;
  follow_up_date?: string | null;
  created_at: string;
}

export interface Contact {
  id: number;
  name: string;
  role?: string | null;
  phone?: string | null;
  email?: string | null;
  organization_id: number;
  created_at: string;
}

export interface ContactListItem extends Contact {
  organization: Organization;
}

export interface ContactDetail extends Contact {
  organization: Organization;
  activities: Activity[];
}

export interface OrganizationWithContacts extends Organization {
  contacts: Contact[];
}

export interface ActivityWithContact extends Activity {
  contact: Contact;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json();
}

export function searchContacts(q: string, type?: OrganizationType, city?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type) params.set("type", type);
  if (city) params.set("city", city);
  return request<ContactListItem[]>(`/contacts?${params.toString()}`);
}

export function getContact(id: number) {
  return request<ContactDetail>(`/contacts/${id}`);
}

export function addActivity(
  contactId: number,
  activity: { description: string; medicine_id?: number | null; follow_up_date?: string | null }
) {
  return request<Activity>(`/contacts/${contactId}/activities`, {
    method: "POST",
    body: JSON.stringify(activity),
  });
}

export function searchMedicines(q: string) {
  const params = new URLSearchParams({ q });
  return request<Medicine[]>(`/medicines?${params.toString()}`);
}

export function createMedicine(medicine: { name: string; manufacturer?: string | null }) {
  return request<Medicine>(`/medicines`, {
    method: "POST",
    body: JSON.stringify(medicine),
  });
}

export function listOrganizations(limit = 50, offset = 0, city?: string, type?: OrganizationType) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (city) params.set("city", city);
  if (type) params.set("type", type);
  return request<Organization[]>(`/organizations?${params.toString()}`);
}

export function listCities() {
  return request<string[]>(`/organizations/cities`);
}

export function getOrganization(id: number) {
  return request<OrganizationWithContacts>(`/organizations/${id}`);
}

export function createOrganization(org: {
  name: string;
  type: OrganizationType;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
}) {
  return request<Organization>(`/organizations`, {
    method: "POST",
    body: JSON.stringify(org),
  });
}

export function createContact(contact: {
  name: string;
  role?: string | null;
  phone?: string | null;
  email?: string | null;
  organization_id: number;
}) {
  return request<Contact>(`/contacts`, {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

export function listFollowUps(dueBefore?: string) {
  const params = new URLSearchParams();
  if (dueBefore) params.set("due_before", dueBefore);
  return request<ActivityWithContact[]>(`/follow-ups?${params.toString()}`);
}
