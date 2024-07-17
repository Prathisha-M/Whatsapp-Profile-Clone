import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
global.varlink = 'http://192.168.29.42:3000';
const EditProfileView = () => {
  const [name, setName] = useState('Prathisha');
  const [about, setAbout] = useState('Busy');
  const [phone, setPhone] = useState('9876543210');
  const [avatar, setAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCameraIcon = () => {
    setModalVisible(true);
    console.log('Camera icon pressed');
  };

  const handleCameraOption = async () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        const file = response.assets[0];
        setAvatar(file.uri); 
      }
    });
    setModalVisible(false);
  };

  const handleGalleryOption = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.error) {
        const file = response.assets[0];
        setAvatar(file.uri);
      }
    });
    setModalVisible(false);
  };

  const handleDeleteOption = () => {
    setAvatar(null);
    setModalVisible(false);
  };

  const handleCameraPress = () => {
    const formData = new FormData();
    if (avatar) {
      const uriParts = avatar.split('.');
      const fileType = uriParts[uriParts.length - 1];
  
      formData.append('avatar', {
        uri: avatar,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      });
    }
  
    fetch(`${global.varlink}/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Profile picture updated successfully: ', data);
    })
    .catch(error => {
      console.error('Profile picture update failed: ', error);
      console.error('Error details: ', error);
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={avatar ? { uri: avatar } : require('../assets/pikachu.jpeg')} />
        <TouchableOpacity 
          style={styles.camicon} 
          onPress={handleCameraIcon}
        >
          <Icon name="camera" size={18} color="#000" style={styles.cam} />
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
          />
          <Icon name="user-circle" size={20} color="#fff" style={styles.icon} />
        </View>
        <Text style={styles.label}>About</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter About"
            value={about}
            onChangeText={setAbout}
          />
          <Icon name="info-circle" size={20} color="#fff" style={styles.icon} />
        </View>
        <Text style={styles.label}>Phone</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Icon name="phone" size={20} color="#fff" style={styles.icon} />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity> 

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleCameraOption}>
              <Text style={styles.modalButton}>
                <Icon name="camera" size={18} color="green" style={styles.cam} /> Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGalleryOption}>
              <Text style={styles.modalButton}>
                <Icon name="image" size={18} color="green" style={styles.cam} /> Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteOption}>
              <Text style={styles.modalButton}>
                <Icon name="trash" size={18} color="green" style={styles.cam} /> Remove
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  form: {
    width: '80%',
  },
  label: {
    marginTop: 20,
    color: 'white',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    paddingVertical: 5,
    justifyContent: 'space-between',
    borderTopWidth: 0,
    borderStartWidth: 0,
    borderEndWidth: 0,
  },
  icon: {
    marginLeft: 10,
    color: 'green',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 40,
    backgroundColor: 'green',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
  },
  avatarContainer: {
    marginTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  camicon: {
    position: 'absolute',
    right: 7,
    top: 105,
    borderRadius: 100,
    backgroundColor: 'green',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    paddingLeft: 125,
    borderWidth: 0.5,
    borderColor: 'white',
  },
  modalButton: {
    fontSize: 18,
    marginVertical: 10,
    color: 'green',
  },
});

export default EditProfileView;









// npm i --save react-native-fontawesome