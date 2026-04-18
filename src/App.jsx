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

  const totalInventoryValue = fruits.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    localStorage.setItem('sultan_inventory', JSON.stringify(fruits));
  }, [fruits]);

  useEffect(() => {
    localStorage.setItem('sultan_sales', sales.toString());
  }, [sales]);

  const exportToExcel = () => {
    if (fruits.length === 0 && sales === 0) return alert("Report ke liye data zaroori hai!");
    let csv = "data:text/csv;charset=utf-8,Item Name,Price,Stock,Total Value\n";
    fruits.forEach(f => {
      csv += `${f.text},${f.price},${f.quantity},${f.price * f.quantity}\n`;
    });
    csv += `\nSUMMARY\nTotal Sales,Rs. ${sales}\nInventory Value,Rs. ${totalInventoryValue}`;
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "Sultan_Elite_Report.csv";
    link.click();
  };

  const addFruit = () => {
    if (inputValue && inputPrice && quantity) {
      setFruits([...fruits, { id: Date.now(), text: inputValue, price: Number(inputPrice), quantity: Number(quantity) }]);
      setInputValue(""); setInputPrice(""); setQuantity("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>Sultan's Elite Shop 🛒</h1>
          <button onClick={exportToExcel} style={styles.exportBtn}>📊 Download Report</button>
        </header>
        
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

        <div style={styles.inputCard}>
          <input style={styles.inputField} placeholder="Item Name (e.g. Honda Civic)" value={inputValue} onChange={e => setInputValue(e.target.value)} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={styles.inputSmall} type="number" placeholder="Price" value={inputPrice} onChange={e => setInputPrice(e.target.value)} />
            <input style={styles.inputSmall} type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} />
            <button style={styles.addBtn} onClick={addFruit}>Add Item</button>
          </div>
        </div>

        <div style={styles.listContainer}>
          {fruits.map(f => (
            <ListItem key={f.id} data={f} onSell={() => {
                if (f.quantity > 0) {
                    setSales(prev => prev + f.price);
                    setFruits(fruits.map(x => x.id === f.id ? { ...x, quantity: x.quantity - 1 } : x));
                }
            }} onAdd={() => setFruits(fruits.map(x => x.id === f.id ? {...x, quantity: x.quantity + 1} : x))} onDelete={() => setFruits(fruits.filter(x => x.id !== f.id))} />
          ))}
        </div>
        
        <button onClick={() => { if(confirm("Data reset?")) { localStorage.clear(); window.location.reload(); } }} style={styles.resetLink}>Reset All Data</button>
      </div>
    </div>
  );
}

// Styles ko bas thora upgrade kiya hai, functionality wahi hai
const styles = {
  container: { backgroundColor: '#0f172a', minHeight: '100vh', padding: '15px', display: 'flex', justifyContent: 'center', fontFamily: 'Inter, sans-serif' },
  card: { width: '100%', maxWidth: '480px', backgroundColor: '#ffffff', padding: '25px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: 0, letterSpacing: '-0.5px' },
  
  // Indigo Premium Button
  exportBtn: { backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)' },
  
  statsRow: { display: 'flex', gap: '12px', marginBottom: '20px' },
  statBoxBlue: { flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', textAlign: 'center' },
  statBoxGreen: { flex: 1, padding: '16px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' },
  label: { display: 'block', fontSize: '10px', fontWeight: '800', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' },
  val: { fontSize: '18px', fontWeight: '900', color: '#0f172a' },
  
  // Inputs (Wahi logic jo aapne di, bas border thora clean)
  inputCard: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '18px', marginBottom: '25px', border: '1px solid #e2e8f0' },
  inputField: { color:'black', width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #cbd5e1', marginBottom: '10px', outline: 'none', fontSize: '14px', backgroundColor: '#fff' },
  inputSmall: { color:'black', width: '32%', padding: '12px', borderRadius: '10px', border: '2px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#fff' },
  addBtn: { flex: 1, backgroundColor: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' },
  
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' },
  resetLink: { width: '100%', marginTop: '25px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }
};
