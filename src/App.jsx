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

  // Inventory ki total value nikalne ka formula
  const totalInventoryValue = fruits.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
        
        {/* Statistics Row */}
        <div style={styles.statsRow}>
           <div style={{...styles.statBox, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe'}}>
              <span style={styles.statLabel}>Total Sales</span>
              <span style={{...styles.statValue, color: '#1e3a8a'}}>Rs. {sales.toLocaleString()}</span>
           </div>
           <div style={{...styles.statBox, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0'}}>
              <span style={{...styles.statLabel, color: '#16a34a'}}>Inventory Value</span>
              <span style={{...styles.statValue, color: '#15803d'}}>Rs. {totalInventoryValue.toLocaleString()}</span>
           </div>
        </div>

        <div style={styles.inputSection}>
          <input style={styles.inputMain} placeholder="Item Name (e.g. Honda Civic)" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={styles.inputSmall} type="number" placeholder="Price" value={inputPrice} onChange={e => setInputPrice(e.target.value)} />
            <input style={styles.inputSmall} type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} />
            <button style={styles.addBtn} onClick={addFruit}>Add Item</button>
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
        
        <div style={{textAlign: 'center', marginTop: '40px'}}>
            <button 
              onClick={() => { if(confirm("Kya aap saara data (Sales aur Inventory) khatam karna chahte hain?")) { localStorage.clear(); window.location.reload(); } }}
              style={styles.resetBtn}
            >
              🗑️ Reset All Shop Data
            </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f8fafc', minHeight: '100vh', padding: '15px', display: 'flex', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' },
  card: { width: '100%', maxWidth: '550px', backgroundColor: '#fff', padding: '25px', borderRadius: '28px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', alignSelf: 'start' },
  title: { textAlign: 'center', color: '#0f172a', fontSize: '28px', fontWeight: '900', marginBottom: '25px' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '25px' },
  statBox: { flex: 1, padding: '18px', borderRadius: '20px', textAlign: 'center' },
  statLabel: { display: 'block', fontSize: '11px', color: '#3b82f6', fontWeight: '800', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.5px' },
  statValue: { fontSize: '20px', fontWeight: '800' },
  inputSection: { background: '#f1f5f9', padding: '20px', borderRadius: '20px', marginBottom: '25px', border: '1px solid #e2e8f0' },
  inputMain: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '12px', boxSizing: 'border-box', fontSize: '15px', outline: 'none' },
  inputSmall: { width: '30%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' },
  addBtn: { flex: 1, backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', transition: '0.2s' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  resetBtn: { color: '#ef4444', background: '#fff1f2', border: '1px solid #fecdd3', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }
};
