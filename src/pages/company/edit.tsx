import CustomAvatar from "@/components/custom-avatar";
import SelectOptionWithAvatar from "@/components/select-option-with-avatar";
import {
  businessTypeOptions,
  companySizeOptions,
  industryOptions,
} from "@/constants";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { UsersSelectQuery } from "@/graphql/types";
import { getNameInitials } from "@/utils";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import React from "react";
import { CompanyContactsTable } from "./contatcs-table";

export const EditPage = () => {
  const { formProps, saveButtonProps, formLoading, queryResult } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });

  const { avatarUrl, name } = queryResult?.data?.data || {};

  const { selectProps, queryResult: selectQueryResult } = useSelect<
    GetFieldsFromList<UsersSelectQuery>
  >({
    resource: "users",
    optionLabel: "name",
    pagination: {
      mode: "off",
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });
  return (
    <>
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form layout="vertical" {...formProps}>
              <CustomAvatar
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || "")}
                style={{
                  width: 96,
                  height: 96,
                  marginBottom: 24,
                }}
              />
              <Form.Item
                label="Sales Owner"
                name="salesOwnerId"
                initialValue={formProps.initialValues?.salesOwner.id}
              >
                <Select
                  {...selectProps}
                  placeholder="Please select a sales owner"
                  options={
                    selectQueryResult.data?.data?.map((user) => ({
                      value: user.id,
                      label: (
                        <SelectOptionWithAvatar
                          name={user.name}
                          avatarUrl={user.avatarUrl ?? undefined}
                          shape="circle"
                        />
                      ),
                    })) ?? []
                  }
                />
              </Form.Item>
              <Form.Item label="Company Size">
                <Select
                  options={companySizeOptions}
                  value={formProps.initialValues?.companySize}
                ></Select>
              </Form.Item>

              <Form.Item name="totalRevenue">
                <InputNumber
                  autoFocus
                  addonBefore="$"
                  min={0}
                  placeholder="0.00"
                />
              </Form.Item>
              <Form.Item label="Industry" name="industry">
                <Select options={industryOptions}></Select>
                <Form.Item label="Business Type" name="businessType">
                  <Select options={businessTypeOptions}></Select>
                </Form.Item>
                <Form.Item label="Country" name="country">
                  <Input placeholder="Country" />
                </Form.Item>
                <Form.Item label="Website" name="website">
                  <Input placeholder="Website" />
                </Form.Item>
              </Form.Item>
            </Form>
          </Edit>
        </Col>
        <Col xs={24} xl={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </>
  );
};
