import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Checkbox, Space, Divider, Row, Col, Tag, Tooltip, DatePicker } from 'antd';
import { useModel } from 'umi';
import { NoteItem } from '@/models/notes';
import { PlusOutlined, TagsOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const NoteForm: React.FC = () => {
  const [form] = Form.useForm();
  const { 
    selectedNote, 
    isEdit, 
    setVisible, 
    addNote, 
    updateNote, 
    notes 
  } = useModel('notes');
  
  const [tagInput, setTagInput] = useState<string>('');
  
  // Extract all unique tags from existing notes
  const existingTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [notes]);
  
  useEffect(() => {
    if (isEdit && selectedNote) {
      form.setFieldsValue({
        title: selectedNote.title,
        content: selectedNote.content,
        tags: selectedNote.tags,
        isImportant: selectedNote.isImportant,
        isPinned: selectedNote.isPinned,
        createdAt: selectedNote.createdAt ? moment(selectedNote.createdAt) : moment(),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        title: '',
        content: '',
        tags: [],
        isImportant: false,
        isPinned: false,
        createdAt: moment(),
      });
    }
  }, [form, isEdit, selectedNote]);
  
  const handleSubmit = (values: any) => {
    // Convert moment date to ISO string if present
    const createdAt = values.createdAt ? values.createdAt.toISOString() : new Date().toISOString();
    
    if (isEdit && selectedNote) {
      updateNote({
        ...selectedNote,
        ...values,
        createdAt,
      });
    } else {
      addNote({
        title: values.title,
        content: values.content,
        tags: values.tags || [],
        isImportant: values.isImportant || false,
        isPinned: values.isPinned || false,
        createdAt,
      });
    }
    
    setVisible(false);
  };
  
  const handleAddTag = () => {
    if (tagInput && tagInput.trim() !== '') {
      const currentTags = form.getFieldValue('tags') || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setFieldsValue({ tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };
  
  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="title"
        label="Tiêu đề"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
      >
        <Input 
          placeholder="Nhập tiêu đề ghi chú" 
          size="large"
          autoFocus
        />
      </Form.Item>
      
      <Form.Item
        name="content"
        label="Nội dung"
        rules={[{ required: true, message: 'Vui lòng nhập nội dung ghi chú' }]}
      >
        <TextArea 
          rows={6} 
          placeholder="Nhập nội dung ghi chú" 
          showCount 
          maxLength={1000}
          style={{ resize: 'none' }}
        />
      </Form.Item>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item 
            name="createdAt" 
            label={
              <Space>
                <CalendarOutlined />
                <span>Ngày tạo</span>
              </Space>
            }
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="YYYY-MM-DD"
              allowClear={false}
              showTime={{ format: 'HH:mm' }}
              placeholder="Chọn ngày tạo" 
              suffixIcon={null}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12}>
          <Form.Item 
            name="tags" 
            label={
              <Space>
                <TagsOutlined />
                <span>Thẻ</span>
              </Space>
            }
          >
            <Select
              mode="multiple"
              placeholder="Chọn hoặc thêm thẻ"
              style={{ width: '100%' }}
              tagRender={(props) => {
                const { label, value, closable, onClose } = props;
                return (
                  <Tag 
                    color="blue" 
                    closable={closable} 
                    onClose={onClose} 
                    style={{ marginRight: 3 }}
                  >
                    {label}
                  </Tag>
                );
              }}
              dropdownRender={menu => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', padding: '0 8px 4px' }}>
                    <Input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Nhập để thêm thẻ mới"
                      style={{ flex: 'auto', marginRight: '8px' }}
                    />
                    <Button type="primary" onClick={handleAddTag} icon={<PlusOutlined />}>
                      Thêm
                    </Button>
                  </div>
                </>
              )}
            >
              {existingTags.map(tag => (
                <Option key={tag} value={tag}>
                  {tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12}>
          <Form.Item name="isImportant" valuePropName="checked">
            <Checkbox>
              <Tooltip title="Đánh dấu ghi chú quan trọng bằng ngôi sao">
                Đánh dấu quan trọng
              </Tooltip>
            </Checkbox>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12}>
          <Form.Item name="isPinned" valuePropName="checked">
            <Checkbox>
              <Tooltip title="Ghi chú được ghim sẽ xuất hiện ở đầu danh sách">
                Ghim lên đầu
              </Tooltip>
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
      
      <Divider />
      
      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space wrap size="middle">
          <Button onClick={() => setVisible(false)}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {isEdit ? 'Cập nhật ghi chú' : 'Thêm ghi chú'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NoteForm; 