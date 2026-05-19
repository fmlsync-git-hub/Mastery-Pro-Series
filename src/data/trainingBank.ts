import { Level } from '../types';

export interface TrainingModule {
  title: string;
  overview: string;
  concepts: { title: string; body: string }[];
  summary: string;
}

export const TRAINING_BANK: Record<string, Record<Level, TrainingModule>> = {
  html: {
    kids: {
      title: "The Web Magic Wand 🪄",
      overview: "Imagine buildings. Every building has a blueprint. HTML is the skeleton for everything you see on the internet!",
      concepts: [
        { title: "Building Blocks", body: "Tags are like Lego blocks. You open one <block> and close it </block> to build your site!" },
        { title: "Magic Pictures", body: "Use the <img> tag to bring your favorite photos to the web world." }
      ],
      summary: "You are now a Web Junior Apprentice! Ready to build the internet skeleton."
    },
    elementary: {
      title: "Structure and Substance",
      overview: "Now we move beyond simple blocks. We learn how to organize information using headings and lists.",
      concepts: [
        { title: "Hierarchy", body: "H1 is the biggest boss. H6 is the smallest helper. Use them to organize your ideas." },
        { title: "Lists", body: "Want to make a grocery list? Use <ul> and <li> to stay organized!" }
      ],
      summary: "Organization is the key to professional web development."
    },
    highschool: {
       title: "Modern Semantic Structures",
       overview: "Modern HTML5 is about context. Tags like <header> and <section> tell search engines what your content actually means.",
       concepts: [
         { title: "Semantic Tags", body: "Never use a <div> where a <header> or <main> should be. It helps accessibility!" },
         { title: "Interactivity", body: "Forms allow users to talk back to your website." }
       ],
       summary: "Semantic HTML is the backbone of the accessible, modern web."
    },
    academic: {
       title: "DOM Foundations",
       overview: "The Document Object Model (DOM) is a tree structure representing your page in the browser's memory.",
       concepts: [
         { title: "Tree Traversal", body: "Every element is a node. Parents, children, and siblings define the structure." },
         { title: "Standards bodies", body: "W3C and WHATWG define the evolving standards of HTML5.2 and beyond." }
       ],
       summary: "Understanding the underlying data structure is vital for advanced engineering."
    },
    pro: {
       title: "Enterprise Architecture",
       overview: "At scale, HTML involves micro-optimizations, SSR considerations, and Hydration strategies.",
       concepts: [
         { title: "SSR & SEO", body: "How search engines index client-side vs server-side rendered markup." },
         { title: "Accessibility (A11y)", body: "Advanced ARIA roles and keyboard focus management for enterprise applications." }
       ],
       summary: "Architect-level HTML requires a focus on performance and universal accessibility."
    },
    beginner: { title: "", overview: "", concepts: [], summary: "" },
    intermediate: { title: "", overview: "", concepts: [], summary: "" },
    advanced: { title: "", overview: "", concepts: [], summary: "" }
  }
};
