//variables
const themeSwitcherBtn = document.querySelector("#theme-switcher");
const bodyTag = document.querySelector("body");
const themeImg = themeSwitcherBtn.children[0];
const userTheme = localStorage.getItem("theme");
const addBtn = document.querySelector("#add-btn");
const todoInput = document.querySelector(".text-input");
const ul = document.querySelector(".todos");
const itemsLeft = document.querySelector("#items-left");
const filter = document.querySelector(".filter");
const btnClearCompleted = document.querySelector("#clear-completed");
//main function
function main(){
  //theme switcher
  if(userTheme === "light") {
    bodyTag.classList.add("light");
    themeImg.setAttribute("src", "./assets/images/icon-moon.svg");
  };
  themeSwitcherBtn.addEventListener("click", ()=>{
    bodyTag.classList.toggle("light");
    if(bodyTag.classList.contains("light")){
      themeImg.setAttribute("src", "./assets/images/icon-moon.svg");
      localStorage.setItem("theme", "light");
    }else{
      themeImg.setAttribute("src", "./assets/images/icon-sun.svg");
      localStorage.removeItem("theme");
    }
  });
  //get local storage item and show it to dom
  makeTodoElement(JSON.parse(localStorage.getItem("todos")));
  //drag function
  ul.addEventListener("dragover" , (e)=>{
    e.preventDefault();
    if(e.target.classList.contains("card") && !e.target.classList.contains("dragging")){
      const draggingCard = document.querySelector(".dragging");
      const cards = [...ul.querySelectorAll(".card")];
      const currentPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);
      if(currentPos > newPos){
        ul.insertBefore(draggingCard , e.target);
      }else{
        ul.insertBefore(draggingCard , e.target.nextsibling);
      }
      //set the local storage = html
      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currentPos , 1);
      todos.splice(newPos , 0 , removed[0]);
      localStorage.setItem("todos" , JSON.stringify(todos));
    }
  })
  //Add Todo in Local storage
  addBtn.addEventListener("click", ()=>{
    const item = todoInput.value.trim();
    if(item){
      todoInput.value = "";
      const todos = !localStorage.getItem("todos")
      ? []
      : JSON.parse(localStorage.getItem("todos"));
      const curentTodo = {
        item : item ,
        isCompleted : false
      }
      todos.push(curentTodo);
      localStorage.setItem("todos" , JSON.stringify(todos));
      makeTodoElement([curentTodo]);
    }
  });
  todoInput.addEventListener("keydown" , (e)=>{
    if(e.key == "Enter"){
      addBtn.click();
    }
  });
  filter.addEventListener("click" , (e)=>{
    const id = e.target.id;
    if(id){
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    };
  });
  btnClearCompleted.addEventListener("click" , ()=>{
    var deleteIndexes = [];
    document.querySelectorAll(".card.checked").forEach((card)=>{
      deleteIndexes.push([...document.querySelectorAll(".todos .card")].indexOf(card));
      card.classList.add("fall");
      card.addEventListener("animationend" , ()=>{
        card.remove(); 
      });
    });
    removeMultipleTodos(deleteIndexes);
  });
  //remove todo from local storage
  function removeTodo(index){
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos.splice(index , 1);
    localStorage.setItem("todos" , JSON.stringify(todos));
  };
  //remove all completed todos
  function removeMultipleTodos(indexes){
    var todos = JSON.parse(localStorage.getItem("todos"));
    todos= todos.filter((todo , index)=>{
      return !indexes.includes(index);
    });
    localStorage.setItem("todos" , JSON.stringify(todos));
  };
  //state todo from local storage
  function stateTodo(index , iscomplete){
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos[index].isCompleted = iscomplete;
    localStorage.setItem("todos" , JSON.stringify(todos));
  };
  function makeTodoElement(todoArray){
    if(!todoArray){
      return null;
    };
    todoArray.forEach((todoObject)=>{
      //creat HTML Elementsof todo
      const card = document.createElement("li");
      const cbContainer = document.createElement("div");
      const cbInput = document.createElement("input");
      const checkSpan = document.createElement("span");
      const item = document.createElement("p");
      const clearBtn = document.createElement("button");
      const img = document.createElement("img");
      //add classes
      card.classList.add("card");
      cbContainer.classList.add("cb-container");
      cbInput.classList.add("cb-input");
      checkSpan.classList.add("check");
      checkSpan.classList.add("check");
      item.classList.add("item");
      clearBtn.classList.add("clear");
      //add Attributes
      card.setAttribute("draggable" , true);
      cbInput.setAttribute("type" , "checkbox");
      img.setAttribute("src" , "./assets/images/icon-cross.svg")
      img.setAttribute("alt" , "Clear It");
      item.textContent = todoObject.item;
      if(todoObject.isCompleted){
        card.classList.add("checked");
        cbInput.setAttribute("checked" , "checked");
      };  
      //Add Event
      card.addEventListener("dragstart" , ()=>{
        card.classList.add("dragging");
      });
      card.addEventListener("dragend" , ()=>{
        card.classList.remove("dragging");
      });
      clearBtn.addEventListener("click" , (e)=>{
        const currentCard = clearBtn.parentElement;
        currentCard.classList.add("fall");
        const indexOfCurrentCard = [...document.querySelectorAll(".todos .card")].indexOf(currentCard);
        removeTodo(indexOfCurrentCard);
        currentCard.addEventListener("animationend" , ()=>{
          setTimeout(()=>{
            currentCard.remove();
            itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
          } , 100);
        });
      });
      cbInput.addEventListener("click" , (e)=>{
        const currentCard = cbInput.parentElement.parentElement;
        const checked = cbInput.checked;
        const currentCardIndex = [...document.querySelectorAll(".todos .card")].indexOf(currentCard);
        stateTodo(currentCardIndex , checked);
        checked ? currentCard.classList.add("checked") : currentCard.classList.remove("checked");
        itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
      })
      // item of todo
      item.textContent = todoObject.item;
      //set element by parent child
      clearBtn.appendChild(img);
      cbContainer.appendChild(cbInput);
      cbContainer.appendChild(checkSpan);
      card.appendChild(cbContainer); 
      card.appendChild(item);
      card.appendChild(clearBtn);
      document.querySelector(".todos").appendChild(card);
     
    });
  };
  itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
};
document.addEventListener("DOMContentLoaded", main);
function calc(num){
  return num * 0.01;
}
typeof calc('hello'); 