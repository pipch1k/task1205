define("ContactPageV2", ["ext-base", "terrasoft"], function (Ext, Terrasoft) {
  return {
    entitySchemaName: "Contact",
    attributes: {
      Ns_Editable: {
        dataValueType: Terrasoft.DataValueType.BOOLEAN,
        type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
        value: true,
      },
      NsTestString: {
        dataValueType: Terrasoft.DataValueType.STRING,
        dependencies: [
          {
            columns: ["NsTestInt"],
            methodName: "editFieldNsTestString",
          },
        ],
      },
      Owner: {
        dataValueType: Terrasoft.DataValueType.LOOKUP,
        lookupListConfig: {
          filter: function () {
            var filterGroup = this.Terrasoft.createFilterGroup();
            filterGroup.logicalOperation = Terrasoft.LogicalOperatorType.OR;
            filterGroup.addItem(
              Terrasoft.createColumnFilterWithParameter(
                Terrasoft.ComparisonType.EQUAL,
                "Id",
                Terrasoft.SysValue.CURRENT_USER_CONTACT.value
              )
            );
            filterGroup.addItem(
              Terrasoft.createColumnFilterWithParameter(
                Terrasoft.ComparisonType.EQUAL,
                "[Account:Owner].Id",
                this.get("Account")
              )
            );

            return filterGroup;
          },
        },
      },
    },
    modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
    details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
    businessRules: /**SCHEMA_BUSINESS_RULES*/ {} /**SCHEMA_BUSINESS_RULES*/,
    methods: {
      onEntityInitialized: function () {
        this.callParent(arguments);
        this.set("Ns_Editable", false);
        /*var account = Terrasoft.SysValue.CURRENT_USER_CONTACT;
			var data = JSON.stringify(account);
			if (account) {
    			console.log(account);
				console.log(data);
			} else {
    			console.log("Объект контрагента не найден.");
			}
				
			if (this.get("Type"))
				console.log(this.get("Type").displayValue);
				
			var customer = Terrasoft.SysValue.CURRENT_USER_CONTACT;
			var keys = Object.keys(account);
			console.log(keys);
			
			this.CallService();*/
		  this.myServiceCall();
      },
		myServiceCall: function () {
          var name = this.get("Name");
          var serviceData =
            {
                Name: name,
            };
            this.callService("UsrCustomConfigService", "GetContactIdByName",
                function (response) {
                    var result = response.GetContactIdByNameResult;
                    this.showInformationDialog(result);
                },
            serviceData, this);
        },
		
		callService: function (config, methodName, callback, data, scope, requestId) {
    	var serviceName;
		if (config && Ext.isObject(config)) {
			serviceName = config.serviceName;
			methodName = config.methodName;
			callback = config.callback;
			data = config.data;
			scope = config.scope;
			requestId = config.requestId;
		} else {
			serviceName = config;
		}
		var dataSend = data || {};
		var requestUrl = this.buildConfigurationUrl(serviceName, methodName);
		var requestConfig = {
			url: requestUrl,
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			method: "POST",
			jsonData: Ext.encode(dataSend),
			instanceId: requestId,
			callback: function(request, success, response) {
				if (callback) {
					this.callServiceCallback(success, response, callback, this);
				}
			},
			scope: scope || this
		};
		if (config && config.timeout) {
			requestConfig.timeout = config.timeout;
		}
		return Terrasoft.AjaxProvider.request(requestConfig);
  	},

  	callServiceCallback: function (success, response, callback, scope) {
    	var responseObject = response;
    	if (success) {
      	responseObject = Terrasoft.decode(response.responseText);
    	}
    	callback.call(scope, responseObject, success);
  	},
		buildConfigurationUrl: function (serviceName, methodName) {
		const baseUrl = Terrasoft.utils.uri.getConfigurationWebServiceBaseUrl();
		const transferName = 'rest';
		return Terrasoft.combinePath(baseUrl, transferName, serviceName, methodName);
	},

      isNsEditVisible: function () {
        return !this.get("Ns_Editable");
      },

      resultInfoButtonClick: function () {
        var accountName = this.get("Account").displayValue;
        if (accountName.length > 10 && accountName.includes("S")) {
          Terrasoft.showInformation("Account: " + accountName);
        } else {
          Terrasoft.showInformation("Контрагенты не найдены");
        }
      },
    },
    dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
    diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "ButtonInfoNameAccount",
				"values": {
					"itemType": 5,
					"caption": "$Resources.Strings.ButtonInfoNameAccount",
					"click": "$resultInfoButtonClick",
					"layout": {
						"colSpan": 3,
						"rowSpan": 1
					}
				},
				"parentName": "ActionButtonsContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "Typec751fefc-c038-43ce-8c34-3c22856ca35c",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ContactGeneralInfoBlock"
					},
					"bindTo": "Type"
				},
				"parentName": "ContactGeneralInfoBlock",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "Age",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1
					}
				}
			},
			{
				"operation": "move",
				"name": "Age",
				"parentName": "ContactGeneralInfoBlock",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "merge",
				"name": "SalutationType",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 2
					}
				}
			},
			{
				"operation": "insert",
				"name": "NsGroupFieldsTestDiff",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NsGroupFieldsTestDiffGroupCaption"
					},
					"itemType": 15,
					"markerValue": "added-group",
					"items": []
				},
				"parentName": "GeneralInfoTab",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "NsTestBool",
				"values": {
					"visible": true,
					"enabled": true
				},
				"parentName": "NsGroupFieldsTestDiff",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NsTestInt",
				"values": {
					"visible": true,
					"enabled": true
				},
				"parentName": "NsGroupFieldsTestDiff",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "NsTestString",
				"values": {
					"visible": true,
					"enabled": true
				},
				"parentName": "NsGroupFieldsTestDiff",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "NsTestDatetime",
				"values": {
					"visible": true,
					"enabled": true
				},
				"parentName": "NsGroupFieldsTestDiff",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "NsTestLookup",
				"values": {
					"visible": true,
					"enabled": true
				},
				"parentName": "NsGroupFieldsTestDiff",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "GeneralInfoTabGridLayout43b42e51",
				"values": {
					"itemType": 0,
					"items": []
				},
				"parentName": "NsGroupFieldsTestDiff",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "Ns_Editable",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "GeneralInfoTabGridLayout43b42e51"
					}
				},
				"parentName": "GeneralInfoTabGridLayout43b42e51",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "JobTabContainer",
				"values": {
					"order": 2
				}
			},
			{
				"operation": "merge",
				"name": "HistoryTab",
				"values": {
					"order": 5
				}
			},
			{
				"operation": "merge",
				"name": "NotesAndFilesTab",
				"values": {
					"order": 6
				}
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 7
				}
			},
			{
				"operation": "remove",
				"name": "Type"
			},
			{
				"operation": "move",
				"name": "Gender",
				"parentName": "ContactGeneralInfoBlock",
				"propertyName": "items",
				"index": 3
			}
		]/**SCHEMA_DIFF*/,
  };
});
