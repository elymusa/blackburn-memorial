import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
export default App;

const Page = React.forwardRef((props, ref) => {
  const { person } = props;
  const biographyRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    const bioElement = biographyRef?.current;
    if (bioElement) {
      // Show button if user has scrolled down more than 100px
      if (bioElement.scrollTop > 100) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    }
  };

  const scrollTop = () => {
    if (biographyRef.current) {
      biographyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // This effect attaches the scroll listener to the biography element
  useEffect(() => {
    const bioElement = biographyRef?.current;
    if (bioElement) {
      bioElement.addEventListener('scroll', checkScrollTop);
      return () => bioElement.removeEventListener('scroll', checkScrollTop);
    }
  }, []);

  return (
    <div className="page" ref={ref}>


      <div className="biography-container">
        <p className="biography" ref={biographyRef}>{person.biography}</p>
        {showScroll && (
          <button onClick={scrollTop} className="back-to-top-button" title="Back to Top">
            ↑
          </button>
        )}
      </div>

    </div>
  );
});


// This component is the main view of the memorial book
const BookView = () => {
  const [people, setPeople] = useState([]);
  const bookRef = useRef();
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5001/api/people')
      .then(response => setPeople(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const goToNextPerson = () => {
    setCurrentPersonIndex((prevIndex) => (prevIndex + 1) % people.length);
  };

  const goToPreviousPerson = () => {
    setCurrentPersonIndex((prevIndex) => (prevIndex - 1 + people.length) % people.length);
  };

    return (
    <>
         {people.length > 0 && people[currentPersonIndex] ? (
        <Page key={people[currentPersonIndex]._id} person={people[currentPersonIndex]} />
      ) : (
        <p>Loading...</p> // Or some other placeholder
      )}
    </>
  );
}

// This is now the main App component that handles all routing
function App() {
  const [people, setPeople] = useState([]); // Define people state
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0); // Define currentPersonIndex state

  // These functions need to be defined in App component to be accessible
  const goToNextPerson = () => {
    setCurrentPersonIndex((prevIndex) => (prevIndex + 1) % people.length);
  };

  const goToPreviousPerson = () => {
    setCurrentPersonIndex((prevIndex) => (prevIndex - 1 + people.length) % people.length);
  };

  return (
    
    <div className="App">
     {/* Only render Page and buttons if people array is not empty */}
     {people.length > 0 && (
       <Page key={people[currentPersonIndex]._id} person={people[currentPersonIndex]} />
     )}
      <button onClick={goToPreviousPerson}>Previous</button>
      <button onClick={goToNextPerson}>Next</button>


      {/* Add the new static title here */}
      <h1 className="main-title">Welcome to the Blackburn Elders Website</h1>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <Link to="/login" className="admin-link">Admin Login</Link>
      </div>
      <Routes>
        <Route path="/" element={
          <div className="book-container">
            <BookView />
          </div>
        } />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/admin" element={<DashboardPage />} />
      </Route>
    </Routes>
    </div>
  );
}