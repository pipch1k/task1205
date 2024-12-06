define("AccountSectionV2", [
  "BaseFiltersGenerateModule",
  "ProcessModuleUtilities",
], function (BaseFiltersGenerateModule, ProcessModuleUtilities) {
  return {
    entitySchemaName: "Account",
    methods: {
      onOpenPrimaryContactClick: function () {
        var activeRow = this.get("ActiveRow");
        if (!activeRow) {
          return;
        }
        var primaryId = this.get("GridData")
          .get(activeRow)
          .get("PrimaryContact").value;
        if (!primaryId) {
          return;
        }
        var requestUrl = "CardModuleV2/ContactPageV2/edit/" + primaryId;
        this.sandbox.publish("PushHistoryState", { hash: requestUrl });
      },

      onSaved: function () {
        this.callParent(arguments);
        this.getOrderButtonStatus();
      },

      isAccountPrimaryContactSet: function () {
        var activeRow = this.get("ActiveRow");
        if (!activeRow) {
          return false;
        }
        var pc = this.get("GridData").get(activeRow).get("PrimaryContact");
        return pc || pc !== "" ? true : false;
      },
      initFixedFiltersConfig: function () {
        var fixedFilterConfig = {
          entitySchema: this.entitySchema,
          filters: [
            {
              name: "Owner",
              caption: this.get("Resources.Strings.TypeFilterCaption"),
              addOwnerCaption: this.get(
                "Resources.Strings.AddEmployeeFilterCaption"
              ),
              hint: this.get("Resources.Strings.SelectEmployeeFilterHint"),
              columnName: "Type",
              defValue: this.Terrasoft.SysValue.CURRENT_USER_CONTACT,
              dataValueType: this.Terrasoft.DataValueType.LOOKUP,
            },
            {
              name: "Owner1",
              caption: this.get("Resources.Strings.OwnerFilterCaption"),
              columnName: "Owner",
              filter: BaseFiltersGenerateModule.OwnerFilter,
              defValue: this.Terrasoft.SysValue.CURRENT_USER_CONTACT,
              dataValueType: this.Terrasoft.DataValueType.LOOKUP,
            },
          ],
        };
        this.set("FixedFilterConfig", fixedFilterConfig);
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
            Caption: {
              bindTo: "Resources.Strings.CreationStartProcessActionCaption",
            },
            Click: { bindTo: "startBusinessProcess" },
            Enabled: { bindTo: "isCustomActionEnabled" },
          })
        );
        return actionMenuItems;
      },
      startBusinessProcess: function () {
        var args = {
          sysProcessName: "NsBusProcessAccount",
          parameters: { AccountId: this.get("ActiveRow") },
        };
        ProcessModuleUtilities.executeProcess(args);
      },
      isCustomActionEnabled: function () {
        var activeRowId = this.get("ActiveRow");
        var selectedRows = this.get("SelectedRows");
        if (selectedRows.length == 0 && activeRowId) return true;
        else return false;
      },
    },
    diff: /**SCHEMA_DIFF*/ [
      {
        operation: "insert",
        parentName: "ActionButtonsContainer",
        propertyName: "items",
        name: "MainContactSectionButton",
        values: {
          itemType: Terrasoft.ViewItemType.BUTTON,
          caption: {
            bindTo: "Resources.Strings.OpenPrimaryContactButtonCaption",
          },
          click: { bindTo: "onOpenPrimaryContactClick" },
          enabled: { bindTo: "isAccountPrimaryContactSet" },
          layout: {
            column: 1,
            row: 6,
            colSpan: 1,
          },
        },
      },
    ] /**SCHEMA_DIFF*/,
  };
});
