
import { useEffect, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Package,
    ShoppingBag,
    Users,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "react-toastify";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";

import { getDashboardStats } from "../services/dashboardService";
import { getAllProducts } from "../services/productService";

const Dashboard = () => {
    const [period, setPeriod] = useState("Week");
    const [statsData, setStatsData] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatPrice = (amount = 0) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);

                const [statsResponse, productsResponse] =
                    await Promise.all([
                        getDashboardStats(),
                        getAllProducts({ limit: 5 }),
                    ]);

                const dashboard =
                    statsResponse.stats ??
                    statsResponse.data?.stats ??
                    statsResponse.data ??
                    statsResponse;

                setStatsData(dashboard);

                const products =
                    productsResponse.products ??
                    productsResponse.data?.products ??
                    productsResponse.data ??
                    [];

                setTopProducts(
                    Array.isArray(products)
                        ? products.slice(0, 5).map((product) => ({
                              id: product._id,
                              name: product.title ?? product.name ?? "Product",
                              category:
                                  product.category?.name ??
                                  product.category ??
                                  "Uncategorized",
                              sold: product.sold ?? product.totalSold ?? 0,
                              price: product.price ?? 0,
                              image:
                                  product.images?.[0]?.url ??
                                  product.images?.[0] ??
                                  product.image ??
                                  "",
                          }))
                        : []
                );

                // Recent orders ko actual order API se connect karna hoga.
                setRecentOrders(
                    dashboard?.recentOrders ??
                    statsResponse.recentOrders ??
                    []
                );
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Failed to load dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const getStatValue = (...keys) => {
        for (const key of keys) {
            const value = statsData?.[key];

            if (value !== undefined && value !== null) {
                return value;
            }
        }

        return 0;
    };

    const stats = [
        {
            title: "Total Revenue",
            value: formatPrice(
                getStatValue("totalRevenue", "revenue", "totalSales")
            ),
            change: statsData?.revenueChange ?? "0%",
            trend: statsData?.revenueTrend ?? "up",
            icon: DollarSign,
            description: "Compared to last month",
        },
        {
            title: "Total Orders",
            value: getStatValue("totalOrders", "ordersCount", "orders"),
            change: statsData?.ordersChange ?? "0%",
            trend: statsData?.ordersTrend ?? "up",
            icon: ShoppingBag,
            description: "Compared to last month",
        },
        {
            title: "Total Products",
            value: getStatValue("totalProducts", "productsCount"),
            change: statsData?.productsChange ?? "0%",
            trend: statsData?.productsTrend ?? "up",
            icon: Package,
            description: "Total products in store",
        },
        {
            title: "Total Customers",
            value: getStatValue("totalCustomers", "customersCount", "totalUsers"),
            change: statsData?.customersChange ?? "0%",
            trend: statsData?.customersTrend ?? "up",
            icon: Users,
            description: "Total registered customers",
        },
    ];

    const salesData = statsData?.salesData ?? [];
    const maxSales = Math.max(
        ...salesData.map((item) => Number(item.sales) || 0),
        1
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's what's happening with your store."
            />

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Sales Overview */}
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] sm:p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                            Sales Overview
                        </h2>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Your sales performance at a glance
                        </p>
                    </div>

                    <select
                        value={period}
                        onChange={(event) => setPeriod(event.target.value)}
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="Week">This Week</option>
                        <option value="Month">This Month</option>
                        <option value="Year">This Year</option>
                    </select>
                </div>

                <div className="mb-5">
                    <p className="text-sm text-[var(--text-muted)]">
                        Total sales
                    </p>
                    <p className="mt-1 text-3xl font-bold text-[var(--text-primary)]">
                        {formatPrice(
                            getStatValue("totalRevenue", "revenue", "totalSales")
                        )}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--success)]">
                        <ArrowUpRight size={16} />
                        {statsData?.revenueChange ?? "0%"} change
                    </p>
                </div>

                {salesData.length > 0 ? (
                    <div className="flex h-56 items-end gap-3 sm:gap-6">
                        {salesData.map((item, index) => {
                            const sales = Number(item.sales) || 0;
                            const height = (sales / maxSales) * 100;

                            return (
                                <div
                                    key={item.day ?? item.label ?? index}
                                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                                >
                                    <div className="flex h-full w-full items-end justify-center">
                                        <div
                                            title={formatPrice(sales)}
                                            className="w-full max-w-12 rounded-t-lg bg-[var(--primary)] transition-all duration-300 hover:opacity-80"
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>

                                    <span className="text-xs text-[var(--text-muted)]">
                                        {item.day ?? item.label ?? ""}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-56 items-center justify-center text-sm text-[var(--text-muted)]">
                        No sales data available
                    </div>
                )}
            </section>

            {/* Recent Orders and Top Products */}
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                {/* Recent Orders */}
                <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] 2xl:col-span-2">
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-5">
                        <div>
                            <h2 className="font-semibold text-[var(--text-primary)]">
                                Recent Orders
                            </h2>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Latest orders from your store
                            </p>
                        </div>

                        <Link
                            to="/orders"
                            className="whitespace-nowrap text-sm font-semibold text-[var(--primary)] hover:opacity-80"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                            <thead className="bg-[var(--surface-subtle)]">
                                <tr>
                                    {["Order", "Customer", "Date", "Amount", "Status"].map(
                                        (heading) => (
                                            <th
                                                key={heading}
                                                className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]"
                                            >
                                                {heading}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[var(--border)]">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr
                                            key={order._id ?? order.id}
                                            className="transition-colors hover:bg-[var(--surface-subtle)]"
                                        >
                                            <td className="px-5 py-4">
                                                <Link
                                                    to={`/orders/${order._id ?? order.id}`}
                                                    className="text-sm font-semibold text-[var(--primary)]"
                                                >
                                                    {order.orderNumber ??
                                                        order._id ??
                                                        order.id}
                                                </Link>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
                                                    {order.user?.name ??
                                                        order.customer?.name ??
                                                        order.customer ??
                                                        "Customer"}
                                                </p>
                                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                                    {order.user?.email ??
                                                        order.customer?.email ??
                                                        order.email ??
                                                        "N/A"}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--text-secondary)]">
                                                {formatDate(order.createdAt ?? order.date)}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">
                                                {formatPrice(
                                                    order.totalAmount ??
                                                        order.totalPrice ??
                                                        order.amount ??
                                                        0
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={order.status ?? "Pending"} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-5 py-10 text-center text-sm text-[var(--text-muted)]"
                                        >
                                            No recent orders available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Top Selling Products */}
                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
                    <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
                        <div>
                            <h2 className="font-semibold text-[var(--text-primary)]">
                                Top Products
                            </h2>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Best-selling products
                            </p>
                        </div>

                        <Package size={20} className="text-[var(--text-muted)]" />
                    </div>

                    <div className="divide-y divide-[var(--border)]">
                        {topProducts.length > 0 ? (
                            topProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 p-4"
                                >
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            loading="lazy"
                                            className="h-14 w-14 shrink-0 rounded-xl border border-[var(--border)] object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-muted)]">
                                            <Package size={22} />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                                            {product.name}
                                        </p>

                                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                                            {product.category}
                                        </p>

                                        <p className="mt-2 text-xs text-[var(--text-secondary)]">
                                            {product.sold} sold
                                        </p>
                                    </div>

                                    <p className="whitespace-nowrap text-sm font-semibold text-[var(--text-primary)]">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="p-6 text-center text-sm text-[var(--text-muted)]">
                                No products available
                            </p>
                        )}
                    </div>

                    <Link
                        to="/products"
                        className="block border-t border-[var(--border)] p-4 text-center text-sm font-semibold text-[var(--primary)] hover:bg-[var(--surface-subtle)]"
                    >
                        View All Products
                    </Link>
                </section>
            </div>

            {/* Quick Summary */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--success-bg)] text-[var(--success)]">
                        <CreditCard size={23} />
                    </div>

                    <div>
                        <p className="text-sm text-[var(--text-muted)]">
                            Completed Payments
                        </p>
                        <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                            {getStatValue("completedPayments", "paidOrders")}
                        </p>
                    </div>

                    <ArrowUpRight
                        size={20}
                        className="ml-auto text-[var(--success)]"
                    />
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--warning-bg)] text-[var(--warning)]">
                        <ShoppingBag size={23} />
                    </div>

                    <div>
                        <p className="text-sm text-[var(--text-muted)]">
                            Pending Orders
                        </p>
                        <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                            {getStatValue("pendingOrders")}
                        </p>
                    </div>

                    <ArrowDownRight
                        size={20}
                        className="ml-auto text-[var(--warning)]"
                    />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
