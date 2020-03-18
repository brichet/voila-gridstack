/*
 * Copyright (c) 2018, Voila Contributors
 * Copyright (c) 2018, QuantStack
 *
 * Distributed under the terms of the BSD 3-Clause License.
 *
 * The full license is in the file LICENSE, distributed with this software.
 */


define(['jquery',
        'base/js/namespace',
        'nbextensions/voila-gridstack/gridstack',
        'nbextensions/voila-gridstack/gridstack.jqueryUI_require'
       ],
       function($, Jupyter, gridstack, _) {

    function load_ipython_extension() {

//        $('head').append( $('<script />').attr('src', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.all.js') );
//        $('head').append( $('<script />').attr('src', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.jQueryUI.min.js') );
        var close_voila_gridstack = function() {
            Jupyter.notebook.save_notebook().then(function () {

                $('#notebook-container').css('width', '');
                $('.code_cell > .input').show();

                // Remove Gridstack JS and CSS files
                $('head').children("link[href='https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.min.css']").remove();
                $('head').children("script[src='https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.all.js']").remove();
                $('head').children("script[src='https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.jQueryUI.min.js']").remove();
            });
        }

        var open_voila_gridstack = function() {
            Jupyter.notebook.execute_all_cells();
            Jupyter.notebook.save_notebook().then(function () {
//                head = document.head || document.getElementsByTagName('head')[0];
//                var scr  = document.createElement('script');
//                scr.src = 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.all.js';
//                scr.async = false; // optionally
//                head.insertBefore(scr, head.firstChild);
//                scr  = document.createElement('script');
//                scr.src = 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.jQueryUI.min.js';
//                head.insertBefore(scr, head.firstChild);
//                $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.min.css') );
//                $('head').append( $('<script id=script_gridstack />').attr('src', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.all.js') );
//                $('head').append( $('<script id=script_gridstack_jqueryUI />').attr('src', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.jQueryUI.min.js') );

                $('#notebook-container').css('width', '100%');
                $('.code_cell > .input').hide();
                $('.prompt').hide();
//                {% set cell_jupyter_dashboards = cell.metadata.get('extensions', {}).get('jupyter_dashboards', {}) %}
//                {% set view_data = cell_jupyter_dashboards.get('views', {}).get(active_view, {}) %}
//                {% set hidden = view_data.get('hidden') %}
//                {% set auto_position = ('row' not in view_data or 'col' not in view_data) %}
//                {%- if not hidden and cell.cell_type in ['markdown', 'code'] %}
//                    $('.code_cell > .output_wrapper:has(.output:not(:empty))').wrap("<div class='grid-stack-item-content'></div>");
                $('.code_cell').wrap("<div class='grid-stack-item-content'></div>");
                $('.text_cell').wrap("<div class='grid-stack-item-content'></div>");
                $('.grid-stack-item-content').prepend(`
                    <div class="gridhandle">
                        <i class=" fa fa-arrows"></i>
                    </div>
                `)
                $('.grid-stack-item-content').wrap("<div class='grid-stack-item' data-gs-autoPosition=true></div>");
//                    $('.grid-stack-item').wrap("<div class='grid-stack'></div>");
                $('#notebook-container').addClass('grid-stack');
                $('.grid-stack-item-content').css({"background": "var(--jp-layout-color0)",
                                                   "color": "var(--jp-ui-font-color1)",
                                                   "display": "flex",
                                                   "flex-direction": "column"});
                $('.gridhandle').css({"cursor": "move", "margin-left": "10px"});
                var grid = GridStack.init({
//                    alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
//                    resizable: {
//                        handles: 'e, se, s, sw, w'
//                    },
////                     cellHeight: {{gridstack_conf.defaultCellHeight}},
////                     width: {{gridstack_conf.maxColumns}},
////                     verticalMargin: {{gridstack_conf.cellMargin}},
//                    cellHeight: 2,
//                    cellWidth: 4,
//                    column: 12,
                    draggable: {
                        handle: '.gridhandle'
                    }
                });
//                $('.grid-stack').on('resizestop', function(event, elem) {
//                    resize_workaround();
//                });
//                $('.grid-stack').gridstack({
//                    alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
//                    resizable: {
//                        handles: 'e, se, s, sw, w'
//                    },
////                         cellHeight: {{gridstack_conf.defaultCellHeight}},
////                         width: {{gridstack_conf.maxColumns}},
////                         verticalMargin: {{gridstack_conf.cellMargin}},
//                    draggable: {
//                        handle: '.gridhandle'
//                    }
//                }).on('resizestop', function(event, elem) {
//                    resize_workaround();
//                });
            });
        }

        var open_voila_dashboard = function() {
            Jupyter.notebook.save_notebook().then(function () {
                let voila_dashboard_url = Jupyter.notebook.base_url + "voila/dashboard/" + Jupyter.notebook.notebook_path;
                window.open(voila_dashboard_url)
            });
        }

        var action_notebook = {
            icon    : 'fa-code', // a font-awesome class used on buttons, etc
            help    : 'Back to notebook',
            handler : close_voila_gridstack
        };
        var prefix = 'notebook';
        var action_name = 'close-voila-gridstack';
        var full_action_notebook = Jupyter.actions.register(action_notebook, action_notebook, prefix);


        var action_gridstack = {
            icon    : 'fa-th', // a font-awesome class used on buttons, etc
            help    : 'Voila-gridstack',
            handler : open_voila_gridstack
        };
        var prefix = 'voila-gridstack';
        var action_name = 'open-voila-gridstack';

        var full_action_gridstack = Jupyter.actions.register(action_gridstack, action_gridstack, prefix);

        var action_dashboard = {
            icon    : 'fa-dashboard', // a font-awesome class used on buttons, etc
            help    : 'Voila-dashboard',
            handler : open_voila_dashboard
        };
        var prefix = 'voila-dashboard';
        var action_name = 'open-voila-dashboard';

        var full_action_dashboard = Jupyter.actions.register(action_dashboard, action_dashboard, prefix);

        Jupyter.toolbar.add_buttons_group([full_action_notebook, full_action_gridstack, full_action_dashboard]);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
