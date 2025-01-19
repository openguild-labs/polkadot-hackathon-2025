import UserSocket from '@/socket/user.socket';
import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
type Store = {
  isSocketConnected: boolean;
  setIsSocketConnected: (isConnected: boolean) => void;
  socket?: UserSocket;
  setSocket: (socket: UserSocket | undefined) => void;
  reset: () => void;
};

const useSocketStore = create<Store>()(
  // persist(
    immer(
      (set, get) => ({
        isSocketConnected: false,
        setIsSocketConnected(isConnected) {
          set(state => {
            state.isSocketConnected = isConnected
          })
        },
        socket: undefined,
        setSocket(socket: any | undefined) {
          set(
            (state) => {
              state.socket = socket;
            }
          );
        },
        reset: () =>
          set(
            (state) => {
              state.socket = undefined;
            }
          ),
      })
    ),
  //   {
  //     name: 'auth-storage', // name of the item in the storage (must be unique)
  //     storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
  //   },
  // ),
);

export default useSocketStore;
