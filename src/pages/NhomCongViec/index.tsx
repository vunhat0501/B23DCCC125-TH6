import React, {useEffect, useState} from 'react';
import { Layout, Button, Typography, Space } from 'antd';
import TaskList from '@/pages/NhomCongViec/TaskList';
import LoginForm from '@/pages/NhomCongViec/LoginForm';
import { loadTasks, saveTasks } from '@/pages/NhomCongViec/storage';
import { Task } from '@/services/Task/typings';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const NhomCongViec: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('username'));
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!currentUser);

    useEffect(() => {
        if (isLoggedIn && currentUser) {
            const loadedTasks = loadTasks();
            setTasks(loadedTasks);
        }
    }, [isLoggedIn, currentUser]);

    const handleLogin = (username: string) => {
        localStorage.setItem('username', username);
        setCurrentUser(username);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        setCurrentUser(null);
        setIsLoggedIn(false);
    };

    const handleAddTask = (newTask: any) => {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        saveTasks(updatedTasks);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: 0 }}>
                <Space style={{ paddingLeft: 24 }}>
                    <Title level={3}>Quản lý công việc nhóm</Title>
                </Space>
            </Header>
            <Content style={{ padding: '0 50px', marginTop: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    {!isLoggedIn ? (
                        <LoginForm onLogin={handleLogin} />
                    ) : (
                        <>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Title level={4}>Chào mừng, {currentUser}</Title>
                                <Button type="primary" onClick={handleLogout}>
                                    Đăng xuất
                                </Button>
                            </Space>
                            <TaskList currentUser={currentUser || ''} tasks={tasks} onAddTask={handleAddTask} />
                        </>
                    )}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2025 Quản lý công việc nhóm</Footer>
        </Layout>
    );
};
export default NhomCongViec;