import React from 'react';
import { List, Tag, Typography, Button, Popconfirm, Space, Divider } from 'antd';
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

const { Text, Paragraph } = Typography;

interface NoteListProps {
  notes: NoteItem[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const { 
    setSelectedNote, 
    setIsEdit, 
    setVisible, 
    deleteNote,
    toggleImportance,
    togglePin
  } = useModel('notes');

  const handleEdit = (note: NoteItem) => {
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
    <List
      itemLayout="vertical"
      dataSource={notes}
      renderItem={(note) => (
        <List.Item
          key={note.id}
          actions={[
            <Space wrap size="small" style={{ justifyContent: 'center' }}>
              <Button 
                type="text" 
                icon={note.isImportant ? <StarFilled /> : <StarOutlined />} 
                onClick={() => toggleImportance(note.id)}
                size="small"
                className={classNames('action-btn', 'action-btn-effect', 'important-btn', { 'active': note.isImportant })}
              >
                <span className="hide-on-mobile">
                  {note.isImportant ? "Bỏ đánh dấu quan trọng" : "Đánh dấu quan trọng"}
                </span>
              </Button>
              <Button 
                type="text" 
                icon={note.isPinned ? <PushpinFilled /> : <PushpinOutlined />} 
                onClick={() => togglePin(note.id)}
                size="small"
                className={classNames('action-btn', 'action-btn-effect', 'pin-btn', { 'active': note.isPinned })}
              >
                <span className="hide-on-mobile">
                  {note.isPinned ? "Bỏ ghim" : "Ghim lên đầu"}
                </span>
              </Button>
              <Button 
                type="primary"
                icon={<EditOutlined />} 
                onClick={() => handleEdit(note)}
                size="small"
                className="action-btn-effect"
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa ghi chú này?"
                onConfirm={() => deleteNote(note.id)}
                okText="Đồng ý"
                cancelText="Hủy"
              >
                <Button 
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="action-btn-effect"
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          ]}
        >
          <List.Item.Meta
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {note.title}
                {note.isPinned && <PushpinFilled style={{ color: '#1890ff', fontSize: '14px' }} />}
                {note.isImportant && <StarFilled style={{ color: '#cc1c1c', fontSize: '14px' }} />}
              </div>
            }
            description={
              <div style={{ display: 'flex', alignItems: 'center', color: '#888' }}>
                <ClockCircleOutlined style={{ marginRight: '5px', fontSize: '12px' }} />
                <Text type="secondary">{formatDate(note.createdAt)}</Text>
              </div>
            }
          />
          
          <Divider style={{ margin: '12px 0' }} />
          
          <Paragraph ellipsis={{ rows: 2 }}>
            {note.content}
          </Paragraph>
          
          <div className={styles.noteTags}>
            {note.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </List.Item>
      )}
    />
  );
};

export default NoteList; 