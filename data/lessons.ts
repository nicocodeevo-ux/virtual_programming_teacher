import type { LanguagesData } from '../types';

export const LANGUAGES: LanguagesData = {
  javascript: {
    name: "JavaScript",
    topics: [
      { title: "Introduction to Variables", prompt: "Explain JavaScript variables (var, let, and const) for a beginner, including scope and hoisting. Provide clear code examples for each." },
      { title: "Functions and Scope", prompt: "Detail JavaScript functions, including function declarations, expressions, and arrow functions. Explain global, function, and block scope with examples." },
      { title: "Asynchronous JavaScript", prompt: "Explain asynchronous JavaScript concepts: Callbacks, Promises, and Async/Await. Provide a simple example for each to show how they prevent blocking." },
      { title: "DOM Manipulation", prompt: "Provide a beginner's guide to DOM manipulation in JavaScript. Show how to select, create, add, and remove elements with code snippets." },
      { title: "ES6 Modules", prompt: "Explain ES6 modules in JavaScript. Cover the `import` and `export` syntax, default vs. named exports, and the benefits of modular code." },
      { title: "The 'this' Keyword", prompt: "Demystify the 'this' keyword in JavaScript. Explain how its value is determined in different contexts (global, function, method, arrow function) with clear examples." }
    ]
  },
  python: {
    name: "Python",
    topics: [
      { title: "Basic Data Types", prompt: "Explain Python's basic data types: integers, floats, strings, and booleans. Show how to create and use them in simple operations." },
      { title: "Lists and Dictionaries", prompt: "Give a detailed explanation of Python lists and dictionaries. Cover creation, accessing elements, adding/removing items, and common methods for both." },
      { title: "Loops and Conditionals", prompt: "Explain control flow in Python using 'if/elif/else' statements and 'for'/'while' loops. Provide clear, simple examples for a beginner." },
      { title: "Object-Oriented Programming", prompt: "Introduce the basics of Object-Oriented Programming in Python. Explain classes, objects, methods, and inheritance with a simple, real-world analogy and code." },
      { title: "Virtual Environments & pip", prompt: "Explain the importance of virtual environments in Python using `venv`. Show how to create, activate, and use `pip` to install packages within an environment." },
      { title: "Working with Files", prompt: "Provide a guide to reading from and writing to files in Python. Cover the `open()` function, `with` statement, and different file modes ('r', 'w', 'a')." }
    ]
  },
  sql: {
    name: "SQL",
    topics: [
      { title: "SELECT and FROM", prompt: "Explain the fundamental SQL `SELECT` and `FROM` clauses. Show how to retrieve all columns and specific columns from a table with example queries." },
      { title: "Filtering with WHERE", prompt: "Detail how to use the `WHERE` clause in SQL to filter data. Provide examples using comparison operators, `AND`, `OR`, and `IN`." },
      { title: "Joining Tables", prompt: "Explain `INNER JOIN` and `LEFT JOIN` in SQL. Use a simple example with two tables (e.g., Customers and Orders) to illustrate how they work." },
      { title: "Aggregate Functions", prompt: "Introduce SQL aggregate functions like `COUNT`, `SUM`, `AVG`, `MIN`, and `MAX`. Explain how to use them with the `GROUP BY` clause with examples." },
      { title: "Indexes and Performance", prompt: "Explain what a database index is and why it's important for query performance in SQL. Describe how an index works using a simple analogy." },
      { title: "Window Functions", prompt: "Introduce SQL window functions. Explain the `OVER()` clause with `PARTITION BY` and `ORDER BY` using a practical example like ranking sales per category." }
    ]
  },
  rust: {
      name: "Rust",
      topics: [
          { title: "Ownership and Borrowing", prompt: "Explain Rust's core concepts of Ownership, Borrowing, and Lifetimes. Use simple analogies and code examples to make these difficult concepts understandable for a beginner." },
          { title: "Structs and Enums", prompt: "Detail how to define and use `structs` and `enums` in Rust. Explain how they are used to create custom data types and show examples of pattern matching with `match` on an enum." },
          { title: "Error Handling", prompt: "Explain Rust's approach to error handling using the `Result` enum and the `?` operator. Contrast it with exceptions in other languages and provide a practical example." },
          { title: "Cargo and Crates", prompt: "Provide an introduction to Cargo, Rust's build system and package manager. Explain what a crate is and show the basic commands like `cargo new`, `cargo build`, and `cargo run`." },
          { title: "Traits and Generics", prompt: "Explain traits and generics in Rust. Show how they enable writing flexible and reusable code, using an example like a `summary` trait." },
          { title: "Concurrency", prompt: "Introduce concurrency in Rust. Explain how to use `std::thread::spawn` to create threads and message passing with channels to communicate between them safely." }
      ]
  },
  typescript: {
    name: "TypeScript",
    topics: [
        { title: "TypeScript vs. JavaScript", prompt: "Explain the key differences between TypeScript and JavaScript. Describe the benefits of using a static type system and how TypeScript compiles to plain JavaScript." },
        { title: "Basic Types", prompt: "Cover the basic types in TypeScript, such as `string`, `number`, `boolean`, `array`, `any`, `unknown`, and `void`. Provide code examples for type annotations." },
        { title: "Interfaces and Types", prompt: "Explain how to use `interface` and `type` aliases in TypeScript to define custom object shapes. Discuss the similarities and key differences between them." },
        { title: "Generics", prompt: "Introduce the concept of Generics in TypeScript. Explain how they allow you to create reusable components that can work over a variety of types rather than a single one." }
    ]
  },
  kotlin: {
    name: "Kotlin",
    topics: [
      { title: "Kotlin Basics", prompt: "Introduce Kotlin basics: variables, val vs var, basic types, and string interpolation with examples." },
      { title: "Null Safety", prompt: "Explain Kotlin's null safety features: nullable types, the safe-call operator `?.`, the Elvis operator `?:`, and the not-null assertion `!!`." },
      { title: "Functions and Lambdas", prompt: "Show how to declare functions in Kotlin, default/ named parameters, and using lambdas for concise code." },
      { title: "Coroutines Overview", prompt: "Provide an introduction to Kotlin coroutines for asynchronous programming and show a basic example using `launch` and `suspend` functions." }
    ]
  },
  java: {
    name: "Java",
    topics: [
        { title: "Intro to Java & JVM", prompt: "Provide a beginner's introduction to the Java programming language. Explain the role of the Java Virtual Machine (JVM) and the 'write once, run anywhere' principle." },
        { title: "Classes and Objects", prompt: "Explain the fundamentals of Object-Oriented Programming in Java with classes and objects. Show how to define a class, create objects (instances), and use fields and methods." },
        { title: "Inheritance & Polymorphism", prompt: "Detail the concepts of inheritance and polymorphism in Java. Use a clear example (e.g., Animal -> Dog, Cat) to illustrate how a subclass extends a superclass." },
        { title: "Collections Framework", prompt: "Introduce the Java Collections Framework. Briefly explain the purpose of `List`, `Set`, and `Map` interfaces and provide a simple example using `ArrayList`." }
    ]
  },
  go: {
      name: "Go (Golang)",
      topics: [
          { title: "Packages and Imports", prompt: "Explain the package management system in Go. Show how to define a package, import other packages (from standard library and external), and the purpose of `main`." },
          { title: "Structs and Methods", prompt: "Describe how to create custom types using `structs` in Go. Explain how to attach methods to structs to define behavior for the type." },
          { title: "Goroutines", prompt: "Introduce concurrency with goroutines in Go. Explain what a goroutine is, how to start one with the `go` keyword, and why they are lightweight." },
          { title: "Channels", prompt: "Explain how to use channels for communication between goroutines in Go. Provide a simple example of sending and receiving data on a channel to ensure safe concurrency." }
      ]
  },
  html_css: {
      name: "HTML & CSS",
      topics: [
          { title: "HTML Document Structure", prompt: "Explain the basic structure of an HTML5 document, including `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>`. Describe the purpose of common tags like `<h1>`, `<p>`, `<a>`, and `<img>`." },
          { title: "CSS Selectors & Specificity", prompt: "Introduce CSS and how it's used to style HTML. Explain the most common CSS selectors (tag, class, ID) and the concept of specificity." },
          { title: "The Box Model", prompt: "Explain the CSS Box Model in detail. Describe the concepts of content, padding, border, and margin and how they affect element layout." },
          { title: "Flexbox Layout", prompt: "Provide a practical guide to using CSS Flexbox for creating responsive layouts. Explain the main properties for the container (`display: flex`, `justify-content`, `align-items`) and items." }
      ]
  }
};
