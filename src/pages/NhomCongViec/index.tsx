import React, { useEffect, useState } from 'react';
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
		<Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
			<Header
				style={{
					background: '#1890ff',
					display: 'flex',
					alignItems: 'center',
					paddingLeft: 24,
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
				}}
			>
				<Title level={3} style={{ color: '#fff', margin: 0 }}>
					Quản lý công việc nhóm
				</Title>
			</Header>

			<Content style={{ padding: '0 50px', marginTop: 40 }}>
				<div
					style={{
						textAlign: 'center',
						marginBottom: 20,
						background: '#fff',
						padding: 32,
						borderRadius: 12,
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
						maxWidth: 1600,
						marginLeft: 'auto',
						marginRight: 'auto',
					}}
				>
					{!isLoggedIn ? (
						<LoginForm onLogin={handleLogin} />
					) : (
						<>
							<Space direction='vertical' size='middle' style={{ display: 'flex', marginBottom: 24 }}>
								<Title level={4} style={{ margin: 0 }}>
									Chào mừng, {currentUser}
								</Title>
								<Button type='primary' onClick={handleLogout}>
									Đăng xuất
								</Button>
							</Space>
							<TaskList currentUser={currentUser || ''} tasks={tasks} onAddTask={handleAddTask} />
						</>
					)}
				</div>
			</Content>

			<Footer style={{ textAlign: 'center', background: '#fff', padding: '16px 0', fontWeight: 500 }}>
				©2025 Quản lý công việc nhóm
			</Footer>
		</Layout>
	);
};

export default NhomCongViec;
