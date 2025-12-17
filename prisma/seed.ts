import { PrismaClient, Role, EmploymentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Project Director
  const director = await prisma.user.create({
    data: {
      name: "Project Director",
      email: "director@ihub-drishti.ai",
      role: Role.PROJECT_DIRECTOR,
      employmentType: EmploymentType.PAYROLL,
    },
  });

  // Manager
  const manager = await prisma.user.create({
    data: {
      name: "Manager One",
      email: "manager@ihub-drishti.ai",
      role: Role.MANAGER,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // HR
  const hr = await prisma.user.create({
    data: {
      name: "HR",
      email: "hr@ihub-drishti.ai",
      role: Role.HR,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // Accounts
  const accounts = await prisma.user.create({
    data: {
      name: "Accounts",
      email: "accounts@ihub-drishti.ai",
      role: Role.ACCOUNTS,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // Sample Employee
  const employee = await prisma.user.create({
    data: {
      name: "Employee One",
      email: "employee@ihub-drishti.ai",
      role: Role.EMPLOYEE,
      employmentType: EmploymentType.ADHOC,
      managerId: manager.id,
    },
  });

  // Leave Balances
  await prisma.leaveBalance.createMany({
    data: [
      {
        userId: director.id,
        casualTotal: 12,
        earnedTotal: 12,
        medicalTotal: 10,
      },
      {
        userId: manager.id,
        casualTotal: 12,
        earnedTotal: 12,
        medicalTotal: 10,
      },
      {
        userId: hr.id,
        casualTotal: 12,
        earnedTotal: 12,
        medicalTotal: 10,
      },
      {
        userId: accounts.id,
        casualTotal: 12,
        earnedTotal: 12,
        medicalTotal: 10,
      },
      {
        userId: employee.id,
        casualTotal: 4, // Adhoc rule
      },
    ],
  });

  console.log("✅ Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
