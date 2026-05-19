import { Level, Question } from '../types';

export const QUESTION_BANK: Record<string, Record<Level, Question[]>> = {
  html: {
    kids: [
      { id: 'h_k_1', question: 'Which tag is used to make text bold (like a superhero)?', options: ['<bold>', '<b>', '<stronger>', '<heavy>'], answer: 'B' },
      { id: 'h_k_2', question: 'What does HTML stand for in the world of web magic?', options: ['Hot Mail', 'HyperText Markup Language', 'Happy Text Making List', 'High Tech Magic Lamp'], answer: 'B' },
      { id: 'h_k_3', question: 'Which tag is used to show a picture?', options: ['<pic>', '<draw>', '<img>', '<photo>'], answer: 'C' },
    ],
    elementary: [
      { id: 'h_e_1', question: 'Which attribute provides alternate text for an image?', options: ['title', 'alt', 'src', 'longdesc'], answer: 'B' },
      { id: 'h_e_2', question: 'What is the correct tag for a large heading?', options: ['<head>', '<h6>', '<heading>', '<h1>'], answer: 'D' },
    ],
    highschool: [
      { id: 'h_h_1', question: 'Which HTML5 element is used to specify footer information for a document?', options: ['<bottom>', '<section>', '<footer>', '<aside>'], answer: 'C' },
      { id: 'h_h_2', question: 'Which tag is used to create an interactive form?', options: ['<input>', '<form>', '<action>', '<method>'], answer: 'B' },
    ],
    academic: [
      { id: 'h_a_1', question: 'What is the purpose of the <main> element in Semantic HTML?', options: ['To wrap navigation', 'To contain the unique content of the body', 'To store metadata', 'To define global footer'], answer: 'B' },
    ],
    pro: [
      { id: 'h_p_1', question: 'Which attribute should be used on an <img> tag to improve performance by delaying image loading?', options: ['defer="true"', 'async="lazy"', 'loading="lazy"', 'preload="none"'], answer: 'C' },
    ],
    beginner: [
      { id: 'h_b_1', question: 'Which character is used to indicate an end tag?', options: ['^', '/', '*', '<'], answer: 'B' },
      { id: 'h_b_2', question: 'What is the correct HTML for creating a hyperlink?', options: ['<a url="http://google.com">Google</a>', '<a>http://google.com</a>', '<a href="http://google.com">Google</a>', '<hyperlink>http://google.com</hyperlink>'], answer: 'C' }
    ],
    intermediate: [],
    advanced: []
  },
  javascript: {
    kids: [
      { id: 'js_k_1', question: 'What do we use to show an alert box in JS?', options: ['popup()', 'alert()', 'msg()', 'window.show()'], answer: 'B' },
    ],
    elementary: [
      { id: 'js_e_1', question: 'How do you create a function in JavaScript?', options: ['function myFunction()', 'function:myFunction()', 'function = myFunction()', 'func myFunction()'], answer: 'A' },
    ],
    highschool: [
      { id: 'js_h_1', question: 'Which operator is used to assign a value to a variable?', options: ['*', '-', '=', 'x'], answer: 'C' },
    ],
    academic: [
      { id: 'js_a_1', question: 'Which of the following is NOT a JavaScript data type?', options: ['String', 'Boolean', 'Integer', 'Undefined'], answer: 'C' },
    ],
    pro: [
      { id: 'js_p_1', question: 'What is the "Temporal Dead Zone" in JavaScript?', options: ['A time when the browser freezes', 'The period between variable enters scope and its initialization', 'The timeout period of an API request', 'Memory leak period'], answer: 'B' },
    ],
    beginner: [],
    intermediate: [],
    advanced: []
  },
  python: {
    kids: [
       { id: 'p_k_1', question: 'How do you say "Hello" in Python code?', options: ['say("Hello")', 'print("Hello")', 'write("Hello")', 'speak("Hello")'], answer: 'B' },
       { id: 'p_k_2', question: 'Which shape is the Python logo animal?', options: ['A Dragon', 'A Snake', 'A Turtle', 'A Lion'], answer: 'B' },
    ],
    elementary: [
       { id: 'p_e_1', question: 'What is it called when we store a value like x = 5?', options: ['Secret', 'Variable', 'Folder', 'Box'], answer: 'B' },
    ],
    highschool: [
       { id: 'p_h_1', question: 'How do you start a "for loop" in Python?', options: ['for i in range(5):', 'for(i=0; i<5; i++)', 'loop for 5 times:', 'do for 5:'], answer: 'A' },
    ],
    academic: [
       { id: 'p_a_1', question: 'In Python, what is the correct term for an immutable sequence?', options: ['List', 'Array', 'Tuple', 'Dictionary'], answer: 'C' },
    ],
    pro: [
       { id: 'p_p_1', question: 'What is the primary difference between a Shallow Copy and a Deep Copy in Python?', options: ['Syntax only', 'Shallow copy shares internal references; Deep copy duplicates everything', 'Performance of math operations', 'Compatibility with Python 2'], answer: 'B' },
    ],
    beginner: [],
    intermediate: [],
    advanced: []
  }
};
