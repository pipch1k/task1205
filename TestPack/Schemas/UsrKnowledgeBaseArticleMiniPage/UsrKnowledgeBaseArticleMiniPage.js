define("UsrKnowledgeBaseArticleMiniPage",
["terrasoft", "KnowledgeBaseFile", "ConfigurationConstants", "css!UsrKnowledgeBaseArticleMiniPageCss"],
    function(Terrasoft, KnowledgeBaseFile, ConfigurationConstants) {
        return {
            entitySchemaName: "KnowledgeBase",
            attributes: {
                "MiniPageModes": {
                    "value": [this.Terrasoft.ConfigurationEnums.CardOperation.VIEW]
                },
                "Article": {
                    "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                    "referenceSchemaName": "KnowledgeBase"
                }
            },
            methods: {
                init: function() {
                    this.callParent(arguments);
                    this.initExtendedMenuButtonCollections("File", ["Article"], this.close);
                },
                onEntityInitialized: function() {
                    this.callParent(arguments);
                    this.setArticleInfo();
                    this.fillFilesExtendedMenuData();
                },
                fillFilesExtendedMenuData: function() {
                    this.getFiles(this.initFilesMenu, this);
                },
                setArticleInfo: function() {
                    this.set("Article", {
                        value: this.get(this.primaryColumnName),
                        displayValue: this.get(this.primaryDisplayColumnName)
                    });
                },
                getFiles: function(callback, scope) {
                    var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
                        rootSchema: KnowledgeBaseFile
                    });
                    esq.addColumn("Name");
                    var articleFilter = this.Terrasoft.createColumnFilterWithParameter(
                        this.Terrasoft.ComparisonType.EQUAL, "KnowledgeBase", this.get(this.primaryColumnName));
                    var typeFilter = this.Terrasoft.createColumnFilterWithParameter(
                        this.Terrasoft.ComparisonType.EQUAL, "Type", ConfigurationConstants.FileType.File);
                    esq.filters.addItem(articleFilter);
                    esq.filters.addItem(typeFilter);
                    esq.getEntityCollection(function(response) {
                        if (!response.success) {
                            return;
                        }
                        callback.call(scope, response.collection);
                    }, this);
                },
                initFilesMenu: function(files) {
                    if (files.isEmpty()) {
                        return;
                    }
                    var data = [];
                    files.each(function(file) {
                        data.push({
                            caption: file.get("Name"),
                            tag: file.get("Id")
                        });
                    }, this);
                    var recipientInfo = this.fillExtendedMenuItems("File", ["Article"]);
                    this.fillExtendedMenuData(data, recipientInfo, this.downloadFile);
                },
                downloadFile: function(id) {
                    var element = document.createElement("a");
                    element.href = "../rest/FileService/GetFile/" + KnowledgeBaseFile.uId + "/" + id;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
            },
            diff: /**SCHEMA_DIFF*/[
                {
                    "operation": "insert",
                    "name": "Name",
                    "parentName": "HeaderContainer",
                    "propertyName": "items",
                    "index": 0,
                    "values": {
                        "labelConfig": {
                            "visible": true
                        },
                        "isMiniPageModelItem": true
                    }
                },
                {
                    "operation": "insert",
                    "name": "Keywords",
                    "parentName": "MiniPage",
                    "propertyName": "items",
                    "values": {
                        "labelConfig": {
                            "visible": true
                        },
                        "isMiniPageModelItem": true,
                        "layout": {
                            "column": 0,
                            "row": 1,
                            "colSpan": 24
                        }
                    }
                },
                {
                    "operation": "insert",
                    "parentName": "HeaderContainer",
                    "propertyName": "items",
                    "name": "FilesButton",
                    "values": {
                        "itemType": Terrasoft.ViewItemType.BUTTON,
                        "imageConfig": {
                            "bindTo": "Resources.Images.FilesImage"
                        },
                        "extendedMenu": {
                            "Name": "File",
                            "PropertyName": "Article",
                            "Click": {
                                "bindTo": "fillFilesExtendedMenuData"
                            }
                        }
                    },
                    "index": 1
                }
            ]/**SCHEMA_DIFF*/
        };
    });