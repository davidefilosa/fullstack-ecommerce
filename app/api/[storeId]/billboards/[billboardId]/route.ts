import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imgUrl } = body;

    if (!userId) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imgUrl) {
      return new NextResponse("Image is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("BillboardId is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUser) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    const billboard = await prismadb.billboard.updateMany({
      where: { id: params.billboardId, storeId: params.storeId },
      data: { label, imgUrl: imgUrl },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("BILLBOARD_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("BillboardId is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUser) {
      return new NextResponse("Not authorized", { status: 401 });
    }

    const billboard = await prismadb.billboard.deleteMany({
      where: { id: params.billboardId },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("BILLBOARD_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("BillboardId is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("BILLBOARD_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
