import React, { useState, useEffect } from 'react';
import { goalService } from '../../services/goalService.js';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Archive,
  CheckCircle,
  HelpCircle,
  FolderPlus
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Card, { CardContent } from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge, { PriorityBadge, StatusBadge } from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { Input, Textarea, Select } from '../../components/ui/Input.jsx';
import toast from 'react-hot-toast';

const goalSchema = zod.object({
  title: zod.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: zod.string().optional(),
  category: zod.string().min(1, 'Category is required'),
  priority: zod.enum(['low', 'medium', 'high']),
  dueDate: zod.string().min(1, 'Due date is required'),
  estimatedMinutes: zod.coerce.number().min(0, 'Estimated minutes cannot be negative'),
  tagsString: zod.string().optional(),
});

const categorySchema = zod.object({
  name: zod.string().min(1, 'Category name is required').max(30),
  color: zod.string().default('#3B82F6'),
  icon: zod.string().default('Folder'),
});

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      priority: 'medium',
      estimatedMinutes: 0,
    }
  });

  const { register: registerCat, handleSubmit: handleCatSubmit, reset: resetCat, formState: { errors: catErrors } } = useForm({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchGoals();
    fetchCategories();
  }, [selectedCategory, selectedPriority, selectedStatus]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory || undefined,
        priority: selectedPriority || undefined,
        status: selectedStatus || undefined,
      };
      const res = await goalService.getGoals(params);
      if (res.success && res.data) {
        setGoals(res.data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await goalService.getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger search on local state
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term) {
      fetchGoals();
      return;
    }
    try {
      const res = await goalService.searchGoals(term);
      if (res.success) {
        setGoals(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Modals configurations
  const openCreateGoal = () => {
    setEditingGoal(null);
    reset({
      title: '',
      description: '',
      category: categories[0]?._id || '',
      priority: 'medium',
      dueDate: new Date().toISOString().substring(0, 10),
      estimatedMinutes: 0,
      tagsString: '',
    });
    setIsGoalModalOpen(true);
  };

  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    reset({
      title: goal.title,
      description: goal.description,
      category: goal.category?._id || '',
      priority: goal.priority,
      dueDate: new Date(goal.dueDate).toISOString().substring(0, 10),
      estimatedMinutes: goal.estimatedMinutes,
      tagsString: goal.tags?.join(', ') || '',
    });
    setIsGoalModalOpen(true);
  };

  const onGoalSubmit = async (values) => {
    const tags = values.tagsString ? values.tagsString.split(',').map(t => t.trim()).filter(Boolean) : [];
    const payload = { ...values, tags };
    delete payload.tagsString;

    try {
      if (editingGoal) {
        const res = await goalService.updateGoal(editingGoal._id, payload);
        if (res.success) {
          toast.success('Goal updated successfully');
          fetchGoals();
          setIsGoalModalOpen(false);
        }
      } else {
        const res = await goalService.createGoal(payload);
        if (res.success) {
          toast.success('Goal created successfully');
          fetchGoals();
          setIsGoalModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onCategorySubmit = async (values) => {
    try {
      const res = await goalService.createCategory(values);
      if (res.success) {
        toast.success('Custom category created successfully');
        fetchCategories();
        resetCat();
        setIsCategoryModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actions
  const handleGoalComplete = async (id) => {
    try {
      const res = await goalService.completeGoal(id);
      if (res.success) {
        toast.success('Goal completed! Excellent work!');
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoalArchive = async (id) => {
    try {
      const res = await goalService.archiveGoal(id);
      if (res.success) {
        toast.success('Goal archived successfully');
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoalDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal permanently?')) return;
    try {
      const res = await goalService.deleteGoal(id);
      if (res.success) {
        toast.success('Goal deleted');
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Task Goals Workspace</h2>
          <p className="text-xs text-slate-400">Add badges, priorities, and custom tags to keep tracker updated.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsCategoryModalOpen(true)} className="flex items-center space-x-1">
            <FolderPlus className="h-4 w-4" />
            <span>Category</span>
          </Button>
          <Button size="sm" onClick={openCreateGoal} className="flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </Button>
        </div>
      </div>

      {/* 2. Filters & Searches */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-cardBg-light dark:bg-cardBg-dark border border-borderCol-light dark:border-borderCol-dark p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search goals title or tags..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-borderCol-light dark:border-borderCol-dark bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-borderCol-light dark:border-borderCol-dark bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-slate-500 dark:text-slate-400"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-borderCol-light dark:border-borderCol-dark bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-slate-500 dark:text-slate-400"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-borderCol-light dark:border-borderCol-dark bg-transparent focus:outline-none focus:ring-1 focus:ring-primary text-slate-500 dark:text-slate-400"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* 3. Goals List Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-20 bg-cardBg-light dark:bg-cardBg-dark rounded-2xl border border-borderCol-light dark:border-borderCol-dark">
          <p className="text-sm text-slate-400">No active goals match your parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal._id} className="flex flex-col justify-between" hoverEffect>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <Badge variant={goal.category?.isDefault ? 'slate' : 'secondary'}>
                    {goal.category?.name || 'Uncategorized'}
                  </Badge>
                  <PriorityBadge priority={goal.priority} />
                </div>

                {/* Title and details */}
                <div className="space-y-2 flex-1">
                  <h3 className={`text-sm font-bold text-slate-800 dark:text-slate-100 ${goal.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Due Date & tags */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                    <span>{goal.estimatedMinutes || 0} mins</span>
                  </div>

                  {goal.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {goal.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px] font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions drawer */}
                  <div className="flex items-center justify-between pt-1">
                    <StatusBadge status={goal.status} />

                    <div className="flex items-center space-x-1">
                      {goal.status === 'pending' && (
                        <button
                          onClick={() => handleGoalComplete(goal._id)}
                          className="p-1.5 text-slate-400 hover:text-success hover:bg-success/10 rounded-xl transition-all"
                          title="Complete Task"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openEditGoal(goal)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Edit Details"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleGoalArchive(goal._id)}
                        className="p-1.5 text-slate-400 hover:text-warning hover:bg-warning/10 rounded-xl transition-all"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleGoalDelete(goal._id)}
                        className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 4. Modals - Create/Edit Goal */}
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={editingGoal ? 'Edit Goal Details' : 'Create New Goal'}>
        <form onSubmit={handleSubmit(onGoalSubmit)} className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g. Write architecture notes"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Specify steps or detail resources..."
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Goal Category"
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              error={errors.category?.message}
              {...register('category')}
            />

            <Select
              label="Task Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              error={errors.priority?.message}
              {...register('priority')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              error={errors.dueDate?.message}
              {...register('dueDate')}
            />

            <Input
              label="Estimate (Minutes)"
              type="number"
              error={errors.estimatedMinutes?.message}
              {...register('estimatedMinutes')}
            />
          </div>

          <Input
            label="Tags (Comma separated, e.g. code, health)"
            placeholder="writing, learning"
            error={errors.tagsString?.message}
            {...register('tagsString')}
          />

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsGoalModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingGoal ? 'Save Modifications' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Modals - Create Category */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Create Custom Category">
        <form onSubmit={handleCatSubmit(onCategorySubmit)} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Hobbies"
            error={catErrors.name?.message}
            {...registerCat('name')}
          />

          <Input
            label="Theme HEX Color"
            type="color"
            error={catErrors.color?.message}
            {...registerCat('color')}
          />

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GoalsPage;
