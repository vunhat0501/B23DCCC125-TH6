import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { Classroom } from '../../models/Classroom/Classroom';

const { Option } = Select;

interface ClassroomFormProps {
  initialValues?: Classroom;
  onSubmit: (values: Classroom) => void;
  managers: string[];
}

const ClassroomForm: React.FC<ClassroomFormProps> = ({ initialValues, onSubmit, managers }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = (values: Classroom) => {
    if (!values.id || !values.name || !values.manager || !values.capacity || !values.type) {
      message.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      {/* Mã phòng */}
      <Form.Item
        label="Mã phòng"
        name="id"
        rules={[
          { required: true, message: 'Mã phòng không được để trống!' },
          { max: 10, message: 'Mã phòng không được vượt quá 10 ký tự!' }, // Kiểm tra độ dài
        ]}
      >
        <Input placeholder="Nhập mã phòng" />
      </Form.Item>

      {/* Tên phòng */}
      <Form.Item
        label="Tên phòng"
        name="name"
        rules={[
          { required: true, message: 'Tên phòng không được để trống!' },
          { max: 50, message: 'Tên phòng không được vượt quá 50 ký tự!' }, // Kiểm tra độ dài
        ]}
      >
        <Input placeholder="Nhập tên phòng" />
      </Form.Item>

      {/* Số chỗ ngồi */}
      <Form.Item
        label="Số chỗ ngồi"
        name="capacity"
        rules={[{ required: true, message: 'Số chỗ ngồi không được để trống!' }]}
      >
        <InputNumber min={1} placeholder="Nhập số chỗ ngồi" style={{ width: '100%' }} />
      </Form.Item>

      {/* Loại phòng */}
      <Form.Item
        label="Loại phòng"
        name="type"
        rules={[{ required: true, message: 'Loại phòng không được để trống!' }]}
      >
        <Select placeholder="Chọn loại phòng">
          <Option value="Lý thuyết">Lý thuyết</Option>
          <Option value="Thực hành">Thực hành</Option>
          <Option value="Hội trường">Hội trường</Option>
        </Select>
      </Form.Item>

      {/* Người phụ trách */}
      <Form.Item
        label="Người phụ trách"
        name="manager"
        rules={[{ required: true, message: 'Người phụ trách không được để trống!' }]}
      >
        <Select placeholder="Chọn người phụ trách">
          {managers.map((manager) => (
            <Option key={manager} value={manager}>
              {manager}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Nút lưu */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ClassroomForm;