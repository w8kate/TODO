(function() {
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
		button.textContent = 'Добавить дело';
		button.disabled = true; // task 1

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    // создаем и возвращаем список элементов
    function createTodolist() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
	}

    function createTodoItem(nameDone) { // task 2
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его правой части с помощью flex
		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

		if (typeof(nameDone) === 'string') { // task 2
			item.textContent = nameDone;
		}
		else {
			item.textContent = nameDone.name;
			if (nameDone.done === true) {
				item.classList.add('list-group-item-success');
			}
		}

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp(container, title = 'Список дел', defaultTodoList = [], storageKey = "") { // task 3
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
		let todoList = createTodolist();

		container.append(todoAppTitle);
        container.append(todoItemForm.form);
		container.append(todoList);

		if (!localStorage.getItem(storageKey)) { // task 3
			localStorage.setItem(storageKey, JSON.stringify(defaultTodoList));
		}

		for (let i = 0; i < JSON.parse(localStorage.getItem(storageKey)).length; i++) { // task 2, 3
			let defaultTodoItem = createTodoItem(JSON.parse(localStorage.getItem(storageKey))[i]);
			todoList.append(defaultTodoItem.item);

			defaultTodoItem.doneButton.addEventListener('click', function() {
				defaultTodoItem.item.classList.toggle('list-group-item-success');
				let storageList = JSON.parse(localStorage.getItem(storageKey)); // task 3
				storageList[i].done = !storageList[i].done; // task 3
				localStorage.setItem(storageKey, JSON.stringify(storageList)); // task 3
			});

			defaultTodoItem.deleteButton.addEventListener('click', function() {
				if (confirm('Вы уверены?')) {
					defaultTodoItem.item.remove();
					let storageList = JSON.parse(localStorage.getItem(storageKey)); // task 3
					storageList.splice(i, 1); // task 3
					localStorage.setItem(storageKey, JSON.stringify(storageList)); // task 3
					location.reload();
				}
			});

			todoList.append(defaultTodoItem.item);
		}

		todoItemForm.input.addEventListener('input', function() { // task 1
			if (todoItemForm.input.value != '') {
				todoItemForm.button.disabled = false;
			}
			else todoItemForm.button.disabled = true;
		})

        // браузер создает событие submit на форме по нажатию Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в даном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

			let todoItem = createTodoItem(todoItemForm.input.value);
			let storageList = JSON.parse(localStorage.getItem(storageKey));
			storageList.push({name: todoItemForm.input.value, done: false});
			localStorage.setItem(storageKey, JSON.stringify(storageList));

            // добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function() {
				todoItem.item.classList.toggle('list-group-item-success');
				let storageList = JSON.parse(localStorage.getItem(storageKey)); // task 3
				storageList[storageList.length - 1].done = !storageList[storageList.length - 1].done; // task 3
				localStorage.setItem(storageKey, JSON.stringify(storageList)); // task 3
            });
            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
					todoItem.item.remove();
					let storageList = JSON.parse(localStorage.getItem(storageKey)); // task 3
					storageList.splice(storageList.length - 1, 1); // task 3
					localStorage.setItem(storageKey, JSON.stringify(storageList)); // task 3
                }
            });

            //создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
			todoItemForm.input.value = '';

			todoItemForm.button.disabled = true; // task 1
        });
    }

    window.createTodoApp = createTodoApp;

})();
