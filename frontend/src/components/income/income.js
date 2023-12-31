import {Common} from "../../utils/common.js";
import {CustomHttp} from "../../services/custom-http.js";
import config from "../../../config/config.js";

export class Income {

    constructor() {
        this.modal = null;
        this.plusBtn = document.getElementsByClassName('income-item')[0];
        this.url = '#/createIncome';
        this.incomeCategories = null;
        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                this.incomeCategories = result;
            }
        } catch (error) {
            return console.log(error);
        }
        this.showCategories();
    }

    showCategories() {
        const incomeItemsElement = document.getElementById('income-items');
        if (this.incomeCategories && this.incomeCategories.length > 0) {
            this.incomeCategories.forEach(category => {
                const incomeItemElement = document.createElement('div');
                incomeItemElement.className = 'income-item border rounded-3';
                const itemTitleElement = document.createElement('h2');
                itemTitleElement.className = 'item-title mb-2 fs-3';
                itemTitleElement.innerText = category.title;
                const itemButtonsElement = document.createElement('div');
                itemButtonsElement.className = 'item-buttons';
                const buttonEditElement = document.createElement('button');
                buttonEditElement.className = 'btn btn-primary me-2 edit';
                buttonEditElement.innerText = 'Редактировать';
                buttonEditElement.setAttribute('data-id', category.id);
                buttonEditElement.setAttribute('category-name', category.title);
                const buttonDeleteElement = document.createElement('button');
                buttonDeleteElement.className = 'btn btn-danger delete';
                buttonDeleteElement.innerText = 'Удалить';
                buttonDeleteElement.setAttribute('data-bs-toggle', 'modal');
                buttonDeleteElement.setAttribute('data-bs-target', '#modal');
                buttonDeleteElement.setAttribute('data-id', category.id);
                buttonDeleteElement.setAttribute('category-name', category.title);
                itemButtonsElement.appendChild(buttonEditElement);
                itemButtonsElement.appendChild(buttonDeleteElement);
                incomeItemElement.appendChild(itemTitleElement);
                incomeItemElement.appendChild(itemButtonsElement);
                incomeItemsElement.appendChild(incomeItemElement);
            })

            const incomeItemAdd = document.getElementById('add');
            incomeItemsElement.appendChild(incomeItemAdd);
        }

        this.editIncome();
        Common.deleteCategory('/categories/income/');
        this.createIncome();
    }

    editIncome() {
        const editBtn = document.getElementsByClassName('edit');
        Array.from(editBtn).forEach(btn => {
            btn.onclick = function (e) {
                localStorage.setItem('incomeCategoryId', e.target.getAttribute('data-id'));
                localStorage.setItem('incomeCategory', e.target.getAttribute('category-name'));
                location.href = '#/editIncome';
            }
        })
    }

    createIncome() {
        Common.move(this.plusBtn, this.url)
    }
}