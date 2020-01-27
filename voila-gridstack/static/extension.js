/*
 * Copyright (c) 2018, Voila Contributors
 * Copyright (c) 2018, QuantStack
 *
 * Distributed under the terms of the BSD 3-Clause License.
 *
 * The full license is in the file LICENSE, distributed with this software.
 */

define(['base/js/namespace'], function(Jupyter) {
    function load_ipython_extension() {

        var open_voila_gridstack = function() {
            Jupyter.notebook.save_notebook().then(function () {
                let voila_gridstack_url = Jupyter.notebook.base_url + "voila/gridstack/" + Jupyter.notebook.notebook_path;
                window.open(voila_gridstack_url)
            });
        }
        var open_voila_dashboard = function() {
            Jupyter.notebook.save_notebook().then(function () {
                let voila_dashboard_url = Jupyter.notebook.base_url + "voila/dashboard/" + Jupyter.notebook.notebook_path;
                window.open(voila_dashboard_url)
            });
        }

        var action_gridstack = {
            icon: 'fa-th', // a font-awesome class used on buttons, etc
            help    : 'Voila-gridstack',
            handler : open_voila_gridstack
        };
        var prefix = 'voila-gridstack';
        var action_name = 'open-voila-gridstack';

        var full_action_gridstack = Jupyter.actions.register(action_gridstack, action_gridstack, prefix);

        var action_dashboard = {
            icon: 'fa-desktop', // a font-awesome class used on buttons, etc
            help    : 'Voila-dashboard',
            handler : open_voila_dashboard
        };
        var prefix = 'voila-dashboard';
        var action_name = 'open-voila-dashboard';

        var full_action_dashboard = Jupyter.actions.register(action_dashboard, action_dashboard, prefix);
        console.log(full_action_gridstack);
        console.log(full_action_dashboard);
        Jupyter.toolbar.add_buttons_group([full_action_gridstack, full_action_dashboard]);
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
