import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, errorFrom } from "../apiThunk";
import * as messageService from "../../services/messageService";

const sameId = (a, b) => String(a) === String(b);

// Public contact form. Nothing is stored in the state: the seller dashboard
// loads the inbox itself.
export const sendMessage = apiThunk("messages/send", (payload) => messageService.sendMessage(payload));

// Seller dashboard
export const fetchMessages = apiThunk("messages/fetchAll", () => messageService.fetchMessages());

export const markMessageRead = apiThunk("messages/markRead", async (id) => {
  await messageService.markMessageRead(id);
  return id;
});

export const deleteMessage = apiThunk("messages/delete", async (id) => {
  await messageService.deleteMessage(id);
  return id;
});

const messagesSlice = createSlice({
  name: "messages",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorFrom(action);
      })
      .addCase(markMessageRead.fulfilled, (state, action) => {
        const message = state.items.find((m) => sameId(m.id, action.payload));
        if (message) message.read = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => !sameId(m.id, action.payload));
      });
  },
});

export default messagesSlice.reducer;
