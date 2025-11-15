'use client';

import { api } from '@repo/database';
import type { Id } from '@repo/database/convex/_generated/dataModel';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { Input } from '@repo/design-system/components/ui/input';
import { handleError } from '@repo/design-system/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Todo = {
  _id: Id<'todos'>;
  _creationTime: number;
  userId: Id<'user'>;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: number;
  projectId?: Id<'projects'>;
  tags: Array<{
    _id: Id<'tags'>;
    name: string;
    color: string;
  }>;
  project: {
    _id: Id<'projects'>;
    name: string;
  } | null;
};

type FilterType = 'all' | 'active' | 'completed';

export function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Fetch todos with pagination
  const todosResult = useQuery(api.todos.list, {
    paginationOpts: { numItems: 50, cursor: null },
    completed: filter === 'all' ? undefined : filter === 'completed',
  });

  const createTodo = useMutation(api.todos.create);
  const toggleComplete = useMutation(api.todos.toggleComplete);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const todos = todosResult?.page ?? [];
  const isLoading = todosResult === undefined;
  const hasMore = todosResult?.isDone === false;

  // Filter todos client-side for 'active' filter (since API doesn't support it directly)
  const filteredTodos =
    filter === 'active'
      ? todos.filter((todo: Todo) => !todo.completed)
      : filter === 'completed'
        ? todos.filter((todo: Todo) => todo.completed)
        : todos;

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || isCreating) return;

    setIsCreating(true);
    try {
      await createTodo({
        title: newTodoTitle.trim(),
      });
      setNewTodoTitle('');
      toast.success('Todo created successfully');
    } catch (error) {
      handleError(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleComplete = async (id: Id<'todos'>) => {
    try {
      const newStatus = await toggleComplete({ id });
      toast.success(
        newStatus ? 'Todo marked as completed' : 'Todo marked as active',
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteTodo = async (id: Id<'todos'>) => {
    try {
      await deleteTodo({ id });
      toast.success('Todo deleted successfully');
    } catch (error) {
      handleError(error);
    }
  };

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="rounded-xl bg-muted/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Todos</h3>
        <div className="flex items-center gap-3">
          {todos.length > 0 && (
            <Badge variant="secondary">
              {todos.filter((t: Todo) => !t.completed).length} active
            </Badge>
          )}
          <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="h-7 px-3 text-xs"
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
              className="h-7 px-3 text-xs"
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('completed')}
              className="h-7 px-3 text-xs"
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      {/* Create Todo Form */}
      <form onSubmit={handleCreateTodo} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new todo..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            disabled={isCreating}
            className="flex-1"
          />
          <Button type="submit" disabled={isCreating || !newTodoTitle.trim()}>
            {isCreating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Add
          </Button>
        </div>
      </form>

      {/* Todos List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>
            {todos.length === 0
              ? 'No todos yet. Create your first todo above!'
              : `No ${filter === 'active' ? 'active' : filter === 'completed' ? 'completed' : ''} todos found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo: Todo) => (
            <div
              key={todo._id}
              className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                todo.completed
                  ? 'bg-muted/30 border-muted'
                  : 'bg-background border-border'
              }`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggleComplete(todo._id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium ${
                        todo.completed
                          ? 'text-muted-foreground line-through'
                          : 'text-foreground'
                      }`}
                    >
                      {todo.title}
                    </h4>
                    {todo.description && (
                      <p
                        className={`text-sm mt-1 ${
                          todo.completed
                            ? 'text-muted-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {todo.priority && (
                        <Badge variant={getPriorityColor(todo.priority)}>
                          {todo.priority}
                        </Badge>
                      )}
                      {todo.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Due: {formatDate(todo.dueDate)}
                        </span>
                      )}
                      {todo.project && (
                        <Badge variant="outline" className="text-xs">
                          {todo.project.name}
                        </Badge>
                      )}
                      {todo.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {todo.tags.map((tag) => (
                            <Badge
                              key={tag._id}
                              variant="outline"
                              className="text-xs"
                              style={{
                                borderColor: tag.color,
                                color: tag.color,
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Load more todos...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
