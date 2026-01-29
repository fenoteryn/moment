import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import logoImg from './logo.png'; 

// --- 관리자 페이지 ---
function AdminPage() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.userId === 'admin') {
      setAdmin(currentUser);
      const users = JSON.parse(localStorage.getItem('userList')) || [];
      setUserList(users);
    } else {
      alert("관리자만 접근할 수 있습니다.");
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleDeleteUser = (targetId) => {
    if (window.confirm(`${targetId} 회원을 삭제하시겠습니까?`)) {
      const updatedList = userList.filter(user => user.userId !== targetId);
      setUserList(updatedList);
      localStorage.setItem('userList', JSON.stringify(updatedList));
    }
  };

  const handleVisitUser = (targetUser) => {
    navigate('/main/'+targetUser, { state: { visitedUser: targetUser } });
  };

  if (!admin) return <div>로딩중...</div>;

  return (
    <div className="main-white-page admin-bg">
      <div className="admin-container">
        <div className="admin-header">
          <h1>관리자 페이지 🛠️</h1>
          <button className="logout-btn small" onClick={handleLogout}>로그아웃</button>
        </div>
        <p>현재 가입된 회원 수: <strong>{userList.length}</strong>명</p>
        <table className="user-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>생년월일</th>
              <th>아이디</th>
              <th>비밀번호</th>
              {/* [수정] 순서 변경: 홈피 -> 관리 */}
              <th>홈피</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {userList.length > 0 ? (
              userList.map((user, index) => (
                <tr key={index}>
                  <td>{user.userName}</td>
                  <td>{user.userBirth}</td>
                  <td>{user.userId}</td>
                  <td>{user.userPw}</td>
                  {/* [수정] 순서 변경: 방문 버튼 -> 삭제 버튼 */}
                  <td>
                    <button className="visit-btn" onClick={() => handleVisitUser(user.userId)}>방문</button>
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteUser(user.userId)}>삭제</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">가입된 회원이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 메인 페이지 ---
function MainPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [user, setUser] = useState(null);
  const [isVisitorMode, setIsVisitorMode] = useState(false);

  useEffect(() => {
    if (location.state && location.state.visitedUser) {
      setUser(location.state.visitedUser); 
      setIsVisitorMode(true); 
    } else {
      const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
      if (loggedInUser) {
        setUser(loggedInUser);
      } else {
        alert("로그인이 필요합니다.");
        navigate('/');
      }
    }
  }, [navigate, location.state]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    alert("로그아웃 되었습니다.");
    navigate('/');
  };

  if (!user) return <div>로딩중...</div>;

  return (
    <div className="main-white-page">
      <h1>모먼트 프로젝트 ~ </h1>
      <p> 미영아 이제 뭘 하면 돼 ? <strong>{user.userName}</strong>님!</p>
      <p>우리 맛난 거 먹울래 ??</p>
      
      {isVisitorMode ? (
        <button className="logout-btn return-admin" onClick={() => navigate('/admin')}>
          관리자 페이지로 돌아가기
        </button>
      ) : (
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      )}
    </div>
  );
}

// --- 로그인 페이지 ---
function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === 'admin' && pw === '1234') {
      const adminUser = { userName: '관리자', userId: 'admin' };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      navigate('/admin'); 
      return;
    }

    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    const foundUser = userList.find(user => user.userId === id && user.userPw === pw);

    if (foundUser) {
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      navigate('/main');
    } else {
      setShowPopup(true);
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="logo-area">
          <img src={logoImg} alt="MOMENT Logo" className="logo-img" />
        </div>
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <input type="text" className="input-field" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
          <input type="password" className="input-field" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} />
          <div className="button-group">
            <button type="submit" className="login-btn">로그인</button>
            <button type="button" className="membership" onClick={() => navigate('/signup')}>회원가입</button>
          </div>
          <div className="find-links" onClick={() => navigate('/find')}>
            아이디 / 비밀번호 찾기
          </div>
        </form>
      </div>
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-text">아이디 또는 비밀번호가<br/>일치하지 않습니다.</p>
            <button className="modal-close-btn" onClick={closePopup}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 아이디/비밀번호 찾기 페이지 ---
function FindAccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('id');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [id, setId] = useState('');
  const [modalInfo, setModalInfo] = useState({ show: false, message: '' });

  const handleFind = (e) => {
    e.preventDefault();
    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    
    if (activeTab === 'id') {
      if (!name || !birth) {
        setModalInfo({ show: true, message: "이름과 생년월일을 입력해주세요." });
        return;
      }
      const found = userList.find(u => u.userName === name && u.userBirth === birth);
      if (found) {
        setModalInfo({ show: true, message: `${name}님의 아이디는\n[ ${found.userId} ] 입니다.` });
      } else {
        setModalInfo({ show: true, message: "일치하는 회원 정보가 없습니다." });
      }
    } else {
      if (!name || !birth || !id) {
        setModalInfo({ show: true, message: "모든 정보를 입력해주세요." });
        return;
      }
      const found = userList.find(u => u.userName === name && u.userId === id && u.userBirth === birth);
      if (found) {
        setModalInfo({ show: true, message: `${name}님의 비밀번호는\n[ ${found.userPw} ] 입니다.` });
      } else {
        setModalInfo({ show: true, message: "일치하는 회원 정보가 없습니다." });
      }
    }
  };

  const closeModal = () => setModalInfo({ ...modalInfo, show: false });

  return (
    <div className="login-wrapper">
      <div className="login-box signup-box">
        <h2>아이디/비밀번호 찾기</h2>
        <div className="tab-group">
          <button className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`} onClick={() => setActiveTab('id')}>아이디 찾기</button>
          <button className={`tab-btn ${activeTab === 'pw' ? 'active' : ''}`} onClick={() => setActiveTab('pw')}>비밀번호 찾기</button>
        </div>
        <form onSubmit={handleFind} style={{marginTop: '20px'}}>
          <input type="text" className="input-field" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="date" className="input-field" value={birth} onChange={(e) => setBirth(e.target.value)} />
          {activeTab === 'pw' && (
            <input type="text" className="input-field" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
          )}
          <div className="button-group">
            <button type="submit" className="login-btn">찾기</button>
            <button type="button" className="membership" onClick={() => navigate('/')}>취소</button>
          </div>
        </form>
      </div>
      {modalInfo.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-text" style={{whiteSpace: 'pre-wrap'}}>{modalInfo.message}</p>
            <button className="modal-close-btn" onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 회원가입 페이지 ---
function SignupPage() {
  const [newName, setNewName] = useState('');
  const [newBirth, setNewBirth] = useState('');
  const [newId, setNewId] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const handleSignup = (e) => {
    e.preventDefault();
    if (!newName || !newBirth || !newId || !newPw) {
      setWarningMsg("모든 빈칸을 채워주세요.");
      setShowWarningPopup(true); 
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem('userList')) || [];
    if (existingUsers.some(user => user.userId === newId)) {
      setWarningMsg("이미 사용 중인 아이디입니다.");
      setShowWarningPopup(true); 
      return;
    }
    const newUser = { userName: newName, userBirth: newBirth, userId: newId, userPw: newPw };
    localStorage.setItem('userList', JSON.stringify([...existingUsers, newUser]));
    setShowSuccessPopup(true); 
  };

  const closeSuccessPopup = () => { setShowSuccessPopup(false); navigate('/'); };
  const closeWarningPopup = () => setShowWarningPopup(false);

  return (
    <div className="login-wrapper">
      <div className="login-box signup-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSignup}>
          <input type="text" className="input-field" placeholder="이름" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input 
            type="date" 
            className="input-field" 
            value={newBirth} 
            min="1900-01-01" 
            max={today}
            onChange={(e) => setNewBirth(e.target.value)} 
          />
          <input type="text" className="input-field" placeholder="아이디 생성" value={newId} onChange={(e) => setNewId(e.target.value)} />
          <input type="password" className="input-field" placeholder="비밀번호 생성" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          <div className="button-group">
            <button type="submit" className="login-btn">가입완료</button>
            <button type="button" className="membership" onClick={() => navigate('/')}>취소</button>
          </div>
        </form>
      </div>
      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-text">회원가입이 완료되었습니다!<br/>로그인 해주세요.</p>
            <button className="modal-close-btn" onClick={closeSuccessPopup}>확인</button>
          </div>
        </div>
      )}
      {showWarningPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-text">{warningMsg}</p>
            <button className="modal-close-btn" onClick={closeWarningPopup}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/find" element={<FindAccountPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;