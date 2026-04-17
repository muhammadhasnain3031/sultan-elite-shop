import React, { useState, useEffect } from 'react';
import ListItem from './ListItem';

export default function App() {
  // 1. Shuru mein check karna ke kya pehle se koi data para hai?
  const [fruits, setFruits] = useState(() => {
    const savedFruits = localStorage.getItem('sultan_inventory');
    return savedFruits ? JSON.parse(savedFruits) : [];
  });

  const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem('sultan_sales');
    return savedSales ? Number(savedSales) : 0;
  });

  const [inputValue, setInputValue] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // 2. Jab bhi 'fruits' change hon, unhein save kar lo
  useEffect(() => {
    localStorage.setItem('sultan_inventory', JSON.stringify(fruits));
  }, [fruits]);

  // 3. Jab bhi 'sales' change hon, unhein save kar lo
  useEffect(() => {
    localStorage.setItem('sultan_sales', sales.toString());
  }, [sales]);

  const addFruit = () => {
    if (inputValue && inputPrice && quantity) {
      setFruits([...fruits, { id: Date.now(), text: inputValue, price: Number(inputPrice), quantity: Number(quantity) }]);
      setInputValue(""); setInputPrice(""); setQuantity("");
    }
  };

  const sellOne = (id) => {
    const target = fruits.find(f => f.id === id);
    if (target && target.quantity > 0) {
      setSales(prev => prev + target.price);
      setFruits(fruits.map(f => f.id === id ? { ...f, quantity: f.quantity - 1 } : f));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sultan's Elite Shop 🛒</h1>
        <div style={styles.statBox}>
           <span style={styles.statLabel}>Total Sales (Saved)</span>
           <span style={styles.statValue}>Rs. {sales.toLocaleString()}</span>
        </div>

        <div style={styles.inputSection}>
          <input style={styles.inputMain} placeholder="Item Name..." value={inputValue} onChange={e => setInputValue(e.target.value)} />
          <div style={styles.inputSmallRow}>
            <input style={styles.inputSmall} type="number" placeholder="Price" value={inputPrice} onChange={e => setInputPrice(e.target.value)} />
            <input style={styles.inputSmall} type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} />
            <button style={styles.addBtn} onClick={addFruit}>Add</button>
          </div>
        </div>

        <div style={styles.listContainer}>
          {fruits.map(f => (
            <ListItem 
              key={f.id} 
              data={f} 
              onSell={() => sellOne(f.id)} 
              onAdd={() => setFruits(fruits.map(x => x.id === f.id ? {...x, quantity: x.quantity + 1} : x))} 
              onDelete={() => setFruits(fruits.filter(x => x.id !== f.id))} 
            />
          ))}
        </div>
        
        {fruits.length > 0 && (
          <button 
            onClick={() => { if(confirm("Clear all data?")) { localStorage.clear(); window.location.reload(); } }}
            style={{marginTop: '20px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px'}}
          >
            Reset Shop Data
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' },
  card: { maxWidth: '450px', margin: '0 auto', backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' },
  title: { textAlign: 'center', color: '#1e293b', marginBottom: '20px' },
  statBox: { backgroundColor: '#eff6ff', padding: '15px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px', border: '1px solid #bfdbfe' },
  statLabel: { display: 'block', fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' },
  statValue: { fontSize: '22px', fontWeight: '800', color: '#1e3a8a' },
  inputSection: { background: '#f8fafc', padding: '15px', borderRadius: '15px', marginBottom: '20px' },
  inputMain: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '10px', boxSizing: 'border-box' },
  inputSmallRow: { display: 'flex', gap: '10px' },
  inputSmall: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' },
  addBtn: { backgroundColor: '#1e3a8a', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px' }
};
