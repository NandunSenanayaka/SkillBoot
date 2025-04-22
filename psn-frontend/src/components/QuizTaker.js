import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, Button, Form, ProgressBar, Alert } from "react-bootstrap";
import { RiTimeLine, RiCheckLine, RiCloseLine } from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";

function QuizTaker({ quiz, onFinish }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60); // Convert minutes to seconds
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);
  const userId = localStorage.getItem("psnUserId");

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (currentQuestionIndex / quiz.questions.length) * 100;

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Move to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    if (isFinished) return;
    
    setIsFinished(true);
    const correctAnswers = quiz.questions.reduce((count, q, index) => {
      return count + (answers[index] === q.correctAnswer ? 1 : 0);
    }, 0);
    
    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(calculatedScore);

    try {
      const token = localStorage.getItem("psnToken");
      if (!token) {
        console.error("No auth token found");
        toast.error("Authentication error. Please sign in again.");
        return;
      }

      console.log("Saving quiz result:", {
        quizId: quiz.id,
        userId: userId,
        score: calculatedScore,
        answers: answers
      });

      const response = await axios.post("/api/v1/quiz-results", {
        quizId: quiz.id,
        userId: userId,
        score: calculatedScore,
        answers: answers
      }, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === "success") {
        console.log("Quiz result saved successfully:", response.data);
        onFinish(quiz.id, calculatedScore);
      } else {
        console.error("Failed to save quiz result:", response.data);
        toast.error("Failed to save quiz result");
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      toast.error("Error saving quiz result");
    }
  }, [quiz, answers, isFinished, userId, onFinish]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmit]);

  // Get current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  // If quiz is finished, show score
  if (isFinished) {
    return (
      <Card className="shadow mb-4">
        <Card.Header className="bg-success text-white">
          <h3 className="mb-0">Quiz Results</h3>
        </Card.Header>
        <Card.Body className="text-center">
          <h1 className="display-4 mb-4">{score}%</h1>
          <Alert variant={score >= 70 ? "success" : "warning"}>
            {score >= 70 
              ? "Congratulations! You passed the quiz." 
              : "You didn't pass the quiz. Try to improve your knowledge."}
          </Alert>
          <div className="mt-4">
            <h4>Question Review</h4>
            {quiz.questions.map((question, index) => (
              <Card key={index} className="mb-3">
                <Card.Header className={answers[index] === question.correctAnswer ? "bg-success text-white" : "bg-danger text-white"}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Question {index + 1}</span>
                    {answers[index] === question.correctAnswer ? 
                      <RiCheckLine size={24} /> : 
                      <RiCloseLine size={24} />
                    }
                  </div>
                </Card.Header>
                <Card.Body>
                  <p><strong>{question.question}</strong></p>
                  <p>Your answer: {question[`option${answers[index]}`]}</p>
                  {answers[index] !== question.correctAnswer && (
                    <p className="text-success">Correct answer: {question[`option${question.correctAnswer}`]}</p>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow mb-4">
      <Card.Header className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{quiz.title}</h3>
          <div className="d-flex align-items-center">
            <RiTimeLine className="me-2" />
            <span className="h4 mb-0">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <ProgressBar now={progressPercentage} className="mb-4" />
        
        <div className="mb-4">
          <h4>Question {currentQuestionIndex + 1} of {quiz.questions.length}</h4>
          <p className="lead">{currentQuestion.question}</p>
        </div>
        
        <Form>
          {[1, 2, 3, 4].map((optionNum) => (
            <Form.Check
              key={optionNum}
              type="radio"
              id={`option-${optionNum}`}
              label={currentQuestion[`option${optionNum}`]}
              name="question-options"
              checked={answers[currentQuestionIndex] === optionNum.toString()}
              onChange={() => handleAnswerSelect(currentQuestionIndex, optionNum.toString())}
              className="mb-3 p-3 border rounded"
            />
          ))}
        </Form>
        
        <div className="d-flex justify-content-between mt-4">
          <Button 
            variant="outline-primary" 
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button 
              variant="success" 
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quiz.questions.length || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Finish Quiz"}
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleNextQuestion}
              disabled={!answers[currentQuestionIndex]}
            >
              Next
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default QuizTaker; 