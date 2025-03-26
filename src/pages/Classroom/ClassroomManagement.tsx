import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import ClassroomList from '../../components/Classroom/ClassroomList';
import ClassroomForm from '../../components/Classroom/ClassroomForm';
import { Classroom } from '../../models/Classroom/Classroom';
import './ClassroomManagement.css'; // Import file CSS
const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const storedData = localStorage.getItem('classrooms');
    return storedData ? JSON.parse(storedData) : [];
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);

  const managers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];

  useEffect(() => {
    localStorage.setItem('classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  const showModal = (classroom?: Classroom) => {
    setEditingClassroom(classroom || null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingClassroom(null);
  };

  const handleSave = (classroom: Classroom) => {
    if (editingClassroom) {
      // Chỉnh sửa phòng học
      if (
        classrooms.some(
          (item) => item.id === classroom.id && item.id !== editingClassroom.id
        )
      ) {
        message.error('Mã phòng đã tồn tại!');
        return;
      }
      setClassrooms((prev) =>
        prev.map((item) => (item.id === editingClassroom.id ? classroom : item))
      );
      message.success('Cập nhật phòng học thành công!');
    } else {
      // Thêm mới phòng học
      if (classrooms.some((item) => item.id === classroom.id)) {
        message.error('Mã phòng đã tồn tại!');
        return;
      }
      setClassrooms((prev) => [...prev, classroom]);
      message.success('Thêm phòng học thành công!');
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setClassrooms((prev) => prev.filter((item) => item.id !== id));
    message.success('Xóa phòng học thành công!');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản Lý Phòng Học</h1>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Thêm Phòng Học
      </Button>
      <ClassroomList classrooms={classrooms} onDelete={handleDelete} />
      <Modal
        title={editingClassroom ? 'Chỉnh Sửa Phòng Học' : 'Thêm Phòng Học'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <ClassroomForm
          initialValues={editingClassroom || undefined}
          onSubmit={handleSave}
          managers={managers}
        />
      </Modal>
    </div>
  );
};

export default ClassroomManagement;