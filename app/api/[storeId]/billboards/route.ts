import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUser) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    const billboard = await prismadb.billboard.create({
      data: { label, imgUrl: imageUrl, storeId: params.storeId },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("STORES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
    });
    return NextResponse.json(billboards);
  } catch (error) {
    console.log("STORES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
