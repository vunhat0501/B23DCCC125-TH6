declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module 'classnames';

declare module './NoteForm' {
  import { FC } from 'react';
  const NoteForm: FC;
  export default NoteForm;
}

declare module './NoteCard' {
  import { FC } from 'react';
  import { NoteItem } from '@/models/notes';
  
  interface NoteCardProps {
    note: NoteItem;
  }
  
  const NoteCard: FC<NoteCardProps>;
  export default NoteCard;
}

declare module './NoteList' {
  import { FC } from 'react';
  import { NoteItem } from '@/models/notes';
  
  interface NoteListProps {
    notes: NoteItem[];
  }
  
  const NoteList: FC<NoteListProps>;
  export default NoteList;
} 