import {
  DashboardTotalCountCards,
  DealsChart,
  UpcomingEvents,
  LatestActivities,
} from "@/components";

import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
import { DashboardTotalCountsQuery } from "@/graphql/types";
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";
import React from "react";

export function Home() {
  const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY,
    },
  });
  return (
    <>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8} style={{}}>
          <DashboardTotalCountCards
            isLoading={isLoading}
            totalCount={data?.data.companies.totalCount}
            resource="companies"
          />
        </Col>
        <Col xs={24} sm={24} xl={8} style={{}}>
          <DashboardTotalCountCards
            isLoading={isLoading}
            totalCount={data?.data.contacts.totalCount}
            resource="contacts"
          />
        </Col>
        <Col xs={24} sm={24} xl={8} style={{}}>
          <DashboardTotalCountCards
            isLoading={isLoading}
            totalCount={data?.data.deals.totalCount}
            resource="deals"
          />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
          <UpcomingEvents />
        </Col>
        <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
          <DealsChart />
        </Col>
      </Row>
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <LatestActivities />
        </Col>
      </Row>
    </>
  );
}
