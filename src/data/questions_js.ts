import { Question } from '../types';

export const jsQuestions: Record<string, Question[]> = {
  beginner: [
    { id: 'js-b1', question: "Inside which HTML element do we put the JavaScript?", options: ["<js>", "<scripting>", "<script>", "<javascript>"], answer: "C" },
    { id: 'js-b2', question: "What is the correct JavaScript syntax to change the content of the HTML element with id 'demo'?", options: ["document.getElementById('demo').innerHTML = 'Hello World!';", "document.getElement('p').innerHTML = 'Hello World!';", "#demo.innerHTML = 'Hello World!';", "document.getElementByName('p').innerHTML = 'Hello World!';"], answer: "A" },
    { id: 'js-b3', question: "Where is the correct place to insert a JavaScript?", options: ["The <head> section", "The <body> section", "Both", "None"], answer: "C" },
    { id: 'js-b4', question: "What is the correct syntax for referring to an external script called 'xxx.js'?", options: ["<script href='xxx.js'>", "<script name='xxx.js'>", "<script src='xxx.js'>", "<javascript src='xxx.js'>"], answer: "C" },
    { id: 'js-b5', question: "The external JavaScript file must contain the <script> tag.", options: ["True", "False"], answer: "B" },
    { id: 'js-b6', question: "How do you write 'Hello World' in an alert box?", options: ["msgBox('Hello World');", "alertBox('Hello World');", "alert('Hello World');", "msg('Hello World');"], answer: "C" },
    { id: 'js-b7', question: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "function = myFunction()", "myFunction():function"], answer: "A" },
    { id: 'js-b8', question: "How do you call a function named 'myFunction'?", options: ["call myFunction()", "myFunction()", "call function myFunction()", "run myFunction"], answer: "B" },
    { id: 'js-b9', question: "How to write an IF statement in JavaScript?", options: ["if i = 5 then", "if i == 5 then", "if (i == 5)", "if i = 5"], answer: "C" },
    { id: 'js-b10', question: "How to write an IF statement for executing some code if 'i' is NOT equal to 5?", options: ["if (i <> 5)", "if i <> 5", "if (i != 5)", "if i != 5"], answer: "C" },
    { id: 'js-b11', question: "How does a WHILE loop start?", options: ["while (i <= 10)", "while i = 1 to 10", "while (i <= 10; i++)", "while i < 10 then"], answer: "A" },
    { id: 'js-b12', question: "How does a FOR loop start?", options: ["for (i = 0; i <= 5; i++)", "for (i <= 5; i++)", "for i = 1 to 5", "for (i = 0; i <= 5)"], answer: "A" },
    { id: 'js-b13', question: "How can you add a comment in a JavaScript?", options: ["'This is a comment", "//This is a comment", "<!--This is a comment-->", "/* This is a comment */"], answer: "B" },
    { id: 'js-b14', question: "How to insert a comment that has more than one line?", options: ["/*This comment has more than one line*/", "//This comment has more than one line//", "<!--This comment has more than one line-->", "'This comment has more than one line"], answer: "A" },
    { id: 'js-b15', question: "What is the correct way to write a JavaScript array?", options: ["var colors = (1:'red', 2:'green', 3:'blue')", "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')", "var colors = ['red', 'green', 'blue']", "var colors = 'red', 'green', 'blue'"], answer: "C" },
    { id: 'js-b16', question: "How do you round the number 7.25, to the nearest integer?", options: ["round(7.25)", "Math.round(7.25)", "rnd(7.25)", "Math.rnd(7.25)"], answer: "B" },
    { id: 'js-b17', question: "How do you find the number with the highest value of x and y?", options: ["Math.ceil(x, y)", "Math.max(x, y)", "ceil(x, y)", "top(x, y)"], answer: "B" },
    { id: 'js-b18', question: "What is the correct JavaScript syntax for opening a new window called 'w2' ?", options: ["w2 = window.new('http://www.w3schools.com');", "w2 = window.open('http://www.w3schools.com');", "w2 = open('http://www.w3schools.com');", "window.open('http://www.w3schools.com', 'w2');"], answer: "B" },
    { id: 'js-b19', question: "JavaScript is the same as Java.", options: ["True", "False"], answer: "B" },
    { id: 'js-b20', question: "How can you detect the client's browser name?", options: ["client.navName", "navigator.appName", "browser.name", "window.appName"], answer: "B" }
  ],
  intermediate: [
    { id: 'js-i1', question: "Which event occurs when the user clicks on an HTML element?", options: ["onmouseclick", "onmouseover", "onclick", "onchange"], answer: "C" },
    { id: 'js-i2', question: "How do you declare a JavaScript variable?", options: ["var carName;", "variable carName;", "v carName;", "declare carName;"], answer: "A" },
    { id: 'js-i3', question: "Which operator is used to assign a value to a variable?", options: ["*", "-", "=", "x"], answer: "C" },
    { id: 'js-i4', question: "What will the following code return: Boolean(10 > 9)", options: ["false", "true", "NaN", "undefined"], answer: "B" },
    { id: 'js-i5', question: "Is JavaScript case-sensitive?", options: ["No", "Yes"], answer: "B" },
    { id: 'js-i6', question: "Which method can be used to display data in some form of output?", options: ["document.write()", "console.log()", "window.alert()", "All of the above"], answer: "D" },
    { id: 'js-i7', question: "Which operator is used to compare both value and type?", options: ["==", "===", "=", "!=="], answer: "B" },
    { id: 'js-i8', question: "What is the result of '5' + 5?", options: ["10", "55", "Error", "NaN"], answer: "B" },
    { id: 'js-i9', question: "How do you find the length of a string?", options: ["string.size()", "string.length", "string.len()", "string.count"], answer: "B" },
    { id: 'js-i10', question: "Which method converts a string to all lowercase letters?", options: ["toLowerCase()", "toLower()", "changeCase('lower')", "lowerCase()"], answer: "A" }
  ],
  advanced: [
    { id: 'js-a1', question: "What is a Promise in JavaScript?", options: ["A placeholder for a future value", "A syntax error", "A type of loop", "A way to define constants"], answer: "A" },
    { id: 'js-a2', question: "Which keyword is used to handle exceptions in JavaScript?", options: ["catch", "error", "throw", "All of the above"], answer: "D" },
    { id: 'js-a3', question: "What is 'hoisting' in JavaScript?", options: ["Moving declarations to the top", "Elevating variables to a database", "Lifting errors to the console", "A type of animation"], answer: "A" },
    { id: 'js-a4', question: "What does 'this' keyword refer to in JavaScript?", options: ["The object it belongs to", "The current function", "The window object always", "None of the above"], answer: "A" },
    { id: 'js-a5', question: "What is a closure in JavaScript?", options: ["A function with its lexical environment", "Closing a database connection", "Ending a loop", "Private variables only"], answer: "A" },
    { id: 'js-a6', question: "Which method is used to serialize an object into a JSON string?", options: ["JSON.parse()", "JSON.stringify()", "JSON.toText()", "JSON.convert()"], answer: "B" },
    { id: 'js-a7', question: "What is the purpose of the 'async' keyword?", options: ["To define an asynchronous function", "To speed up the code", "To prevent errors", "To handle DOM events"], answer: "A" },
    { id: 'js-a8', question: "Which array method creates a new array with all elements that pass a test?", options: ["map()", "filter()", "reduce()", "forEach()"], answer: "B" },
    { id: 'js-a9', question: "What is the use of the 'spread' operator (...)?", options: ["Expanding arrays/objects", "Spreading errors", "Math operations", "String concatenation"], answer: "A" },
    { id: 'js-a10', question: "What is the purpose of 'use strict' in JavaScript?", options: ["Enforce stricter parsing/error handling", "Bypass security checks", "Enable experimental features", "Optimize memory usage"], answer: "A" }
  ]
};
