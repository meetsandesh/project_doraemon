(function ($) {
    $.fn.field_panel_2 = function (options) {
	this.settings = $.extend({
	    base_url: '',
	    fetch_fields_url: '',
	    submit_fields_url: '',
	    with_popup: false,
	    heading: '',
	    show_next_button: false,
	    host: 'ECM',
	    cancel_fields_url: '',
	    data_entry_panel: false,
	    cancel_action_exist: false,
	    editable: true,
	    case_id: ''
	}, options);
	var _formAttributes = {
	    base_url: '',
	    entity_id: '5000045',
	    type: 'CASE',
	    field_type: 'USER',
	    fields_def: [],
	    fields_data: [],
	    host: 'ECM'
	};
	var _fieldsDefCache = {};
	var rootElement = this;
	var attributes = this.settings;
	var _withPopupFormat = '<div class="popupContainer">' +
	    '<div class="popupHeading"></div>' +
	    '<div class="popupContent"><div class="form_data_field"></div></div>' +
	    '<div class="popupBtn">' +
	    '<a href="javascript:void(0);" tabindex="23" class="secondaryBtn closePopup" >' + 'Cancel' + '</a>' +
	    '</div>' +
	    '</div>';
	var _withoutPopupFormat = '<div id="form" class="data_entry_field">' +
	    '<div id="form_title" class="form_title"></div>' +
	    '<div id="field_form" class="indexing_form_content">' +
	    '<div class="form_data_field"></div>' +
	    '</div>' +
	    '<div id="nextbutton" class="bottomBtns ecm-clearfix"></div>' +
	    '</div>';
	var heading = '<h3 class="indexing_heading">' + attributes.heading + '</h3>';
	var popupHeading = '<h3 class="indexing_heading">' + attributes.heading + '</h3>';
	var _bindContent = function () {
	    if (attributes.with_popup) {
		rootElement.addClass("emcpopupOverlay casePopup");
		rootElement.hide();
		rootElement.append(_withPopupFormat);
		rootElement.find(".popupHeading").append(popupHeading);
		rootElement.find(".popupContent").append(_withoutPopupFormat);
		rootElement.find(".closePopup").attr("href", "javascript:void(0);");
	    } else {
		rootElement.addClass("casePopup");
		rootElement.append(_withoutPopupFormat);
		rootElement.find("#form_title").append(heading);
		_showNextButton();
		_initSubmitButton();
		_showSubmitButton();
	    }
	    if (attributes.cancel_action_exist) {
		var url = attributes.base_url + attributes.cancel_fields_url;
		rootElement.find(".closePopup").attr("href", url);
	    }
	    rootElement.find(".form_data_field").ecm_fields_renderer();
	};
	var _setScroll = function () {
	    //Scrollbar for data entry panel
	    if (attributes.data_entry_panel) {
		var fi = window.innerHeight - $(".form_data_entry").offset().top - 90;
		rootElement.find(".form_data_field").height(fi);
		rootElement.find(".data_entry_field .bottomBtns").css({"bottom": 0});
		setTimeout(function () {
		    rootElement.find(".form_data_field").mCustomScrollbar();
		}, 10);
	    }

	    //Scrollbar except of data entry panel
	    if (!attributes.data_entry_panel) {
		var ach = rootElement.find(".popupContainer").height() - 134;
		rootElement.find(".form_data_field").height(ach);
		rootElement.find(".form_data_field").mCustomScrollbar();
	    }
	};
	var _initSubmitButton = function () {
	    if (!attributes.with_popup) {
		var html = '<button id="field_panel_submit" tabindex="80" class="secondaryBtn nextBtn">' + 'Submit' + '</button>';
		rootElement.find('#nextbutton').append(html);
		rootElement.find("#field_panel_submit").on("click", function () {
		    rootElement.find(".form_data_field").trigger('efr_validate_and_get_data');
		});
	    }
	};
	var _showSubmitButton = function () {
	    if (!attributes.with_popup) {
		if (_formAttributes.fields_def.length == 0) {
		    rootElement.find('#field_panel_submit').hide();
		} else {
		    rootElement.find('#field_panel_submit').show();
		}
	    }
	};
	var _showNextButton = function () {
	    if (attributes.show_next_button) {
		rootElement.find('#nextbutton').html('<button id="field_panel_next" tabindex="80" class="secondaryBtn nextBtn">' + 'Next' + '</button>');
		rootElement.find("#field_panel_next").on("click", function () {
		    var alert_type = "success";
		    rootElement.trigger("show_alert", [ide.popup.next.button.message, alert_type]);
		    rootElement.trigger('fp_flip_next');
		});
	    }
	};
	var _initFields = function () {
	    rootElement.find(".form_data_field").trigger("efr_remove_previous_fields");
	    rootElement.find(".form_data_field").trigger("efr_paint", _formAttributes);
	};
	var _bindCustomEvents = function () {
	    var enterKey = true;
	    rootElement.on('click', function (e) {
		e.stopPropagation();
		enterKey = true;
	    });
	    $("body").on('click', function (e) {
		enterKey = false;
	    });
	    rootElement.on('keydown', function (event) {
		if (enterKey) {
		    if (event.keyCode == 13) {
			_submitForm();
		    }
		}
	    });
	    if (attributes.with_popup) {
		rootElement.find(".closePopup").off('click').on("click", function () {
		    rootElement.hide();
		    show_of_dom();
		});
	    }
	};
	var _submitForm = function () {
	    console.log("SUBMIT");
	};
	var _bindActionOnInit = function () {
	    rootElement.on("fp_refresh", function (event, json) {
		_unbind();
		_formAttributes.entity_id = json.id;
		_formAttributes.type = json.type;
		_formAttributes.field_type = json.field_type;
		if (_fieldsDefCache.hasOwnProperty(_formAttributes.host + "_" + _formAttributes.type + "_" + _formAttributes.field_type)) {
		    _formAttributes.fields_def = _fieldsDefCache[_formAttributes.host + "_" + _formAttributes.type + "_" + _formAttributes.field_type];
		    _initFields();
		    _showSubmitButton();
		} else {
//					_fetchFields().done(function(){
//						_initFields();
//						_showSubmitButton();
//					});
		    _fetchFields();
		    _initFields();
		    _showSubmitButton();
		}
	    });
	    rootElement.on("efr_emitted_data", function (event, json) {
		console.log(json);
		_submitForm();
	    });
	};
	var _init = function () {
	    _formAttributes.base_url = attributes.base_url;
	    _formAttributes.host = attributes.host;
	    _bindContent();
	    _bindActionOnInit();
	    _bindCustomEvents();
	};
	var _fetchFields = function () {
	    var data = [];
	    if (_formAttributes.type == "CASE") {
		data = [
		    {
			code: 'ONE',
			displayName: 'One',
			mandatory: false,
			validationRegex: null
		    },
		    {
			code: 'TWO',
			displayName: 'Two',
			mandatory: true,
			validationRegex: null
		    },
		    {
			code: 'THREE',
			displayName: 'Three',
			mandatory: false,
			validationRegex: '^([A-Z]*)$'
		    },
		    {
			code: 'FOUR',
			displayName: 'Four',
			mandatory: true,
			validationRegex: '^([a-z]*)$'
		    }
		];
	    }
	    _formAttributes.fields_def = data;
	    _fieldsDefCache[_formAttributes.host + "_" + _formAttributes.type + "_" + _formAttributes.field_type] = data;
	    console.log(_fieldsDefCache);
//			var temp = attributes.base_url + attributes.fetch_fields_url + "?host=" + _formAttributes.host + "&type=" + _formAttributes.type + "&fieldType=" + _formAttributes.field_type;
//			return $.ajax({
//				url: temp,
//				type: 'GET',
//				dataType: 'json',
//				contentType: "application/json",
//				success: function (data) {
//					console.log(data);
//					_formAttributes.fields_def = data;
//					_fieldsDefCache[_formAttributes.host+"_"+_formAttributes.type+"_"+_formAttributes.field_type]=data;
//				},
//				error: function (msg) {
//					var alert_msg;
//					if (msg.responseText !== null) {
//						msg.responseText = JSON.parse(msg.responseText);
//						if (msg.responseText.message !== null) {
//							alert_msg = msg.responseText.message;
//						}
//						else {
//							alert_msg = msg.statusText;
//						}
//					}
//					else {
//						alert_msg = msg.statusText;
//					}
//					var alert_type = "error";
//					rootElement.trigger("show_alert", [alert_msg, alert_type]);
//				}
//			});
	};
	var _unbind = function () {
	    rootElement.off('keydown');
	};
	this.destroy = function () {

	};
	_init();
	return this;
    };
}(jQuery));