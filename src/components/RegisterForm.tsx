import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select } from 'antd';
import { SchoolSelect } from '@/features/school/SchoolSelect';
import { ROLE } from '@/constants/roles';
import type { RegisterDto } from '@/features/auth/user';

interface RegisterFormProps {
  onSubmit: (data: RegisterDto) => void;
  isLoading: boolean;
  apiError?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, apiError }) => {
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterDto>();
  const password = watch('password');

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow"
    >
      <Form.Item
        label="Họ và tên"
        required
        validateStatus={errors.fullName ? 'error' : ''}
        help={errors.fullName?.message}
      >
        <Controller
          name="fullName"
          control={control}
          rules={{ required: 'Họ và tên là bắt buộc' }}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        required
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email là bắt buộc',
            pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' },
          }}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item label="Số điện thoại" validateStatus={errors.phoneNumber ? 'error' : ''} help={errors.phoneNumber?.message}>
        <Controller name="phoneNumber" control={control} render={({ field }) => <Input {...field} />} />
      </Form.Item>

      <Form.Item label="Mật khẩu" required validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Mật khẩu là bắt buộc',
            minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          }}
          render={({ field }) => <Input.Password {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu"
        required
        validateStatus={errors.confirmPassword ? 'error' : ''}
        help={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: 'Vui lòng xác nhận mật khẩu',
            validate: value => value === password || 'Mật khẩu không khớp',
          }}
          render={({ field }) => <Input.Password {...field} />}
        />
      </Form.Item>

      <Form.Item label="Vai trò" required>
        <Controller
          name="role"
          control={control}
          defaultValue={ROLE.TEACHER}
          render={({ field }) => (
            <Select {...field} disabled options={[{ value: ROLE.TEACHER, label: 'Giáo viên' }]} />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Trường học"
        required
        validateStatus={errors.schoolId ? 'error' : ''}
        help={errors.schoolId?.message}
      >
        <Controller
          name="schoolId"
          control={control}
          rules={{ required: 'Vui lòng chọn trường' }}
          render={({ field }) => <SchoolSelect {...field} />}
        />
      </Form.Item>

      {apiError && <p className="text-sm text-red-600">{apiError}</p>}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>
      </Form.Item>
    </Form>
  );
};