define("OpportunitySectionV2", [], function () {
  return {
    entitySchemaName: "Opportunity",
    methods: {
      isOwnerForClientSet: function () {
        var activeRow = this.get("ActiveRow");
        if (!activeRow) {
          return false;
        }
        var account = this.get("GridData").get(activeRow).get("Account");
        return account && account.value ? true : false;
      },
      setOwner: function () {
        /* Получение идентификатора выбранной записи. */
        var activeRow = this.get("ActiveRow");
        if (!activeRow) {
          return;
        }
        /* Определение идентификатора основного контакта. */
        var accountId = this.get("GridData")
          .get(activeRow)
          .get("Account").value;
        if (!accountId) {
          return;
        }
        /* Формирование строки адреса. */
        var requestUrl = "CardModuleV2/AccountPageV2/edit/" + accountId;
        /* Публикация сообщения о пополнении истории навигации по страницам и переход на страницу основного контакта. */
        this.sandbox.publish("PushHistoryState", {
          hash: requestUrl,
        });
      },
      getSectionActions: function () {
        var actionMenuItems = this.callParent(arguments);
        actionMenuItems.addItem(
          this.getButtonMenuItem({
            Type: "Terrasoft.MenuSeparator",
            Caption: "",
          })
        );
        actionMenuItems.addItem(
          this.getButtonMenuItem({
            Caption: { bindTo: "Resources.Strings.ShowOwnerForClient" },
            Click: { bindTo: "setOwner" },
            Enabled: { bindTo: "isOwnerForClientSet" },
          })
        );
        return actionMenuItems;
      },
      initFixedFiltersConfig: function () {
        this.callParent(arguments);
        var fixedFilterConfig = {
          entitySchema: this.entitySchema,
          filters: [
            {
              name: "CreatedOn",
              caption: this.get("Resources.Strings.DateCreatedFilterCaption"),
              columnName: "CreatedOn",
              dataValueType: this.Terrasoft.DataValueType.DATE,
              filterType: Terrasoft.FilterType.DATE,
            },
          ],
        };
        this.set("FixedFilterConfig", fixedFilterConfig);
      },
    },
  };
});
