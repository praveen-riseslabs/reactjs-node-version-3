import { Outlet } from "react-router-dom";
import SideBar from "../components/shared/SideBar";
import Header from "../components/shared/Header";
import {useWindowDimensions} from "../hooks/useWindowDimensions"

function Home() {
  const { glWidth } = useWindowDimensions();
  const isMobile = glWidth <= 768;
  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md-2 col-1 bg-dark text-white p-0"
          style={{ height: "100vh" }}
        >
          <div className="px-4 py-md-3 py-4 fw-bold">{!isMobile && "RisesLabs"}</div>
          <div className="">
            <SideBar  isMobile={isMobile}/>
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

export default Home;
