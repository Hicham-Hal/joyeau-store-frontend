import api from '../api/axiosClient.js'

export async function uploadMedia(file) {
    const isVideo = file.type.startsWith('video/')
    const { data: sig } = await api.get('/admin/upload-signature')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('api_key', sig.apiKey)
    fd.append('timestamp', sig.timestamp)
    fd.append('signature', sig.signature)
    fd.append('folder', sig.folder)

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/${isVideo ? 'video' : 'image'}/upload`,
        { method: 'POST', body: fd }
    )
    if (!res.ok) throw new Error('upload_failed')
    const data = await res.json()
    return { url: data.secure_url, type: isVideo ? 'video' : 'image' }
}s