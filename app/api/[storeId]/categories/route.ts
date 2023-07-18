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
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("BillboardId is required", { status: 400 });
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

    const category = await prismadb.category.create({
      data: { name, billboardId, storeId: params.storeId },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("CATEGORY_POST", error);
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

    const categories = await prismadb.category.findMany({
      where: { storeId: params.storeId },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log("CATEGORY_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
