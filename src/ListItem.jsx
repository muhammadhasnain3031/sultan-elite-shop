import React from 'react';

export default function ListItem({ data, onSell, onAdd, onDelete }) {
  const isLow = data.quantity < 5;
  const isVip = data.price > 2000;

  return (
    <div style={{...lStyles.wrapper, borderLeftColor: isVip ? '#fbbf24' : '#0ea5e9'}}>
      <div style={lStyles.info}>
        <span style={{...lStyles.name, color: isVip ? '#b45309' : '#1e293b'}}>
          {data.text} {isVip ? '⭐' : '🍏'}
        </span>
        <span style={{...lStyles.stock, color: isLow ? '#ef4444' : '#64748b'}}>
          {isLow ? '⚠️ Low Stock: ' : '📦 Stock: '} {data.quantity}
        </span>
      </div>

      <div style={lStyles.actions}>
        <div style={lStyles.priceTag}>Rs. {data.price}</div>
        <div style={lStyles.btnGroup}>
          <button onClick={onAdd} style={lStyles.addBtn}>+</button>
          <button onClick={onSell} disabled={data.quantity <= 0} style={lStyles.sellBtn}>Sell 💸</button>
          <button onClick={onDelete} style={lStyles.delBtn}>×</button>
        </div>
      </div>
    </div>
  );
}

const lStyles = {
  wrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9', borderLeft: '5px solid' },
  info: { display: 'flex', flexDirection: 'column' },
  name: { fontSize: '16px', fontWeight: 'bold' },
  stock: { fontSize: '12px' },
  actions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' },
  priceTag: { fontWeight: 'bold', color: '#0ea5e9' },
  btnGroup: { display: 'flex', gap: '5px' },
  addBtn: { padding: '5px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer' },
  sellBtn: { backgroundColor: '#0ea5e9', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' },
  delBtn: { background: 'none', border: 'none', color: '#cbd5e1', fontSize: '18px', cursor: 'pointer' }
};
