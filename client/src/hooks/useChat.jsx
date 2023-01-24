import useFetch from "./useFetch";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../store/chatSlice";

const useChat = (contact) => {
  const mode = useSelector((state) => state.chatReducer.mode);

  const dispatch = useDispatch();
  const chatHistory = useSelector((state) => state.chatReducer.chatHistory);
  const chat = useSelector((state) => state.chatReducer.currentChatRoom);

  const { reqFn: fetchChatRoom } = useFetch(
    {
      method: "GET",
      url: `/chatRoom/${contact?.chatRoomId}`,
    },
    (data) => {
      const chatRoom = {
        chatProfile: {
          ...contact.contactDetails,
          name: contact.contactName,
        },
        ...data.data.chatRoom,
      };
      console.log(chatRoom);
      // Set chat room as current
      dispatch(chatActions.setChatRoom({ chatRoom }));
      // Add chat room to history
      dispatch(
        chatActions.addToChatRoomHistory({
          chatRoomId: contact.chatRoomId,
          chatRoom,
        })
      );
    }
  );

  const setChatRoom = () => {
    // Check if chat has been fetched already
    const chatRoom = chatHistory[contact.chatRoomId];
    if (chatRoom) {
      dispatch(chatActions.setChatRoom({ chatRoom }));
    } else {
      fetchChatRoom();
    }
    dispatch(chatActions.setChatActive());
  };

  return { chat, setChatRoom, mode };
};

export default useChat;
