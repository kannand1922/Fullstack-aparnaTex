import React from "react";
import UserDetails from "../../components/userDetaisl";
import CustomNavbar from "../../components/navbar";

function CustomerDetaisl() {
  return (
    <div>
      <CustomNavbar />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <UserDetails />
      </div>
    </div>
  );
}

export default CustomerDetaisl;
