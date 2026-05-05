import AV from 'leancloud-storage'
import { assertSessionUserMatchesHeaders } from '../../service/av'

export default defineEventHandler(async (event) => {
    const headers = getHeaders(event)
    await assertSessionUserMatchesHeaders(headers)

    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
        throw createError({ statusCode: 400, statusMessage: '未找到上传文件' })
    }

    const filePart = formData.find((p) => p.name === 'file')
    if (!filePart || !filePart.data) {
        throw createError({ statusCode: 400, statusMessage: '未找到 file 字段' })
    }

    if (filePart.data.length > 5 * 1024 * 1024) {
        throw createError({ statusCode: 400, statusMessage: '文件大小不能超过 5MB' })
    }

    const ext = (filePart.filename || 'image.jpg').split('.').pop() || 'jpg'
    const mimeType = filePart.type || 'image/jpeg'
    const avFile = new AV.File(`avatar_${Date.now()}.${ext}`, { base64: filePart.data.toString('base64') }, mimeType)

    try {
        const saved = await avFile.save()
        return { url: saved.get('url'), key: saved.id }
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '文件上传失败'
        throw createError({ statusCode: 500, statusMessage: msg })
    }
})
