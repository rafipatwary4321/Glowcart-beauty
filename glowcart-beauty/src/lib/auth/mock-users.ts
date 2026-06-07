import type { UserRole } from "@/types/user";

export type MockUserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  image?: string;
};

/**
 * In-memory mock users for placeholder auth.
 * Replace with database lookups when backend is wired up.
 */
const seedUsers: MockUserRecord[] = [
  {
    id: "user_demo_001",
    name: "Ayesha Rahman",
    email: "demo@glowcart.com",
    password: "demo1234",
    role: "customer",
  },
  {
    id: "user_admin_001",
    name: "GlowCart Admin",
    email: "admin@glowcart.com",
    password: "admin1234",
    role: "admin",
  },
];

let mockUsers: MockUserRecord[] = [...seedUsers];

export function getMockUsers(): MockUserRecord[] {
  return mockUsers;
}

export function findMockUserByEmail(email: string): MockUserRecord | undefined {
  const normalized = email.trim().toLowerCase();
  return mockUsers.find((user) => user.email.toLowerCase() === normalized);
}

export function addMockUser(user: Omit<MockUserRecord, "id">): MockUserRecord {
  const record: MockUserRecord = {
    ...user,
    id: `user_${Date.now()}`,
  };
  mockUsers = [...mockUsers, record];
  return record;
}

export function resetMockUsers(): void {
  mockUsers = [...seedUsers];
}
