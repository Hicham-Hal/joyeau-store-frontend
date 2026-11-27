import { createSlice } from "@reduxjs/toolkit";
import emailjs from "@emailjs/browser";
import { apiThunk, errorFrom } from "../apiThunk";
import * as messageService from "../../services/messageService";

const sameId = (a, b) => String(a) === String(b);

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Sends the visitor form directly to email via EmailJS instead of the backend inbox API.
export const sendMessage = apiThunk("messages/send", async (payload) => {
  const templateParams = {
    from_name: payload.name.trim(),
    phone: payload.phone.trim(),
    message: payload.message.trim(),
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
    publicKey: PUBLIC_KEY,
  });
});

// Seller dashboard (kept if the admin inbox still uses the backend API)
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