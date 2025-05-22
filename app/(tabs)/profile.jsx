import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'; // Firestore işlemleri
import { db } from '../../config/firebase'; // Firestore yapılandırması

export default function Profile() {
  const [task, setTask] = useState(''); // Görev metni için durum
  const [tasks, setTasks] = useState([]); // Görevleri tutma
  const [modalVisible, setModalVisible] = useState(false); // Görev ekleme/güncelleme modalı
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Görev silme modalı
  const [selectedTask, setSelectedTask] = useState(null); // Seçilen görev

  // Firestore'dan görevleri çek
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    const tasksList = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setTasks(tasksList);
  };

  useEffect(() => {
    fetchTasks(); // Sayfa yüklendiğinde görevleri çek
  }, []);

  // Yeni görev ekleme
  const addTask = async () => {
    if (task) {
      const newTask = { text: task, completed: false };
      const docRef = await addDoc(collection(db, 'tasks'), newTask); // Firestore'a ekle
      setTasks(prevTasks => [...prevTasks, { ...newTask, id: docRef.id }]); // Görevi listeye ekle
      setTask('');
      setModalVisible(false); // Modalı kapat
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
    setTask(taskToUpdate.text); // Güncellenecek görevin metnini al
    setModalVisible(true); // Modalı aç
  };

  // Güncellenen görevi kaydet
  const handleUpdateTask = async () => {
    if (selectedTask) {
      const taskRef = doc(db, 'tasks', selectedTask.id);
      await updateDoc(taskRef, { text: task }); // Sadece text alanını günceller
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === selectedTask.id ? { ...t, text: task } : t // Diğer alanları koruyarak günceller
        )
      );
      setTask(''); // Input alanını sıfırlar
      setSelectedTask(null); // Seçilen görevi sıfırlar
      setModalVisible(false); // Modalı kapatır
    }
  };
  // Görev silme
  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id)); // Firestore'dan sil
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Görev listesindeki öğe
  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <TouchableOpacity onPress={() => toggleTaskCompletion(item.id, item.completed)}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={item.completed ? 'green' : 'gray'}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.text}</Text>
      </View>
      <TouchableOpacity onPress={() => updateTask(item.id)}>
        <Ionicons name="create-outline" size={24} color="blue" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Günlük Görevler</Text>
        <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
          <Ionicons name="trash-outline" size={30} color="red" />
        </TouchableOpacity>
      </View>

      {/* Görevleri listeleme */}
      <FlatList
        data={tasks}
        renderItem={TaskItem}
        keyExtractor={item => item.id}
      />

      {/* Artı butonu ile görev ekleme */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={64} color="blue" />
      </TouchableOpacity>

      {/* Görev ekleme/güncelleme modali */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTask ? 'Görevi Güncelle' : 'Yeni Görev Ekle'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Görev adı..."
              value={task}
              onChangeText={setTask}
              multiline
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={selectedTask ? handleUpdateTask : addTask}
              >
                <Text style={styles.buttonText}>{selectedTask ? 'Güncelle' : 'Görev Ekle'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { backgroundColor: 'red', borderColor: 'red' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Görev silme modali */}
      <Modal visible={deleteModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Görevleri Sil</Text>
            <FlatList
              data={tasks}
              renderItem={({ item }) => (
                <View style={styles.deleteTaskItem}>
                  <Text style={styles.taskText}>{item.text}</Text>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.id}
            />
            <Button title="Kapat" onPress={() => setDeleteModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor:'#D2B48C'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9', // Görev arka planı
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskText: {
    fontSize: 18,
    flexShrink: 1,
    flexWrap: 'wrap',
    marginLeft: 10, // Icon ile metin arasına boşluk bırakır
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderColor: 'gray',
    borderRadius: 5,
    textAlignVertical: 'top', // Uzun metin girişine uygun hale getirir
  },
  deleteTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 5, // Butonlar arasında boşluk
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007BFF',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
