import React, { useState, useEffect } from 'react';
import ListItem from './ListItem';

export default function App() {
  const [fruits, setFruits] = useState(() => {
    const saved = localStorage.getItem("sultan_shop_data");
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem("sultan_sales");
    return savedSales ? Number(savedSales) : 0;
  });

  const [inputValue, setInputValue] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    localStorage.setItem("sultan_shop_data", JSON.stringify(fruits));
    localStorage.setItem("sultan_sales", sales.toString());
  }, [fruits, sales]);

  const addFruit = () => {
    if (inputValue && inputPrice && quantity) {
      setFruits([...fruits, {
        id: Date.now(),
        text: inputValue,
        price: Number(inputPrice),
        quantity: Number(quantity)
      }]);
      setInputValue(""); setInputPrice(""); setQuantity("");
    } else {
      alert("Sultan bhai, details poori bharein! ⚠️");
    }
  };

  const sellOne = (id) => {
    const target = fruits.find(f => f.id === id);
    if (target && target.quantity > 0) {
      setSales(prev => (Number(prev) || 0) + Number(target.price));
      setFruits(fruits.map(f => f.id === id ? { ...f, quantity: f.quantity - 1 } : f));
    }
  };

  const addStock = (id) => {
    setFruits(fruits.map(f => f.id === id ? { ...f, quantity: f.quantity + 1 } : f));
  };

  const deleteItem = (id) => setFruits(fruits.filter(f => f.id !== id));

  const totalWorth = fruits.reduce((acc, f) => acc + (Number(f.price) * Number(f.quantity)), 0);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sultan's Elite Shop 🛒</h1>
        
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Inventory Worth 📊</span>
            <span style={styles.statValue}>Rs. {totalWorth.toLocaleString()}</span>
          </div>
          <div style={{...styles.statBox, backgroundColor: '#e0f2fe', borderColor: '#0ea5e9'}}>
            <span style={{...styles.statLabel, color: '#0369a1'}}>Total Sales 📈</span>
            <span style={{...styles.statValue, color: '#0369a1'}}>Rs. {sales.toLocaleString()}</span>
          </div>
        </div>

        <div style={styles.inputSection}>
          <input 
            style={styles.inputMain} 
            placeholder="Item Name (e.g., Honda)" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
          />
          <div style={styles.inputSmallRow}>
            <input 
              style={styles.inputSmall} 
              type="number" 
              placeholder="Price" 
              value={inputPrice} 
              onChange={e => setInputPrice(e.target.value)} 
            />
            <input 
              style={styles.inputSmall} 
              type="number" 
              placeholder="Qty" 
              value={quantity} 
              onChange={e => setQuantity(e.target.value)} 
            />
            {/* Professional Navy Blue Add Button */}
            <button style={styles.addBtn} onClick={addFruit}>Add +</button>
          </div>
        </div>

        <div style={styles.listContainer}>
          {fruits.map(f => (
            <ListItem key={f.id} data={f} onSell={() => sellOne(f.id)} onAdd={() => addStock(f.id)} onDelete={() => deleteItem(f.id)} />
          ))}
        </div>

        {fruits.length > 0 && (
          <button style={styles.resetBtn} onClick={() => window.confirm("Reset All Inventory Data?") && setFruits([])}>
            🔄 Reset Shop Data
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '15px', fontFamily: '"Inter", sans-serif', color: '#1e293b' },
  card: { maxWidth: '480px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' },
  title: { textAlign: 'center', color: '#0f172a', fontSize: '26px', fontWeight: '800', marginBottom: '25px' },
  statsRow: { display: 'flex', gap: '15px', marginBottom: '25px' },
  statBox: { flex: 1, padding: '15px', borderRadius: '18px', border: '1px solid #e2e8f0', textAlign: 'center' },
  statLabel: { display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: '18px', fontWeight: '800', color: '#0f172a' },
  inputSection: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '18px', marginBottom: '25px' },
  inputMain: { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '12px', boxSizing: 'border-box', fontSize: '15px', color: '#1e293b', backgroundColor: '#fff' },
  inputSmallRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  inputSmall: { flex: '1 1 80px', padding: '12px 15px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#1e293b', backgroundColor: '#fff', minWidth: '0' },
  // Professional Navy Blue Add Button
  addBtn: { backgroundColor: '#1e3a8a', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', flexShrink: 0, boxShadow: '0 4px 10px rgba(30, 58, 138, 0.2)' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  resetBtn: { width: '100%', marginTop: '30px', padding: '14px', background: 'none', border: '1px solid #f87171', color: '#f87171', borderRadius: '14px', cursor: 'pointer', fontWeight: '600' }
};
