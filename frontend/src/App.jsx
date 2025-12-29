import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { Authenticator } from '@aws-amplify/ui-react';
import { uploadData, getUrl } from 'aws-amplify/storage';
import '@aws-amplify/ui-react/styles.css';

// 1. Core Config (S3 removed for now)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
      loginWith: { email: true }
    }
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_GRAPHQL_URL,
      region: import.meta.env.VITE_REGION,
      defaultAuthMode: 'userPool'
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_S3_BUCKET,
      region: import.meta.env.VITE_REGION
    }
  }
});

const client = generateClient();

const ADD_ITEM = `mutation Add($title: String!) {
  addItem(title: $title) { id title }
}`;

const GET_ITEMS = `query Get {
  getBucketList { id title }
}`;

const DELETE_ITEM = `mutation Delete($id: ID!) {
  deleteItem(id: $id) { id }
}`;

function AuthenticatedApp({ signOut }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null); // New state for the file

  const fetchItems = async () => {
    try {
      const { data } = await client.graphql({ query: GET_ITEMS });
      setItems(data.getBucketList || []);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!title) return;

    let imageUrl = null;

    // TRY FILE UPLOAD (Only if a file exists)
    if (file) {
      try {
        const result = await uploadData({
          path: `public/${Date.now()}_${file.name}`,
          data: file,
          options: { contentType: file.type }
        }).result;

        const urlData = await getUrl({ path: result.path });
        imageUrl = urlData.url.toString();
        console.log("Upload Success:", imageUrl);
      } catch (uploadError) {
        console.error("Upload failed, saving without image:", uploadError);
        alert("Image upload failed, but we will save your item text!");
      }
    }

    // SAVE TO DATABASE
    try {
      await client.graphql({
        query: ADD_ITEM, // Ensure your ADD_ITEM mutation includes imageUrl
        variables: { title, imageUrl }
      });
      setTitle('');
      setFile(null); // Reset file input
      fetchItems();
    } catch (dbError) {
      console.error("Database Save Error:", dbError);
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.graphql({
        query: DELETE_ITEM,
        variables: { id }
      });
      // Refresh the list after deleting
      fetchItems();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bucket List (v2: File Upload)</h1>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <input 
        placeholder="Item title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <button onClick={handleSave}>Save Item</button>

      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.imageUrl && <img src={item.imageUrl} width="50" alt="item" />}
            {item.title}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut }) => <AuthenticatedApp signOut={signOut} />}
    </Authenticator>
  );
}