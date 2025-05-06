// src/pages/ManageUsers.jsx
//merging admindashboard and manageusers
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, useToast, Tag, IconButton, HStack, Input, Flex,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormLabel, useDisclosure, Skeleton, SkeletonText, Text, AlertDialog,
  AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import axios from '../services/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon, EditIcon, DownloadIcon, AddIcon } from '@chakra-ui/icons';
import * as XLSX from 'xlsx';

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [form, setForm] = useState({ name: '', email: '' });
  const [userToDelete, setUserToDelete] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    // eslint-disable-next-line no-unused-vars
    isOpen: isPasswordOpen,
    // eslint-disable-next-line no-unused-vars
    onOpen: onPasswordOpen,
    // eslint-disable-next-line no-unused-vars
    onClose: onPasswordClose
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const cancelRef = useRef();

  useEffect(() => {
    if (!user?.token || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [user]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(u =>
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users/admin', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(data);
    } catch {
      toast({ title: 'Failed to fetch users', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (u) => {
    setUserToDelete(u);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/admin/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter(u => u._id !== userToDelete._id));
      toast({ title: 'User deleted', status: 'info' });
    } catch (err) {
      toast({ title: 'Delete failed', description: err.response?.data?.message, status: 'error' });
    } finally {
      onDeleteClose();
      setUserToDelete(null);
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const { data } = await axios.put(`/api/users/admin/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.map(u => (u._id === id ? { ...u, role: data.role } : u)));
      toast({ title: `Role changed to ${data.role}`, status: 'success' });
    } catch (err) {
      toast({ title: 'Role update failed', description: err.response?.data?.message, status: 'error' });
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'eventease_users.xlsx');
  };

  const handleEditOpen = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email });
    onEditOpen();
  };

  const handleEditSubmit = async () => {
    try {
      const payload = { ...form };
      if (resetPassword.trim()) payload.password = resetPassword.trim();

      const { data } = await axios.put(`/api/users/admin/${editUser._id}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.map(u => (u._id === data._id ? data : u)));
      toast({ title: 'User updated', status: 'success' });
      onEditClose();
      setResetPassword('');
    } catch (err) {
      toast({ title: 'Edit failed', description: err.response?.data?.message, status: 'error' });
    }
  };

  const handleAddSubmit = async () => {
    try {
      const { data } = await axios.post('/api/users/admin', newUser, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers([...users, data]);
      toast({ title: 'User added', status: 'success' });
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      onAddClose();
    } catch (err) {
      toast({ title: 'Add failed', description: err.response?.data?.message, status: 'error' });
    }
  };

  if (loading) {
    return (
      <Box maxW="6xl" mx="auto" mt={10} p={6}>
        <Skeleton height="40px" mb={4} />
        <SkeletonText mt="4" noOfLines={8} spacing="4" />
      </Box>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" mt={10} p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="teal.600">Admin Dashboard - Users</Heading>
        <HStack spacing={4}>
          <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} width="250px" />
          <Button colorScheme="green" onClick={onAddOpen} leftIcon={<AddIcon />}>Add User</Button>
          <Button colorScheme="blue" onClick={handleExport} leftIcon={<DownloadIcon />}>Export Excel</Button>
        </HStack>
      </Flex>

      <Heading size="md" mb={4}>Total Users: {users.length}</Heading>

      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((u) => (
            <Tr key={u._id}>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>
                <Tag
                  colorScheme={u.role === 'admin' ? 'purple' : 'gray'}
                  width="70px"
                  justifyContent="center"
                  textTransform="capitalize"
                >
                  {u.role}
                </Tag>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    minW="90px"
                    colorScheme={u.role === 'admin' ? 'gray' : 'purple'}
                    onClick={() => handleToggleRole(u._id, u.role)}
                    isDisabled={u._id === user._id}
                  >
                    {u.role === 'admin' ? 'Demote' : 'Promote'}
                  </Button>
                  <IconButton icon={<EditIcon />} colorScheme="green" size="sm" aria-label="Edit user" onClick={() => handleEditOpen(u)} />
                  {u._id !== user._id && (
                    <IconButton icon={<DeleteIcon />} colorScheme="red" size="sm" onClick={() => confirmDeleteUser(u)} aria-label="Delete user" />
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Delete Confirmation */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete User</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Yes, Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Reset Password</FormLabel>
              <Input
                placeholder="New password (optional)"
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>Save</Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleAddSubmit}>Create</Button>
            <Button variant="ghost" onClick={onAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageUsers;
