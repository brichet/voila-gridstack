/***************************************************************************
* Copyright (c) 2018, Voila contributors                                   *
*                                                                          *
* Distributed under the terms of the BSD 3-Clause License.                 *
*                                                                          *
* The full license is in the file LICENSE, distributed with this software. *
****************************************************************************/
require([], function(gridstack) {
    $( document ).ready(function() {
        alert("Script loaded");
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
    //        var xhttp = new XMLHttpRequest();
    //        xhttp.open("POST", "/gridstack");
    //        xhttp.setRequestHeader("Content-Type", "application/json");
    //
    //        xhttp.onreadystatechange = function(){
    //            if (this.readyState == 4 && this.status == 200){
    //                content = JSON.parse(this.responseText);
    //                console.log("$$$$$$$$$$$$$$");
    //                console.log(content);
    //                console.log("$$$$$$$$$$$$$$");
    //            }
    //        };
    //        xhttp.send(JSON.stringify(modified_items));
        });

    //    $( '.grid-stack' ).trigger("change", [$('.grid-stack').data('gridstack').grid.nodes]);
    });
});

alert("passed");