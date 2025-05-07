import { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from 'antd';
import { Task, Priority, Status } from "@/services/Task/typings";

interface TaskFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (task: Task) => void;
    task?: Task; // Optional prop for editing an existing task
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onClose, onSubmit, task }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (task) {
        form.setFieldsValue(task);
        } else {
        form.resetFields();
        }
    }, [task, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
        const newTask: Task = {
            id: task ? task.id : Date.now().toString(),
            ...values,
        };
        onSubmit(newTask);
        form.resetFields();
        });
    };

    return (
        <Modal
        visible={visible}
        title={task ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
        okText="Lưu"
        cancelText="Hủy"
        onCancel={onClose}
        onOk={handleOk}
        >
        <Form form={form} layout="vertical" name="task_form">
            <Form.Item name="name" label="Tên công việc" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item name="assignedTo" label="Người được giao" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
            <Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}>
            <Select>
                <Select.Option value="Thấp">Thấp</Select.Option>
                <Select.Option value="Trung bình">Trung bình</Select.Option>
                <Select.Option value="Cao">Cao</Select.Option>
            </Select>
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
                <Select.Option value="Chưa làm">Chưa làm</Select.Option>
                <Select.Option value="Đang làm">Đang làm</Select.Option>
                <Select.Option value="Đã xong">Đã xong</Select.Option>
            </Select>
            </Form.Item>
        </Form>
        </Modal>
    );
};

export default TaskForm;