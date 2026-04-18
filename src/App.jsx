import React, { useState, useEffect } from 'react';
import ListItem from './ListItem';

export default function App() {
  // --- DATA LOADING ---
  const [fruits, setFruits] = useState(() => {
    const saved = localStorage.getItem('sultan_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('sultan_sales');
    return saved ? Number(saved) : 0;
  });

  // --- INPUT STATES ---
  const [inputValue, setInputValue] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // --- CALCULATIONS ---
  const totalInventoryValue = fruits.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- AUTO-SAVE ---
  useEffect(() => {
    localStorage.setItem('sultan_inventory', JSON.stringify(fruits));
  }, [fruits]);

  useEffect(() => {
    localStorage.setItem('sultan_sales', sales.toString());
  }, [sales]);

  // --- EXPORT TO EXCEL (With Date) ---
  const exportToExcel = () => {
    if (fruits.length === 0 && sales === 0) return alert("Report ke liye data zaroori hai!");
    
    const reportDate = new Date().toLocaleString();
    let csv = `Sultan Elite Shop - Business Report\nGenerated on: ${reportDate}\n\n`;
    csv += "Item Name,Price,Stock,Total Value\n";
    
    fruits.forEach(f => {
      csv += `${f.text},${f.price},${f.quantity},${f.price * f.quantity}\n`;
    });
    
    csv += `\nSUMMARY\nTotal Sales,Rs. ${sales}\nInventory Value,Rs. ${totalInventoryValue}`;
    
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = `Sultan_Report_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  // --- ADD ITEM LOGIC ---
  const addFruit = () => {
    if (inputValue && inputPrice && quantity) {
      setFruits([...fruits, { 
        id: Date.now(), 
        text: inputValue, 
        price: Number(inputPrice), 
        quantity: Number(quantity) 
      }]);
      setInputValue(""); 
      setInputPrice(""); 
      setQuantity("");
    } else {
      alert("Bhai, sari fields bharna zaroori hain!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Sultan's Elite Shop 🛒</h1>
            <p style={{fontSize: '11px', color: '#94a3b8', margin: 0}}>Premium Inventory Management</p>
          </div>
          <button onClick={exportToExcel} style={styles.exportBtn}>📊 Download Report</button>
        </header>
        
        {/* Sales & Stock Dashboard */}
        <div style={styles.statsRow}>
           <div style={styles.statBoxBlue}>
              <span style={styles.label}>TOTAL SALES</span>
              <span style={styles.val}>Rs. {sales.toLocaleString()}</span>
           </div>
           <div style={styles.statBoxGreen}>
              <span style={styles.label}>INVENTORY VALUE</span>
              <span style={styles.val}>Rs. {totalInventoryValue.toLocaleString()}</span>
           </div>
        </div>

        {/* Inventory Input Card */}
        <div style={styles.inputCard}>
          <label style={styles.fieldLabel}>Item Description</label>
          <input 
            style={styles.inputField} 
            placeholder="e.g. Honda Civic" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
          />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{flex: 1}}>
               <label style={styles.fieldLabel}>Price</label>
               <input style={styles.inputSmall} type="number" placeholder="0" value={inputPrice} onChange={e => setInputPrice(e.target.value)} />
            </div>
            <div style={{flex: 1}}>
               <label style={styles.fieldLabel}>Qty</label>
               <input style={styles.inputSmall} type="number" placeholder="0" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <button style={styles.addBtn} onClick={addFruit}>Add Item</button>
          </div>
        </div>

        {/* Items List Section */}
        <div style={styles.listContainer}>
          <h3 style={{fontSize: '14px', color: '#1e293b', marginBottom: '10px'}}>Active Stock:</h3>
          {fruits.length === 0 && <p style={{textAlign: 'center', color: '#94a3b8', fontSize: '13px'}}>Dukan khali hai!</p>}
          {fruits.map(f => (
            <ListItem 
              key={f.id} 
              data={f} 
              onSell={() => {
                if (f.quantity > 0) {
                    setSales(prev => prev + f.price);
                    setFruits(fruits.map(x => x.id === f.id ? { ...x, quantity: x.quantity - 1 } : x));
                }
              }} 
              onAdd={() => setFruits(fruits.map(x => x.id === f.id ? {...x, quantity: x.quantity + 1} : x))} 
              onDelete={() => {
                if(confirm("Ye item delete kar dein?")) {
                  setFruits(fruits.filter(x => x.id !== f.id));
                }
              }} 
            />
          ))}
        </div>
        
        {/* Reset Button at Bottom */}
        <button onClick={() => { if(confirm("Kya aap waqayi saara data reset karna chahte hain?")) { localStorage.clear(); window.location.reload(); } }} style={styles.resetLink}>
            🗑️ Reset All Shop Data
        </button>
      </div>
    </div>
  );
}

// --- ELITE STYLING ---
const styles = {
  container: { backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '15px', display: 'flex', justifyContent: 'center', fontFamily: '"Inter", sans-serif' },
  card: { width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', padding: '25px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
  title: { fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: 0 },
  exportBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '20px' },
  statBoxBlue: { flex: 1, padding: '15px', borderRadius: '16px', backgroundColor: '#eff6ff', border: '1px solid #3b82f6', textAlign: 'center' },
  statBoxGreen: { flex: 1, padding: '15px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1px solid #22c55e', textAlign: 'center' },
  label: { display: 'block', fontSize: '10px', fontWeight: '800', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' },
  val: { fontSize: '17px', fontWeight: '900', color: '#1e293b' },
  inputCard: { backgroundColor: '#f8fafc', padding: '18px', borderRadius: '18px', marginBottom: '20px', border: '1px solid #e2e8f0' },
  fieldLabel: { fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '5px', display: 'block' },
  inputField: { color:'black', width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #cbd5e1', marginBottom: '12px', outline: 'none', fontSize: '14px', backgroundColor: '#fff', boxSizing: 'border-box' },
  inputSmall: { color:'black', width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#fff', boxSizing: 'border-box' },
  addBtn: { height: '46px', marginTop: '18px', padding: '0 20px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '13px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto', paddingRight: '5px' },
  resetLink: { width: '100%', marginTop: '25px', background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }
};
