import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { theme } from '../../constants/theme';
import { Fonts } from '../../assets/fonts/fontsjs';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Firestore'dan görevleri çek
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    const tasksList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setTasks(tasksList);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Yeni görev ekleme
  const addTask = async () => {
    if (task) {
      const newTask = { text: task, completed: false };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      setTasks(prevTasks => [...prevTasks, { ...newTask, id: docRef.id }]);
      setTask('');
      setModalVisible(false);
    }
  };

  // Görev tamamlanma durumunu değiştirme
  const toggleTaskCompletion = async (id, completed) => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, { completed: !completed });
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !completed } : task
      )
    );
  };

  // Görev güncelleme
  const updateTask = (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    setSelectedTask(taskToUpdate);
    setTask(taskToUpdate.text);
    setModalVisible(true);
  };

  // Güncellenen görevi kaydet
  const handleUpdateTask = async () => {
    if (selectedTask) {
      const taskRef = doc(db, 'tasks', selectedTask.id);
      await updateDoc(taskRef, { text: task });
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === selectedTask.id ? { ...t, text: task } : t
        )
      );
      setTask('');
      setSelectedTask(null);
      setModalVisible(false);
    }
  };

  // Görev silme
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? completedCount / tasks.length : 0;

  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTaskCompletion(item.id, item.completed)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.completed ? theme.colors.success : theme.colors.inkFaint}
        />
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.text}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateTask(item.id)} hitSlop={8}>
        <Ionicons name="create-outline" size={22} color={theme.colors.inkSoft} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.header}>Günlük Görevler</Text>
            <Text style={styles.subHeader}>
              {tasks.length > 0
                ? `${completedCount}/${tasks.length} görev tamamlandı`
                : 'Henüz görev eklenmedi'}
            </Text>
          </View>
          <TouchableOpacity style={styles.trashButton} onPress={() => setDeleteModalVisible(true)}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>

        {/* İlerleme çubuğu */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>

        {/* Görev listesi */}
        <FlatList
          data={tasks}
          renderItem={TaskItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={44} color={theme.colors.inkFaint} />
              <Text style={styles.emptyText}>Sağ alttaki + ile ilk görevinizi ekleyin</Text>
            </View>
          }
        />

        {/* Görev ekleme FAB */}
        <TouchableOpacity
          style={[styles.addButton, { bottom: 80 + insets.bottom }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={30} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Görev ekleme/güncelleme modali */}
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <KeyboardAvoidingView behavior="padding" style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTask ? 'Görevi Güncelle' : 'Yeni Görev Ekle'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Görev adı..."
                placeholderTextColor={theme.colors.inkFaint}
                value={task}
                onChangeText={setTask}
                multiline
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonGhost]}
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedTask(null);
                    setTask('');
                  }}
                >
                  <Text style={styles.buttonGhostText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={selectedTask ? handleUpdateTask : addTask}
                >
                  <Text style={styles.buttonText}>{selectedTask ? 'Güncelle' : 'Ekle'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Görev silme modali */}
        <Modal visible={deleteModalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Görevleri Sil</Text>
              <FlatList
                data={tasks}
                renderItem={({ item }) => (
                  <View style={styles.deleteTaskItem}>
                    <Text style={styles.taskText} numberOfLines={1}>{item.text}</Text>
                    <TouchableOpacity onPress={() => deleteTask(item.id)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={item => item.id}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: 12 }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  header: {
    fontSize: 26,
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
  },
  subHeader: {
    fontSize: 13,
    color: theme.colors.inkSoft,
    marginTop: 2,
  },
  trashButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadowSoft,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(27,67,50,0.12)',
    marginTop: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  listContent: {
    paddingBottom: 150,
    flexGrow: 1,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadowSoft,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  taskText: {
    fontSize: 15,
    color: theme.colors.ink,
    flexShrink: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: theme.colors.inkFaint,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.inkSoft,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(20,40,30,0.6)',
  },
  modalContent: {
    width: '84%',
    maxHeight: '70%',
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
  },
  modalTitle: {
    fontSize: 18,
    color: theme.colors.ink,
    fontFamily: Fonts.RobotoBold,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderColor: 'rgba(27,67,50,0.2)',
    borderRadius: theme.radius.md,
    textAlignVertical: 'top',
    minHeight: 60,
    fontSize: 15,
    color: theme.colors.ink,
    backgroundColor: theme.colors.bg,
  },
  deleteTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
    gap: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(27,67,50,0.25)',
  },
  buttonGhostText: {
    color: theme.colors.ink,
    fontSize: 15,
    fontWeight: theme.fontWeight.medium,
  },
});
