import React, { useEffect, useMemo, useState } from "react";
import { Typography, Pagination, Input, Space, Button, Select } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, updateUserStatus } from "@/features/user/usersSlice";
import { fetchSchoolNames } from "../shared/sharedSlice";
import { UsersTable } from "./UsersTable";
import { useDebounce } from "@/hooks/useDebounce";
import { UserStatus } from "@/features/user/userApi";

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pagedUsers, isLoading } = useAppSelector((state) => state.users);
  const { schoolList } = useAppSelector((state) => state.shared);

  const {
    items: users,
    totalItems,
    pageIndex,
    pageSize,
  } = pagedUsers || { items: [], totalItems: 0, pageIndex: 1, pageSize: 10 };

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      fetchUsers({ pageIndex: 1, pageSize, search: debouncedSearch, status })
    );
    if (schoolList.length === 0) {
      dispatch(fetchSchoolNames());
    }
  }, [dispatch, pageSize, debouncedSearch, status, schoolList.length]);

  const usersWithSchoolName = useMemo(() => {
    if (!users || !schoolList.length) return users || [];
    return users.map((user) => {
      const schoolId = user.schoolId || user.schoolID;
      const school = schoolList.find((s) => s.id === schoolId);
      return { ...user, schoolName: school ? school.schoolName : "Không rõ" };
    });
  }, [users, schoolList]);

  const handleStatusUpdate = (userId: string, newStatus: UserStatus) => {
    const currentFilters = {
      pageIndex,
      pageSize,
      search: debouncedSearch,
      status,
    };
    dispatch(updateUserStatus({ userId, status: newStatus, currentFilters }));
  };

  const handlePageChange = (page: number, size: number) => {
    dispatch(
      fetchUsers({
        pageIndex: page,
        pageSize: size,
        search: debouncedSearch,
        status,
      })
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
  };

  return (
    <div>
      <Title level={2}>Quản lý Người dùng</Title>

      <div style={{ marginBottom: 16 }}>
        <Space wrap size="middle">
          <Input.Search
            placeholder="Tìm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            value={status || null}
            onChange={(value) => setStatus(value || "")}
            style={{ width: 180 }}
            allowClear
          >
            <Select.Option value={UserStatus.Pending}>Chờ duyệt</Select.Option>
            <Select.Option value={UserStatus.Active}>Hoạt động</Select.Option>
            <Select.Option value={UserStatus.Inactive}>
              Vô hiệu hóa
            </Select.Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            Reset
          </Button>
        </Space>
      </div>

      <UsersTable
        users={usersWithSchoolName}
        isLoading={isLoading}
        onStatusUpdate={handleStatusUpdate}
      />

      <Pagination
        current={pageIndex}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: "right" }}
        showSizeChanger
      />
    </div>
  );
};

export default UsersPage;
