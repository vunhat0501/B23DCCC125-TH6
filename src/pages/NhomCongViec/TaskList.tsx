import { useState, useEffect } from "react";
import { Button, Select, Input, Space } from "antd";
import { Task } from "@/services/Task/typings";
import { loadTasks, saveTasks } from "@/pages/NhomCongViec/storage";
import TaskForm from "@/pages/NhomCongViec/TaskForm";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface TaskListProps {
    currentUser: string;
    tasks: Task[];
    onAddTask: (newTask: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ currentUser }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
    const [filterUser, setFilterUser] = useState<string | undefined>(undefined);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

    useEffect(() => {
        const loadedTasks = loadTasks();
        setTasks(loadedTasks);
        setFilteredTasks(loadedTasks);
    }, []);

    useEffect(() => {
        let tempTasks = [...tasks];
        if (filterStatus) {
            tempTasks = tempTasks.filter((task) => task.status === filterStatus);
        }
        if (filterUser) {
            tempTasks = tempTasks.filter((task) => task.assignedTo === filterUser);
        }
        if (searchKeyword) {
            tempTasks = tempTasks.filter((task) =>
                task.name.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }
        setFilteredTasks(tempTasks);
    }, [tasks, filterStatus, filterUser, searchKeyword]);

    const handleAddTask = (task: Task) => {
        const updatedTasks = taskToEdit
            ? tasks.map((t) => (t.id === task.id ? task : t))
            : [...tasks, task];
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
        setIsModalVisible(false);
        setTaskToEdit(undefined);
    };

    const handleDelete = (id: string) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    const handleEdit = (task: Task) => {
        setTaskToEdit(task);
        setIsModalVisible(true);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);
        setTasks(reorderedTasks);
        saveTasks(reorderedTasks);
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Select
                    placeholder="Lọc theo trạng thái"
                    allowClear
                    onChange={(value) => setFilterStatus(value)}
                    style={{ width: 150 }}
                >
                    <Select.Option value="Chưa làm">Chưa làm</Select.Option>
                    <Select.Option value="Đang làm">Đang làm</Select.Option>
                    <Select.Option value="Đã xong">Đã xong</Select.Option>
                </Select>
                <Select
                    placeholder="Lọc theo người được giao"
                    allowClear
                    onChange={(value) => setFilterUser(value)}
                    style={{ width: 150 }}
                >
                    {[...new Set(tasks.map((task) => task.assignedTo))].map((user) => (
                        <Select.Option key={user} value={user}>
                            {user}
                        </Select.Option>
                    ))}
                </Select>
                <Input
                    placeholder="Tìm kiếm theo tên công việc"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ width: 200 }}
                />
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Thêm công việc
                </Button>
            </Space>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="taskList">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {filteredTasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                userSelect: 'none',
                                                padding: 16,
                                                marginBottom: 8,
                                                background: '#f0f2f5',
                                                borderRadius: 8,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            <div><strong>{task.name}</strong></div>
                                            <div>Người giao: {task.assignedTo}</div>
                                            <div>Ưu tiên: {task.priority}</div>
                                            <div>Trạng thái: {task.status}</div>
                                            <Space style={{ marginTop: 8 }}>
                                                <Button onClick={() => handleEdit(task)} size="small">Sửa</Button>
                                                <Button danger onClick={() => handleDelete(task.id)} size="small">
                                                    Xóa
                                                </Button>
                                            </Space>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <TaskForm
                visible={isModalVisible}
                onSubmit={handleAddTask}
                onClose={() => {
                    setIsModalVisible(false);
                    setTaskToEdit(undefined);
                }}
                task={taskToEdit}
            />
        </div>
    );
};

export default TaskList;
