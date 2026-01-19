// import { useState } from "react";
// import {
//   Button,
//   Form,
//   Input,
//   Modal,
//   Table,
//   Upload,
//   message,
//   Popconfirm,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusSquareOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import TeamMemberServices from "../services/teamMember.services";
// import { baseUrl } from "../constants/env";

// const {
//   processAddTeamMember,
//   processDeleteTeamMember,
//   processEditTeamMember,
//   processGetTeamMembers,
//   processEditTeamMemberField
// } = TeamMemberServices;

// const TeamMembers = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const [editingMember, setEditingMember] = useState(null);
//   const [fileList, setFileList] = useState([]);

//   const queryClient = useQueryClient();

//   const { data: teamMembers = [], isLoading } = useQuery({
//     queryKey: ["team-members"],
//     queryFn: processGetTeamMembers,
//   });

//   const { mutate: addMemberMutate, isLoading: adding } = useMutation({
//     mutationFn: processAddTeamMember,
//     onSuccess: () => {
//       message.success("Team member added!");
//       queryClient.invalidateQueries(["team-members"]);
//       handleModalCancel();
//     },
//     onError: () => {
//       message.error("Failed to add team member.");
//     },
//   });

//   const { mutate: editMemberMutate, isLoading: editing } = useMutation({
//     mutationFn: ({ formData, id }) => processEditTeamMember(formData, id),
//     onSuccess: () => {
//       message.success("Team member updated!");
//       queryClient.invalidateQueries(["team-members"]);
//       handleModalCancel();
//     },
//     onError: () => {
//       message.error("Failed to update team member.");
//     },
//   });

//   const { mutate: deleteMemberMutate } = useMutation({
//     mutationFn: processDeleteTeamMember,
//     onSuccess: () => {
//       message.success("Team member deleted.");
//       queryClient.invalidateQueries(["team-members"]);
//     },
//     onError: () => {
//       message.error("Failed to delete team member.");
//     },
//   });

//   const handleModalCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//     setEditingMember(null);
//     setFileList([]);
//   };

//   const handleFileChange = ({ fileList }) => {
//     setFileList(fileList);
//   };

//   const handleSubmit = (values) => {
//     const { teamMemberName, teamMemberDesignation } = values;
//     const formData = new FormData();
//     formData.append("teamMemberName", teamMemberName);
//     formData.append("teamMemberDesignation", teamMemberDesignation);

//     if (fileList.length > 0) {
//       formData.append("teamMemberImage", fileList[0].originFileObj);
//     }

//     if (editingMember) {
//       editMemberMutate({ formData, id: editingMember._id });
//     } else {
//       console.log(formData);
//       addMemberMutate(formData);
//     }
//   };

//   const handleEdit = (record) => {
//     setEditingMember(record);
//     form.setFieldsValue({
//       teamMemberName: record?.teamMemberName,
//       teamMemberDesignation: record?.teamMemberDesignation,
//     });

//     if (record?.teamMemberImage) {
//       setFileList([
//         {
//           uid: "-1",
//           name: record.teamMemberImage,
//           status: "done",
//           url: `${baseUrl}${record.teamMemberImage}`,
//         },
//       ]);
//     }

//     setIsModalVisible(true);
//   };

//   const handleDelete = (id) => {
//     deleteMemberMutate(id);
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image",
//       key: "image",
//       render: (img, record) => {
//         console.log("team", record);
//         return (
//           <div>
//             {record ? (
//               <img
//                 src={`${baseUrl}${record?.teamMemberImage}`}
//                 alt="Team"
//                 style={{
//                   width: 50,
//                   height: 50,
//                   objectFit: "cover",
//                   borderRadius: 4,
//                 }}
//               />
//             ) : (
//               "-"
//             )}
//           </div>
//         );
//       },
//     },
//     {
//       title: "Name",
//       dataIndex: "teamMemberName",
//       key: "teamMemberName",
//     },
//     {
//       title: "Designation",
//       dataIndex: "teamMemberDesignation",
//       key: "teamMemberDesignation",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <div className="flex gap-2">
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
//           <Popconfirm
//             title="Are you sure to delete?"
//             onConfirm={() => handleDelete(record._id)}
//           >
//             <Button icon={<DeleteOutlined />} danger />
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="w-full bg-white my-6 p-8 rounded-md">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">Team Members</h1>
//         <Button onClick={() => setIsModalVisible(true)}>
//           <PlusSquareOutlined /> Add Member
//         </Button>
//       </div>

//       <Table
//         loading={isLoading}
//         dataSource={teamMembers}
//         columns={columns}
//         rowKey="_id"
//         scroll={{ x: true }}
//       />

//       <Modal
//         title={editingMember ? "Edit Team Member" : "Add Team Member"}
//         open={isModalVisible}
//         onCancel={handleModalCancel}
//         footer={null}
//       >
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item
//             name="teamMemberName"
//             label="Name"
//             rules={[{ required: true, message: "Please enter the name" }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="teamMemberDesignation"
//             label="Designation"
//             rules={[
//               { required: true, message: "Please enter the designation" },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item label="Image">
//             <Upload
//               listType="picture-card"
//               beforeUpload={() => false}
//               fileList={fileList}
//               onChange={handleFileChange}
//               maxCount={1}
//             >
//               {fileList.length >= 1 ? null : (
//                 <div>
//                   <UploadOutlined />
//                   <div style={{ marginTop: 8 }}>Upload</div>
//                 </div>
//               )}
//             </Upload>
//           </Form.Item>

//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             loading={adding || editing}
//           >
//             {editingMember ? "Update Member" : "Add Member"}
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TeamMembers;

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Upload,
  message,
  Popconfirm,
  Image,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TeamMemberServices from "../services/teamMember.services";
import { baseUrl } from "../constants/env";

const {
  processAddTeamMember,
  processDeleteTeamMember,
  processEditTeamMember,
  processGetTeamMembers,
  processEditTeamMemberField,
} = TeamMemberServices;

const TeamMembers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingMember, setEditingMember] = useState(null);
  const [fileList, setFileList] = useState([]);

  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: processGetTeamMembers,
  });

  const { mutate: addMemberMutate, isLoading: adding } = useMutation({
    mutationFn: processAddTeamMember,
    onSuccess: () => {
      message.success("Team member added!");
      queryClient.invalidateQueries(["team-members"]);
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add team member.");
    },
  });

  const { mutate: editMemberMutate, isLoading: editing } = useMutation({
    mutationFn: ({ formData, id }) => processEditTeamMember(formData, id),
    onSuccess: () => {
      message.success("Team member updated!");
      queryClient.invalidateQueries(["team-members"]);
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update team member.");
    },
  });

  const { mutate: deleteMemberMutate } = useMutation({
    mutationFn: processDeleteTeamMember,
    onSuccess: () => {
      message.success("Team member deleted.");
      queryClient.invalidateQueries(["team-members"]);
    },
    onError: () => {
      message.error("Failed to delete team member.");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingMember(null);
    setFileList([]);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = (values) => {
    const { teamMemberName, teamMemberDesignation } = values;
    const isImageChanged = fileList.length > 0 && fileList[0].originFileObj;

    const formData = new FormData();
    formData.append("teamMemberName", teamMemberName);
    formData.append("teamMemberDesignation", teamMemberDesignation);

    if (isImageChanged) {
      formData.append("teamMemberImage", fileList[0].originFileObj);
    }

    if (editingMember) {
      if (isImageChanged) {
        // PUT when image is updated
        editMemberMutate({ formData, id: editingMember._id });
      } else {
        // PATCH when image is not updated
        const fieldFormData = new FormData();
        fieldFormData.append("teamMemberName", teamMemberName);
        fieldFormData.append("teamMemberDesignation", teamMemberDesignation);

        processEditTeamMemberField(fieldFormData, editingMember._id)
          .then(() => {
            message.success("Team member updated!");
            queryClient.invalidateQueries(["team-members"]);
            handleModalCancel();
          })
          .catch(() => {
            message.error("Failed to update team member.");
          });
      }
    } else {
      addMemberMutate(formData);
    }
  };

  const handleEdit = (record) => {
    setEditingMember(record);
    form.setFieldsValue({
      teamMemberName: record?.teamMemberName,
      teamMemberDesignation: record?.teamMemberDesignation,
    });

    if (record?.teamMemberImage) {
      setFileList([
        {
          uid: "-1",
          name: record.teamMemberImage,
          status: "done",
          url: `${baseUrl}${record.teamMemberImage}`,
        },
      ]);
    }

    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMemberMutate(id);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <div>
          {record?.teamMemberImage ? (
            <Image
              src={`${baseUrl}${record?.teamMemberImage}`}
              alt="Team"
              placeholder
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 4,
              }}
            />
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "teamMemberName",
      key: "teamMemberName",
    },
    {
      title: "Designation",
      dataIndex: "teamMemberDesignation",
      key: "teamMemberDesignation",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Button onClick={() => setIsModalVisible(true)}>
          <PlusSquareOutlined /> Add Member
        </Button>
      </div>

      <Table
        loading={isLoading}
        dataSource={teamMembers}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
      />

      <Modal
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="teamMemberName"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="teamMemberDesignation"
            label="Designation"
            rules={[
              { required: true, message: "Please enter the designation" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={adding || editing}
          >
            {editingMember ? "Update Member" : "Add Member"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamMembers;
