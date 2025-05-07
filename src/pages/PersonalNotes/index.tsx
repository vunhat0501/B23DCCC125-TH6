import React, { useEffect } from 'react';
import { Button, Input, DatePicker, Row, Col, Select, Space, Modal, Empty, message } from 'antd';
import { useModel } from 'umi';
import {
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  TagOutlined,
  CalendarOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import NoteForm from './NoteForm';
import NoteCard from './NoteCard';
import NoteList from './NoteList';
import styles from './index.less';

const { Option } = Select;

const PersonalNotes: React.FC = () => {
  const {
    filteredNotes,
    setSelectedNote,
    setIsEdit,
    setVisible,
    visible,
    viewMode,
    setViewMode,
    searchText,
    setSearchText,
    selectedTag,
    setSelectedTag,
    dateFilter,
    setDateFilter,
    notes,
    isEdit,
  } = useModel('notes');

  // Extract all unique tags from notes
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [notes]);

  const handleAddNote = () => {
    setSelectedNote(undefined);
    setIsEdit(false);
    setVisible(true);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedTag(null);
    setDateFilter(null);
    message.success('Đã xóa tất cả bộ lọc');
  }

  const hasFilters = searchText || selectedTag || dateFilter;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.appTitle}>
          <FileTextOutlined />
          <h1>Ghi Chú Cá Nhân</h1>
        </div>
        <div className={styles.controls}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNote}
            size="large"
            className={styles.addButton}
          >
            Thêm Ghi Chú
          </Button>
          <div className={styles.viewToggle}>
            <Button
              type={viewMode === 'grid' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('grid')}
              className={styles.gridButton}
            />
            <Button
              type={viewMode === 'list' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('list')}
              className={styles.listButton}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <Row gutter={[16, 16]} className={styles.filterPanel}>
        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
          <div className={styles.searchSection}>
            <SearchOutlined className={styles.searchIcon} />
            <Input
              placeholder="Tìm kiếm tiêu đề hoặc nội dung"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={styles.searchInput}
              bordered={false}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={7} lg={6} xl={5}>
          <div className={styles.tagSection}>
            <TagOutlined className={styles.tagIcon} />
            <Select
              placeholder="Lọc theo thẻ"
              allowClear
              value={selectedTag}
              onChange={setSelectedTag}
              className={styles.tagSelect}
              dropdownMatchSelectWidth={false}
              bordered={false}
            >
              {allTags.map(tag => (
                <Option key={tag} value={tag}>{tag}</Option>
              ))}
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={7} lg={6} xl={5}>
          <div className={styles.dateSection}>
            <CalendarOutlined className={styles.calendarIcon} />
            <DatePicker 
              placeholder="Lọc theo ngày"
              onChange={(date) => setDateFilter(date ? date.toISOString() : null)}
              allowClear
              className={styles.datePicker}
              format="YYYY-MM-DD"
              bordered={false}
              suffixIcon={null}
            />
          </div>
        </Col>

        {hasFilters && (
          <Col xs={24} sm={24} md={hasFilters ? 2 : 0}>
            <Button 
              onClick={handleClearFilters}
              className={styles.clearButton}
              type="primary"
              danger
              block
              icon={<ClearOutlined />}
            >
              Xóa
            </Button>
          </Col>
        )}
      </Row>

      {/* Notes Container */}
      <div className={styles.notesContainer}>
        {notes.length === 0 ? (
          <div className={styles.emptyState}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có ghi chú nào. Tạo ghi chú đầu tiên của bạn!"
            />
            <Button 
              type="primary" 
              onClick={handleAddNote} 
              icon={<PlusOutlined />}
              className={styles.createButton}
            >
              Tạo Ghi Chú
            </Button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className={styles.emptyState}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có ghi chú phù hợp với bộ lọc của bạn."
            />
            <Button 
              onClick={handleClearFilters} 
              icon={<ClearOutlined />}
              type="primary"
              danger
            >
              Xóa Bộ Lọc
            </Button>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <Row gutter={[16, 16]} className={styles.notesGrid}>
              {filteredNotes.map(note => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={note.id} className={styles.noteCol}>
                  <NoteCard note={note} />
                </Col>
              ))}
            </Row>
          ) : (
            <NoteList notes={filteredNotes} />
          )
        )}
      </div>

      {/* Add/Edit Note Modal */}
      <Modal
        title={isEdit ? "Chỉnh Sửa Ghi Chú" : "Tạo Ghi Chú Mới"}
        destroyOnClose
        footer={null}
        visible={visible}
        onCancel={() => setVisible(false)}
        width={720}
        centered
        maskClosable={false}
        bodyStyle={{ padding: '24px' }}
        className={styles.noteModal}
      >
        <NoteForm />
      </Modal>
    </div>
  );
};

export default PersonalNotes; 