import { createClient } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';

const client = createClient({
  authEndpoint: '/api/liveblocks-auth',
  throttle: 100,
});

// Presence represents the properties that exist on every user in the Room
// and that will be automatically synchronized in real-time
type Presence = {
  cursor: { x: number; y: number } | null;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
};

// Storage represents the shared document structure
// Using Yjs for collaborative text editing
type Storage = {
  // Yjs document for Tiptap collaboration
  // The actual structure is managed by @liveblocks/react-tiptap
};

// UserMeta represents static/readonly data on each user connected to the room
type UserMeta = {
  id: string;
  info: {
    name: string;
    email: string;
    image?: string;
    organizationId: string;
  };
};

// RoomEvent represents custom events broadcast to all users in the room
type RoomEvent =
  | {
      type: 'CURSOR_CHANGE';
      userId: string;
      position: { x: number; y: number };
    }
  | {
      type: 'USER_TYPING';
      userId: string;
      isTyping: boolean;
    };

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useOthers,
    useSelf,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStatus,
    useLostConnectionListener,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);

export { client };
