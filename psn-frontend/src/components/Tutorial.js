import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Row, Col, ListGroup, Modal, Alert } from "react-bootstrap";
import { RiAddLine, RiEyeLine, RiEyeOffLine, RiEditLine, RiDeleteBinLine, RiQuestionLine, RiCheckLine, RiCloseLine, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuizTaker from "./QuizTaker";

function Tutorial() {
  const navigate = useNavigate();
  const [tutorialName, setTutorialName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userId] = useState(localStorage.getItem("psnUserId"));
  const [userEmail] = useState(localStorage.getItem("psnUserEmail"));
  const [showForm, setShowForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [tutorials, setTutorials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quizSearchQuery, setQuizSearchQuery] = useState("");
  
  // Quiz form states
  const [quizTitle, setQuizTitle] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "1"
    }
  ]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState({});

  const checkIfAdmin = useCallback(() => {
    if (userEmail === "admin123@gmail.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      console.log("User is not admin, should see Attend Quiz button");
    }
  }, [userEmail]);

  const fetchTutorials = useCallback(async () => {
    try {
      const token = localStorage.getItem("psnToken");
      const response = await axios.get("/api/v1/tutorials", {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.status === "success") {
        setTutorials(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      showErrorMessage("Error fetching tutorials");
    }
  }, []);

  const fetchQuizzes = useCallback(async () => {
    try {
      const token = localStorage.getItem("psnToken");
      const response = await axios.get("/api/v1/quizzes", {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.status === "success") {
        setQuizzes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      showErrorMessage("Error fetching quizzes");
    }
  }, []);

  const fetchQuizResults = useCallback(async () => {
    try {
      const token = localStorage.getItem("psnToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      console.log("Fetching quiz results for user:", userId);
      const response = await axios.get(`/api/v1/quiz-results/user/${userId}`, {
        headers: {
          Authorization: token,
        },
      });
      
      if (response.data.status === "success") {
        const results = {};
        response.data.data.forEach(result => {
          results[result.quizId] = result.score;
        });
        setQuizResults(results);
        console.log("Quiz results loaded:", results);
      } else {
        console.error("Failed to fetch quiz results:", response.data);
      }
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      navigate("/signin");
      return;
    }

    checkIfAdmin();
    fetchTutorials();
    fetchQuizResults();
    fetchQuizzes();
  }, [userId, navigate, checkIfAdmin, fetchTutorials, fetchQuizResults, fetchQuizzes]);

  const showSuccessMessage = (message) => {
    toast.success(message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const showErrorMessage = (message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tutorialName || !category || !description || !videoUrl) {
      showErrorMessage("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("psnToken");
      if (!token) {
        showErrorMessage("Please sign in to create a tutorial");
        navigate("/signin");
        return;
      }

      const response = await axios({
        method: "post",
        url: "/api/v1/tutorials",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
        data: (() => {
          const formData = new FormData();
          formData.append("tutorialName", tutorialName);
          formData.append("category", category);
          formData.append("description", description);
          formData.append("userId", userId);
          formData.append("videoUrl", videoUrl);
          return formData;
        })(),
      });

      if (response.data.status === "success") {
        showSuccessMessage("Tutorial created successfully!");
        resetForm();
        fetchTutorials();
      } else {
        showErrorMessage("Failed to create tutorial");
      }
    } catch (error) {
      console.error("Error creating tutorial:", error);
      showErrorMessage(error.response?.data?.message || "Error creating tutorial. Please try again.");
    }
  };

  const handleEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    setTutorialName(tutorial.tutorialName);
    setCategory(tutorial.category);
    setDescription(tutorial.description);
    setVideoUrl(tutorial.videoUrl);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!tutorialName || !category || !description || !videoUrl) {
      showErrorMessage("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("psnToken");
      const response = await axios({
        method: "put",
        url: `/api/v1/tutorials/${editingTutorial.id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
        data: (() => {
          const formData = new FormData();
          formData.append("tutorialName", tutorialName);
          formData.append("category", category);
          formData.append("description", description);
          formData.append("videoUrl", videoUrl);
          return formData;
        })(),
      });

      if (response.data.status === "success") {
        showSuccessMessage("Tutorial updated successfully!");
        resetForm();
        fetchTutorials();
      } else {
        showErrorMessage("Failed to update tutorial");
      }
    } catch (error) {
      console.error("Error updating tutorial:", error);
      showErrorMessage(error.response?.data?.message || "Error updating tutorial. Please try again.");
    }
  };

  const handleDelete = async (tutorialId) => {
    if (!window.confirm("Are you sure you want to delete this tutorial?")) {
      return;
    }

    try {
      const token = localStorage.getItem("psnToken");
      const response = await axios.delete(`/api/v1/tutorials/${tutorialId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status === "success") {
        showSuccessMessage("Tutorial deleted successfully!");
        fetchTutorials();
      } else {
        showErrorMessage("Failed to delete tutorial");
      }
    } catch (error) {
      console.error("Error deleting tutorial:", error);
      showErrorMessage(error.response?.data?.message || "Error deleting tutorial. Please try again.");
    }
  };

  const resetForm = () => {
    setTutorialName("");
    setCategory("");
    setDescription("");
    setVideoUrl("");
    setShowForm(false);
    setEditingTutorial(null);
  };

  const resetQuizForm = () => {
    setQuizTitle("");
    setQuizTime("");
    setQuestions([
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "1"
      }
    ]);
    setShowQuizForm(false);
    setEditingQuiz(null);
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const quizData = {
        title: quizTitle,
        timeLimit: parseInt(quizTime),
        userId: userId,
        questions: questions
      };

      const response = await axios.post("/api/v1/quizzes", quizData, {
        headers: {
          Authorization: localStorage.getItem("psnToken")
        }
      });

      if (response.data.status === "success") {
        toast.success("Quiz created successfully!");
        resetQuizForm();
        setShowQuizForm(false);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error(error.response?.data?.message || "Error creating quiz");
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "1"
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      showErrorMessage("You must have at least one question");
    }
  };

  const updateQuestion = (index, field, value) => {
    setQuestions(questions.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };

  const handleQuizUpdate = async (quizId) => {
    try {
      const token = localStorage.getItem("psnToken");
      const response = await axios.put(`/api/v1/quizzes/${quizId}`, {
        title: quizTitle,
        timeLimit: parseInt(quizTime),
        questions: questions
      }, {
        headers: {
          Authorization: token
        }
      });

      if (response.data.status === "success") {
        showSuccessMessage("Quiz updated successfully!");
        resetQuizForm();
        setShowQuizForm(false);
        setEditingQuiz(null);
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      showErrorMessage(error.response?.data?.message || "Error updating quiz");
    }
  };

  const handleQuizDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("psnToken");
      const response = await axios.delete(`/api/v1/quizzes/${quizId}`, {
        headers: {
          Authorization: token
        }
      });

      if (response.data.status === "success") {
        showSuccessMessage("Quiz deleted successfully!");
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      showErrorMessage(error.response?.data?.message || "Error deleting quiz");
    }
  };

  const handleQuizEdit = (quiz) => {
    setEditingQuiz(quiz);
    setQuizTitle(quiz.title);
    setQuizTime(quiz.timeLimit.toString());
    setQuestions(quiz.questions);
    setShowQuizForm(true);
  };

  const handleAttendQuiz = (quiz) => {
    console.log("Attend Quiz clicked for:", quiz.title);
    setSelectedQuiz(quiz);
    setShowQuizzes(false);
  };

  const handleQuizFinish = (quizId, score) => {
    setQuizResults({
      ...quizResults,
      [quizId]: score
    });
    setSelectedQuiz(null);
  };

  // Filter tutorials based on search query
  const filteredTutorials = tutorials.filter(tutorial => {
    const searchLower = searchQuery.toLowerCase();
    return (
      tutorial.tutorialName.toLowerCase().includes(searchLower) ||
      tutorial.category.toLowerCase().includes(searchLower) ||
      tutorial.description.toLowerCase().includes(searchLower)
    );
  });

  // Filter quizzes based on search query
  const filteredQuizzes = quizzes.filter(quiz => {
    const searchLower = quizSearchQuery.toLowerCase();
    return quiz.title.toLowerCase().includes(searchLower);
  });

  return (
    <div className="container py-4">
      <ToastContainer />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Tutorials & Quizzes</h1>
        <div>
          <Button 
            variant="outline-primary" 
            className="me-2"
            onClick={() => setShowQuizzes(!showQuizzes)}
          >
            {showQuizzes ? "Show Tutorials" : "Show Quizzes"}
          </Button>
          {isAdmin && (
            <Button 
              variant="primary" 
              onClick={() => showQuizzes ? setShowQuizForm(true) : setShowForm(true)}
            >
              {showQuizzes ? "Create Quiz" : "Create Tutorial"}
            </Button>
          )}
        </div>
      </div>

      {!showQuizzes ? (
        <>
          {/* Tutorial Search Bar */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <RiSearchLine />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search tutorials by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tutorial List */}
          <Row>
            {filteredTutorials.length > 0 ? (
              filteredTutorials.map((tutorial) => (
                <Col key={tutorial.id} md={6} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h4>{tutorial.tutorialName}</h4>
                          <p className="text-muted">Category: {tutorial.category}</p>
                          <p>{tutorial.description}</p>
                          <div className="d-flex gap-2">
                            {tutorial.videoUrl && (
                              <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                Watch Tutorial
                              </a>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <div>
                            <Button
                              variant="outline-primary"
                              className="me-2"
                              onClick={() => handleEdit(tutorial)}
                            >
                              <RiEditLine /> Edit
                            </Button>
                            
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="info">No tutorials found. {searchQuery && "Try a different search term."}</Alert>
              </Col>
            )}
          </Row>
        </>
      ) : (
        <>
          {/* Quiz Search Bar */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <RiSearchLine />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search quizzes by title..."
                value={quizSearchQuery}
                onChange={(e) => setQuizSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quiz List */}
          <Row>
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <Col key={quiz.id} md={6} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h4>{quiz.title}</h4>
                          <p className="text-muted">Time Limit: {quiz.timeLimit} minutes</p>
                          {quizResults[quiz.id] !== undefined && (
                            <div className="mt-2">
                              <Alert variant={quizResults[quiz.id] >= 70 ? "success" : "warning"}>
                                Your Score: {quizResults[quiz.id]}%
                              </Alert>
                            </div>
                          )}
                        </div>
                        <div>
                          {isAdmin && (
                            <>
                              <Button
                                variant="outline-primary"
                                className="me-2"
                                onClick={() => handleQuizEdit(quiz)}
                              >
                                <RiEditLine /> Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleQuizDelete(quiz.id)}
                              >
                                <RiDeleteBinLine /> Delete
                              </Button>
                            </>
                          )}
                          {!isAdmin && quizResults[quiz.id] === undefined && (
                            <Button
                              variant="success"
                              onClick={() => handleAttendQuiz(quiz)}
                            >
                              Attend Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="info">No quizzes found. {quizSearchQuery && "Try a different search term."}</Alert>
              </Col>
            )}
          </Row>
        </>
      )}

      {showForm && isAdmin && (
        <Card className="shadow mb-4">
          <Card.Header className="bg-success text-white">
            <h3 className="mb-0">{editingTutorial ? "Edit Tutorial" : "Add New Tutorial"}</h3>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={editingTutorial ? handleUpdate : handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tutorial Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter tutorial name"
                      value={tutorialName}
                      onChange={(e) => setTutorialName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter tutorial description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Video URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100">
                {editingTutorial ? <><RiEditLine /> Update Tutorial</> : <><RiAddLine /> Add Tutorial</>}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {showQuizForm && isAdmin && (
        <Card className="shadow mb-4">
          <Card.Header className="bg-success text-white">
            <h3 className="mb-0">{editingQuiz ? "Edit Quiz" : "Add New Quiz"}</h3>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={(e) => {
              e.preventDefault();
              if (editingQuiz) {
                handleQuizUpdate(editingQuiz.id);
              } else {
                handleQuizSubmit(e);
              }
            }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quiz Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter quiz title"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Time Limit (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      placeholder="Enter time limit in minutes"
                      value={quizTime}
                      onChange={(e) => setQuizTime(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {questions.map((q, index) => (
                <Card key={index} className="mb-4 border-success">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Question {index + 1}</h5>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      <RiDeleteBinLine /> Remove
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Question</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter your question"
                        value={q.question}
                        onChange={(e) => updateQuestion(index, "question", e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Option 1</Form.Label>
                          <div className="d-flex">
                            <Form.Control
                              type="text"
                              placeholder="Enter option 1"
                              value={q.option1}
                              onChange={(e) => updateQuestion(index, "option1", e.target.value)}
                              required
                            />
                            <Form.Check
                              type="radio"
                              name={`correctAnswer-${index}`}
                              id={`option1-${index}`}
                              className="ms-2"
                              checked={q.correctAnswer === "1"}
                              onChange={() => updateQuestion(index, "correctAnswer", "1")}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Option 2</Form.Label>
                          <div className="d-flex">
                            <Form.Control
                              type="text"
                              placeholder="Enter option 2"
                              value={q.option2}
                              onChange={(e) => updateQuestion(index, "option2", e.target.value)}
                              required
                            />
                            <Form.Check
                              type="radio"
                              name={`correctAnswer-${index}`}
                              id={`option2-${index}`}
                              className="ms-2"
                              checked={q.correctAnswer === "2"}
                              onChange={() => updateQuestion(index, "correctAnswer", "2")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Option 3</Form.Label>
                          <div className="d-flex">
                            <Form.Control
                              type="text"
                              placeholder="Enter option 3"
                              value={q.option3}
                              onChange={(e) => updateQuestion(index, "option3", e.target.value)}
                              required
                            />
                            <Form.Check
                              type="radio"
                              name={`correctAnswer-${index}`}
                              id={`option3-${index}`}
                              className="ms-2"
                              checked={q.correctAnswer === "3"}
                              onChange={() => updateQuestion(index, "correctAnswer", "3")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Option 4</Form.Label>
                          <div className="d-flex">
                            <Form.Control
                              type="text"
                              placeholder="Enter option 4"
                              value={q.option4}
                              onChange={(e) => updateQuestion(index, "option4", e.target.value)}
                              required
                            />
                            <Form.Check
                              type="radio"
                              name={`correctAnswer-${index}`}
                              id={`option4-${index}`}
                              className="ms-2"
                              checked={q.correctAnswer === "4"}
                              onChange={() => updateQuestion(index, "correctAnswer", "4")}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              <div className="d-flex justify-content-between mb-3">
                <Button variant="outline-success" onClick={addQuestion}>
                  <RiAddLine /> Add Another Question
                </Button>
              </div>

              <Button variant="success" type="submit" className="w-100">
                {editingQuiz ? <><RiEditLine /> Update Quiz</> : <><RiAddLine /> Add Quiz</>}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {selectedQuiz && (
        <QuizTaker 
          quiz={selectedQuiz} 
          onFinish={handleQuizFinish} 
        />
      )}
    </div>
  );
}

export default Tutorial; 