 define("OrderPageV2", ["OrderConfigurationConstants"], function(OrderConfigurationConstants) {
    return {
        /* Название схемы объекта страницы записи. */
        entitySchemaName: "Order",
        /* Методы модели представления страницы записи. */
        methods: {
            /* Проверяет стадию заказа для определения доступности пункта меню. */
            isRunning: function() {
                /* Метод возвращает true, если статус заказа [Исполнение], иначе возвращает false. */
                if (this.get("Status")) {
                    return this.get("Status").value === OrderConfigurationConstants.Order.OrderStatus.Running;
                }
                return false;
            },
            /* Метод-обработчик действия. В информационном окне отображает дату выполнения заказа. */
            showOrderInfo: function() {
                /* Получает дату выполнения заказа. */
                var dueDate = this.get("DueDate");
                /* Отображает информационное окно. */
                this.showInformationDialog(dueDate);
            },
            /* Переопределяет базовый виртуальный метод, который возвращает коллекцию действий страницы записи. */
            getActions: function() {
                /* Вызывается родительская реализация метода для получения коллекции проинициализированных действий базовой страницы. */
                var actionMenuItems = this.callParent(arguments);
                /* Добавляет линию-разделитель. */
                actionMenuItems.addItem(this.getButtonMenuItem({
                    Type: "Terrasoft.MenuSeparator",
                    Caption: ""
                }));
                /* Добавляет пункт меню в список действий страницы записи. */
                actionMenuItems.addItem(this.getButtonMenuItem({
                    /* Привязывает заголовок пункта меню к локализуемой строке схемы. */
                    "Caption": {bindTo: "Resources.Strings.InfoActionCaption"},
                    /* Привязывает метод-обработчик действия. */
                    "Tag": "showOrderInfo",
                    /* Привязывает свойство доступности пункта меню к значению, которое возвращает метод isRunning(). */
                    "Enabled": {bindTo: "isRunning"}
                }));
                return actionMenuItems;
            }
        }
    };
});