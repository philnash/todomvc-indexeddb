# Todo MVC with IndexedDB

A reimplementation of [TodoMVC](http://todomvc.com/) using IndexedDB as the data layer instead of LocalStorage.

## Reasoning

TodoMVC is great for comparing front end frameworks, but I wanted to compare front end databases. Since the data layer of TodoMVC is implemented in LocalStorage I thought it would be interesting to re-implement the store with IndexedDB.

I picked the Vanilla JS version of TodoMVC so that I could deal with straightforward JavaScript with no build tools or frameworks and just concentrate on replacing the Store.js file with my own implementation.

## Checking out the examples

I have included the original Vanilla JS implementation with LocalStorage as well as my new IndexedDB implementation. You can just open the relevant index.html files in a web browser to view them in action.
