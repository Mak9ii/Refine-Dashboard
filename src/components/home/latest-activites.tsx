import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List, Space } from "antd";
import React from "react";
import { Text } from "../text";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import { useList } from "@refinedev/core";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "@/graphql/queries";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardLatestActivitiesAuditsQuery } from "@/graphql/types";
import dayjs from "dayjs";
import CustomAvatar from "../custom-avatar";

function LatestActivities() {
  const {
    data: audit,
    isLoading: isLoadingAudit,
    isError,
    error,
  } = useList<GetFieldsFromList<DashboardLatestActivitiesAuditsQuery>>({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
    },
  });
  const dealsId = audit?.data.map((audit) => audit?.targetId) || [];

  const { data: deals, isLoading: isLoadingDeals } = useList({
    resource: "deals",
    queryOptions: { enabled: !!dealsId?.length },
    pagination: { mode: "off" },
    filters: [{ field: "id", operator: "in", value: dealsId }],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  });
  const isLoading = isLoadingAudit || isLoadingDeals;
  if (isError) {
    console.log(error);
    return null;
  }
  return (
    <>
      <Card
        headStyle={{ padding: "16px" }}
        bodyStyle={{ padding: "0 1rem" }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UnorderedListOutlined />
            <Text size="sm" style={{ marginLeft: "0.5rem" }}>
              Latest Activities
            </Text>
          </div>
        }
      >
        {isLoading ? (
          <List
            itemLayout="horizontal"
            dataSource={Array.from({ length: 5 }).map((_, i) => ({
              id: i,
            }))}
            renderItem={(_, i) => <LatestActivitiesSkeleton key={i} />}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={audit?.data}
            renderItem={(audit) => {
              const deal =
                deals?.data.find(
                  (deal) => deal.id === String(audit.targetId)
                ) || undefined;
              return (
                <List.Item>
                  <List.Item.Meta
                    title={dayjs(deal?.createdAt).format("MMM DD,YYYY-HH:mm")}
                    avatar={
                      <CustomAvatar
                        shape="square"
                        size={48}
                        src={deal?.company.avatarUrl}
                        name={deal?.company.name}
                      />
                    }
                    description={
                      <Space size={4}>
                        <Text strong>{audit.user?.name}</Text>
                        <Text>
                          {audit?.action === "CREATE" ? "CREADTED" : "MOVED"}
                        </Text>
                        <Text strong>{deal?.title}</Text>
                        <Text>deal</Text>
                        <Text>{audit?.action === "CREATE" ? "in" : "to"}</Text>
                        <Text strong>{deal?.stage?.title}</Text>
                      </Space>
                    }
                  ></List.Item.Meta>
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </>
  );
}

export default LatestActivities;
