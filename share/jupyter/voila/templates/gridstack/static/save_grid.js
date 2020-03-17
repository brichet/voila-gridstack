/***************************************************************************
* Copyright (c) 2018, Voila contributors                                   *
*                                                                          *
* Distributed under the terms of the BSD 3-Clause License.                 *
*                                                                          *
* The full license is in the file LICENSE, distributed with this software. *
****************************************************************************/
require([], function() {
    $( document ).ready(function() {
        $( '.grid-stack' ).on('change', function (event, items) {
            modified_items = {};
            for (var i = 0; i < items.length; i++){
    //            modified_items[items[i].id] = {grid_x: items[i].x,
    //                                           grid_y: items[i].y,
    //                                           grid_columns: items[i].width,
    //                                           grid_rows: items[i].height
    //                                          };
                console.log(items[i]);
            }
//            Jupyter.notebook.save_notebook();
        });

    //    $( '.grid-stack' ).trigger("change", [$('.grid-stack').data('gridstack').grid.nodes]);
    });

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
//    console.log(Jupyter.notebook)
});
