// lib/permissions.ts
import { LeaveStatus } from "@prisma/client";

/**
 * Manager approval logic
 * Manager is derived from User.managerId (NOT leave.managerId)
 */
export function canManagerApproveLeave(params: {
  managerId: string;
  employeeId: string;
  employeeManagerId: string | null;
  leaveStatus: LeaveStatus;
}): boolean {
  const {
    managerId,
    employeeId,
    employeeManagerId,
    leaveStatus,
  } = params;

  // 1️⃣ Leave must be pending at manager level
  if (leaveStatus !== LeaveStatus.PENDING_MANAGER) {
    return false;
  }

  // 2️⃣ Employee must have a manager
  if (!employeeManagerId) {
    return false;
  }

  // 3️⃣ Logged-in manager must be the employee's manager
  if (employeeManagerId !== managerId) {
    return false;
  }

  // 4️⃣ Manager cannot approve their own leave
  if (employeeId === managerId) {
    return false;
  }

  return true;
}
