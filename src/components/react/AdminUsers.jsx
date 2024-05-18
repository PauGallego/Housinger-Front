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

  return (
    <div>
      <h1>User List</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {users.map(user => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '150px',
            }}
            onClick={() => handleOpen(user)}
          >
            <img
              src={`${API_BASE_URL}/v1/fileCustomer/download/${user.picture}`}
              alt={`${user.name} ${user.surname}`}
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
            <h2 style={{ fontSize: '16px', margin: '10px 0 5px' }}>{user.name}</h2>
            <p style={{ margin: 0 }}>{user.surname}</p>
            <Button variant="contained" onClick={() => handleOpen(user)}>Ver Detalles</Button>
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
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Button onClick={handleClose} style={{ position: 'absolute', top: 16, right: 16 }}>✕</Button>
            <Typography id="user-modal-title" variant="h6" component="h2">
              Usuario: {selectedUser.name} {selectedUser.surname}
            </Typography>
            <img
              src={`${API_BASE_URL}/v1/fileCustomer/download/${selectedUser.picture}`}
              alt={`${selectedUser.name} ${selectedUser.surname}`}
              style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '16px 0' }}
            />
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
            <Button variant="contained" style={{ marginTop: '16px' }} onClick={handleModify}>Modificar</Button>
            <Button variant="contained" color="secondary" style={{ marginTop: '16px' }} onClick={handleDelete}>Eliminar usuario</Button>
          </Box>
        </Modal>
      )}
    </div>
  );

};

export default UserList;
