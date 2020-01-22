/***************************************************************************
* Copyright (c) 2018, Voila contributors                                   *
*                                                                          *
* Distributed under the terms of the BSD 3-Clause License.                 *
*                                                                          *
* The full license is in the file LICENSE, distributed with this software. *
****************************************************************************/

// NOTE: this file is not transpiled, async/await is the only modern feature we use here
require([], function() {
    $( document ).ready(function() {
        $( '.grid-stack' ).on('change', function (event, items) {
            modified_items = {};
            for (var i = 0; i < items.length; i++){
                modified_items[items[i].id] = {grid_x: items[i].x,
                                               grid_y: items[i].y,
                                               grid_columns: items[i].width,
                                               grid_rows: items[i].height
                                              };
            }
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/gridstack");
            xhttp.setRequestHeader("Content-Type", "application/json");

            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    content = JSON.parse(this.responseText);
                    console.log("$$$$$$$$$$$$$$");
                    console.log(content);
                    console.log("$$$$$$$$$$$$$$");
                }
            };
            xhttp.send(JSON.stringify(modified_items));
        });
//        grid = $('.grid-stack').data('gridstack').grid.nodes;
//        console.log(grid);
//        for (var i = 0; i < grid.length; i++){
//            console.log(grid[i]);
//        }
        $( '.grid-stack' ).trigger("change", [$('.grid-stack').data('gridstack').grid.nodes]);
    });
});