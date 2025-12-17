import { Role, LeaveStatus, User } from "@prisma/client";

/**
 * Helper to check if a user is a manager-type role
 */
export function isManagerialRole(role: Role): boolean {
  return role === Role.MANAGER || role === Role.PROJECT_DIRECTOR;
}

/**
 * Can the user approve or reject a leave request?
 */
export function canApproveLeave(
  currentUser: Pick<User, "id" | "role">,
  leave: {
    userId: string;
    status: LeaveStatus;
  },
  employeeManagerId?: string
): boolean {
  // HR, Accounts, Admin, Procurement can NEVER approve
  if (
    currentUser.role === Role.HR ||
    currentUser.role === Role.ACCOUNTS ||
    currentUser.role === Role.ADMIN ||
    currentUser.role === Role.PROCUREMENT
  ) {
    return false;
  }

  // Project Director can approve any leave
  if (currentUser.role === Role.PROJECT_DIRECTOR) {
    return true;
  }

  // Manager can approve only their direct report
  if (
    currentUser.role === Role.MANAGER &&
    employeeManagerId === currentUser.id
  ) {
    return true;
  }

  return false;
}

/**
 * Can the user view leave balances of others?
 */
export function canViewLeaveBalances(role: Role): boolean {
  return (
    role === Role.MANAGER ||
    role === Role.PROJECT_DIRECTOR ||
    role === Role.HR ||
    role === Role.ACCOUNTS
  );
}

/**
 * Can the user view team leave requests?
 */
export function canViewTeamLeaves(role: Role): boolean {
  return (
    role === Role.MANAGER ||
    role === Role.PROJECT_DIRECTOR ||
    role === Role.HR ||
    role === Role.ACCOUNTS
  );
}

/**
 * Can the user apply for leave?
 * (Everyone can apply for themselves)
 */
export function canApplyForLeave(): boolean {
  return true;
}

/**
 * Can the user see the organization calendar?
 */
export function canViewCalendar(): boolean {
  return true;
}
