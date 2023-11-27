import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { follow, unfollow } from "@/service/user";

import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return new NextResponse("Authentication Error", { status: 401 });
  }

  const { id: targetId, follow: isFollow } = await req.json();

  if (!targetId || follow === undefined) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const request = isFollow ? follow : unfollow;

  return request(user.id, targetId)
    .then((res) => NextResponse.json(res))
    .catch((err) => new NextResponse(JSON.stringify(err), { status: 500 }));
}