import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("ColorId is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUser) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    const color = await prismadb.color.updateMany({
      where: { id: params.colorId, storeId: params.storeId },
      data: { name, value },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("ColorId is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUser) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    const color = await prismadb.color.deleteMany({
      where: { id: params.colorId },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("ColorId is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("COLOR_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
