
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Package, UserRound, MapPin, CreditCard, CalendarDays, Truck, CheckCircle, RefreshCw, Save, FileText, } from "lucide-react";
import { toast } from "react-toastify";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { getOrderById, updateOrderNotes, updateOrderStatus, } from "../services/orderService";

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled",];

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);



  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderById(id);
      const orderData = response?.data;

      if (!orderData) {
        throw new Error("Order data not found");
      }

      setOrder(orderData);
      setNotes(orderData.notes || "");
      setSelectedStatus(orderData.status || "pending");


    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch order details";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSaveNotes = async () => {
    if (!order?._id) return;

    try {
      setSavingNotes(true);

      const response = await updateOrderNotes(order._id, notes);

      if (response?.success === false) {
        throw new Error(
          response.message || "Failed to save notes"
        );
      }

      setOrder((previous) => ({
        ...previous,
        notes: response.data?.notes ?? notes.trim(),
      }));

      setNotes(response.data?.notes ?? notes.trim());

      toast.success(
        response.message || "Order notes saved successfully"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to save notes"
      );
    } finally {
      setSavingNotes(false);
    }
  };




  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (!order?._id || !selectedStatus) {
      toast.error("Please select an order status");
      return;
    }

    if (selectedStatus === order.status) {
      toast.info("Order status is already up to date");
      return;
    }

    try {
      setSaving(true);

      const response = await updateOrderStatus(
        order._id,
        selectedStatus
      );

      if (response?.success === false) {
        throw new Error(
          response.message || "Failed to update order status"
        );
      }

      toast.success(
        response?.message || "Order status updated successfully"
      );

      await fetchOrder();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getProduct = (item) => {
    if (item.product && typeof item.product === "object") {
      return item.product;
    }

    return {};
  };

  const getProductName = (item) => {
    const product = getProduct(item);
    return product.title || product.name || "Product unavailable";
  };

  const getProductImage = (item) => {
    const product = getProduct(item);
    const images = product.images || [];

    if (Array.isArray(images)) {
      const firstImage = images[0];

      if (typeof firstImage === "string") {
        return firstImage;
      }

      return firstImage?.url || "";
    }

    return typeof images === "string" ? images : "";
  };

  const getCustomer = () => {
    if (order?.user && typeof order.user === "object") {
      return order.user;
    }

    return {};
  };

  const getCustomerName = () => {
    const customer = getCustomer();
    return customer.name || customer.fullName || "N/A";
  };

  const getCustomerEmail = () => {
    const customer = getCustomer();
    return customer.email || "N/A";
  };

  const getCustomerPhone = () => {
    const customer = getCustomer();
    return customer.phone || customer.phoneNumber || "N/A";
  };

  const subtotal = (order?.items || []).reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--muted)]">
          <RefreshCw size={22} className="animate-spin" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-5">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-[var(--primary)]"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <Package
            size={40}
            className="mx-auto mb-3 text-[var(--muted)]"
          />

          <h2 className="text-xl font-semibold text-[var(--text)]">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-[var(--muted)]">
            {error || "Unable to load this order."}
          </p>

          <button
            type="button"
            onClick={fetchOrder}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const items = order.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--primary)]"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <StatusBadge status={order.status || "pending"} />
      </div>

      <PageHeader
        title={`Order #${order._id}`}
        description="View order items, customer information and update order status."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 xl:col-span-2">
          {/* Order Items */}
          <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-3 border-b border-[var(--border)] p-5">
              <Package
                size={20}
                className="text-[var(--primary)]"
              />

              <div>
                <h2 className="font-semibold text-[var(--text)]">
                  Order Items
                </h2>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {items.length} product(s)
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <p className="p-6 text-sm text-[var(--muted)]">
                No products found in this order.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {items.map((item, index) => {
                  const image = getProductImage(item);

                  return (
                    <div
                      key={item._id || getProduct(item)._id || index}
                      className="flex flex-wrap items-center gap-4 p-5"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={getProductName(item)}
                          className="h-20 w-20 rounded-xl border border-[var(--border)] object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)]">
                          <Package size={28} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-[var(--text)]">
                          {getProductName(item)}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Price: {formatCurrency(item.price)}
                        </p>
                      </div>

                      <p className="font-semibold text-[var(--text)]">
                        {formatCurrency(
                          (Number(item.price) || 0) *
                          (Number(item.quantity) || 0)
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-3 border-t border-[var(--border)] p-5">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">Subtotal</span>
                <span className="text-[var(--text)]">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">Shipping</span>
                <span className="text-[var(--text)]">
                  N/A
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-3">
                <span className="font-semibold text-[var(--text)]">
                  Total Amount
                </span>

                <span className="text-lg font-bold text-[var(--primary)]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </section>

          {/* Order Timeline */}


          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-4 flex items-center gap-3">
              <FileText
                size={20}
                className="text-[var(--primary)]"
              />

              <h2 className="font-semibold text-[var(--text)]">
                Order Notes
              </h2>
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="Add notes about this order..."
              className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
            />

            <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
              <span>Maximum 1000 characters</span>
              <span>{notes.length}/1000</span>
            </div>

            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingNotes ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}

              {savingNotes ? "Saving..." : "Save Notes"}
            </button>
          </section>




        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Update Order Status */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-5 flex items-center gap-3">
              <Truck
                size={20}
                className="text-[var(--primary)]"
              />

              <h2 className="font-semibold text-[var(--text)]">
                Update Order Status
              </h2>
            </div>

            <label
              htmlFor="orderStatus"
              className="mb-2 block text-sm text-[var(--muted)]"
            >
              Select Status
            </label>

            <select
              id="orderStatus"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={
                saving || selectedStatus === order.status
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}

              {saving ? "Saving..." : "Save Status"}
            </button>
          </section>

          {/* Customer Details */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-5 flex items-center gap-3">
              <UserRound
                size={20}
                className="text-[var(--primary)]"
              />

              <h2 className="font-semibold text-[var(--text)]">
                Customer Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--muted)]">
                  Full Name
                </p>

                <p className="mt-1 font-medium text-[var(--text)]">
                  {getCustomerName()}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)]">
                  Email Address
                </p>

                <p className="mt-1 break-all text-sm text-[var(--text)]">
                  {getCustomerEmail()}
                </p>
              </div>

              <div>
                <p className="text-xs text-[var(--muted)]">
                  Phone Number
                </p>

                <p className="mt-1 text-sm text-[var(--text)]">
                  {getCustomerPhone()}
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-5 flex items-center gap-3">
              <MapPin
                size={20}
                className="text-[var(--primary)]"
              />

              <h2 className="font-semibold text-[var(--text)]">
                Shipping Address
              </h2>
            </div>

            <p className="text-sm text-[var(--muted)]">
              Shipping address is not available in the current order response.
            </p>
          </section>

          {/* Payment Details */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-5 flex items-center gap-3">
              <CreditCard
                size={20}
                className="text-[var(--primary)]"
              />

              <h2 className="font-semibold text-[var(--text)]">
                Payment Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--muted)]">
                  Payment Method
                </span>

                <span className="text-sm font-medium text-[var(--text)]">
                  {order.paymentMethod || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--muted)]">
                  Payment Status
                </span>

                {order.paymentStatus ? (
                  <StatusBadge status={order.paymentStatus} />
                ) : (
                  <span className="text-sm text-[var(--muted)]">
                    N/A
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--muted)]">
                  Order Date
                </span>

                <span className="flex items-center gap-1 text-right text-sm text-[var(--text)]">
                  <CalendarDays size={14} />
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="border-t border-[var(--border)] pt-4">
                <p className="text-sm text-[var(--muted)]">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-bold text-[var(--primary)]">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </section>

          {/* Order Notes */}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-4 flex items-center gap-3">
              <FileText
                size={20}
                className="text-[var(--primary)]"
              />

              <h2 className="font-semibold text-[var(--text)]">
                Order Notes
              </h2>
            </div>

            <p className="whitespace-pre-wrap text-sm text-[var(--muted)]">
              {order.notes || "No notes available for this order."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;