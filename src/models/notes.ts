import { useState, useEffect } from 'react';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  isImportant: boolean;
  isPinned: boolean;
}

export default () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteItem | undefined>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  
  // Load notes from localStorage
  const loadNotes = () => {
    const storedNotes = localStorage.getItem('personalNotes');
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      setNotes(parsedNotes);
      setFilteredNotes(parsedNotes);
    } else {
      // Create sample notes if no notes exist
      const sampleNotes: NoteItem[] = [
        {
          id: '1',
          title: 'Chào mừng đến với Ghi Chú Cá Nhân',
          content: 'Đây là ứng dụng ghi chú cá nhân của bạn. Bạn có thể tạo, chỉnh sửa và sắp xếp ghi chú của mình tại đây.',
          createdAt: new Date().toISOString(),
          tags: ['chào mừng', 'hướng dẫn'],
          isImportant: true,
          isPinned: true,
        },
        {
          id: '2',
          title: 'Cách sử dụng thẻ',
          content: 'Thẻ giúp bạn sắp xếp ghi chú của mình. Bạn có thể thêm nhiều thẻ cho mỗi ghi chú và lọc ghi chú theo thẻ.',
          createdAt: new Date().toISOString(),
          tags: ['hướng dẫn', 'mẹo'],
          isImportant: false,
          isPinned: false,
        },
      ];
      localStorage.setItem('personalNotes', JSON.stringify(sampleNotes));
      setNotes(sampleNotes);
      setFilteredNotes(sampleNotes);
    }
  };
  
  // Save notes to localStorage
  const saveNotes = (updatedNotes: NoteItem[]) => {
    localStorage.setItem('personalNotes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };
  
  // Add a new note
  const addNote = (note: Omit<NoteItem, 'id'>) => {
    const newNote: NoteItem = {
      ...note,
      id: Date.now().toString(),
      // Use provided createdAt or default to current date
      createdAt: note.createdAt || new Date().toISOString(),
    };
    
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
  };
  
  // Update an existing note
  const updateNote = (updatedNote: NoteItem) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    saveNotes(updatedNotes);
  };
  
  // Delete a note
  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };
  
  // Toggle importance
  const toggleImportance = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, isImportant: !note.isImportant } : note
    );
    saveNotes(updatedNotes);
  };
  
  // Toggle pin status
  const togglePin = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    );
    saveNotes(updatedNotes);
  };
  
  // Filter notes based on search, tags, and date
  useEffect(() => {
    let result = [...notes];
    
    // Sort by pinned first
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
    
    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        note => 
          note.title.toLowerCase().includes(searchLower) || 
          note.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by tag
    if (selectedTag) {
      result = result.filter(note => note.tags.includes(selectedTag));
    }
    
    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      result = result.filter(note => {
        const noteDate = new Date(note.createdAt).toDateString();
        return noteDate === filterDate;
      });
    }
    
    setFilteredNotes(result);
  }, [notes, searchText, selectedTag, dateFilter]);
  
  // Load notes on initial render
  useEffect(() => {
    loadNotes();
  }, []);
  
  return {
    notes,
    filteredNotes,
    selectedNote,
    setSelectedNote,
    isEdit,
    setIsEdit,
    visible,
    setVisible,
    viewMode,
    setViewMode,
    searchText,
    setSearchText,
    selectedTag,
    setSelectedTag,
    dateFilter,
    setDateFilter,
    addNote,
    updateNote,
    deleteNote,
    toggleImportance,
    togglePin,
  };
}; 