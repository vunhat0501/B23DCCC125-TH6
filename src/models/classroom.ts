import { useState } from 'react';
import { Classroom } from '../models/Classroom/Classroom';

export default function useClassroomModel() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const storedData = localStorage.getItem('classrooms');
    return storedData ? JSON.parse(storedData) : [];
  });

  const saveToLocalStorage = (data: Classroom[]) => {
    localStorage.setItem('classrooms', JSON.stringify(data));
  };

  const addClassroom = (classroom: Classroom) => {
    if (classrooms.some((item) => item.id === classroom.id)) {
      throw new Error('Mã phòng đã tồn tại!');
    }
    const updatedClassrooms = [...classrooms, classroom];
    setClassrooms(updatedClassrooms);
    saveToLocalStorage(updatedClassrooms);
  };

  const editClassroom = (classroom: Classroom) => {
    const updatedClassrooms = classrooms.map((item) =>
      item.id === classroom.id ? classroom : item
    );
    setClassrooms(updatedClassrooms);
    saveToLocalStorage(updatedClassrooms);
  };

  const deleteClassroom = (id: string) => {
    const updatedClassrooms = classrooms.filter((item) => item.id !== id);
    setClassrooms(updatedClassrooms);
    saveToLocalStorage(updatedClassrooms);
  };

  return {
    classrooms,
    addClassroom,
    editClassroom,
    deleteClassroom,
  };
}