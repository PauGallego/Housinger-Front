import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, TextField, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { API_BASE_URL } from '../../astro.config';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState({
    usuario: false,
    usuarioPremiun: false,
    admin: false,
  });
  const [enableAccount, setEnableAccount] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDNI] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    const token = localStorage.getItem('authorization');
    if (!token) {
      console.error('No token found');
      return;
    }

    const url = `${API_BASE_URL}/v1/user/get/all`;

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Authentication ' + token,
    });

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      setUsers(data);

      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user) => {
    setSelectedUser(user);
    setRoles({
      usuario: user.roles.includes('U'),
      usuarioPremiun: user.roles.includes('P'),
      admin: user.roles.includes('A'),
    });
    setEnableAccount(user.enableAccount);
    setName(user.name);
    setSurname(user.surname);
    setEmail(user.mail);
    setUsername(user.username);
    setPassword('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRoleChange = (event) => {
    setRoles({
      ...roles,
      [event.target.name]: event.target.checked,
    });
    setSelectedUser(prevUser => ({
      ...prevUser,
      roles: {
        ...prevUser.roles,
        [event.target.name]: event.target.checked,
      }
    }));
  };

  const uploadImg = async () => {
    const formData = new FormData();
    const fileInput = document.querySelector('#fileInput');
    formData.append('file', fileInput.files[0]);

    try {
        const token = localStorage.getItem('authorization');
        if (!token) {
            console.error('No token found');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/v1/fileCustomer/upload/${selectedUser.customerEntityId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Authentication ' + token,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const imageUrl = await response.text(); 
        const fileName = imageUrl.match(/([^\/\\]+)$/)[0];

        setSelectedUser(prevUser => ({
            ...prevUser,
            picture: fileName
        }));

        let updatedUsers = users.map(user => {
            if (user.id === selectedUser.id) {
                return {
                    ...user,
                    picture: fileName
                };
            } else {
                return user;
            }
        });

        setUsers(updatedUsers);

        handleClose();
    } catch (error) {
        // Manejar errores de red u otros errores
        console.error('Error uploading image:', error);
    }
};


  const handleEnableAccountChange = (event) => {
    setEnableAccount(event.target.checked);
    setSelectedUser(prevUser => ({
      ...prevUser,
      enableAccount: event.target.checked,
    }));
  };

  const handleModify = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem('authorization');
    if (!token) {
      console.error('No token found');
      return;
    }

    const url = `${API_BASE_URL}/v1/user/truePut`;

    const updatedUser = {
      ...selectedUser,
      name: name,
      surname: surname,
      mail: email,
      username: username,
      password: password,
      roles: [
        roles.usuario && 'U',
        roles.usuarioPremiun && 'P',
        roles.admin && 'A',
      ].filter(Boolean),
      enableAccount: enableAccount,
      dni: dni,
    };

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Authentication ' + token,
    });

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      fetchUsers();

      handleClose();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem('authorization');
    if (!token) {
      console.error('No token found');
      return;
    }

    const url = `${API_BASE_URL}/v1/user/trueDelete/${selectedUser.id}`;

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Authentication ' + token,
    });

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      handleClose();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='pb-[50px]'>
      <div className="flex justify-start ml-[10vw] mb-5">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2 w-full max-w-md"
        />
      </div>
      <div className="flex flex-wrap justify-start gap-10 pl-[50px] md:pl-[200px]">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="flex flex-col items-center border border-gray-300 rounded-lg p-4 w-[200px] md:w-[250px]"
            onClick={() => handleOpen(user)}
          >
            <img
              src={`${API_BASE_URL}/v1/fileCustomer/download/${user.picture}`}
              alt={`${user.name} ${user.surname}`}
              className="w-24 h-24 rounded-full"
            />
            <h2 className="text-lg mt-2">{user.name}</h2>
            <p className="text-sm">{user.surname}</p>
          </div>
        ))}
      </div>

      {selectedUser && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="user-modal-title"
          aria-describedby="user-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              maxWidth: '1000px',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              overflowY: 'auto', // Permite el desplazamiento vertical
              overflowX: 'hidden',
            }}
          >
            <Button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16 }}>✕</Button>
            <Typography id="user-modal-title" variant="h6" component="h2">
              Usuario: {selectedUser.name} {selectedUser.surname}
            </Typography>
            <img
                src={`${API_BASE_URL}/v1/fileCustomer/download/${selectedUser.picture}`}
                alt={`${selectedUser.name} ${selectedUser.surname}`}
                className="w-24 h-24 rounded-full"
              />
            <div className="flex gap-4">
              
              <div className="flex flex-col gap-4 w-full">
                <input type="file" id="fileInput" accept="image/*" />
                <Button className='w-[320px]' variant="contained" color="primary" onClick={uploadImg}>Subir Imagen</Button>
                <TextField
                  label="Nombre"
                  value={name}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Apellido"
                  value={surname}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setSurname(e.target.value)}
                />
                <TextField
                  label="DNI"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setDNI(e.target.value)}
                />
                <TextField
                  label="Email"
                  value={email}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Usuario"
                  value={username}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  label="Password"
                  value={password}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="usuario" checked={roles.usuario} onChange={handleRoleChange} />}
                    label="Usuario no premiun"
                  />
                  <FormControlLabel
                    control={<Checkbox name="usuarioPremiun" checked={roles.usuarioPremiun} onChange={handleRoleChange} />}
                    label="Usuario Premiun"
                  />
                  <FormControlLabel
                    control={<Checkbox name="admin" checked={roles.admin} onChange={handleRoleChange} />}
                    label="Usuario admin"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={enableAccount} onChange={handleEnableAccountChange} />}
                    label="Cuenta Activada"
                  />
                </FormGroup>
              </div>
            </div>
            <div className='flex gap-5'>
            <Button variant="contained" style={{ marginTop: '16px' }} onClick={handleModify}>Modificar</Button>
            <Button variant="contained" color="secondary" style={{ marginTop: '16px' }} onClick={handleDelete}>Eliminar usuario</Button>
            </div>
           
          </Box>
        </Modal>
      )}
    </div>
  );

};

export default UserList;
