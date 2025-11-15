import { v } from 'convex/values';
import { z } from 'zod';
import type { Id } from './_generated/dataModel';
import {
  createAuthMutation,
  createAuthPaginatedQuery,
  createAuthQuery,
} from './functions';

// List todos with pagination and filtering
export const list = createAuthPaginatedQuery()({
  args: {
    completed: v.optional(v.boolean()),
    projectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, args) => {
    const { table, user } = ctx;
    const { completed, projectId, paginationOpts } = args;

    // Get all todos for user and paginate
    // Note: We'll filter by userId and completed in memory for now
    // TODO: Optimize with proper index queries when needed
    const todosQuery = table('todos');
    const todos = await todosQuery.paginate(paginationOpts);

    // Filter by userId, completed status, and projectId
    const filteredPage = todos.page.filter((todo: any) => {
      if (todo.userId !== user._id) return false;
      if (completed !== undefined && todo.completed !== completed) return false;
      if (projectId && todo.projectId !== projectId) return false;
      return true;
    });

    // Load related data (project, tags) for each todo
    const todosWithRelations = await Promise.all(
      filteredPage.map(async (todo: any) => {
        const project = todo.projectId
          ? await table('projects').get(todo.projectId)
          : null;

        const tags = await todo.edge('tags');

        return {
          ...todo,
          project: project
            ? {
                _id: project._id,
                name: project.name,
              }
            : null,
          tags: tags.map((tag: any) => ({
            _id: tag._id,
            name: tag.name,
            color: tag.color,
          })),
        };
      }),
    );

    return {
      page: todosWithRelations,
      isDone: todos.isDone,
      continueCursor: todos.continueCursor,
    };
  },
});

// Create a new todo
export const create = createAuthMutation()({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    ),
    dueDate: v.optional(v.number()),
    projectId: v.optional(v.id('projects')),
    tagIds: v.optional(v.array(v.id('tags'))),
  },
  handler: async (ctx, args) => {
    const { table, user } = ctx;
    const { title, description, priority, dueDate, projectId, tagIds } = args;

    // Create the todo
    const todoId = await table('todos').insert({
      userId: user._id,
      title,
      description,
      completed: false,
      priority,
      dueDate,
      projectId,
    });

    const todo = await table('todos').getX(todoId);

    // Add tags if provided
    if (tagIds && tagIds.length > 0) {
      await Promise.all(
        tagIds.map((tagId) =>
          table('todoTags').insert({
            todoId: todo._id,
            tagId,
          }),
        ),
      );
    }

    return todo._id;
  },
});

// Toggle todo completion status
export const toggleComplete = createAuthMutation()({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    const { table, user } = ctx;
    const { id } = args;

    // Get the todo and verify ownership
    const todo = await table('todos').getX(id);
    if (todo.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    // Toggle completion status
    const newCompleted = !todo.completed;
    await todo.patch({ completed: newCompleted });

    return newCompleted;
  },
});

// Delete a todo (soft delete)
export const deleteTodo = createAuthMutation()({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    const { table, user } = ctx;
    const { id } = args;

    // Get the todo and verify ownership
    const todo = await table('todos').getX(id);
    if (todo.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    // Soft delete
    await todo.delete();

    return { success: true };
  },
});

// Get a single todo by ID
export const get = createAuthQuery()({
  args: {
    id: v.id('todos'),
  },
  handler: async (ctx, args) => {
    const { table, user } = ctx;
    const { id } = args;

    const todo = await table('todos').get(id);
    if (!todo) {
      return null;
    }

    // Verify ownership
    if (todo.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    // Load related data
    const project = todo.projectId
      ? await table('projects').get(todo.projectId)
      : null;

    const tags = await todo.edge('tags');

    return {
      ...todo,
      project: project
        ? {
            _id: project._id,
            name: project.name,
          }
        : null,
      tags: tags.map((tag: any) => ({
        _id: tag._id,
        name: tag.name,
        color: tag.color,
      })),
    };
  },
});

// Update a todo
export const update = createAuthMutation()({
  args: {
    id: v.id('todos'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    priority: v.optional(
      v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    ),
    dueDate: v.optional(v.number()),
    projectId: v.optional(v.union(v.id('projects'), v.null())),
  },
  handler: async (ctx, args) => {
    const { table, user } = ctx;
    const { id, ...updates } = args;

    // Get the todo and verify ownership
    const todo = await table('todos').getX(id);
    if (todo.userId !== user._id) {
      throw new Error('Unauthorized');
    }

    // Build update object (only include defined fields)
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.completed !== undefined)
      updateData.completed = updates.completed;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
    if (updates.projectId !== undefined)
      updateData.projectId = updates.projectId;

    // Update the todo
    await todo.patch(updateData);

    return { success: true };
  },
});
