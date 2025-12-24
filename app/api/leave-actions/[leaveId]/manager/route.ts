import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { canManagerApproveLeave } from "@/lib/permissions";
import { LeaveStatus } from "@prisma/client";


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leaveId: string }> }
) {



  const { leaveId } = await params;

  if (!leaveId) {
    return NextResponse.json({ error: "Leave ID missing" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, rejectionReason } = await req.json();

  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
    include: {
      user: true, // 🔴 THIS IS CRITICAL
    },
  });

  if (!leave) {
    return NextResponse.json({ error: "Leave not found" }, { status: 404 });
  }

  const allowed = canManagerApproveLeave({
    managerId: session.user.id,
    employeeId: leave.userId,
    employeeManagerId: leave.user.managerId, // ✅ CORRECT SOURCE
    leaveStatus: leave.status,
  });

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedLeave = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: {
      status:
        action === "APPROVE"
          ? LeaveStatus.PENDING_DIRECTOR
          : LeaveStatus.REJECTED_MANAGER,

      managerId: session.user.id,
      managerDecisionAt: new Date(),
      rejectionReason:
        action === "REJECT" ? rejectionReason ?? null : null,
    },
  });


  return NextResponse.json(updatedLeave);
}
