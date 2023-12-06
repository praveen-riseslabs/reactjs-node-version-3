import { Outlet } from "react-router-dom";
import SideBar from "../components/shared/SideBar";
import Header from "../components/shared/Header";

function DashBoard() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-2 bg-dark text-white p-0"
          style={{ height: "100vh" }}
        >
          <div className="px-4 py-3 align-items-center fw-bold">Windmill</div>
          <div className="">
            <SideBar />
          </div>
        </div>
        <div className="col g-0 bg-black">
          {/* header bar */}
          <Header />
          {/* main section */}
          <div className="text-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
