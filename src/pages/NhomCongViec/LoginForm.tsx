import { useState } from 'react';
import { Input, Button } from 'antd';

interface LoginFormProps {
    onLogin: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        if (username.trim()) {
            localStorage.setItem('username', username);
            onLogin(username);
        }
    };

    return (
        <div style={{ maxWidth: 300, margin: '0 auto', paddingTop: 100 }}>
        <Input
            placeholder="Nhập tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleLogin}
        />
        <Button type="primary" onClick={handleLogin} style={{ marginTop: 16 }}>
            Đăng nhập
        </Button>
        </div>
    );
};

export default LoginForm;
