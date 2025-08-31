import React from "react";
import { Avatar as AntdAvatar, AvatarProps } from "antd";
import { getNameInitials } from "@/utils/get-name-initials";
type Props = AvatarProps & {
  name?: string;
};
function CustomAvatar({ name, style, ...rest }: Props) {
  return (
    <AntdAvatar
      alt={name}
      size="small"
      style={{
        backgroundColor: "#f56a00",
        display: "flex",
        alignItems: "center",
        border: "none",
        ...style,
      }}
      {...rest}
    >
      {getNameInitials(name || "")}
    </AntdAvatar>
  );
}

export default CustomAvatar;
