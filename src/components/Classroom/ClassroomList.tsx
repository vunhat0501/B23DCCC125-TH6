import React from 'react';
import { Table, Input, Select, Button, Popconfirm, message } from 'antd';
import { Classroom } from '../../models/Classroom/Classroom';

const { Search } = Input;
const { Option } = Select;

interface ClassroomListProps {
  classrooms: Classroom[];
  onDelete: (id: string) => void; // Hàm xử lý xóa phòng học
}

const ClassroomList: React.FC<ClassroomListProps> = ({ classrooms, onDelete }) => {
  const [searchText, setSearchText] = React.useState<string>('');
  const [filterType, setFilterType] = React.useState<string | null>(null);

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm và loại phòng
  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.name.toLowerCase().includes(searchText.toLowerCase()) ||
      classroom.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterType ? classroom.type === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a: Classroom, b: Classroom) => a.capacity - b.capacity, // Sắp xếp theo số chỗ ngồi
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: any, record: Classroom) => (
        <Popconfirm
          title={
            record.capacity < 30
              ? 'Bạn có chắc chắn muốn xóa phòng này không?'
              : 'Chỉ có thể xóa phòng có số chỗ ngồi dưới 30!'
          }
          onConfirm={() => {
            if (record.capacity < 30) {
              onDelete(record.id);
            } else {
              message.error('Không thể xóa phòng có số chỗ ngồi từ 30 trở lên!');
            }
          }}
          okText="Xóa"
          cancelText="Hủy"
          disabled={record.capacity >= 30}
        >
          <Button danger disabled={record.capacity >= 30}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* Thanh tìm kiếm và lọc */}
      <div className="filter-container">
        <Search
          placeholder="Tìm kiếm theo mã hoặc tên phòng"
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        <Select
          placeholder="Lọc theo loại phòng"
          onChange={(value) => setFilterType(value)}
          allowClear
          className="filter-select"
        >
          <Option value="Lý thuyết">Lý thuyết</Option>
          <Option value="Thực hành">Thực hành</Option>
          <Option value="Hội trường">Hội trường</Option>
        </Select>
      </div>
      {/* Bảng hiển thị danh sách phòng học */}
      <Table
        className="classroom-table"
        dataSource={filteredClassrooms}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default ClassroomList;