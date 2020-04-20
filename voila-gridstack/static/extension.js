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
        'nbextensions/voila-gridstack/gridstack.jqueryUI_require',
        'nbextensions/voila-gridstack/voila-gridstack'
       ],
       function($, Jupyter, gridstack, _, voila_gridstack) {

    function load_ipython_extension() {
        var close_voila_gridstack = function() {
            $('#btn-voila-gridstack_notebook').prop( "disabled", true );
            Jupyter.notebook.save_notebook().then(function () {

                $('#notebook-container').css('width', '');
//                $('.code_cell:has(.output_wrapper:has(.output:empty))').show();
                $('.code_cell > .input').show();
                $('.prompt').show();
                $('.gridhandle').remove();

                $('.grid-stack').contents().unwrap();
                $('.grid-stack-item-content').siblings().remove();
                $('.grid-stack-item-content').unwrap();
                $('.grid-stack-item-content').contents().unwrap();
                $('style[data-gs-style-id]').remove();

                // Remove CSS files
                $('head').children("link[href='https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.min.css']").remove();
                $("head").children("#voila-gridstack-styles").remove();

                $('#btn-voila-gridstack_gridstack').prop( "disabled", false );
            });
        }

        var open_voila_gridstack = function() {
            $('#btn-voila-gridstack_gridstack').prop( "disabled", true );
            $('#site').hide();
            $("head").append("<link id='voila-gridstack-styles' href='/nbextensions/voila-gridstack/voila-gridstack.css' type='text/css' rel='stylesheet' />").ready( function () {
                $('#site').after(`
                    <div id="loading">
                        <div class="spinner-container">
                          <svg class="spinner" data-name="c1" version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><metadata><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title>voila</dc:title></cc:Work></rdf:RDF></metadata><title>spin</title><path class="voila-spinner-color1" d="m250 405c-85.47 0-155-69.53-155-155s69.53-155 155-155 155 69.53 155 155-69.53 155-155 155zm0-275.5a120.5 120.5 0 1 0 120.5 120.5 120.6 120.6 0 0 0-120.5-120.5z"/><path class="voila-spinner-color2" d="m250 405c-85.47 0-155-69.53-155-155a17.26 17.26 0 1 1 34.51 0 120.6 120.6 0 0 0 120.5 120.5 17.26 17.26 0 1 1 0 34.51z"/></svg>
                        </div>
                        <h2 id="loading_text">Running...</h2>
                    </div>
                `);
            });

            Jupyter.notebook.execute_all_cells();
            voila_gridstack.wait_for_all_cells_executed().then(function () {
                voila_gridstack.init_metadata();
                Jupyter.notebook.save_notebook().then(function () {
                    try {
                        var active_view_name = Jupyter.notebook.metadata.extensions.jupyter_dashboards.activeView;
                        var active_view = Jupyter.notebook.metadata.extensions.jupyter_dashboards.views[active_view_name];
                    }
                    catch(TypeError) {
                        console.error('Error during gridstack initialization');
                    }
    //                head = document.head || document.getElementsByTagName('head')[0];
    //                var scr  = document.createElement('script');
    //                scr.src = 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.all.js';
    //                scr.async = false; // optionally
    //                head.insertBefore(scr, head.firstChild);
    //                scr  = document.createElement('script');
    //                scr.src = 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.jQueryUI.min.js';
    //                head.insertBefore(scr, head.firstChild);
                    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.min.css') );

    //                $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'nbextensions/voila-gridstack/voila-gridstack.css') );
    //                $('head').append( $('<script id=script_gridstack />').attr('src', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.all.js') );
    //                $('head').append( $('<script id=script_gridstack_jqueryUI />').attr('src', 'https://cdn.jsdelivr.net/npm/gridstack@0.5.2/dist/gridstack.jQueryUI.min.js') );

                    $('#notebook-container').css('width', '100%');
                    $('.code_cell > .input').hide();
//                    $('.code_cell:has(.output_wrapper:has(.output:empty))').hide();
                    $('.prompt').hide();
//                    $('.code_cell:has(.output_wrapper:has(.output:not(:empty)))').wrap("<div class='grid-stack-item-content'></div>");
//                    $('.text_cell').wrap("<div class='grid-stack-item-content'></div>");
                    $('.cell').wrap("<div class='grid-stack-item-content'></div>");
                    $('.grid-stack-item-content').prepend(`
                        <div class="gridhandle">
                            <i class=" fa fa-arrows"></i>
                        </div>
                    `);
                    $('.grid-stack-item-content').wrap(function() {

                        cell = $(this).find(".cell").first().data('cell');

                        try {
                            gridstack_meta = cell.metadata.extensions.jupyter_dashboards.views[active_view_name];
                        }
                        catch(TypeError) {
                            console.error('Error during gridstack initialization');
                        }

                        position = (!gridstack_meta.hasOwnProperty('col')) ?
                                        "data-gs-auto-position='true'" :
                                        "data-gs-x='" + gridstack_meta.col + "' data-gs-y='" + gridstack_meta.row + "'";

                        width = (!gridstack_meta.hasOwnProperty('width')) ? "12" : gridstack_meta.width;

                        height = (!gridstack_meta.hasOwnProperty('height')) ? "2" : gridstack_meta.height;

//                        float = ($(this).find('.code_cell:has(.output_wrapper:has(.output:empty))').length) ?
//                                'float=true' : '';

                        return `<div class='grid-stack-item'
                                 ${position}
                                 data-gs-width='${width}'
                                 data-gs-height='${height}'></div>`;
                    });

                    $('.grid-stack-item').wrapAll("<div class='grid-stack'></div>");

                    $('.grid-stack-item').hover( function () {
                            $( this ).find('.gridhandle').show();
                            $( this ).find('.gridhandle').css("z-index","9999");
                        }, function(){
                            $(this).find('.gridhandle').hide();
                    });


                    var grid = GridStack.init({
                        alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                        resizable: {
                            handles: 'e, se, s, sw, w'
                        },
                        cellHeight: active_view.cellHeight,
                        verticalMargin: active_view.cellMargin,
                        column: active_view.numColumns,
                        draggable: {
                            handle: '.gridhandle'
                        }
                    });

                    voila_gridstack.hide_elements(grid);
                    voila_gridstack.init_on_change(grid);

                    $('.grid-stack').trigger("change", grid.engine.nodes[0]);
                });
                $('#loading').remove();
                $('#site').show();

                $('#btn-voila-gridstack_notebook').prop( "disabled", false );

            });
        }

        var open_voila_dashboard = function() {
            Jupyter.notebook.save_notebook().then(function () {
                let voila_dashboard_url = Jupyter.notebook.base_url + "voila/dashboard/" + Jupyter.notebook.notebook_path;
                window.open(voila_dashboard_url)
            });
        }

//        var clean_metadata = function() {
//            close_voila_gridstack();
//
//        }

        // Register icon which go back to notebook
        var action_notebook = {
            icon    : 'fa-code', // a font-awesome class used on buttons, etc
            help    : 'Back to notebook',
            handler : close_voila_gridstack
        };
        var prefix = 'notebook';
        var action_name = 'close-voila-gridstack';
        var full_action_notebook = Jupyter.actions.register(action_notebook, action_notebook, prefix);

        // Register icon which show grid-stack with handles
        var action_gridstack = {
            icon    : 'fa-th', // a font-awesome class used on buttons, etc
            help    : 'Voila-gridstack',
            handler : open_voila_gridstack
        };
        var prefix = 'voila-gridstack';
        var action_name = 'open-voila-gridstack';
        var full_action_gridstack = Jupyter.actions.register(action_gridstack, action_gridstack, prefix);

        // Register icon which open voila-gridstack
        var action_dashboard = {
            icon    : 'fa-dashboard', // a font-awesome class used on buttons, etc
            help    : 'Voila-dashboard',
            handler : open_voila_dashboard
        };
        var prefix = 'voila-dashboard';
        var action_name = 'open-voila-dashboard';
        var full_action_dashboard = Jupyter.actions.register(action_dashboard, action_dashboard, prefix);

//        var action_clean_metadata = {
//            icon : 'fa-dashboard', // a font-awesome class used on buttons, etc
//            help    : 'Voila-dashboard',
//            handler : open_voila_dashboard
//        };
//        var prefix = 'clean_metatada';
//        var action_name = 'clean_metadata';
//        var full_action_clean = Jupyter.actions.register(action_clean_metadata, action_clean_metadata, prefix);

        // Add buttons in Jupyter header
        Jupyter.toolbar.add_buttons_group([{action: full_action_notebook, id: 'btn-voila-gridstack_notebook'},
                                           {action: full_action_gridstack, id: 'btn-voila-gridstack_gridstack'},
                                           full_action_dashboard,
                                           /*full_action_clean*/],
                                           'btn-voila-gridstack');
        $('#btn-voila-gridstack_notebook').prop( "disabled", true );
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
