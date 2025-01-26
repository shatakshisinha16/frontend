import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (query === '') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/search?title=${query}&page=${page}&per_page=${perPage}`);
        setQuestions(response.data);
      } catch (err) {
        setError('Error fetching questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, page, perPage]);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
    setPage(1); 
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedQuestion(null);
  };

  const renderQuestionDetails = (question) => {
    if (question.type === 'MCQ' && question.options) {
      return (
        <div className="question-details">
          <h4>Options:</h4>
          {question.options.map((option, index) => (
            <p key={index} className={option.isCorrectAnswer ? 'correct' : 'incorrect'}>
              {option.isCorrectAnswer ? '✓' : '✗'} {option.text}
            </p>
          ))}
        </div>
      );
    } else if (question.type === 'ANAGRAM' && question.blocks) {
      return (
        <div className="question-details">
          <h4>Blocks:</h4>
          {question.blocks.map((block, index) => (
            <p key={index} className={block.isAnswer ? 'correct' : 'incorrect'}>
              {block.isAnswer ? '✓' : '✗'} {block.text}
            </p>
          ))}
          <h4>Solution: {question.solution}</h4>
        </div>
      );
    }
    return <div className="question-details"><p>{question.title}</p></div>;
  };

  return (
    <div className="container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Questions"
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {questions.length > 0 && !loading && (
        <div className="pagination">
          <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
            Previous
          </button>
          <button onClick={() => handlePageChange(page + 1)} disabled={questions.length < perPage}>
            Next
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="questions-grid">
          {questions.length > 0 ? (
            questions.map((question) => (
              <div className="question-card" key={question._id} onClick={() => handleQuestionClick(question)}>
                <h3>{question.title}</h3>
                <p>Type: {question.type}</p>
              </div>
            ))
          ) : (
            <p>No results found. Try a different search term.</p>
          )}
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {openModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Question Details</h2>
              <button className="close-btn" onClick={handleCloseModal}>X</button>
            </div>
            <div className="modal-body">
              {selectedQuestion && renderQuestionDetails(selectedQuestion)}
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
