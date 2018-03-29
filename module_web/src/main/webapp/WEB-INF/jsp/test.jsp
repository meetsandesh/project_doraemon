<!DOCTYPE html>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="webjars/bootstrap/3.3.7/css/bootstrap.min.css" />
        <c:url value="/css/main.css" var="jstlCss" />
        <link href="${jstlCss}" rel="stylesheet" />
        <c:url value="/js/jQuery.js" var="js1" />
        <script type="text/javascript" src="${js1}"></script>
        <c:url value="/js/field_panel_2.js" var="js2" />
        <script type="text/javascript" src="${js2}"></script>
        <c:url value="/js/ecm_fields_renderer.js" var="js3" />
        <script type="text/javascript" src="${js3}"></script>
    </head>
    <body>
        <div id="1">Hello</div>
        <div id="2"><a href="javascript:void(0);">Panel</a></div>
        <div id="panel_1"></div>
        <div id="2"><a href="javascript:void(0);">Popup</a></div>
        <div id="panel_2"></div>
        <script type="text/javascript" src="webjars/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script>
            $(document).ready(function () {
                $("body").addClass("load_content");
                $("#panel_1").field_panel_2({
                    base_url: '/BASE_URL',
                    fetch_fields_url: '/app/fields2/getFieldDefinitions',
                    submit_fields_url: '/app/fields2/setFields',
                    cancel_action_exist: false,
                    with_popup: false,
                    heading: 'Data Entry',
                    show_next_button: true,
                    host: 'ECM',
                    data_entry_panel: true
                });
                $("#panel_1").trigger("fp_refresh", {id: -1, type: 'CASE', field_type: 'USER'});
//                test2();
            });
            function test2()
            {
                setTimeout(function () {
                    $("#panel_1").trigger("fp_refresh", {id: -1, type: 'DOCUMENT', field_type: 'USER'});
                }, 10000);
            }
        </script>
    </body>
</html>
