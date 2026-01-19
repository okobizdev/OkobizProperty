import {
  Table,
  Button,
  Select,
  Popconfirm,
  Input,
  Image,
  message,
  Spin,
} from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import GuestManagementServices from "../services/guestManagement.services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useDebounce from "../hooks/useDebounce";
import { baseUrl } from "../constants/env";

const { Option } = Select;
const {
  processGetAllGuest,
  processChangeAccountStatus,
  processGuestDelete,
  processSearchGuest,
} = GuestManagementServices;

const GuestManagement = () => {
  const [searchText, setSearchText] = useState();
  const [statusFilter, setStatusFilter] = useState();
  const [sortOrder, setSortOrder] = useState();
  const [page, setPage] = useState();

  const queryClient = useQueryClient();

  // Debounce for search input
  const debouncedSearch = useDebounce(searchText, 500);

  const {
    data: usersData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["guests", statusFilter, page, sortOrder],
    queryFn: () =>
      processGetAllGuest(statusFilter || "", page, sortOrder || ""),
    keepPreviousData: true,
    enabled: !debouncedSearch, // Disable if searching
  });
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search-guests", debouncedSearch],
    queryFn: () => processSearchGuest(debouncedSearch),
    enabled: !!debouncedSearch,
  });
  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status, identityDocument }) =>
      processChangeAccountStatus(id, {
        identityDocument,
        accountStatus: status,
      }),
    onSuccess: () => {
      message.success("Account status updated");
      queryClient.invalidateQueries(["guests"]);
    },
    onError: () => {
      message.error("Failed to update account status");
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: processGuestDelete,
    onSuccess: () => {
      message.success("User deleted");
      queryClient.invalidateQueries(["guests"]);
    },
    onError: () => {
      message.error("Failed to delete user");
    },
  });

  const handleAccountStatusChange = (value, userId, identityDocument) => {
    changeStatus({ id: userId, status: value, identityDocument });
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
  };

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (avatar) =>
        avatar ? (
          <Image width={40} height={40} src={avatar} alt="avatar" />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            N/A
          </div>
        ),
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
  render: (role) => {
    if (role === "guest") return "Client";
    if (role === "host") return "Owner";
    return role; 
  },
},
    {
      title: "Verified",
      dataIndex: "isVerified",
      render: (isVerified) => (isVerified ? "Yes" : "No"),
    },
    {
      title: "Account Status",
      dataIndex: "accountStatus",
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) =>
            handleAccountStatusChange(
              value,
              record._id,
              record.identityDocument
            )
          }
          style={{ width: 120 }}
        >
          {/* <Option value="rejected">Rejected</Option> */}
          <Option value="active">Active</Option>
          <Option value="suspended">Suspended</Option>
        </Select>
      ),
    },
    {
      title: "Document Type",
      dataIndex: ["identityDocument", "documentType"],
      render: (type) => type?.toUpperCase() || "N/A",
    },
    {
      title: "Identity Document",
      dataIndex: "identityDocument",
      render: (identityDocument) =>
        identityDocument ? (
          <div className="flex flex-col gap-2">
            <Image
              width={80}
              src={`${baseUrl}${identityDocument?.frontSide}`}
              alt="Front Side"
              placeholder
            />
            <Image
              width={80}
              src={`${baseUrl}${identityDocument?.backSide}`}
              alt="Back Side"
              placeholder
            />
          </div>
        ) : (
          <span>N/A</span>
        ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div
      className="w-full bg-white my-6 p-8 rounded-md overflow-y-auto"
      style={{ maxHeight: "80vh" }}
    >
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />

      <Select
          placeholder="Filter by Status"
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="active">Active</Option>
          {/* <Option value="inactive">Inactive</Option>
          <Option value="pending">Pending</Option> */}
          <Option value="suspended">Suspended</Option>
          {/* <Option value="rejected">Rejected</Option> */}
        </Select> 

        <Select
          placeholder="Sort By"
          value={sortOrder}
          onChange={(value) => {
            setSortOrder(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 150 }}
        >
          <Option value={-1}>New</Option>
          <Option value={1}>Old</Option>
        </Select>
      </div>

      {isLoading || isFetching || searchLoading ? (
        <div className="text-center py-10">
          <Spin />
        </div>
      ) : (
        <Table
          dataSource={
            debouncedSearch
              ? searchResults?.data
                ? Array.isArray(searchResults.data)
                  ? [searchResults.data]
                  : [searchResults.data]
                : []
              : Array.isArray(usersData?.data)
              ? usersData.data
              : []
          }
          columns={columns}
          rowKey="_id"
          pagination={{
            current: page,
            pageSize: 10,
            total: usersData?.totalUsers || 0,
            onChange: (p) => setPage(p),
          }}
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
};

export default GuestManagement;
