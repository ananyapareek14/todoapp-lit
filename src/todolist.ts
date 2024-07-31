import { LitElement, css, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

type ToDoItem = {
  text: string;
  completed: boolean;
};

@customElement('todo-list')
export class ToDoList extends LitElement {
  static styles = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Fira Sans', sans-serif;
    }

    :host {
      display: block;
    }

    main {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 2rem;
      background-color: rgb(38, 35, 54);
      color: #fff;
    }

    main h1 {
      font-size: 2.5rem;
      text-transform: capitalize;
      margin-bottom: 0.5rem;
    }

    main h1 ~ p {
      margin-bottom: 2rem;
    }

    .create-new {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 480px;
    }

    .create-new input {
      appearance: none;
      border: none;
      outline: none;
      border-bottom: 1px solid #fff;
      background-color: transparent;
      color: #fff;
      font-size: 1.5rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      margin: 0;
      transition: 0.4s;
      width: 100%;
    }

    .create-new input:focus {
      border-bottom-color: rgb(47, 214, 111);
    }

    .create-new button {
      appearance: none;
      border: none;
      outline: none;
      background-color: rgb(47, 214, 111);
      text-transform: uppercase;
      font-weight: bold;
      color: #000;
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      margin-left: 0.5rem;
      cursor: pointer;
    }

    .tasks {
      width: 100%;
      max-width: 480px;
      margin-top: 2rem;
    }

    .task {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgb(52, 47, 78);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .task .buttons {
      min-width: fit-content;
    }

    .task button {
      appearance: none;
      border: none;
      outline: none;
      background-color: rgb(47, 214, 111);
      text-transform: uppercase;
      font-weight: bold;
      color: #000;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      margin-left: 0.5rem;
      cursor: pointer;
    }

    .task button.delete {
      background-color: crimson;
      color: #eee;
    }

    .task.is-complete {
      opacity: 0.7;
    }

    .task.is-complete .content {
      text-decoration: line-through;
    }
  `;

  @state()
  private _listItems: ToDoItem[] = [];

  @state()
  private hideCompleted: boolean = false;

  render() {
    const items = this.hideCompleted
      ? this._listItems.filter((item) => !item.completed)
      : this._listItems;
    return html`
      <main>
        <h1>Task Manager</h1>
        <p>Your tasks:</p>
        <div class="create-new">
          <input
            id="newitem"
            aria-label="New item"
            placeholder="Add a new task"
          />
          <button @click=${this.addToDo}>Add</button>
        </div>
        <div class="tasks">
          ${items.map(
            (item, index) =>
              html`
                <div class="task ${item.completed ? 'is-complete' : ''}">
                  <span class="content">${item.text}</span>
                  <div class="buttons">
                    <button @click=${() => this.toggleCompleted(index)}>
                      ${item.completed ? 'Undo' : 'Done'}
                    </button>
                    <button class="edit" @click=${() => this.editTask(index)}>
                      Edit
                    </button>
                    <button class="delete" @click=${() => this.deleteTask(index)}>
                      Delete
                    </button>
                  </div>
                </div>
              `
          )}
        </div>
      </main>
    `;
  }

  toggleCompleted(index: number) {
    this._listItems[index].completed = !this._listItems[index].completed;
    this.requestUpdate();
  }

  @query('#newitem')
  input!: HTMLInputElement;

  addToDo() {
    if (this.input.value.trim()) {
      this._listItems = [
        ...this._listItems,
        { text: this.input.value.trim(), completed: false },
      ];
      this.input.value = '';
    }
  }

  editTask(index: number) {
    const newText = prompt('Edit your task:', this._listItems[index].text);
    if (newText !== null) {
      this._listItems[index].text = newText;
      this.requestUpdate();
    }
  }

  deleteTask(index: number) {
    this._listItems = this._listItems.filter((_, i) => i !== index);
  }
}


