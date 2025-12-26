import { PrismaClient, Role, EmploymentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Comprehensive Seed...");

  // 1. Project Director (The Top Boss)
  const director = await prisma.user.upsert({
    where: { email: "director@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Gaurav Director",
      email: "director@ihub-drishti.ai",
      role: Role.PROJECT_DIRECTOR,
      employmentType: EmploymentType.PAYROLL,
    },
  });

  // 2. Admin (The System Super-User)
  const admin = await prisma.user.upsert({
    where: { email: "admin@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Mukesh Admin",
      email: "admin@ihub-drishti.ai",
      role: Role.ADMIN,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // 3. HR Department
  const hr = await prisma.user.upsert({
    where: { email: "hr@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Harshita HR",
      email: "hr@ihub-drishti.ai",
      role: Role.HR,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // 4. Accounts Department
  const accounts = await prisma.user.upsert({
    where: { email: "accounts@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Vandan Accounts",
      email: "accounts@ihub-drishti.ai",
      role: Role.ACCOUNTS,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // 5. Procurement Department
  const procurement = await prisma.user.upsert({
    where: { email: "procurement@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Akshay Procurement",
      email: "procurement@ihub-drishti.ai",
      role: Role.PROCUREMENT,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // 6. Generic Manager
  const manager = await prisma.user.upsert({
    where: { email: "manager@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Vishakha Manager",
      email: "manager@ihub-drishti.ai",
      role: Role.MANAGER,
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // 7. Legal Department (UPDATED: Now using Role.LEGAL)
  const legal = await prisma.user.upsert({
    where: { email: "legal@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Aditi Legal",
      email: "legal@ihub-drishti.ai",
      role: Role.LEGAL, // ✅ Using the new authentic role
      employmentType: EmploymentType.PAYROLL,
      managerId: director.id,
    },
  });

  // 8. Adhoc Employee
  const employee = await prisma.user.upsert({
    where: { email: "employee@ihub-drishti.ai" },
    update: {},
    create: {
      name: "Punit Employee",
      email: "employee@ihub-drishti.ai",
      role: Role.EMPLOYEE,
      employmentType: EmploymentType.ADHOC,
      managerId: manager.id,
    },
  });

  // --- LEAVE BALANCES ---
  
  const setStandardBalance = async (userId: string) => {
    await prisma.leaveBalance.upsert({
      where: { userId },
      update: {},
      create: { userId, casualTotal: 12, earnedTotal: 12, medicalTotal: 10 },
    });
  };

  await setStandardBalance(director.id);
  await setStandardBalance(admin.id);
  await setStandardBalance(hr.id);
  await setStandardBalance(accounts.id);
  await setStandardBalance(procurement.id);
  await setStandardBalance(manager.id);
  await setStandardBalance(legal.id);

  // Adhoc Balance
  await prisma.leaveBalance.upsert({
    where: { userId: employee.id },
    update: {},
    create: { userId: employee.id, casualTotal: 4, earnedTotal: 0, medicalTotal: 0 },
  });

  console.log("✅ Comprehensive Seeding completed! Includes newly added LEGAL role.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });