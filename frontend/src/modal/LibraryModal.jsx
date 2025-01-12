import React from 'react';

const subjects = [
  { name: 'Health', colors: ['from-[#FAD0C4]', 'to-[#ff9aba]'] },
  { name: 'History', colors: ['from-[#FFE29F]', 'to-[#FFA99F]'] },
  { name: 'Science', colors: ['from-[#84FAB0]', 'to-[#8FD3F4]'] },
  { name: 'Literature', colors: ['from-[#c4e6fa]', 'to-[#8fb7f2]'] },
  { name: 'Geography', colors: ['from-[#FECFEF]', 'to-[#b39ff5]'] },
  { name: 'Art', colors: ['from-[#efffa1]', 'to-[#60ebb6]'] },
];

function LibraryModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end pb-[10%] justify-center z-50" onClick={() => onClose()}>
      <div className="bg-[#e7dfd8] rounded-t-2xl w-full max-w-md max-h-[65vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-1 bg-gray-300 rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-[#384649]">Choose From Library</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subject, index) => (
              <button
                key={index}
                className={`rounded-lg overflow-hidden aspect-[3/2] ${subject.colors[0]} ${subject.colors[1]} bg-gradient-to-b`}
                onClick={() => {
                  console.log(`${subject.name} card pressed`);
                  onClose(subject.name);
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-white text-lg font-bold drop-shadow-md">
                    {subject.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          className="w-full bg-white text-[#384649] font-bold py-3 mt-4"
          onClick={() => onClose()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default LibraryModal;


