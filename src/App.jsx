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

const styles = {
  container: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', fontFamily: '"Segoe UI", Roboto, sans-serif' },
  card: { width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', padding: '30px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  title: { fontSize: '22px', fontWeight: '800', color: '#1a202c', margin: 0 },
  exportBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  statsRow: { display: 'flex', gap: '15px', marginBottom: '25px' },
  statBoxBlue: { flex: 1, padding: '15px', borderRadius: '20px', backgroundColor: '#eef2ff', border: '1px solid #e0e7ff', textAlign: 'center' },
  statBoxGreen: { flex: 1, padding: '15px', borderRadius: '20px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', textAlign: 'center' },
  label: { display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' },
  val: { fontSize: '18px', fontWeight: '800', color: '#1e293b' },
  inputCard: { backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '25px', border: '1px solid #f1f5f9' },
  inputField: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '10px', outline: 'none', fontSize: '14px' },
  inputSmall: { width: '30%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  addBtn: { flex: 1, backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  resetLink: { width: '100%', marginTop: '30px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }
};
