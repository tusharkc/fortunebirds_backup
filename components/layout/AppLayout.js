import React from "react";
import Header from "./Header/Header";
import LandingPageBanner from "./LandingPageBanner/LandingPageBanner";
import Pagination from "./Pagination/Pagination";

const AppLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <LandingPageBanner />
      {children}
      <Pagination />
    </div>
  );
};

export default AppLayout;
