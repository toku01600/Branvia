import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  // v5: auth() を呼ぶ
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return NextResponse.json({
    ok: true,
    emailVerified: !!user?.emailVerified,
    subscriptionStatus: user?.subscriptionStatus || "inactive",
  });
}
