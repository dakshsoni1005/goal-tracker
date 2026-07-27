import React, { useState, useEffect } from 'react';
import { noteService } from '../../services/noteService.js';
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Tag,
  Edit3,
  BookOpen
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Card, { CardContent } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { Input, Textarea } from '../../components/ui/Input.jsx';
import toast from 'react-hot-toast';

const noteSchema = zod.object({
  title: zod.string().min(1, 'Title is required').max(100),
  content: zod.string().optional(),
  tagsString: zod.string().optional(),
  color: zod.string().default('#FFFFFF'),
  isPinned: zod.boolean().default(false),
});

const colorPresets = [
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#FEE2E2', name: 'Red' },
  { hex: '#FEF3C7', name: 'Yellow' },
  { hex: '#ECFDF5', name: 'Green' },
  { hex: '#EFF6FF', name: 'Blue' },
  { hex: '#F5F3FF', name: 'Purple' },
];

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteColor, setNoteColor] = useState('#FFFFFF');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      color: '#FFFFFF',
      isPinned: false,
    }
  });

  useEffect(() => {
    fetchNotes();
  }, [selectedTag]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {
        tag: selectedTag || undefined,
      };
      const res = await noteService.getNotes(params);
      if (res.success && res.data) {
        const list = res.data.results || [];
        setNotes(list);
        
        // Extract unique tags for filtering
        const tagsSet = new Set();
        list.forEach(note => {
          note.tags?.forEach(tag => tagsSet.add(tag));
        });
        setAllTags([...tagsSet]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      fetchNotes();
      return;
    }
    try {
      const res = await noteService.searchNotes(term);
      if (res.success) {
        setNotes(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateNote = () => {
    setEditingNote(null);
    setNoteColor('#FFFFFF');
    reset({
      title: '',
      content: '',
      tagsString: '',
      color: '#FFFFFF',
      isPinned: false,
    });
    setIsModalOpen(true);
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setNoteColor(note.color || '#FFFFFF');
    reset({
      title: note.title,
      content: note.content,
      tagsString: note.tags?.join(', ') || '',
      color: note.color || '#FFFFFF',
      isPinned: note.isPinned || false,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values) => {
    const tags = values.tagsString ? values.tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];
    const payload = { ...values, tags, color: noteColor };
    delete payload.tagsString;

    try {
      if (editingNote) {
        const res = await noteService.updateNote(editingNote._id, payload);
        if (res.success) {
          toast.success('Note updated');
          fetchNotes();
          setIsModalOpen(false);
        }
      } else {
        const res = await noteService.createNote(payload);
        if (res.success) {
          toast.success('Note created');
          fetchNotes();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePin = async (note) => {
    try {
      const res = await noteService.updateNote(note._id, { isPinned: !note.isPinned });
      if (res.success) {
        toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned to top');
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await noteService.deleteNote(id);
      if (res.success) {
        toast.success('Note deleted');
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const regularNotes = notes.filter(n => !n.isPinned);

  return (
    <div className="space-y-6 text-left">
      {/* 1. Header toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Notes & Memos</h2>
          <p className="text-xs text-slate-400">Capture design ideas, task logs, and snippets.</p>
        </div>
        <Button size="sm" onClick={openCreateNote} className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </Button>
      </div>

      {/* 2. Filters & Search tools */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes content or tags..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-borderCol-light dark:border-borderCol-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-borderCol-light dark:border-borderCol-dark bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-slate-500 dark:text-slate-400"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Render Stack */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20 bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark rounded-2xl">
          <p className="text-sm text-slate-400">No notes found. Create one now!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center space-x-1">
                <Pin className="h-3.5 w-3.5 text-primary fill-current" />
                <span>Pinned Memos</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pinnedNotes.map((note) => (
                  <Card
                    key={note._id}
                    className="flex flex-col justify-between"
                    style={{ backgroundColor: note.color }}
                    hoverEffect
                  >
                    <CardContent className="space-y-4 flex flex-col justify-between flex-1 text-slate-800">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm leading-snug truncate w-4/5">{note.title}</h4>
                        <div className="flex space-x-0.5">
                          <button
                            onClick={() => togglePin(note)}
                            className="p-1 rounded hover:bg-slate-200/40 text-primary"
                          >
                            <Pin className="h-3.5 w-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-4 whitespace-pre-wrap flex-1">
                        {note.content}
                      </p>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-250/20 text-[10px] text-slate-400 font-bold">
                        <div className="flex flex-wrap gap-1">
                          {note.tags?.map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-slate-200/35 text-slate-500">#{t}</span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openEditNote(note)} className="hover:text-primary p-1">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => handleDelete(note._id)} className="hover:text-danger p-1">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes section */}
          <div className="space-y-3">
            {pinnedNotes.length > 0 && <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455">Other notes</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNotes.map((note) => (
                <Card
                  key={note._id}
                  className="flex flex-col justify-between"
                  style={{ backgroundColor: note.color }}
                  hoverEffect
                >
                  <CardContent className="space-y-4 flex flex-col justify-between flex-1 text-slate-800">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm leading-snug truncate w-4/5">{note.title}</h4>
                      <div className="flex space-x-0.5">
                        <button
                          onClick={() => togglePin(note)}
                          className="p-1 rounded hover:bg-slate-200/40 text-slate-400"
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-4 whitespace-pre-wrap flex-1">
                      {note.content}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-250/20 text-[10px] text-slate-400 font-bold">
                      <div className="flex flex-wrap gap-1">
                        {note.tags?.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-slate-200/35 text-slate-500">#{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openEditNote(note)} className="hover:text-primary p-1">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(note._id)} className="hover:text-danger p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Create/Edit Note */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingNote ? 'Modify Note' : 'Create Memo Card'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Memo Title"
            placeholder="e.g. Shopping List"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Note Content"
            placeholder="Start writing markdown details..."
            error={errors.content?.message}
            rows={5}
            {...register('content')}
          />

          <Input
            label="Tags (Comma separated)"
            placeholder="work, ideas"
            error={errors.tagsString?.message}
            {...register('tagsString')}
          />

          {/* Color preset selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Card Color</label>
            <div className="flex space-x-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setNoteColor(preset.hex)}
                  className={`h-7 w-7 rounded-lg border transition-all ${
                    noteColor === preset.hex ? 'ring-2 ring-primary border-transparent scale-105' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Memo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotesPage;
