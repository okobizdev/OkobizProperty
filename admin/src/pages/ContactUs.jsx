import { message, Button, Popconfirm, Table, Input, Select } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ContactsServices from "../services/contacts.services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { processDeleteContactMessage, processGetAllContacts } = ContactsServices;
const { Option } = Select;

const ContactUs = () => {
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [page, setPage] = useState();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: ({ id }) => processDeleteContactMessage({ id }),
    onSuccess: () => {
      message.success("Item deleted successfully");
      queryClient.invalidateQueries(["flats"]);
    },
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ["flats", page, sortOrder, searchText],
    queryFn: () =>
      processGetAllContacts({
        page,
        sort: sortOrder || "",
        search: searchText || "",
      }),
    keepPreviousData: true,
  });

  const columns = [
    { title: "SL", render: (_, __, index) => <div>{index + 1}</div> },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Thana",
      dataIndex: "thana",
      key: "thana",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Property Size",
      dataIndex: "property_size",
      key: "property_size",
    },
    {
      title: "Size Unit",
      dataIndex: "property_size_unit",
      key: "property_size_unit",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={() => deleteMutation.mutate({ id: record._id })}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (isError) message.error("Failed to load flats");
  }, [isError]);
  console.log("message data == ", data);
  return (
    <div className="bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by email"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <Select
            placeholder="Sort by"
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
            allowClear
            style={{ width: 150 }}
          >
            <Option value={-1}>Newest</Option>
            <Option value={1}>Oldest</Option>
          </Select>
        </div>
      </div>

      <Table
        dataSource={data?.data || []}
        loading={isLoading}
        columns={columns}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: 9,
          total: data?.totalFlat || 0,
          onChange: (p) => setPage(p),
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ContactUs;
