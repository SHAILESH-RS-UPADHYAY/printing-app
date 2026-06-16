import api from './client';

export async function uploadFile(fileUri: string, fileName: string, mimeType: string) {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);

  const { data } = await api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
  return data;
}

export async function uploadMultiple(files: { uri: string; name: string; type: string }[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);
  });

  const { data } = await api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000,
  });
  return data;
}

export async function getUserDocuments() {
  const { data } = await api.get('/upload');
  return data;
}

export async function deleteDocument(documentId: string) {
  const { data } = await api.delete(`/upload/${documentId}`);
  return data;
}
