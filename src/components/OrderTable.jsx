
import { Link } from "react-router";
import { Eye, ShoppingBag } from "lucide-react";
import StatusBadge from "./StatusBadge";

const OrderTable = ({ orders = [] }) => {
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  const formatPrice = (price) => {
    const amount =
      typeof price === "object" ? price?.amount : price;

    const currency =
      typeof price === "object" ? price?.currency : "INR";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount ?? 0));
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[var(--surface-subtle)]">
            <tr>
              {[
                "Order ID",
                "Customer",
                "Order Date",
                "Total",
                "Payment",
                "Order Status",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {orders.length > 0 ? (
              orders.map((order) => {
                const orderId = order._id ?? order.id;
                const customer =
                  order.user ?? order.customer ?? {};

                const customerName =
                  customer.name ?? order.customerName ?? "Guest Customer";

                const customerEmail =
                  customer.email ?? order.customerEmail ?? "";

                const orderStatus =
                  order.status ?? "Pending";

                const paymentStatus =
                  order.paymentStatus ?? "Pending";

                const total =
                  order.totalAmount ??
                  order.total ??
                  order.amount ??
                  order.price ??
                  0;

                return (
                  <tr
                    key={orderId}
                    className="transition-colors hover:bg-[var(--surface-subtle)]"
                  >
                    {/* Order ID */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--primary)]">
                        #{String(orderId ?? "N/A").slice(-8)}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm font-semibold text-[var(--primary)]">
                          {customerName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate text-sm font-medium text-[var(--text-primary)]">
                            {customerName}
                          </p>

                          {customerEmail && (
                            <p className="max-w-[180px] truncate text-xs text-[var(--text-muted)]">
                              {customerEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--text-secondary)]">
                      {formatDate(
                        order.createdAt ?? order.orderDate ?? order.date
                      )}
                    </td>

                    {/* Total */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">
                      {formatPrice(total)}
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={paymentStatus} />
                    </td>

                    {/* Order Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={orderStatus} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <Link
                        to={`/orders/${orderId}`}
                        title="View order details"
                        aria-label={`View order ${orderId}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                    <ShoppingBag size={30} />

                    <p className="text-sm">
                      No orders found.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
