import React, { useEffect, useState } from 'react';

function App() {
  const [buttonText, setButtonText] = useState('로딩 중...');

  useEffect(() => {
    // 백엔드에서 값 받아오기
    fetch('http://localhost:8081/api/button-label')
      .then((res) => res.json())
      .then((data) => setButtonText(data.label))
      .catch((err) => {
        console.error(err);
        setButtonText('에러 발생');
      });
  }, []);

  const handleClick = () => {
    alert(`현재 버튼 텍스트: ${buttonText}`);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#5e2bd7ff'
    }}>
      <div style={{
        width: '700px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
      <button
        onClick={handleClick}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          cursor: 'pointer',
          borderRadius: '6px',
          
          border: '1px solid #ccc',
          backgroundColor: '#e9a3fbff',
          color: 'white'
        }}
      >
        {buttonText}
      </button>
      <button
        onClick={handleClick}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          cursor: 'pointer',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: '#f8af27ff',
          color: 'white'
        }}
      >
        {buttonText+'2'}
      </button>
      <svg width="200" height="200">
      <circle cx="100" cy="60" r="50" fill="#fcd5ce" /> {/* 얼굴 */}
      <circle cx="80" cy="50" r="5" fill="#000" /> {/* 왼쪽 눈 */}
      <circle cx="120" cy="50" r="5" fill="#000" /> {/* 오른쪽 눈 */}
      <path d="M80 80 Q100 100 120 80" stroke="#000" fill="transparent" /> {/* 입 */}
    </svg>
      </div>
    </div>
  );
}

export default App;
