import { Question } from '../types';

export const cssQuestions: Record<string, Question[]> = {
  beginner: [
    { id: 'css-b1', question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], answer: "B" },
    { id: 'css-b2', question: "Which HTML attribute is used to define inline styles?", options: ["class", "styles", "font", "style"], answer: "D" },
    { id: 'css-b3', question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<design>"], answer: "C" },
    { id: 'css-b4', question: "Which HTML element is used to refer to an external style sheet?", options: ["<link>", "<stylesheet>", "<style>", "<src>"], answer: "A" },
    { id: 'css-b5', question: "Which is the correct CSS syntax?", options: ["body {color: black;}", "{body;color:black;}", "body:color=black;", "body {color=black;}"], answer: "A" },
    { id: 'css-b6', question: "How do you insert a comment in a CSS file?", options: ["// this is a comment", "/* this is a comment */", "' this is a comment", "// this is a comment //"], answer: "B" },
    { id: 'css-b7', question: "Which property is used to change the background color?", options: ["color", "bgcolor", "background-color", "bg-color"], answer: "C" },
    { id: 'css-b8', question: "How do you add a background color for all <h1> elements?", options: ["h1.all {background-color:#FFFFFF;}", "all.h1 {background-color:#FFFFFF;}", "h1 {background-color:#FFFFFF;}", "h1 {bg-color:#FFFFFF;}"], answer: "C" },
    { id: 'css-b9', question: "Which CSS property is used to change the text color of an element?", options: ["text-color", "fgcolor", "color", "font-color"], answer: "C" },
    { id: 'css-b10', question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], answer: "C" },
    { id: 'css-b11', question: "What is the correct CSS syntax for making all the <p> elements bold?", options: ["p {font-weight:bold;}", "p {text-size:bold;}", "p {font-style:bold;}", "<p style=\"font-size:bold;\">"], answer: "A" },
    { id: 'css-b12', question: "How do you display hyperlinks without an underline?", options: ["a {text-decoration:none;}", "a {underline:none;}", "a {decoration:no-underline;}", "a {text-underline:none;}"], answer: "A" },
    { id: 'css-b13', question: "How do you make each word in a text start with a capital letter?", options: ["text-transform:uppercase", "text-transform:capitalize", "font-transform:capitalize", "You cannot do that with CSS"], answer: "B" },
    { id: 'css-b14', question: "Which property is used to change the font of an element?", options: ["font-family", "font-style", "font-weight", "font-type"], answer: "A" },
    { id: 'css-b15', question: "How do you make the text bold?", options: ["font-weight:bold;", "font:bold;", "style:bold;", "font-decoration:bold;"], answer: "A" },
    { id: 'css-b16', question: "Which property is used to change the left margin of an element?", options: ["padding-left", "margin-left", "indent-left", "spacing-left"], answer: "B" },
    { id: 'css-b17', question: "When using the padding property; are you allowed to use negative values?", options: ["Yes", "No"], answer: "B" },
    { id: 'css-b18', question: "How do you make a list that lists its items with squares?", options: ["list-type: square;", "list-style-type: square;", "list: square;", "type: square;"], answer: "B" },
    { id: 'css-b19', question: "Which property is used to change the right margin of an element?", options: ["padding-right", "margin-right", "indent-right", "spacing-right"], answer: "B" },
    { id: 'css-b20', question: "Which property is used to change the distance between lines of text?", options: ["line-height", "spacing-text", "line-spacing", "row-height"], answer: "A" }
  ],
  intermediate: [
    { id: 'css-i1', question: "Which property is used to change the font of an element?", options: ["font-style", "font-weight", "font-family", "font-variant"], answer: "C" },
    { id: 'css-i2', question: "Which property is used to center text?", options: ["text-align", "align-text", "center-align", "text-center"], answer: "A" },
    { id: 'css-i3', question: "How do you make a list with no bullets?", options: ["list-style-type: none;", "list: none;", "bullet: none;", "list-type: no-bullet;"], answer: "A" },
    { id: 'css-i4', question: "Which CSS property controls the order of layered elements?", options: ["x-index", "z-index", "layer-index", "stack-order"], answer: "B" },
    { id: 'css-i5', question: "Which property is used to set the spacing between characters?", options: ["letter-spacing", "character-spacing", "word-spacing", "text-spacing"], answer: "A" },
    { id: 'css-i6', question: "How do you select an element with id 'demo'?", options: [".demo", "#demo", "demo", "*demo"], answer: "B" },
    { id: 'css-i7', question: "How do you select elements with class name 'test'?", options: ["#test", ".test", "test", "*test"], answer: "B" },
    { id: 'css-i8', question: "How do you select all p elements inside a div element?", options: ["div p", "div.p", "div + p", "div > p"], answer: "A" },
    { id: 'css-i9', question: "How do you select all p elements that are direct children of a div element?", options: ["div p", "div.p", "div + p", "div > p"], answer: "D" },
    { id: 'css-i10', question: "What is the default value of the position property?", options: ["relative", "fixed", "absolute", "static"], answer: "D" }
  ],
  advanced: [
    { id: 'css-a1', question: "Which CSS property is used to create a flex container?", options: ["layout: flex;", "display: flex;", "flex-direction: row;", "container: flex;"], answer: "B" },
    { id: 'css-a2', question: "Which property is used to change the alignment of flex items individually?", options: ["align-self", "align-items", "justify-content", "align-content"], answer: "A" },
    { id: 'css-a3', question: "Which CSS property is used to specify the stack order of an element?", options: ["z-index", "stack-index", "layer", "order"], answer: "A" },
    { id: 'css-a4', question: "Which property is used to create a grid container?", options: ["display: grid;", "grid: enabled;", "layout: grid;", "display: bento;"], answer: "A" },
    { id: 'css-a5', question: "How do you define a grid column that takes up 1 fraction of the available space?", options: ["width: 1fr;", "grid-template-columns: 1fr;", "column: 1fr;", "grid-width: 1fr;"], answer: "B" },
    { id: 'css-a6', question: "Which property is used to set the gap between grid rows and columns?", options: ["grid-gap", "gap", "grid-spacing", "Both A and B"], answer: "D" },
    { id: 'css-a7', question: "Which CSS3 property allows you to use your own font in a website?", options: ["font-face", "@font-face", "custom-font", "font-import"], answer: "B" },
    { id: 'css-a8', question: "Which property is used to add a shadow effect to text?", options: ["box-shadow", "text-shadow", "shadow-text", "font-shadow"], answer: "B" },
    { id: 'css-a9', question: "How do you rotate an element 90 degrees?", options: ["rotate: 90deg;", "transform: rotate(90deg);", "turn: 90deg;", "rotate(90deg);"], answer: "B" },
    { id: 'css-a10', question: "Which media query feature is used to apply styles based on the device width?", options: ["max-width", "device-width", "screen-width", "width"], answer: "A" }
  ]
};
