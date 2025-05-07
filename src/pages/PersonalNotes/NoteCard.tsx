import React from 'react';
import { Card, Tag, Typography, Button, Popconfirm, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  StarOutlined, 
  StarFilled,
  PushpinOutlined,
  PushpinFilled,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useModel } from 'umi';
import { NoteItem } from '@/models/notes';
import styles from './index.less';
import classNames from 'classnames';

const { Paragraph, Text } = Typography;

interface NoteCardProps {
  note: NoteItem;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { 
    setSelectedNote, 
    setIsEdit, 
    setVisible, 
    deleteNote,
    toggleImportance,
    togglePin
  } = useModel('notes');

  const handleEdit = () => {
    setSelectedNote(note);
    setIsEdit(true);
    setVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card
      hoverable
      title={note.title}
      extra={note.isPinned && <PushpinFilled style={{ color: '#1890ff' }} />}
      actions={[
        <Tooltip title={note.isImportant ? "Bỏ đánh dấu quan trọng" : "Đánh dấu quan trọng"}>
          <Button 
            type="text" 
            icon={note.isImportant ? <StarFilled /> : <StarOutlined />} 
            onClick={() => toggleImportance(note.id)}
            className={classNames('action-btn', 'action-btn-effect', 'important-btn', { 'active': note.isImportant })}
          />
        </Tooltip>,
        <Tooltip title={note.isPinned ? "Bỏ ghim" : "Ghim lên đầu"}>
          <Button 
            type="text" 
            icon={note.isPinned ? <PushpinFilled /> : <PushpinOutlined />} 
            onClick={() => togglePin(note.id)}
            className={classNames('action-btn', 'action-btn-effect', 'pin-btn', { 'active': note.isPinned })}
          />
        </Tooltip>,
        <Tooltip title="Chỉnh sửa ghi chú">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            className="action-btn-effect"
          />
        </Tooltip>,
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa ghi chú này?"
          onConfirm={() => deleteNote(note.id)}
          okText="Đồng ý"
          cancelText="Hủy"
          placement="topRight"
        >
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            danger
            className="action-btn-effect"
          />
        </Popconfirm>
      ]}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: '#888' }}>
          <ClockCircleOutlined style={{ marginRight: '5px', fontSize: '12px' }} />
          <Text type="secondary" style={{ fontSize: '12px' }}>{formatDate(note.createdAt)}</Text>
        </div>
        
        <Paragraph ellipsis={{ rows: 3 }}>
          {note.content}
        </Paragraph>
        
        <div className={styles.noteTags}>
          {note.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default NoteCard; 