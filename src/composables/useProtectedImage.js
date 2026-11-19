import { onUnmounted, ref, unref, watch } from 'vue';
import api from '@/services/api';

const getStoredPhotoPath = (value) => {
  if (typeof value !== 'string' || !value) return null;
  if (value.startsWith('/uploads/photos/')) return value;

  try {
    const parsed = new URL(value);
    return parsed.pathname.startsWith('/uploads/photos/') ? parsed.pathname : null;
  } catch {
    return null;
  }
};

export const fetchProtectedImageUrl = async (value) => {
  if (!value) return '';
  const storedPath = getStoredPhotoPath(value);
  if (!storedPath) return value;

  const token = localStorage.getItem('authToken');
  const response = await api.get('/image/load', {
    params: { path: storedPath },
    responseType: 'blob',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return URL.createObjectURL(response.data);
};

export const useProtectedImage = (source) => {
  const imageUrl = ref('');
  let objectUrl = null;

  const cleanup = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  };

  const reload = async () => {
    cleanup();
    const value = unref(source);
    const loadedUrl = await fetchProtectedImageUrl(value);
    if (loadedUrl.startsWith('blob:')) objectUrl = loadedUrl;
    imageUrl.value = loadedUrl;
    return loadedUrl;
  };

  watch(source, () => reload().catch(() => { imageUrl.value = ''; }), { immediate: true });
  onUnmounted(cleanup);

  return { imageUrl, reload };
};
