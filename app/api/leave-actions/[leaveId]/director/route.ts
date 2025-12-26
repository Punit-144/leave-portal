import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { LeaveStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ leaveId: string }> }
) {
  // ✅ 1. Correct Next.js 15 implementation
  const { leaveId } = await params;

  if (!leaveId) {
    return NextResponse.json({ error: "Leave ID missing" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "PROJECT_DIRECTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, rejectionReason } = await req.json();

  // 🛡️ SECURITY FIX: Validate input explicitly
  if (action !== "APPROVE" && action !== "REJECT") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // 🛡️ LOGIC FIX: Ensure rejection reason is provided if rejecting
  if (action === "REJECT" && !rejectionReason) {
    return NextResponse.json({ error: "Rejection reason required" }, { status: 400 });
  }

  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
  });

  if (!leave) {
    return NextResponse.json({ error: "Leave not found" }, { status: 404 });
  }

  if (leave.status !== LeaveStatus.PENDING_DIRECTOR) {
    return NextResponse.json(
      { error: "Leave not pending director approval" },
      { status: 400 }
    );
  }

  if (leave.userId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot approve own leave" },
      { status: 403 }
    );
  }

  // ✅ TODO: If action === "APPROVE", you probably need to update 'LeaveBalance' here
  // const daysCount = calculateDays(leave.startDate, leave.endDate);
  // This would usually be a prisma.$transaction([])

  const updatedLeave = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: {
      status:
        action === "APPROVE"
          ? LeaveStatus.APPROVED
          : LeaveStatus.REJECTED_DIRECTOR,
      directorId: session.user.id,
      directorDecisionAt: new Date(),
      rejectionReason:
        action === "REJECT" ? rejectionReason : null,
    },
  });

  return NextResponse.json(updatedLeave);
}