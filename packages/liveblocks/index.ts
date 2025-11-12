/**
 * @repo/liveblocks - Collaborative Editing Package
 * 
 * This package provides Liveblocks integration for real-time collaboration.
 */

// Re-export Liveblocks configuration
export * from "./liveblocks.config";

// Re-export Liveblocks React hooks
export {
  useRoom,
  useSelf,
  useOthers,
  useMyPresence,
  useUpdateMyPresence,
  useBroadcastEvent,
  useEventListener,
  useStorage,
  useMutation,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

// Re-export Liveblocks Tiptap
export { LiveblocksProvider, useEditorStatus } from "@liveblocks/react-tiptap";

