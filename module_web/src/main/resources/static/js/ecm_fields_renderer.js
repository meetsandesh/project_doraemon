(function ($) {
    $.fn.ecm_fields_renderer = function (options) {
	this.settings = $.extend({
	    fields: {},
	    containers: {},
	    form_data: [],
	    entity_id: '',
	    type: '',
	    field_type: '',
	    fields_def: [],
	    fields_data: [],
	    base_url: '',
	    host: 'ECM'
	}, options);
	var _pluginLoaded = true;
	var _fieldsLoaded = [];
	var attributes = this.settings;
	var rootElement = this;
	var _bindAction = function () {
	    rootElement.on("efr_paint", function (event, json) {
		_pluginLoaded = false;
		$("body").removeClass("load_content");
		attributes.fields_def = json.fields_def;
		attributes.fields_data = json.fields_data;
		attributes.entity_id = json.entity_id;
		attributes.type = json.type;
		attributes.field_type = json.field_type;
		attributes.host = json.host;
		attributes.base_url = json.base_url;
		for (var i = 0; i < attributes.fields_def.length; i++) {
		    _fieldsLoaded[attributes.fields_def[i].code] = false;
		    var value = '';
		    for (var k = 0; k < attributes.fields_data.length; k++) {
			if (attributes.fields_data[k].code == attributes.fields_def[i].code) {
			    value = attributes.fields_data[k].value;
			    break;
			}
		    }
		    var tempFieldVO = attributes.fields_def[i];
		    if (value != '' || value == false) {
			tempFieldVO['value'] = value;
		    }
		    tempFieldVO['type'] = attributes.type;
		    tempFieldVO['base_url'] = attributes.base_url;
		    rootElement.append("<div id='field_container_" + attributes.fields_def[i].code + "' class='forn_content_enity'></div>");
		    attributes.containers[attributes.fields_def[i].code] = rootElement.find("#field_container_" + attributes.fields_def[i].code);
		    attributes.fields[attributes.fields_def[i].code] = _getPlugin(tempFieldVO, attributes.containers[attributes.fields_def[i].code]);
		}
		while (!_pluginLoaded) {
		    _pluginLoaded = true;
		    for (var i = 0; i < attributes.fields_def.length; i++) {
			_pluginLoaded = _pluginLoaded && _fieldsLoaded[attributes.fields_def[i].code];
		    }
		    if (_pluginLoaded) {
			$("body").addClass("load_content");
			break;
		    }
		}
		//focus 1st field of form
		if (attributes.fields_def.length > 0) {
		    attributes.fields[attributes.fields_def[0].code].trigger("set_focus");
		}
	    });
	    rootElement.on('efr_show_form_error', function (event, json) {
		showError(json.error);
	    });
	    rootElement.on('efr_remove_form_error', function () {
		removeError();
	    });
	    rootElement.on('efr_field_loaded', function (event, json) {
		_fieldsLoaded[json.code] = true;
	    });
	    rootElement.on("efr_validate_and_get_data", function () {
		debugger;
		var valid_fields = true;
		var errorFieldsIndex = [];
		for (var i = 0; i < attributes.fields_def.length; i++) {
		    var tempval = attributes.fields[attributes.fields_def[i].code].isValid();
		    if (valid_fields && !tempval) {
			errorFieldsIndex.push(i);
		    }
		    valid_fields = valid_fields && tempval;
		}
		if (valid_fields) {
		    _emitData();
		    rootElement.trigger("efr_emitted_data", {form_data: attributes.form_data});
		} else {
		    attributes.fields[attributes.fields_def[errorFieldsIndex[0]].code].trigger("set_focus");
		}
	    });
	    rootElement.on("efr_remove_previous_fields", function () {
		for (var i = 0; i < attributes.fields_def.length; i++) {
		    attributes.fields[attributes.fields_def[i].code].destroy();
		    attributes.containers[attributes.fields_def[i].code].remove();
		    delete attributes.containers[attributes.fields_def[i].code];
		    delete attributes.fields[attributes.fields_def[i].code];
		}
	    });
	};
	var _emitData = function () {
	    for (var i = 0; i < attributes.fields_def.length; i++) {
		var temp = {};
		temp['code'] = attributes.fields_def[i].code;
		temp['value'] = attributes.fields[attributes.fields_def[i].code].getValue();
		attributes.form_data.push(temp);
	    }
	};
	var _getPlugin = function (fieldVO, fieldRootElement) {
	    var plugin;
	    var ct = fieldVO.controlType;
	    var dt = fieldVO.dataType;
	    if (ct != "" && ct != null) {
		ct = ct.toLowerCase();
		if (ct == 'text') {
		    plugin = fieldRootElement.input_text(fieldVO);
		} else if (ct == 'drop_down') {
		    plugin = fieldRootElement.drop_down(fieldVO);
		} else if (ct == 'auto_complete') {
		    plugin = fieldRootElement.input_auto_complete(fieldVO);
		} else if (ct == 'input_number') {
		    plugin = fieldRootElement.input_number(fieldVO);
		} else if (ct == 'date') {
		    plugin = fieldRootElement.input_date(fieldVO);
		}
	    } else if (dt != "" && dt != null) {
		dt = dt.toLowerCase();
		if (dt == 'text') {
		    plugin = fieldRootElement.input_text(fieldVO);
		} else if (dt == 'reference') {
		    plugin = fieldRootElement.drop_down(fieldVO);
		} else if (dt == 'numeric') {
		    plugin = fieldRootElement.input_number(fieldVO);
		} else if (dt == 'date') {
		    plugin = fieldRootElement.input_date(fieldVO);
		}
	    } else {
		plugin = fieldRootElement.input_text(fieldVO);
	    }
	    return plugin;
	};
	var _init = function () {
	    _bindAction();
	};
	_init();
	return this;
    };
    $.fn.input_text = function (options) {
	this.settings = $.extend({
	    displayName: '',
	    code: '',
	    value: '',
	    mandatory: false,
	    validate: false
	}, options);
	var rootElement = this;
	var attributes = this.settings;
	var _bindContent = function () {
	    var mandatory = '';
	    var mandatoryAsterisk = '';
	    if (attributes.mandatory) {
		mandatory = ' mandatory ';
		mandatoryAsterisk = '<span class="red_asterisk">*</span>';
	    }
	    var html = '<div id="' + attributes.code + '" class="">' +
		'<label class="text" id="label_' + attributes.code + '">' + attributes.displayName + mandatoryAsterisk + '</label>' +
		'<div class="" id="div_' + attributes.code + '">' +
		'<input  type="text" class="form-control input_text_field" id="text_' + attributes.code + '" name="text_' + attributes.code + '" value="' + attributes.value + '" ' + mandatory + ' />' +
		'</div>' +
		'<span id="error_' + attributes.code + '" class="" style="display:none;"></span>'
	    '</div>';
	    rootElement.append(html);
	};
	var _bindAction = function () {
	    var typed = false;
	    rootElement.find('#text_' + attributes.code).on("setVal", function () {
		var val = rootElement.find('#text_' + attributes.code).val();
		rootElement.setValue(val);
	    });
	    rootElement.find('#text_' + attributes.code).focusout(function () {
		if (typed) {
		    rootElement.find('#text_' + attributes.code).trigger("setVal");
		}
		if (attributes.value == "") {
		    rootElement.find("#" + attributes.code).removeClass("activeInput");
		}

	    });
	    rootElement.find('#text_' + attributes.code).on("keyup", function (event) {
		// 9 is the keycode for tab key
		if (event.which != 9) {
		    typed = true;
		}
	    });
	    rootElement.on("set_focus", function (event) {
		rootElement.find('#text_' + attributes.code).focus();
	    });
	    rootElement.find('#text_' + attributes.code).focusin(function () {
		rootElement.find("#" + attributes.code).addClass("activeInput");
	    });
	    rootElement.on("reset_value", function (event) {
		//do whatever u want
		attributes.value = '';
		rootElement.find('#text_' + attributes.code).val('');
		rootElement.find("#" + attributes.code).removeClass("activeInput");
	    });
	};
	var _init = function () {
	    _bindContent();
	    _bindAction();
	    if (attributes.value != '') {
		rootElement.setValue(attributes.value);
	    }
	    rootElement.trigger("efr_field_loaded", {code: attributes.code});
	};
	var showError = function (error) {
	    rootElement.find('#' + attributes.code).addClass("contains_error");
	    var errors = "";
	    for (var z = 0; z < error.length; z++) {
		errors += error[z] + "<br>";
	    }
	    rootElement.find('#error_' + attributes.code).html(errors);
	    rootElement.find('#error_' + attributes.code).show();
	};
	var removeError = function () {
	    rootElement.find('#' + attributes.code).removeClass("contains_error");
	    rootElement.find('#error_' + attributes.code).html("");
	    rootElement.find('#error_' + attributes.code).hide();
	};
	var _validateValue = function (val) {
	    val = $.trim(val);
	    //validation for mandatory
	    var error = [];
	    if (attributes.mandatory && (val == "" || val == null)) {
		var errorMsg = "notEmpty";
		error.push(errorMsg);
	    }
	    if (attributes.validationRegex != null) {
		var regex = new RegExp(attributes.validationRegex);
		var matches = regex.test(val);
		if (!matches) {
		    var errorMsg = "notMatches";
		    error.push(errorMsg);
		}
	    }
	    //showing errors if exists
	    if (error.length != 0) {
		attributes.validate = false;
		showError(error);
	    } else {
		attributes.validate = true;
		removeError();
	    }
	};
	this.setValue = function (val) {
	    _validateValue(val);
	    if (attributes.validate) {
		attributes.value = val;
		rootElement.find('#text_' + attributes.code).val(val);
	    }
	};
	this.getValue = function () {
	    if (!rootElement.is(":visible")) {
		attributes.value = '';
	    }
	    return attributes.value;
	};
	this.isValid = function () {
	    if (!rootElement.is(":visible")) {
		attributes.validate = true;
	    } else {
		_validateValue(attributes.value);
	    }
	    return attributes.validate;
	};
	this.destroy = function () {
	    rootElement.find('#text_' + attributes.code).off("setVal");
	    rootElement.find('#text_' + attributes.code).off("keyup");
	    rootElement.off("set_focus");
	    rootElement.off("reset_value");
	    rootElement.find("#" + attributes.code).remove();
	};
	_init();
	return this;
    };
    $.fn.input_number = function (options) {
	this.settings = $.extend({
	    displayName: '',
	    code: '',
	    value: '',
	    mandatory: false,
	    validate: false,
	}, options);
	var rootElement = this;
	var attributes = this.settings;
	var _bindContent = function () {
	    var mandatory = '';
	    if (attributes.mandatory) {
		mandatory = ' mandatory ';
	    }
	    var tempName = "";
	    if (attributes.dataType == "NUMERIC") {
		tempName = "numeric";
	    } else {
		tempName = "decimal";
	    }
	    var html = '<div id="' + attributes.code + '" class="">' +
		'<label class="text" id="label_' + attributes.code + '">' + attributes.displayName + '</label>' +
		'<div class="" id="div_' + attributes.code + '">' +
		'<input  type="text" class="form-control input_text_field" id="text_' + attributes.code + '" name="' + tempName + '" value="' + attributes.value + '" ' + mandatory + ' />' +
		'</div>' +
		'<span id="error_' + attributes.code + '" class="" style="display:none;"></span>' +
		'</div>';
	    rootElement.append(html);
	    if (attributes.dataType == "NUMERIC") {
		rootElement.find("#text_" + attributes.code).inputmask("integer");
	    } else if (attributes.displayStyle == "DECIMAL") {
		rootElement.find("#text_" + attributes.code).inputmask("decimal");
	    }
	};
	var _bindAction = function () {
	    var typed = false;
	    rootElement.find('#text_' + attributes.code).on("setVal", function () {
		var val = rootElement.find('#text_' + attributes.code).val();
		rootElement.setValue(val);
	    });
	    rootElement.find('#text_' + attributes.code).focusout(function () {
		if (typed) {
		    rootElement.find('#text_' + attributes.code).trigger("setVal");
		}
		if (attributes.value == "") {
		    rootElement.find("#" + attributes.code).removeClass("activeInput");
		}
	    });
	    rootElement.find('#text_' + attributes.code).on("keyup", function (event) {
		// 9 is the keycode for tab key
		if (event.which != 9) {
		    typed = true;
		}
	    });
	    rootElement.on("set_focus", function (event) {
		rootElement.find('#text_' + attributes.code).focus();
	    });
	    rootElement.find('#text_' + attributes.code).focusin(function () {
		rootElement.find("#" + attributes.code).addClass("activeInput");
	    });
	};
	var showError = function (error) {
	    rootElement.find('#' + attributes.code).addClass("contains_error");
	    var errors = "";
	    for (var z = 0; z < error.length; z++) {
		errors += error[z] + "<br>";
	    }
	    rootElement.find('#error_' + attributes.code).html(errors);
	    rootElement.find('#error_' + attributes.code).show();
	};
	var removeError = function () {
	    rootElement.find('#' + attributes.code).removeClass("contains_error");
	    rootElement.find('#error_' + attributes.code).html("");
	    rootElement.find('#error_' + attributes.code).hide();
	};
	var init = function () {
	    _bindContent();
	    _bindAction();
	    if (attributes.value != '' || attributes.value === 0) {
		var val = attributes.value;
		rootElement.setValue(val);
	    }
	    rootElement.trigger("efr_field_loaded", {code: attributes.code});
	};
	var _validateValue = function (val) {
	    //validation for mandatory
	    var error = [];
	    if (attributes.mandatory == true && (val == "" || val == null)) {
		var errorMsg = $.i18n.prop("notEmpty");
		error.push(errorMsg);
	    }
	    //showing errors if exists
	    if (error.length != 0) {
		attributes.validate = false;
		showError(error);
	    } else {
		attributes.validate = true;
		removeError();
	    }
	};
	this.setValue = function (val) {
	    val = String(val).replace(/,/g, "");
	    _validateValue(val);
	    if (attributes.validate) {
		attributes.value = val;
	    }
	};
	this.getValue = function () {
	    if (!rootElement.is(":visible")) {
		attributes.value = '';
	    }
	    return attributes.value;
	};
	this.isValid = function () {
	    if (!rootElement.is(":visible")) {
		attributes.validate = true;
	    } else {
		_validateValue(attributes.value);
	    }
	    return attributes.validate;
	};
	this.destroy = function () {
	    rootElement.find('#text_' + attributes.code).off("setVal");
	    rootElement.find('#text_' + attributes.code).off("keyup");
	    rootElement.off("set_focus");
	    rootElement.find("#" + attributes.code).remove();
	};
	init();
	return this;
    };
    $.fn.drop_down = function (options) {
	this.settings = $.extend({
	    displayName: '',
	    code: '',
	    value: '',
	    mandatory: false,
	    validate: false
	}, options);
	var rootElement = this;
	var data = [];
	var attributes = this.settings;
	var _bindContent = function () {
	    var html = '<div id="' + attributes.code + '" class="">' +
		'<label class="text" id="label_' + attributes.code + '">' + attributes.displayName + '</label>' +
		'<div class="" id="div_' + attributes.code + '">' +
		'<select  class="form-control input_text_field" id="dropdown_' + attributes.code + '" name="dropdown_' + attributes.code + '" value="' + attributes.value + '" ><option value="" class="default">-- Select --</option></select>' +
		'</div>' +
		'<span id="error_' + attributes.code + '" class="error_field" style="display:none;"></span>' +
		'</div>';

	    var listElement = '<option class="provided_options" data-filterField="" value="" class=""></option>';
	    rootElement.append(html);
	    _getDropDownData().done(function (list) {
		$.each(list, function (i) {
		    var options = {};
		    options['label'] = list[i]['name'];
		    options['value'] = list[i]['code'];
		    data.push(options);
		});
		for (var i = 0; i < data.length; i++) {
		    rootElement.find("#dropdown_" + attributes.code).append(listElement);
		    rootElement.find("#dropdown_" + attributes.code + ">option:last-child").text(data[i].label);
		    rootElement.find("#dropdown_" + attributes.code + ">option:last-child").attr("value", data[i].value);
		}
		_bindAction();
		rootElement.find('#dropdown_' + attributes.code).val(attributes.value);
		rootElement.trigger("efr_field_loaded", {code: attributes.code});
	    });
	};
	var _getDropDownData = function () {
	    var temp = attributes.base_url + '/app/fields2/getDropDownOptions?type=' + attributes.type + '&fieldCode=' + attributes.code;
	    return $.ajax({
		url: temp,
		type: 'GET',
		dataType: 'json',
		contentType: "application/json",
		error: function (msg) {
		    var alert_msg;
		    if (msg.responseText !== null) {
			msg.responseText = JSON.parse(msg.responseText);
			if (msg.responseText.message !== null) {
			    alert_msg = msg.responseText.message;
			} else {
			    alert_msg = msg.statusText;
			}
		    } else {
			alert_msg = msg.statusText;
		    }
		    var alert_type = "error";
		    rootElement.trigger("show_alert", [alert_msg, alert_type]);
		}
	    });
	};
	var _bindAction = function () {
	    rootElement.on("set_focus", function (event) {
		rootElement.find('#' + attributes.code + " select").focus();
	    });
	    rootElement.on("change", "#dropdown_" + attributes.code, function () {
		var value = $(this).val();
		//console.log(value);
		rootElement.setValue(value);
	    });
	};
	var init = function () {
	    _bindContent();

	};
	var showError = function (error) {
	    rootElement.find('#' + attributes.code).addClass("contains_error");
	    var errors = "";
	    for (var z = 0; z < error.length; z++) {
		errors += error[z] + "<br>";
	    }
	    rootElement.find('#error_' + attributes.code).html(errors);
	    rootElement.find('#error_' + attributes.code).show();
	};
	var removeError = function () {
	    rootElement.find('#' + attributes.code).removeClass("contains_error");
	    rootElement.find('#error_' + attributes.code).html("");
	    rootElement.find('#error_' + attributes.code).hide();
	};
	var _validateValue = function (val) {
	    //validation for mandatory
	    var error = [];
	    if (attributes.mandatory == true && (val == "" || val == null)) {
		var errorMsg = $.i18n.prop("notEmpty");
		error.push(errorMsg);
	    }
	    //showing errors if exists
	    if (error.length != 0) {
		attributes.validate = false;
		showError(error);
	    } else {
		attributes.validate = true;
		removeError();
	    }
	};
	this.setValue = function (val) {
	    _validateValue(val);
	    if (attributes.validate) {
		attributes.value = val;
	    }
	};
	this.getValue = function () {
	    if (!rootElement.is(":visible")) {
		attributes.value = '';
	    }
	    return attributes.value;
	};
	this.isValid = function () {
	    if (!rootElement.is(":visible")) {
		attributes.validate = true;
	    } else {
		_validateValue(attributes.value);
	    }
	    return attributes.validate;
	};
	this.destroy = function () {
	    rootElement.off("set_focus");
	    rootElement.find('#dropdown_' + attributes.code).off("change");
	    rootElement.find("#" + attributes.code).remove();
	};
	init();
	return this;
    };
    $.fn.input_auto_complete = function (options) {
	this.settings = $.extend({
	    displayName: '',
	    code: '',
	    value: '',
	    mandatory: false,
	    validate: false,
	    dependantValue: ''
	}, options);
	var rootElement = this;
	var attributes = this.settings;
	var ACPlugin = null;
	var _bindContent = function () {
	    var html = '<div id="' + attributes.code + '" class="input_style1 form_box_li">' +
		'<label class="label" id="label_' + attributes.code + '">' + attributes.displayName + '</label>' +
		'<div class="input_box" id="div_' + attributes.code + '">' +
		'<input  type="text" class="form-control input_text noSlideInput" id="text_' + attributes.code + '" name="text_' + attributes.code + '"  />' +
		'</div>' +
		'<span id="error_' + attributes.code + '" class="error_field" style="display:none;"></span>' +
		'</div>';
	    rootElement.append(html);
	    if (attributes.value == '') {
		_applyPlugin();
	    } else {
		if (attributes.value != '-1' && attributes.value != null && attributes.value != '') {
		    $.ajax({
			dataType: "json",
			data: {
			    fieldCode: attributes.code,
			    text: attributes.value,
			    dependantValue: attributes.dependantValue
			},
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			beforeSend: function (xhr) {
			    var token = $("meta[name='_csrf']").attr("content");
			    var header = $("meta[name='_csrf_header']").attr("content");
			    if (header != '') {
				xhr.setRequestHeader(header, token);
			    }
			},
			url: 'rest/setoption',
			success: function (data) {
			    _applyPlugin();
			    ACPlugin.val(data[0].name).data('autocomplete');
			    rootElement.find("#" + attributes.code).addClass("activeInput");
			    attributes.value = data[0].code;
			},
			error: function (data) {
			    console.log("No match found on server");
			    _applyPlugin();
			}
		    });
		} else {
		    _applyPlugin();
		    attributes.value = "-1";
		    ACPlugin.val("Others").data('autocomplete');
		}
	    }
	};
	var _applyPlugin = function () {
	    ACPlugin = rootElement.find("#text_" + attributes.code).autocomplete({
		source: function (request, response) {
		    var error = Validators.validate(attributes, request.term);
		    if (error.length != 0) {
			showError(error);
		    } else {
			removeError();
			attributes.value = '';
			$.ajax({
			    dataType: "json",
			    data: {
				fieldCode: attributes.code,
				text: request.term,
				dependantValue: attributes.dependantValue,
			    },
			    type: 'GET',
			    contentType: 'application/json; charset=utf-8',
			    url: 'rest/getoptions',
			    beforeSend: function (xhr) {
				var token = $("meta[name='_csrf']").attr("content");
				var header = $("meta[name='_csrf_header']").attr("content");
				if (header != '') {
				    xhr.setRequestHeader(header, token);
				}
			    },
			    success: function (data) {
				if (attributes.optionConfig.enableOthersOption) {
				    data.push({
					name: "Others",
					code: "-1"
				    });
				}
				response($.map(data, function (item) {
				    return {
					label: item.name,
					value: item.name,
					data: item
				    };
				}));
				if (data.length == 0) {
				    var errorMsg = $.i18n.prop("noDataFound");
				    var error = [errorMsg];
				    rootElement.trigger("show_error", {error: error});
				}
			    },
			    error: function (data) {
				console.log("No match found on server");
			    }
			});
		    }
		},
		open: function () {
		    var getIdopenAuto = $(this).closest(".input_box").attr("id");
		    $(this).autocomplete("widget").appendTo("#" + getIdopenAuto)
			.css({"top": "100%", "left": "0px"});
		},
		minLength: parseInt(attributes.optionConfig.minLengthForFilter),
		autoFocus: true,
		delay: 600,
		select: function (event, ui) {
		    event.preventDefault();
		    var json = {
			code: ui.item.data.code,
			name: ui.item.data.name
		    };
		    rootElement.find("#text_" + attributes.code).val(json.name);
		    rootElement.trigger("ac_val_selected", json);
		}
	    });
//			}).focus(function(){
//				$(this).data("uiAutocomplete").search($(this).val());
//			});
	};
	var _bindAction = function () {
	    var typed = false;
	    rootElement.find('#text_' + attributes.code).on("keyup", function (event) {
		if (event.which == 8) {
		    rootElement.setValue("");
		    rootElement.find('#text_' + attributes.code).val("");
		}
		if (event.which != 9 && event.which != 13) {
		    typed = true;
		    attributes.value = "";
		}
	    });
	    rootElement.on("ac_val_selected", function (event, json) {
		rootElement.setValue(json.code);
	    });
	    rootElement.find('#text_' + attributes.code).focusout(function () {
		if (rootElement.find('#text_' + attributes.code).val() == "") {
		    rootElement.find("#" + attributes.code).removeClass("activeInput");
		    if (typed == true) {
			rootElement.setValue("");
		    }
		}
		if (attributes.value == "") {
		    rootElement.find("#" + attributes.code).removeClass("activeInput");
		    rootElement.find('#text_' + attributes.code).val("");
		}
		if (typed == true) {
		    rootElement.isValid();
		}
		var json = {
		    code: attributes.code,
		    value: attributes.value
		};
		rootElement.trigger("broadcasting_value", json);
	    });
	    rootElement.find('#text_' + attributes.code).focusin(function () {
		rootElement.find("#" + attributes.code).addClass("activeInput");
	    });
	    rootElement.on("set_focus", function (event) {
		rootElement.find('#text_' + attributes.code).focus();
	    });
	    rootElement.on("broadcasted_value", function (event, json) {
		BehaviourUtils.behave(attributes, json);
	    });
	    rootElement.on("dependant_choices", function (event, json) {
		if (attributes.dependantValue != json.value) {
		    attributes.dependantValue = json.value;
		    rootElement.setValue("");
		    attributes.validate = false;
		    removeError();
		    attributes.value = '';
		    rootElement.find('#text_' + attributes.code).val("");
		    rootElement.find("#" + attributes.code).removeClass("activeInput");
		    var json = {
			code: attributes.code,
			value: attributes.value
		    };
		    rootElement.trigger("broadcasting_value", json);
		}
	    });
	    rootElement.on("reset_value", function (event) {
		rootElement.setValue("");
		rootElement.find('#text_' + attributes.code).val("");
		rootElement.find("#" + attributes.code).removeClass("activeInput");
	    });
	    rootElement.on("show_error", function (event, json) {
		showError(json.error);
	    });
	    rootElement.on("visibility", function (event, json) {
		//do whatever u want
		if (json.status) {
		    rootElement.show();
		} else {
		    rootElement.hide();
		    rootElement.trigger("reset_value");
		}
	    });
	};
	var _init = function () {
	    _bindContent();
	    _bindAction();
	    if (attributes.value != '') {
		rootElement.setValue(attributes.value);
	    }
	};
	var showError = function (error) {
	    rootElement.find('#' + attributes.code).addClass("contains_error");
	    var errors = "";
	    for (var z = 0; z < error.length; z++) {
		errors += error[z] + "<br>";
	    }
	    rootElement.find('#error_' + attributes.code).html(errors);
	    rootElement.find('#error_' + attributes.code).show();
	};
	var removeError = function () {
	    rootElement.find('#' + attributes.code).removeClass("contains_error");
	    rootElement.find('#error_' + attributes.code).html("");
	    rootElement.find('#error_' + attributes.code).hide();
	};
	var _validateValue = function (val) {
	    var error = [];
	    if (val == "-1") {
		attributes.validate = true;
	    } else {
		//validation for mandatory
		if (attributes.mandatory == true && (val == "" || val == null)) {
		    var errorMsg = $.i18n.prop("notEmpty");
		    error.push(errorMsg);
		}
	    }
	    //showing errors if exists
	    if (error.length != 0) {
		attributes.validate = false;
		showError(error);
	    } else {
		attributes.validate = true;
		removeError();
	    }
	};
	this.setValue = function (val) {
	    _validateValue(val);
	    if (val == "-1") {
		rootElement.find("#text_" + attributes.code).val("Others");
	    }
	    if (attributes.validate) {
		attributes.value = val;
	    }
	};
	this.getValue = function () {
	    if (!rootElement.is(":visible")) {
		attributes.value = '';
	    }
	    return attributes.value;
	};

	this.isValid = function () {
	    if (!rootElement.is(":visible")) {
		attributes.validate = true;
	    } else if (attributes.value == "-1") {
		attributes.validate = true;
	    } else {
		_validateValue(attributes.value);
	    }
	    return attributes.validate;
	};
	this.destroy = function () {
	    rootElement.off("broadcasted_value");
	    rootElement.find("#" + attributes.code).remove();
	};
	_init();
	return this;
    };
    $.fn.input_date = function (options) {
	this.settings = $.extend({
	    displayName: '',
	    code: '',
	    value: '',
	    mandatory: false,
	    validate: false,
	}, options);
	var rootElement = this;
	var attributes = this.settings;
	var dateFormated = {
	    "YYYY-MM-DD": {"dhtml": "%Y-%m-%d", "mask": "9999-99-99", "masking": "yyyy-mm-dd", "regex": ""},
	    "MM-DD-YYYY": {"dhtml": "%m-%d-%Y", "mask": "99-99-9999", "masking": "mm-dd-yyyy", "regex": ""},
	    "DD-MM-YYYY": {"dhtml": "%d-%m-%Y", "mask": "99-99-9999", "masking": "dd-mm-yyyy", "regex": ""},
	    "YYYY.MM.DD": {"dhtml": "%Y.%m.%d", "mask": "9999.99.99", "masking": "yyyy.mm.dd", "regex": ""},
	    "MM.DD.YYYY": {"dhtml": "%m.%d.%Y", "mask": "99.99.9999", "masking": "mm.dd.yyyy", "regex": ""},
	    "DD.MM.YYYY": {"dhtml": "%d.%m.%Y", "mask": "99.99.9999", "masking": "dd.mm.yyyy", "regex": ""},
	    "YYYY/MM/DD": {"dhtml": "%Y/%m/%d", "mask": "9999/99/99", "masking": "yyyy/mm/dd", "regex": ""},
	    "MM/DD/YYYY": {"dhtml": "%m/%d/%Y", "mask": "99/99/9999", "masking": "mm/dd/yyyy", "regex": ""},
	    "DD/MM/YYYY": {"dhtml": "%d/%m/%Y", "mask": "99/99/9999", "masking": "dd/mm/yyyy", "regex": "^(0[1-9]|[12][0-9]|3[01])[\- \/.](?:(0[1-9]|1[012])[\- \/.](19|20)[0-9]{2})$"}
	};
	var myCalendar;
	var dateFormat = "DD/MM/YYYY";
	var _bindContent = function () {
	    var html = '<div id="' + attributes.code + '" class="">' +
		'<label class="text" id="label_' + attributes.code + '">' + attributes.displayName + '</label>' +
		'<div class="calender_box" id="div_' + attributes.code + '">' +
		'<i class="ecmicon-information dateIcon" id="date_' + attributes.code + '_icon"></i>' +
		'<input  type="text" class="form-control input_text_field" id="date_' + attributes.code + '"/>' +
		'</div>' +
		'<span id="error_' + attributes.code + '" class="error_field" style="display:none;"></span>' +
		'</div>';
	    rootElement.append(html);
	};
	var _bindAction = function () {
	    rootElement.find('#date_' + attributes.code).inputmask({
		mask: dateFormated[dateFormat]["mask"],
		placeholder: dateFormat,
		showMaskOnHover: false
	    });
	    rootElement.find('#date_' + attributes.code).on("idate", function () {
		var val = rootElement.find('#date_' + attributes.code).val();
		rootElement.setValue(val);
	    });
	    rootElement.on("set_focus", function (event) {
		rootElement.find('#date_' + attributes.code).click();
	    });
	    rootElement.find('#date_' + attributes.code).focusout(function () {
		rootElement.find('#date_' + attributes.code).trigger("idate");
	    });
	};
	var init = function () {
	    _bindContent();
	    _doOnLoad();
	    _bindAction();
	    if (attributes.value != '') {
		rootElement.setValue(attributes.value);
	    }
	    rootElement.trigger("efr_field_loaded", {code: attributes.code});
	};
	var showError = function (error) {
	    rootElement.find('#' + attributes.code).addClass("contains_error");
	    var errors = "";
	    for (var z = 0; z < error.length; z++) {
		errors += error[z] + "<br>";
	    }
	    rootElement.find('#error_' + attributes.code).html(errors);
	    rootElement.find('#error_' + attributes.code).show();
	};
	var removeError = function () {
	    rootElement.find('#' + attributes.code).removeClass("contains_error");
	    rootElement.find('#error_' + attributes.code).html("");
	    rootElement.find('#error_' + attributes.code).hide();
	};
	var _doOnLoad = function () {
	    myCalendar = new dhtmlXCalendarObject({
		input: 'date_' + attributes.code,
		button: 'date_' + attributes.code + '_icon'
	    });
	    myCalendar.setDateFormat(dateFormated[dateFormat]["dhtml"]);
	    var w_w = window.innerWidth;
	    if (w_w >= 1024) {
		myCalendar.setPosition("right");
	    }
	    myCalendar.attachEvent("onClick", function (date) {
		rootElement.find('#date_' + attributes.code).trigger("idate");
	    });
	};
	var _validateValue = function (val) {
	    //validation for mandatory
	    var error = [];
	    if (attributes.mandatory == true && (val == "" || val == null)) {
		var errorMsg = $.i18n.prop("notEmpty");
		error.push(errorMsg);
	    }
	    if (attributes.validationRegex != null) {
		var regex = new RegExp(attributes.validationRegex);
		var matches = regex.test(val);
		if (!matches) {
		    var errorMsg = "notMatches";
		    error.push(errorMsg);
		}
	    } else {
		var regex = new RegExp(dateFormated[dateFormat]["regex"]);
		var matches = regex.test(val);
		if (!matches) {
		    var errorMsg = "notMatchesDate";
		    error.push(errorMsg);
		}
	    }
	    //showing errors if exists
	    if (error.length != 0) {
		attributes.validate = false;
		showError(error);
	    } else {
		attributes.validate = true;
		removeError();
	    }
	};
	this.setValue = function (val) {
	    _validateValue(val);
	    if (attributes.validate) {
		attributes.value = val;
		rootElement.find('#date_' + attributes.code).val(val);
	    }
	};
	this.getValue = function () {
	    if (!rootElement.is(":visible")) {
		attributes.value = '';
	    }
	    return attributes.value;
	};
	this.isValid = function () {
	    if (!rootElement.is(":visible")) {
		attributes.validate = true;
	    } else {
		setValue(attributes.value);
	    }
	    return attributes.validate;
	};
	this.destroy = function () {
	    rootElement.find('#date_' + attributes.code).inputmask('remove');
	    rootElement.off("set_focus");
	    rootElement.find('#date_' + attributes.code).off("idate");
	    rootElement.find("#" + attributes.code).remove();
	};
	init();
	return this;
    };
}(jQuery));