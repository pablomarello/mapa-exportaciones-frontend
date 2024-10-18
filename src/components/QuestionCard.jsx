import React, { useState, useEffect } from 'react';
import { getAllPreguntas } from '../api/preguntas.api';
import { getAllRespuestasIncorrectas } from '../api/respuestasIncorrectas';
import Swal from 'sweetalert2';
//import { questions as questionsData } from "../data";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export const QuestionCard = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      try {
        const preguntas = await getAllPreguntas();
        const respuestasIncorrectas = await getAllRespuestasIncorrectas();
  
        const combinedQuestions = preguntas.map((pregunta) => {
          // Encuentra las respuestas incorrectas que corresponden a la pregunta actual
          const respuestas = respuestasIncorrectas
            .filter((respuesta) => respuesta.question_inc === pregunta.id)
            .map((respuesta) => respuesta.answer_incorrect); 
  
          return {
            ...pregunta,
            incorrect_answer: respuestas, // Añade las respuestas incorrectas a la pregunta
          };
        })
        
       // Filtra las preguntas que tienen al menos una respuesta incorrecta
       .filter((pregunta) => pregunta.incorrect_answer.length > 0);
       
  
        setQuestions(shuffleArray(combinedQuestions));
      } catch (error) {
        console.error("Error al cargar preguntas y respuestas:", error);
      }
    };
  
    fetchQuestionsAndAnswers();
  }, []);
  
  // funcion usada para extraer las preguntas del archivo data.js
  /* const handleRestart = () => {
    setQuestions(shuffleArray([...questionsData])); // Mezcla las preguntas de nuevo
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowResult(false);
  }; */

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const answers = [...currentQuestion.incorrect_answer, currentQuestion.correct_answer];
      setShuffledAnswers(shuffleArray(answers));
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerClick = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correct_answer;
    setSelectedAnswer(answer);
    setIsAnswerCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        if (score + (correct ? 1 : 0) === questions.length) {
          Swal.fire({
            title: '¡Felicidades, ganaste!',
            text: `Respuestas correctas: ${score + (correct ? 1 : 0)} de ${questions.length}`,
            imageUrl: '/imagenes/congrat.gif',
            imageWidth: 400,
            imageHeight: 200,
            confirmButtonText: 'Volver a jugar'
          }).then(() => {
            handleRestart();
          });
        } else {
          Swal.fire({
            title: 'Gracias por participar',
            text: `Suerte la próxima. Respuestas correctas: ${score + (correct ? 1 : 0)} de ${questions.length}`,
            confirmButtonText: 'Volver a jugar'
          }).then(() => {
            handleRestart();
          });
        }
      }
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    }, 4000);
  };

  const handleRestart = () => {
    // Refresca las preguntas desde la API nuevamente
    const fetchQuestionsAndAnswers = async () => {
      try {
        const preguntas = await getAllPreguntas();
        const respuestasIncorrectas = await getAllRespuestasIncorrectas();

       

        const combinedQuestions = preguntas.map((pregunta) => {
          return {
            ...pregunta,
            incorrect_answer: respuestasIncorrectas
              .filter((respuesta) => respuesta.question_inc === pregunta.id)
              .map((respuesta) => respuesta.answer_incorrect),
          };
        });

        setQuestions(shuffleArray(combinedQuestions));
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setShowResult(false);
      } catch (error) {
        console.error("Error al reiniciar el juego:", error);
      }
    };

    fetchQuestionsAndAnswers();
  };

  if (questions.length === 0) {
    return <div>Cargando...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className=" relative flex flex-col w-full h-auto max-w-3xl mx-auto p-4 rounded-lg shadow-md mt-2 mb-2">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500 font-neue">{currentQuestionIndex + 1} de {questions.length}</span>
      </div>
      <div className="text-center mb-6">
        <p className="text-xl font-semibold font-neue">
          {currentQuestion.question}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {shuffledAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            className={`px-6 py-3 rounded-2xl font-medium font-neue ${
              selectedAnswer === answer
                ? isAnswerCorrect
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
                : selectedAnswer && answer === currentQuestion.correct_answer
                ? 'bg-green-600 text-white'
                : 'bg-morado text-white'
            }`}
            disabled={selectedAnswer !== null}
          >
            {answer}
          </button>
        ))}
      </div>
      <div className="text-right ">
        <button
          onClick={handleRestart}
          className="font-neue shadow-lg border text-black px-4 py-2 rounded-xl font-medium"
        >
          Reiniciar juego
        </button>
      </div>
    </div>
  );
};
