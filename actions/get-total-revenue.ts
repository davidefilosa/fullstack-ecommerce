import prismadb from "@/lib/prismadb";

const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: { storeId, isPaid: true },
    include: { orderItems: { include: { product: true } } },
  });

  const totalrevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((total, orderItem) => {
      return total + Number(orderItem.product.price);
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalrevenue;
};

export default getTotalRevenue;
