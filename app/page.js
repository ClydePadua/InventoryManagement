'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { 
  Box, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Grid, 
  TextField, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material'
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'

export default function Home() {
  
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) =>{
      inventoryList.push({
        name: doc.id,
       ...doc.data(),
      })
    })

    setInventory(inventoryList)
  }

  const addItem = async () => {
    if (!itemName) {
      alert("Please enter an item name");
      return;
    }

    const docRef = doc(collection(firestore, 'inventory'), itemName)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity: existingQuantity} = docSnap.data()
      await setDoc(docRef, {quantity: existingQuantity + quantity})
    } else {
      await setDoc(docRef, {quantity: quantity})
    }
    await updateInventory()
    setOpen(false)
    setItemName('')
    setQuantity(1)
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item )
    await deleteDoc(docRef)
    await updateInventory()
  }
  
  const incrementQuantity = async (itemName) => {
    const docRef = doc(collection(firestore, 'inventory'), itemName)
    const docSnap = await getDoc(docRef)

  
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }

  const decrementQuantity = async (itemName) => {
    const docRef = doc(collection(firestore, 'inventory'), itemName)
    const docSnap = await getDoc(docRef)
  
    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if(quantity > 1) {
        await setDoc(docRef, {quantity: quantity - 1})
      } else {
        await deleteDoc(docRef)
      }
    }
    await updateInventory()
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredInventory = inventory.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <Box sx={{
      padding: 5,
      backgroundColor: '#f0f0f0', // light gray background
      borderRadius: 10,
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h4" component="h4" sx={{
      marginBottom: 5,
      color: '#333', // dark gray text
      fontWeight: 'bold',
      textAlign: 'center' // add this line
    }}>
      Inventory Management
    </Typography>
      <Button variant="contained" onClick={handleOpen} sx={{
        marginBottom: 5,
        backgroundColor: '#4CAF50', // green background
        color: '#fff', // white text
        '&:hover': {
          backgroundColor: '#3e8e41'
        }
      }}>
        Add Item
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
          Add Item
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the item name and quantity.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Item Name"
            type="text"
            fullWidth
            variant="standard"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{
              '& .MuiInput-underline:before': {
                borderBottomColor: '#4CAF50'
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: '#4CAF50'
              }
            }}
          />
          <TextField
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            sx={{
              '& .MuiInput-underline:before': {
                borderBottomColor: '#4CAF50'
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: '#4CAF50'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{
            color: '#4CAF50'
          }}>
            Cancel
          </Button>
          <Button onClick={addItem} sx={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#3e8e41'
            }
          }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        margin="dense"
        id="search"
        label="Search"
        type="text"
        fullWidth
        variant="standard"
        value={searchTerm}
        onChange={handleSearch}
        sx={{
          '& .MuiInput-underline:before': {
            borderBottomColor: '#4CAF50'
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#4CAF50'
          }
        }}
      />
      <TableContainer component={Paper} sx={{
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        borderRadius: 10
      }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
                Item Name
              </TableCell>
              <TableCell align="right" sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
                Quantity
              </TableCell>
              <TableCell align="right" sx={{ backgroundColor: '#4CAF50', color: '#fff' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow
                key={item.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="primary" onClick={() => incrementQuantity(item.name)} sx={{ marginRight: 2 }}>
                    + 
                  </Button>
                  <Button variant="contained" color="error" onClick={() => decrementQuantity(item.name)} sx={{ marginRight: 2 }}>
                    - 
                  </Button>
                  <Button variant="contained" color="error" onClick={() => removeItem(item.name)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}