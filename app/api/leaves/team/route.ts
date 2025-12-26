import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { LeaveStatus } from "@prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  // 1️⃣ Auth check
  if (!session || session.user.role !== "MANAGER") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2️⃣ Fetch team leaves pending manager approval
  const leaves = await prisma.leaveRequest.findMany({
    where: {
      status: LeaveStatus.PENDING_MANAGER,
      user: {
        managerId: session.user.id,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(leaves);
}
