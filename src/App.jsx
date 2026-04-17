import React, { useState, useEffect } from 'react';
import ListItem from './ListItem';

export default function App() {
  const [fruits, setFruits] = useState(() => {
    const saved = localStorage.getItem('sultan_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('sultan_sales');
    return saved ? Number(saved) : 0;
  });

  const [inputValue, setInputValue] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    localStorage.setItem('sultan_inventory', JSON.stringify(fruits));
  }, [fruits]);

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
          <div style={{ display: 'flex', gap: '8px' }}>
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
        
        {/* Reset Option - Fixed Position */}
        <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button 
              onClick={() => { if(confirm("Kya aap saara data khatam karna chahte hain?")) { localStorage.clear(); window.location.reload(); } }}
              style={styles.resetBtn}
            >
              🗑️ Reset Shop Inventory
            </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '10px', display: 'flex', justifyContent: 'center' },
  card: { width: '100%', maxWidth: '480px', backgroundColor: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', alignSelf: 'start', marginTop: '10px' },
  title: { textAlign: 'center', color: '#1e293b', fontSize: '24px', fontWeight: '800' },
  statBox: { backgroundColor: '#eff6ff', padding: '15px', borderRadius: '16px', textAlign: 'center', marginBottom: '20px', border: '1px solid #bfdbfe' },
  statLabel: { display: 'block', fontSize: '12px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' },
  statValue: { fontSize: '24px', fontWeight: '800', color: '#1e3a8a' },
  inputSection: { background: '#f8fafc', padding: '15px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #e2e8f0' },
  inputMain: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' },
  inputSmall: { width: '30%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' },
  addBtn: { flex: 1, backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  resetBtn: { color: '#ef4444', background: '#fee2e2', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }
};
