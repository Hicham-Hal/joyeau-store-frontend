import axiosClient, { USE_MOCK } from "../api/axiosClient";

// Upload a picture or a video chosen from the phone / computer.
//
// Backend contract:
//   POST /uploads   multipart/form-data, field "file"   ->   { url: "https://..." }
//
// Demo mode (VITE_USE_MOCK=true) has no server: pictures are shrunk in the browser
// and kept as data in localStorage (small videos only, the browser storage is limited).

const MAX_IMAGE_SIDE = 1100; // px — big enough for a phone screen, small enough to load fast
const MAX_DEMO_VIDEO_BYTES = 3 * 1024 * 1024;

export function mediaTypeOf(file) {
  return file?.type?.startsWith("video/") ? "video" : "image";
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("bad_image"));
    img.src = src;
  });
}

async function shrinkImage(file) {
  const img = await loadImage(await readAsDataUrl(file));
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff"; // PNG with transparency -> white background
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

// Resolves with { url, type }  (type = "image" | "video")
export async function uploadFile(file) {
  const type = mediaTypeOf(file);

  if (USE_MOCK) {
    if (type === "video") {
      if (file.size > MAX_DEMO_VIDEO_BYTES) throw new Error("video_too_large");
      return { url: await readAsDataUrl(file), type };
    }
    return { url: await shrinkImage(file), type };
  }

  const form = new FormData();
  form.append("file", file);
  const { data } = await axiosClient.post("/uploads", form, {
    timeout: 120000,
    headers: { "Content-Type": "multipart/form-data" }
  });
  return { url: data.url, type };
}
