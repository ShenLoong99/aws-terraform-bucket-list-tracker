import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { Authenticator, useTheme, View, Text, Heading, Button as AmplifyButton } from '@aws-amplify/ui-react';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Plus, Trash2, LogOut, Image as ImageIcon, CheckCircle } from 'lucide-react';
import '@aws-amplify/ui-react/styles.css';

// 1. Core Config (Same as before)
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

const ADD_ITEM = `mutation Add($title: String!, $imageUrl: String) {
  addItem(title: $title, imageUrl: $imageUrl) { id title imageUrl }
}`;

const GET_ITEMS = `query Get {
  getBucketList { id title imageUrl }
}`;

const DELETE_ITEM = `mutation Delete($id: ID!) {
  deleteItem(id: $id) { id }
}`;

function AuthenticatedApp({ signOut }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchItems = async () => {
    try {
      const { data } = await client.graphql({ query: GET_ITEMS });
      setItems(data.getBucketList || []);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!title) return;
    setIsUploading(true);

    let imageUrl = null;

    if (file) {
      try {
        const result = await uploadData({
          path: `public/${Date.now()}_${file.name}`,
          data: file,
          options: { contentType: file.type }
        }).result;

        const urlData = await getUrl({ path: result.path });
        imageUrl = urlData.url.toString();
      } catch (uploadError) {
        console.error("Upload failed:", uploadError);
        alert("Image upload failed, saving text only.");
      }
    }

    try {
      await client.graphql({
        query: ADD_ITEM,
        variables: { title, imageUrl }
      });
      setTitle('');
      setFile(null);
      fetchItems();
    } catch (dbError) {
      console.error("Database Save Error:", dbError);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this from your list?")) return;
    try {
      await client.graphql({ query: DELETE_ITEM, variables: { id } });
      fetchItems();
    } catch (err) { console.error("Delete Error:", err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <CheckCircle size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">BucketList</span>
          </div>
          <button 
            onClick={signOut}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Input Card */}
        <section className="bg-white rounded-2xl shadow-sm border p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" /> Add New Adventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <input 
                placeholder="Where to next? (e.g. Northern Lights)" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button 
                onClick={handleSave}
                disabled={isUploading || !title}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-blue-200"
              >
                {isUploading ? 'Saving...' : 'Add to List'}
              </button>
            </div>
            
            <div className="relative group">
              <label className="flex flex-col items-center justify-center w-full h-32 md:h-full border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 group-hover:bg-slate-100 transition-all group-hover:border-blue-400">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <div className="text-center px-4">
                      <CheckCircle className="text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 truncate max-w-[200px]">{file.name}</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">Attach a photo</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-shadow group">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon size={40} strokeWidth={1} />
                  </div>
                )}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full shadow-sm transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 leading-tight">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">Your bucket list is empty. Start dreaming!</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Custom styles for the Authenticator
const components = {
  Header() {
    return (
      <View textAlign="center" padding="large">
        <Heading level={3}>BucketList Tracker</Heading>
        <Text color="gray">Sign in to manage your dreams</Text>
      </View>
    );
  }
};

export default function App() {
  return (
    <Authenticator components={components} loginMechanisms={['email']}>
      {({ signOut }) => <AuthenticatedApp signOut={signOut} />}
    </Authenticator>
  );
}