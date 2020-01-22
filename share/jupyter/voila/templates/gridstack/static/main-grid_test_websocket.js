/***************************************************************************
* Copyright (c) 2018, Voila contributors                                   *
*                                                                          *
* Distributed under the terms of the BSD 3-Clause License.                 *
*                                                                          *
* The full license is in the file LICENSE, distributed with this software. *
****************************************************************************/

// NOTE: this file is not transpiled, async/await is the only modern feature we use here
require(['static/voila'], function(voila) {
    // requirejs doesn't like to be passed an async function, so create one inside
    (async function() {
        var kernel = await voila.connectKernel();
//        var message = voila.createMessage({msgId: "tralalalalaalaturlututu",
//                                           msgType: "comm_msg",
//                                           channel: "shell",
//                                           content: {comm_id: "trululululu",
//                                                    data:{cestmoi: "toutcatoutcatoutca"
//                                                    }
//                                           }
//                       });
//        message.then(function(value){
//            console.log("$$$$$$ ICI $$$$$$$$$");
//            console.log(value);
//            kernel.sendShellMessage(value);
//        })
        kernel.requestExecute({code: "print('$$$$$$ ICI $$$$$$$$$')", });

        function init() {
            // it seems if we attach this to early, it will not be called
            window.addEventListener('beforeunload', function (e) {
//                kernel.sendShellMessage({"header": {'msg_id' : "shutdown_id2", msg_type : "comm_msg"}});
                kernel.requestCommInfo({"essai": "terminated"});
                kernel.shutdown()
            });
        }

        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init);
        }
    })()
});

