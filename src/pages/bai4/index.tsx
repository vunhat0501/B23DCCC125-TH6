import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
} from "antd";
import styles from "./index.module.css";

const { Option } = Select;

interface Destination {
  id: string;
  name: string;
  image: string;
  type: string;
  price: number;
  rating: number;
  travelTime: number; // Thời gian di chuyển (phút)
}

const AdminPage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    const storedData = localStorage.getItem("destinations");
    if (storedData) {
      setDestinations(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && editingDestination) {
      form.setFieldsValue(editingDestination);
      setImageUrl(editingDestination.image);
    } else if (isModalOpen) {
      form.resetFields();
      setImageUrl("");
    }
  }, [isModalOpen, editingDestination, form]);

  const saveToLocalStorage = (data: Destination[]) => {
    localStorage.setItem("destinations", JSON.stringify(data));
  };

  const handleAddOrEdit = (values: Omit<Destination, "id" | "image">) => {
    if (!imageUrl) {
      notification.error({ message: "Vui lòng chọn hình ảnh!" });
      return;
    }

    if (editingDestination) {
      const updatedDestinations = destinations.map((dest) =>
        dest.id === editingDestination.id
          ? { ...editingDestination, ...values, image: imageUrl }
          : dest
      );
      setDestinations(updatedDestinations);
      saveToLocalStorage(updatedDestinations);
      notification.success({ message: "Cập nhật điểm đến thành công!" });
    } else {
      const newDestination: Destination = {
        id: Date.now().toString(),
        ...values,
        image: imageUrl,
      };
      const updatedDestinations = [...destinations, newDestination];
      setDestinations(updatedDestinations);
      saveToLocalStorage(updatedDestinations);
      notification.success({ message: "Thêm điểm đến thành công!" });
    }
    setIsModalOpen(false);
    setEditingDestination(null);
    setImageUrl("");
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    const updatedDestinations = destinations.filter((dest) => dest.id !== id);
    setDestinations(updatedDestinations);
    saveToLocalStorage(updatedDestinations);
    notification.success({ message: "Xóa điểm đến thành công!" });
  };

  const openEditModal = (destination: Destination) => {
    setEditingDestination(destination);
    setImageUrl(destination.image);
    setIsModalOpen(true);
  };

  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64 = reader.result.toString();
          setImageUrl(base64);
          notification.success({ message: "Hình ảnh đã được chọn!" });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const columns = [
    {
      title: "Tên điểm đến",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <img src={text} alt="destination" className={styles.destinationImage} />
      ),
    },
    {
      title: "Loại hình",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Giá cả",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Thời gian di chuyển (phút)",
      dataIndex: "travelTime",
      key: "travelTime",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Destination) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h1>Quản lý điểm đến</h1>
      <Button
        type="primary"
        onClick={() => {
          setEditingDestination(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: 20 }}
      >
        Thêm điểm đến
      </Button>
      <Table dataSource={destinations} columns={columns} rowKey="id" />

      <Modal
        title={editingDestination ? "Sửa điểm đến" : "Thêm điểm đến"}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingDestination(null);
          setImageUrl("");
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          initialValues={
            editingDestination || { name: "", type: "", price: 0, rating: 0, travelTime: 0 }
          }
          onFinish={handleAddOrEdit}
        >
          <Form.Item
            name="name"
            label="Tên điểm đến"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Hình ảnh" required>
            <input
              type="file"
              accept="image/*"
              onChange={handleDirectFileUpload}
              className={styles.inputFile}
              title="Chọn hình ảnh"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                className={styles.previewImage}
              />
            )}
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại hình"
            rules={[{ required: true, message: "Vui lòng chọn loại hình!" }]}
          >
            <Select>
              <Option value="biển">Biển</Option>
              <Option value="núi">Núi</Option>
              <Option value="thành phố">Thành phố</Option>
              <Option value="nhà hàng">Nhà hàng</Option>
              <Option value="khách sạn">Khách sạn</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá cả"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
          >
            <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="travelTime"
            label="Thời gian di chuyển (phút)"
            rules={[{ required: true, message: "Vui lòng nhập thời gian di chuyển!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingDestination ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;