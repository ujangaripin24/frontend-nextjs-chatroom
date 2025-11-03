import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchRooms, setCurrentRoom } from "@/lib/slices/chatSlice";
import Link from "next/link";
import { useEffect } from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const SidebarLayout: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen
}) => {
  console.log("dari sidebar layout", isSidebarOpen);
  const dispatch = useAppDispatch()
  const { token } = useAppSelector((state) => state.auth)
  const { rooms, loading, error, currentRoom } = useAppSelector((state) => state.chat)

  useEffect(() => {
    if (token) {
      dispatch(fetchRooms(token))
    }
  }, [token, dispatch])

  const handleRoomSelect = (roomId: string) => {
    dispatch(setCurrentRoom(roomId))
  }

  if (loading) {
    return (
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 -translate-x-full dark:bg-gray-800 dark:border-gray-700`} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/dashboard/chat" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Chat Room</span>
              </Link>
            </li>
            <li>
              {error && (
                <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded mb-2">
                  {error}
                </div>
              )}
              {rooms.length === 0 ? (
                <div className="text-gray-400 text-center p-4">
                  No rooms found. Create one to start chatting!
                </div>
              ) : (
                rooms.map((room) => (
                  <Link
                    key={room.uuid}
                    href={`/dashboard/chat/${room.uuid}`}
                    className={`block p-3 rounded-lg cursor-pointer transition-colors mb-1 ${currentRoom === room.uuid
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-200'
                      }`}
                  >
                    <div className="font-medium truncate">{room.name}</div>
                    <div className="text-sm text-gray-400 truncate">
                      {room.description || 'No description'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(room.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                ))
              )}
            </li>
          </ul>
        </div>
      </aside>
    </div>
  )
}

export default SidebarLayout