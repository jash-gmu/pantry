import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './index.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [addItemOpen, setAddItemOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5001/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async () => {
    try {
      const response = await axios.post('http://localhost:5001/items', { name: newItemName, quantity: newItemQuantity });
      setItems([...items, response.data]);
      setNewItemName('');
      setNewItemQuantity('');
      setAddItemOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const updateItem = async (id, quantity) => {
    try {
      await axios.put(`http://localhost:5001/items/${id}`, { quantity });
      setItems(items.map(item => (item.id === id ? { ...item, quantity } : item)));
      setEditItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className="app">
      <div className="navbar">
        <Typography variant="h6" className="navbar-title">
          Pantry Tracker
        </Typography>
        <Button 
          onClick={() => setAddItemOpen(true)} 
          startIcon={<AddIcon />} 
          variant="contained" 
          style={{ backgroundColor: '#4caf50', color: 'black' }}
        >
          Add Item
        </Button>
      </div>
      <div className="inventory-list">
        {items.map(item => (
          <div className="inventory-item" key={item.id}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography color="textSecondary">Quantity: {item.quantity}</Typography>
            <div className="item-actions">
              <IconButton onClick={() => setEditItem(item)}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton onClick={() => deleteItem(item.id)}>
                <DeleteIcon color="secondary" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      {editItem && (
        <Dialog open={Boolean(editItem)} onClose={() => setEditItem(null)}>
          <DialogTitle>Edit Item Quantity</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the quantity for {editItem.name}.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={editItem.quantity}
              onChange={(e) => {
                const quantity = parseInt(e.target.value, 10);
                setEditItem({ ...editItem, quantity });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditItem(null)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => updateItem(editItem.id, editItem.quantity)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={addItemOpen} onClose={() => setAddItemOpen(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details for the new item.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addItem} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventory;
