import React from "react";
import { Table, Button, Space, Popconfirm, Tag } from "antd";
import type { User } from "../auth/user";
import { ROLE } from "@/constants/roles";
import { UserStatus } from "@/features/user/userApi";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onStatusUpdate: (userId: string, newStatus: UserStatus) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  onStatusUpdate,
}) => {
  const columns = [
    { title: "Họ và tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Trường học", dataIndex: "schoolName", key: "schoolName" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: number) => (
        <Tag color={role === ROLE.ADMIN ? "volcano" : "geekblue"}>
          {role === ROLE.ADMIN ? "Admin" : "Teacher"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "userStatus",
      key: "userStatus",
      render: (status: number) => {
        let color = "default";
        let text = "Không rõ";
        if (status === 3) {
          color = "processing";
          text = "Chờ duyệt";
        }
        if (status === 1) {
          color = "success";
          text = "Hoạt động";
        }
        if (status === 2) {
          color = "error";
          text = "Vô hiệu hóa";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: User) => (
        <Space size="middle">
          {record.userStatus === 3 && (
            <>
              <Popconfirm
                title="Chấp nhận người dùng này?"
                onConfirm={() => onStatusUpdate(record.id, UserStatus.Active)}
              >
                <Button type="primary">Chấp nhận</Button>
              </Popconfirm>
              <Popconfirm
                title="Từ chối người dùng này?"
                onConfirm={() => onStatusUpdate(record.id, UserStatus.Inactive)}
              >
                <Button danger>Từ chối</Button>
              </Popconfirm>
            </>
          )}
          {record.userStatus === 1 && (
            <Popconfirm
              title="Vô hiệu hóa người dùng này?"
              onConfirm={() => onStatusUpdate(record.id, UserStatus.Inactive)}
            >
              <Button danger>Vô hiệu hóa</Button>
            </Popconfirm>
          )}
          {record.userStatus === 2 && (
            <Popconfirm
              title="Kích hoạt lại người dùng này?"
              onConfirm={() => onStatusUpdate(record.id, UserStatus.Active)}
            >
              <Button type="primary" ghost>
                Kích hoạt
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={isLoading}
      pagination={false}
    />
  );
};
