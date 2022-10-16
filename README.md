# Virtualized Table

What is virtualization and why do you need it? Imagine you have a dataset of 100,000 or more items you want to display as a scrollable list without pagination. Rendering that many rows would pollute the DOM, consume too much memory, and degrade the app’s performance.

Through virtualization you can show the user only a small portion of data at a given time. The other items are emulated (virtualized) via top and bottom padding elements, which are empty but have some height necessary to provide consistent scrollbar parameters. Each time the user scrolls out of the set of visible items, the content is rebuilt i.e new items are fetched and rendered, old ones are destroyed and padding elements are recalculated.

## Table of Contents

-   [General Information](#general-information)
-   [Tech Stack](#tech-stack)
-   [Run Locally](#run-locally)
-   [Running Tests](#running-tests)
-   [Feedback](#feedback)

## General Information

This app satisfies some very basic requirements with the following conditions:

-   The initial number of items in the dataset we want to virtualize is known. A list of 200,000 products is generated using [faker-js](https://fakerjs.dev/)
-   The height of a single row is constant
-   A synchronous data flow from the app to the virtualizedTable component is guaranteed

## Tech Stack

-   React
-   Typescript
-   Cypress
-   Vite
-   Material UI (v5)

## Run Locally

Clone the project

```bash
  git clone https://github.com/richyosano/deep-opinion-coding-challenge
```

Go to the project directory

```bash
  cd deep-opinion-coding-challenge
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Feedback

If you have any feedback, please reach out to me at <richardosano97@gmail.com>
