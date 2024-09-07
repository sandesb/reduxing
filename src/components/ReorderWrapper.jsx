import React from 'react';
import { Reorder } from 'framer-motion';

const ReorderWrapper = ({ items, setItems, children }) => {
  return (
    <Reorder.Group axis="x" values={items} onReorder={setItems}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 20 }}
            dragElastic={1}
            style={{ cursor: 'grab' }}
          >
            {children(item)}
          </Reorder.Item>
        ))}
      </div>
    </Reorder.Group>
  );
};

export default ReorderWrapper;
