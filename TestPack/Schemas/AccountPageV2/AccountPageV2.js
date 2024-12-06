define("AccountPageV2", ["NsConstantsJS"], function (NsConstantsJSResources) {
  return {
    entitySchemaName: "Account",
    messages: {
      MessageAboutChangeDetailSubscribe: {
        mode: Terrasoft.MessageMode.PTP,
        direction: Terrasoft.MessageDirectionType.SUBSCRIBE,
      },
    },
    attributes: {
      Owner: {
        dataValueType: Terrasoft.DataValueType.LOOKUP,
        lookupListConfig: {
          filters: [
            function () {
              var filterGroup = this.Terrasoft.createFilterGroup();
              filterGroup.addItem(
                Terrasoft.createColumnBetweenFilterWithParameters("Age", 20, 50)
              );
              return filterGroup;
            },
          ],
        },
      },
      "Type": {
        "dataValueType": Terrasoft.DataValueType.LOOKUP,
        "dependencies": [
          {
            columns: ["Type"],
            methodName: "isNsEditVisible",
          },
        ],
      },
      intDate: {
        dataValueType: Terrasoft.DataValueType.INT,
        type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
      },
      lookupOsMobDevice: {
        dataValueType: Terrasoft.DataValueType.LOOKUP,
        type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
        referenceSchemaName: "Contact",
        isLookup: true,
      },
    },
	methods: {
		onEntityInitialized: function () {
        	this.callParent(arguments);
        	this.set("intDate", new Date().getDate());
        	this.set("lookupOsMobDevice", {
          		value: "1F5B7757-2E67-492A-B219-4ED88F38877F",
        		}); 
			//this.prototype();
			//this.fnCallApplyTest();
			/*const obj = Object.create(null);
			const set = new Set([1,1,1,1,2,2,3,3,4,5,6,6,1,5,6,7,4,3,1,2,3,4,2,2]);
			console.log(set);
			for (let key of set)
				console.log(key);
			console.log(set.entries());
			console.log(set.has(8));
			console.log(set.has(1));*/
			
			/*var a = 5;
			var b = "5";
			var c = new Number(3);
			var d = new Number("4");
			var e = new Number("num");
			var f = Math.sqrt(-1);
			console.log(a);
			console.log(b);
			console.log(c);
			console.log(d);
			console.log(e);
			console.log(f);*/
			const arr = new Array(1,2,3,4,5,6);
			if (arr.length > 0)
				console.log("not empty")
			else
				console.log("empty")
			console.log(arr.length);
			console.log(Array.isArray(arr));
			
    	},
		
		fnCallApplyTest: function() {
			const myObject = {
				sumArray: function () {
					var sum = 0;
					for (var i = 0; i < arguments.length; i++) {
       					sum += arguments[i];}
			    	return sum;
				},
				fnCallApply: function () {
					const callVar = this.sumArray.call(null, 1,2,3,4,5);
					console.log(callVar);
					const applyVar = this.sumArray.apply(null, [1,2,3,4,5]);
					console.log(applyVar);
				}
			}		
		},
		
		prototype: function() {
			const soup = new Object ({
				temperature: 25,
				cook: function(){
					console.log("Cook");
				}
			});
			const borsch = Object.create(soup, {
				beet: {
					value: true,
				}
			});			
		},
		
		init: function () {
        	this.callParent(arguments);
        	this.sandbox.subscribe("MessageAboutChangeDetailSubscribe",this.onEntityChanged, this,[this.sandbox.id]);},
      		onEntityChanged: function (recordId) {
        		Terrasoft.showInformation("Что-то произошло");
      			},
      		resultDataContactButtonClick: function () {
        	var primaryContactId = this.get("PrimaryContact").value;
        	var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
          		rootSchemaName: "Contact",
        	});

        esq.addColumn("Name");
        esq.addColumn("MobilePhone");
        esq.addColumn("BirthDate");

        var esqFilter = esq.createColumnFilterWithParameter(
          Terrasoft.ComparisonType.EQUAL,
          "Id",
          primaryContactId
        );
        esq.filters.addItem(esqFilter);
        var message = "";
        /*esq.getEntityCollection(function(result) {
        		if (result.success && result.collection.getCount() > 0) {
            		var contact = result.collection.getItems()[0];
            		message = "Данные основного контакта:\n" +
                   			"Имя контакта: " + contact.get("Name") + "\n" +
                   			"Телефон контакта: " + contact.get("MobilePhone") + "\n" +
                   			"Дата рождения контакта: " + contact.get("BirthDate");
        		} else {
            		message = "Основной контакт не найден";
        		}
				Terrasoft.showInformation(message);
    			}, this);*/
        return new Promise((resolve, reject) => {
          esq.getEntityCollection(function (result) {
            if (
              result.success &&
              result.collection.getCount() > 0 &&
              primaryContactId
            ) {
              var contact = result.collection.getItems()[0];
              message =
                "Данные основного контакта:\n" +
                "Имя контакта: " +
                contact.get("Name") +
                "\n" +
                "Телефон контакта: " +
                contact.get("MobilePhone") +
                "\n" +
                "Дата рождения контакта: " +
                contact.get("BirthDate");
              resolve(message);
            } else {
              reject("Основной контакт не найден.");
            }
          }, this);
        });
      },
      handleGetContactData: function () {
        this.resultDataContactButtonClick()
          .then((message) => {
            Terrasoft.showInformation(message);
          })
          .catch((errorMessage) => {
            Terrasoft.showInformation(errorMessage);
          });
      },
      isNsEditVisible: function () { 
          return this.get("Type")?.value == NsConstantsJSResources.AccountType.Partner;    
      },
    },
    diff: /**SCHEMA_DIFF*/ [
      {
        operation: "insert",
        name: "ButtonDataContact",
        parentName: "ActionButtonsContainer",
        propertyName: "items",
        values: {
          itemType: Terrasoft.ViewItemType.BUTTON,
          caption: "$Resources.Strings.ButtonDataContact",
          click: "$handleGetContactData",
          layout: {
            colSpan: 3,
            rowSpan: 1,
          },
        },
      },

      {
        "operation": "merge",
        "name": "Communications",
		"parentName": "GeneralInfoTab",
		"propertyName": "items",
        "values": {
          visible: "$isNsEditVisible",
        },
      },
    ] /**SCHEMA_DIFF*/,
    details: /**SCHEMA_DETAILS*/ {} /**SCHEMA_DETAILS*/,
  };
});
