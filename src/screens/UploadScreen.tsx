import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../constants/colors';
import { Button } from '../components/common/Button';
import { formatFileSize } from '../utils/format';
import { uploadFile } from '../services/api/upload';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uri: string;
  mimeType: string;
  pageCount: number;
  remoteUrl?: string;
  remoteId?: string;
}

const PAGES_ESTIMATE: Record<string, number> = {
  'application/pdf': 10,
  'application/msword': 8,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 8,
  'image/jpeg': 1,
  'image/png': 1,
};

export function UploadScreen({ navigation }: { navigation: any }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets) return;

      const picked = result.assets.map((asset) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: asset.name,
        size: asset.size || 0,
        uri: asset.uri,
        mimeType: asset.mimeType || 'application/pdf',
        pageCount: PAGES_ESTIMATE[asset.mimeType || ''] || 5,
      }));

      setUploading(true);
      const uploaded: UploadedFile[] = [];

      for (const file of picked) {
        try {
          const res = await uploadFile(file.uri, file.name, file.mimeType);
          uploaded.push({
            ...file,
            remoteUrl: res.document?.url || res.url,
            remoteId: res.document?._id || res.documentId,
          });
        } catch {
          Alert.alert('Upload Failed', `Could not upload ${file.name}`);
        }
      }

      setFiles((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.log('DocumentPicker error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);

  const renderFile = ({ item }: { item: UploadedFile }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileIcon}>
        <Ionicons
          name={item.mimeType.includes('pdf') ? 'document' : 'document-text'}
          size={24}
          color={Colors.primary}
        />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.fileMeta}>
          {formatFileSize(item.size)} • ~{item.pageCount} pages
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeFile(item.id)} style={styles.removeButton}>
        <Ionicons name="close-circle" size={22} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Documents</Text>
      </View>

      <FlatList
        data={files}
        renderItem={renderFile}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={pickDocument}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.uploadTitle}>Uploading...</Text>
                <Text style={styles.uploadNote}>Please wait while files are uploaded</Text>
              </>
            ) : (
              <>
                <View style={styles.uploadIconContainer}>
                  <Ionicons name="cloud-upload-outline" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.uploadTitle}>Tap to Upload Files</Text>
                <Text style={styles.uploadFormats}>PDF, DOC, DOCX, JPG, PNG</Text>
                <Text style={styles.uploadNote}>Max 20MB per file • Multiple files supported</Text>
              </>
            )}
          </TouchableOpacity>
        }
        ListEmptyComponent={null}
      />

      {files.length > 0 && !uploading && (
        <View style={styles.bottomBar}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalFiles}>{files.length} file(s)</Text>
            <Text style={styles.totalPages}>~{totalPages} total pages</Text>
          </View>
          <View style={styles.totalPrice}>
            <Text style={styles.priceLabel}>Est. from</Text>
            <Text style={styles.priceValue}>₹{(totalPages * 0.9).toFixed(2)}</Text>
          </View>
          <Button
            title="Continue"
            onPress={() =>
              navigation.navigate('PrintCustomization', {
                document: {
                  id: files[0].id,
                  name: files[0].name,
                  fileName: files[0].name,
                  uri: files[0].remoteUrl || files[0].uri,
                  fileUri: files[0].remoteUrl || files[0].uri,
                  pageCount: files[0].pageCount,
                  fileSize: files[0].size,
                  mimeType: files[0].mimeType,
                },
              })
            }
            size="medium"
            style={styles.continueButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  listContent: {
    padding: 16,
  },
  uploadArea: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  uploadFormats: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  uploadNote: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  fileMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalInfo: {
    flex: 1,
  },
  totalFiles: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  totalPages: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  totalPrice: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  continueButton: {
    paddingHorizontal: 24,
  },
});
