import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import HootList from './components/HootList/HootList';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';
import CommentForm from './components/CommentForm/CommentForm';


import { UserContext } from './contexts/UserContext';
import * as hootService from './services/hootService';

const App = () => {
  const { user } = useContext(UserContext);
  const [hoots, setHoots] = useState([]);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots]);
    navigate('/hoots');
  };

  const handleDeleteHoot = async (hootId) => {
    const deletedHoot = await hootService.deleteHoot(hootId);
    setHoots(hoots.filter((hoot) => hoot._id !== deletedHoot._id));
    navigate('/hoots');
  };

  const handleUpdateHoot = async (hootId, hootFormData) => {
    // keep the order! don't mess up the order of the hoot 
    const updatedHoot = await hootService.updateHoot(hootId, hootFormData);
    setHoots(hoots.map((hoot) => hootId === hoot._id ? updatedHoot : hoot));
    navigate(`/hoots/${hootId}`);
  };

  const handleDeleteComment = async (commentId) => {
    const deletedComment = await hootService.deleteComment(commentId);
    setComments(comments.filter((comment) => comment._id !== deletedComment._id));
    navigate(`/hoots/${hootId}/comments`);
  };
  

  useEffect(() => {
    const fetchAllHoots = async() => {
      const hootsData = await hootService.index();
      setHoots(hootsData);
    }; 
    if (user) fetchAllHoots();
    }, [user]); // useEffect depends on users , add user dependency, this is from useContext

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            {/* Protected routes (available only to signed-in users) */}
            <Route path='/hoots' element={<HootList hoots={hoots} />} />
            <Route path='/hoots/new' element={<HootForm handleAddHoot={handleAddHoot}/>} />
            <Route path='/hoots/:hootId' element={<HootDetails handleDeleteHoot={handleDeleteHoot} />} />
            <Route path='/hoots/:hootId/edit' element={<HootForm handleUpdateHoot={handleUpdateHoot} />} />
            <Route path='/hoots/:hootId/comments/:commentId' element={<CommentForm handleDeleteComment={handleDeleteComment} /> } />
            <Route path='/hoots/:hootId/comments/:commentId/edit' element={<CommentForm />} />
          </>
        ) : (
          <>
            {/* Non-user routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
