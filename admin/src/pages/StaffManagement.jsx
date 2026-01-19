import {
  Table,
  Button,
  Select,
  Popconfirm,
  Input,
  Modal,
  Form,
  message,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StaffManagementServices from "../services/staff.services";
import useDebounce from "../hooks/useDebounce";

const {
  processChangeStaffPassword,
  processChangeStaffRole,
  processCreateStaff,
  processDeleteStaff,
  processFindAllStaff,
} = StaffManagementServices;

const roleOptions = [
  { label: "Listing Verification", value: "listingVerificationManager" },
  { label: "Finance", value: "financeManager" },
  { label: "Content", value: "contentManager" },
  { label: "Administrator", value: "accountAdministrator" },
];

const StaffManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState();
  const [page, setPage] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const debouncedSearch = useDebounce(searchText, 500);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["staffs", roleFilter, page, debouncedSearch],
    queryFn: () =>
      processFindAllStaff({
        page,
        role: roleFilter || "",
        search: debouncedSearch || "",
      }),
    keepPreviousData: true,
  });

  const staffList = Array.isArray(data?.data) ? data?.data : [];

  const { mutate: createStaff } = useMutation({
    mutationFn: processCreateStaff,
    onSuccess: () => {
      message.success("Staff created");
      form.resetFields();
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries(["staffs"]);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message);
    },
  });

  const { mutate: changeRole } = useMutation({
    mutationFn: ({ id, payload }) => processChangeStaffRole({ id, payload }),
    onSuccess: () => {
      message.success("Role updated");
      queryClient.invalidateQueries(["staffs"]);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message);
    },
  });

  const { mutate: changePassword } = useMutation({
    mutationFn: ({ id, payload }) =>
      processChangeStaffPassword({ id, payload }),
    onSuccess: () => {
      message.success("Password updated");
      passwordForm.resetFields();
      setIsPasswordModalOpen(false);
      queryClient.invalidateQueries(["staffs"]);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message);
    },
  });

  const { mutate: deleteStaff } = useMutation({
    mutationFn: processDeleteStaff,
    onSuccess: () => {
      message.success("Staff deleted");
      queryClient.invalidateQueries(["staffs"]);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message);
    },
  });

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role, record) => (
        <Select
          value={role}
          onChange={(value) =>
            changeRole({ id: record._id, payload: { role: value } })
          }
          style={{ width: 200 }}
        >
          {roleOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<KeyOutlined />}
            onClick={() => {
              setSelectedStaffId(record._id);
              setIsPasswordModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this staff?"
            onConfirm={() => deleteStaff({ id: record._id })}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <h1 className="text-2xl font-bold mb-4">Staff Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by email"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />

        <Select
          placeholder="Filter by Role"
          value={roleFilter}
          onChange={(value) => {
            setRoleFilter(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 250 }}
        >
          {roleOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Staff
        </Button>
      </div>

      {isLoading || isFetching ? (
        <div className="text-center py-10">
          <Spin />
        </div>
      ) : (
        <Table
          dataSource={staffList}
          columns={columns}
          rowKey="_id"
          pagination={{
            current: page,
            pageSize: 10,
            total: data?.totalStaffs || 0,
            onChange: (p) => setPage(p),
          }}
          scroll={{ x: "max-content" }}
        />
      )}

      {/* Create Staff Modal */}
      <Modal
        title="Create New Staff"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => createStaff({ payload: values })}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModalOpen}
        onCancel={() => setIsPasswordModalOpen(false)}
        onOk={() =>
          passwordForm.validateFields().then(({ password }) => {
            changePassword({
              id: selectedStaffId,
              payload: { password },
            });
          })
        }
        okText="Update"
      >
        <Form layout="vertical" form={passwordForm}>
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
