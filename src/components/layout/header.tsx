import React from "react";
import CurrentUser from "./current-user";
import { Layout, Space } from "antd";
function Header() {
  const headerStyle: React.CSSProperties = {
    background: "#fff",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 24px",
    zIndex: 999,
    position: "sticky",
  };
  return (
    <Layout.Header style={headerStyle}>
      <Space align="center" size="middle">
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
}

export default Header;
