import { IResourceItem } from "@refinedev/core";
import {
  DashboardOutlined,
  ProjectOutlined,
  ShopOutlined,
} from "@ant-design/icons";
export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      Icon: <DashboardOutlined />,
      label: "Dashboard",
    },
  },
  {
    name: "companies",
    list: "/companies",
    show: "companies/:id",
    create: "/companies/create",
    edit: "/companies/edit/:id",
    meta: { label: "Companies", icon: <ShopOutlined /> },
  },
  {
    name: "tasks",
    list: "/tasks",
    create: "/tasks/create",
    edit: "/tasks/edit/:id",
    meta: { label: "Takes", icon: <ProjectOutlined /> },
  },
];
