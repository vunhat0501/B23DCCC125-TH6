export interface Classroom {
    id: string; // Mã phòng
    name: string; // Tên phòng
    capacity: number; // Số chỗ ngồi
    type: 'Lý thuyết' | 'Thực hành' | 'Hội trường'; // Loại phòng
    manager: string; // Người phụ trách
  }