const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('./inventory-f6234-firebase-adminsdk-o0mz8-8173b73b88.json'); // Replace with the correct path to your service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/items', async (req, res) => {
  try {
    const snapshot = await db.collection('inventory').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = req.body;
    const docRef = await db.collection('inventory').add(newItem);
    res.status(201).send({ id: docRef.id, ...newItem });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    await db.collection('inventory').doc(id).update({ quantity });
    res.status(200).send(`Item with id ${id} updated`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('inventory').doc(id).delete();
    res.status(200).send(`Item with id ${id} deleted`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
