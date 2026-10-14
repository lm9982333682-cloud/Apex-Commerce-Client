
import { useCallback, useEffect, useState } from "react";
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    CreditCard,
    Eye,
    RotateCcw,
    FileText,
    LoaderCircle,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "react-toastify";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import Pagination from "../components/Pagination";

import {
    getAllOrders,
    getOrderStats,
    updateOrderStatus,
} from "../services/orderService";

const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
];

const formatStatus = (status = "pending") =>
    status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase();

const getErrorMessage = (error) =>
    error.response?.data?.message ||
    error.message ||
    "Something went wrong";

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getOrderId = (order) => order._id;

const getCustomer = (order) => {
    const customer = order.user ?? order.customer;

    return {
        name:
            customer?.name ??
            customer?.fullName ??
            "Customer",
        email: customer?.email ?? "N/A",
    };
};

const Orders = () => {
    const [orders, setOrders] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);

    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 8,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [expandedNotes, setExpandedNotes] = useState({});

    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        paidRevenue: 0,
    });

    const itemsPerPage = 8;

    // Fetch orders with search, filters and server pagination.
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getAllOrders({
                page: currentPage,
                limit: itemsPerPage,
                search: search.trim(),
                status:
                    statusFilter === "All"
                        ? ""
                        : statusFilter,
                paymentStatus:
                    paymentFilter === "All"
                        ? ""
                        : paymentFilter,
            });

            if (!Array.isArray(response.data)) {
                throw new Error(
                    "Invalid orders response from server."
                );
            }

            setOrders(response.data);

            setPagination(
                response.pagination ?? {
                    total: response.data.length,
                    page: currentPage,
                    limit: itemsPerPage,
                    totalPages: Math.ceil(
                        response.data.length / itemsPerPage
                    ),
                }
            );
        } catch (error) {
            toast.error(getErrorMessage(error));
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        search,
        statusFilter,
        paymentFilter,
    ]);

    // Fetch global statistics from the backend.
    const fetchOrderStats = useCallback(async () => {
        try {
            const response = await getOrderStats();

            if (response.success && response.data) {
                setStats({
                    totalOrders:
                        Number(response.data.totalOrders) || 0,
                    pendingOrders:
                        Number(response.data.pendingOrders) || 0,
                    deliveredOrders:
                        Number(response.data.deliveredOrders) || 0,
                    paidRevenue:
                        Number(response.data.paidRevenue) || 0,
                });
            }
        } catch (error) {
            console.error(
                "Failed to fetch order statistics:",
                error
            );
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        fetchOrderStats();
    }, [fetchOrderStats]);

    // Search handler.
    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    // Order status filter.
    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    // Payment status filter.
    const handlePaymentFilter = (value) => {
        setPaymentFilter(value);
        setCurrentPage(1);
    };

    // Reset all filters.
    const resetFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setPaymentFilter("All");
        setCurrentPage(1);
    };

    const hasActiveFilters =
        search !== "" ||
        statusFilter !== "All" ||
        paymentFilter !== "All";

    // Update an order's status.
    const handleStatusChange = async (orderId, newStatus) => {
        const order = orders.find(
            (item) => getOrderId(item) === orderId
        );

        if (!order || order.status === newStatus) {
            return;
        }

        try {
            setUpdatingOrderId(orderId);

            const response = await updateOrderStatus(
                orderId,
                newStatus
            );

            if (response.success === false) {
                throw new Error(
                    response.message ||
                    "Failed to update order status."
                );
            }

            toast.success(
                "Order status updated successfully."
            );

            await Promise.all([
                fetchOrders(),
                fetchOrderStats(),
            ]);
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Expand or collapse order notes.
    const toggleNotes = (orderId) => {
        setExpandedNotes((previous) => ({
            ...previous,
            [orderId]: !previous[orderId],
        }));
    };

    // Refresh orders and statistics.
    const handleRefresh = async () => {
        await Promise.all([
            fetchOrders(),
            fetchOrderStats(),
        ]);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Orders"
                description="Manage and track all customer orders."
            />

            {/* Global Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    description="All orders"
                />

                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={Clock}
                    description="Awaiting processing"
                />

                <StatCard
                    title="Delivered Orders"
                    value={stats.deliveredOrders}
                    icon={CheckCircle}
                    description="Successfully delivered"
                />

                <StatCard
                    title="Paid Revenue"
                    value={formatCurrency(stats.paidRevenue)}
                    icon={CreditCard}
                    description="Revenue from paid orders"
                />
            </div>

            {/* Orders Table */}
            <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                {/* Header and Filters */}
                <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text)]">
                                All Orders
                            </h2>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                {pagination.total} orders found
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--bg)] disabled:opacity-50"
                            >
                                <RotateCcw
                                    size={15}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                                Refresh
                            </button>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--bg)]"
                                >
                                    <XCircle size={15} />
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                            <SearchBar
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search order ID, customer or email..."
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                handleStatusFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                        >
                            <option value="All">
                                All Order Statuses
                            </option>

                            {ORDER_STATUSES.map((status) => (
                                <option
                                    key={status}
                                    value={status}
                                >
                                    {formatStatus(status)}
                                </option>
                            ))}
                        </select>

                        <select
                            value={paymentFilter}
                            onChange={(event) =>
                                handlePaymentFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                        >
                            <option value="All">
                                All Payment Statuses
                            </option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] text-left">
                        <thead className="bg-[var(--bg)]">
                            <tr className="text-xs uppercase tracking-wider text-[var(--muted)]">
                                <th className="px-5 py-4 font-medium">
                                    Order ID
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Customer
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Date
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Total
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Payment
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Status
                                </th>

                                <th className="px-5 py-4 font-medium">
                                    Change Status
                                </th>

                                <th className="px-5 py-4 text-right font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[var(--border)]">
                            {!loading &&
                                orders.map((order) => {
                                    const orderId = getOrderId(order);
                                    const customer = getCustomer(order);

                                    const currentStatus = String(
                                        order.status ?? "pending"
                                    ).toLowerCase();

                                    const isUpdating =
                                        updatingOrderId === orderId;

                                    return (
                                        <tr
                                            key={orderId}
                                            className="transition hover:bg-[var(--bg)]"
                                        >
                                            {/* Order ID */}
                                            <td className="px-5 py-4">
                                                <span className="font-medium text-[var(--primary)]">
                                                    #{String(orderId).slice(-8)}
                                                </span>

                                                <p className="mt-1 text-xs text-[var(--muted)]">
                                                    {order.items?.length ?? 0} items
                                                </p>

                                                {order.notes && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleNotes(orderId)
                                                        }
                                                        className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                                                    >
                                                        <FileText size={13} />

                                                        {expandedNotes[orderId]
                                                            ? "Hide notes"
                                                            : "View notes"}
                                                    </button>
                                                )}

                                                {expandedNotes[orderId] &&
                                                    order.notes && (
                                                        <p className="mt-2 max-w-48 whitespace-normal break-words rounded-lg border border-[var(--border)] p-2 text-xs text-[var(--muted)]">
                                                            {order.notes}
                                                        </p>
                                                    )}
                                            </td>

                                            {/* Customer */}
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[var(--text)]">
                                                    {customer.name}
                                                </p>

                                                <p className="mt-1 text-xs text-[var(--muted)]">
                                                    {customer.email}
                                                </p>
                                            </td>

                                            {/* Date */}
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--muted)]">
                                                {formatDate(order.createdAt)}
                                            </td>

                                            {/* Total */}
                                            <td className="whitespace-nowrap px-5 py-4 font-medium text-[var(--text)]">
                                                {formatCurrency(order.totalAmount)}
                                            </td>

                                            {/* Payment Status */}
                                            <td className="px-5 py-4">
                                                {order.paymentStatus ? (
                                                    <StatusBadge
                                                        status={formatStatus(
                                                            order.paymentStatus
                                                        )}
                                                    />
                                                ) : (
                                                    <span className="text-sm text-[var(--muted)]">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>

                                            {/* Current Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={formatStatus(
                                                        currentStatus
                                                    )}
                                                />
                                            </td>

                                            {/* Change Status */}
                                            <td className="px-5 py-4">
                                                <select
                                                    value={currentStatus}
                                                    disabled={isUpdating}
                                                    onChange={(event) =>
                                                        handleStatusChange(
                                                            orderId,
                                                            event.target.value
                                                        )
                                                    }
                                                    aria-label="Change order status"
                                                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-50"
                                                >
                                                    {ORDER_STATUSES.map(
                                                        (status) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {formatStatus(status)}
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                {isUpdating && (
                                                    <LoaderCircle
                                                        size={16}
                                                        className="ml-2 inline animate-spin text-[var(--primary)]"
                                                    />
                                                )}
                                            </td>

                                            {/* View Details */}
                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    to={`/orders/${orderId}`}
                                                    aria-label={`View order ${orderId}`}
                                                    className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                                >
                                                    <Eye size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}

                            {/* Empty State */}
                            {!loading && orders.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-12 text-center"
                                    >
                                        <div className="mx-auto flex max-w-sm flex-col items-center">
                                            <div className="mb-3 rounded-full bg-[var(--bg)] p-4 text-[var(--muted)]">
                                                <XCircle size={28} />
                                            </div>

                                            <h3 className="font-semibold text-[var(--text)]">
                                                No orders found
                                            </h3>

                                            <p className="mt-1 text-sm text-[var(--muted)]">
                                                Try changing your search or filters.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Loading State */}
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-12 text-center"
                                    >
                                        <LoaderCircle
                                            size={28}
                                            className="mx-auto animate-spin text-[var(--primary)]"
                                        />

                                        <p className="mt-2 text-sm text-[var(--muted)]">
                                            Loading orders...
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-[var(--border)]">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={Math.max(
                            1,
                            pagination.totalPages
                        )}
                        onPageChange={setCurrentPage}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                    />
                </div>
            </section>
        </div>
    );
};

export default Orders;
