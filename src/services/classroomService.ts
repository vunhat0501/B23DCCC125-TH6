import { Classroom } from '../models/Classroom/Classroom';

export const getClassrooms = (): Classroom[] => {
  return [
    {
      id: 'PH001',
      name: 'Phòng Lý Thuyết 1',
      capacity: 50,
      type: 'Lý thuyết',
      manager: 'Nguyễn Văn A',
    },
    {
      id: 'PH002',
      name: 'Phòng Thực Hành 1',
      capacity: 30,
      type: 'Thực hành',
      manager: 'Trần Thị B',
    },
    {
      id: 'PH003',
      name: 'Hội Trường Lớn',
      capacity: 200,
      type: 'Hội trường',
      manager: 'Lê Văn C',
    },
  ];
};