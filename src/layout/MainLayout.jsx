
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router";

const MainLayout = () => {


  const { isLoading, isAuthenticated } = useSelector(state => state.auth);

  if (isLoading) return <h1>Loading.....</h1>

  if (!isAuthenticated) return <Navigate to={"/login"} />


  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Outlet />
    </div>
  );
};

export default MainLayout;





