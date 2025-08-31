import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { CompaniesListQuery } from "@/graphql/types";
import { currencyNumber } from "@/utils";
import { FilterOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { getDefaultFilter, HttpError, useGo } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Input, Space, Table } from "antd";
import React from "react";

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { tableProps, filters } = useTable<
    GetFieldsFromList<CompaniesListQuery>,
    HttpError,
    GetFieldsFromList<CompaniesListQuery>
  >({
    resource: "companies",
    onSearch: (values: { name?: string }) => [
      {
        field: "name",
        operator: "contains",
        value: values.name,
      },
    ],

    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: "r",
        },
      ],
    },
    pagination: { pageSize: 12 },

    meta: { gqlQuery: COMPANIES_LIST_QUERY },
  });
  return (
    <>
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton
            onClick={() =>
              go({
                to: {
                  resource: "companies",
                  action: "create",
                },
                options: { keepQuery: false },
                type: "replace",
              })
            }
          >
            Create
          </CreateButton>
        )}
      >
        <Table {...tableProps} pagination={{ ...tableProps.pagination }}>
          <Table.Column<Company>
            dataIndex={"name"}
            title="Company Title"
            defaultFilteredValue={getDefaultFilter("id", filters)}
            filterIcon={<FilterOutlined style={{ fontSize: 16 }} />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search..." />
              </FilterDropdown>
            )}
            render={(value, record) => (
              <Space>
                <CustomAvatar
                  shape="square"
                  name={record.name}
                  src={record.avatarUrl}
                />
                <Text style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
              </Space>
            )}
          />
          <Table.Column<Company>
            dataIndex={"totalRevenue"}
            title="Open Deals Amount"
            render={(value, record) => (
              <Text>
                {currencyNumber(record?.dealsAggregate[0]?.sum?.value || 0)}
              </Text>
            )}
          />
          <Table.Column<Company>
            dataIndex={"id"}
            title="Actions"
            fixed="right"
            render={(value) => (
              <Space>
                <EditButton size="small" recordItemId={value} />
                <DeleteButton size="small" recordItemId={value} hideText />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </>
  );
};
