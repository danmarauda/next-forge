/**
 * @repo/liveblocks - Collaborative Editing Package
 *
 * This package provides Liveblocks integration for real-time collaboration.
 */

// Re-export Liveblocks React hooks
export {
  ClientSideSuspense,
  RoomProvider,
  useBroadcastEvent,
  useCanRedo,
  useCanUndo,
  useEventListener,
  useHistory,
  useMutation,
  useMyPresence,
  useOthers,
  useRedo,
  useRoom,
  useSelf,
  useStorage,
  useUndo,
  useUpdateMyPresence,
} from '@liveblocks/react/suspense';
// Re-export Liveblocks Tiptap
export { LiveblocksProvider, useEditorStatus } from '@liveblocks/react-tiptap';
// Re-export Liveblocks configuration
export * from './liveblocks.config';
