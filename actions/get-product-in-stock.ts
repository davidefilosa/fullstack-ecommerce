import prismadb from "@/lib/prismadb";

const getProductInStock = async (storeId: string) => {
  const products = await prismadb.product.count({
    where: { storeId, isArchived: false },
  });

  return products;
};

export default getProductInStock;
