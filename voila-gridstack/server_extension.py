#############################################################################
# Copyright (c) 2018, Voila Contributors                                    #
# Copyright (c) 2018, QuantStack                                            #
#                                                                           #
# Distributed under the terms of the BSD 3-Clause License.                  #
#                                                                           #
# The full license is in the file LICENSE, distributed with this software.  #
#############################################################################

import os
import gettext
from copy import deepcopy
from hashlib import sha1

from jinja2 import Environment, FileSystemLoader

from jupyter_server.utils import url_path_join
from notebook import DEFAULT_STATIC_FILES_PATH

from voila.paths import ROOT, STATIC_ROOT, collect_template_paths
from voila.handler import VoilaHandler
from voila.configuration import VoilaConfiguration
# import voila.server_extension as voila_server_extension
from voila.static_file_handler import MultiStaticFileHandler


def sha1_filter(env, value):
    return sha1(value)


def load_jupyter_server_extension(server_app):

    web_app = server_app.web_app

    nbconvert_template_paths = []
    static_paths = [STATIC_ROOT]
    template_paths = []

    # common configuration options between the server extension and the application
    # voila_server_extension.load_jupyter_server_extension(server_app, template='gridstack')
    # print(web_app.init_handlers)
    voila_configuration = VoilaConfiguration(parent=server_app)
    voila_configuration.template = "gridstack"
    voila_configuration.config.VoilaConfiguration.resources = {"gridstack": {"show_handles": False, "extension": True}}

    voila_configuration_gridstack = VoilaConfiguration(parent=server_app)

    # TODO : Is there an better way to provide 2 handlers with different configurations ?
    #        Dirty hack to prevent sharing the same config between handlers (see traitlets.config.Configurable).
    #        Allow modifying resources of one without modifying the resources of the other one.
    voila_configuration_gridstack.config = deepcopy(voila_configuration.config)
    #
    # voila_configuration_gridstack.template = "gridstack"
    voila_configuration_gridstack.config.VoilaConfiguration.resources = {"gridstack": {"show_handles": True,
                                                                                       "extension": True}}

    collect_template_paths(
        nbconvert_template_paths,
        static_paths,
        template_paths,
        voila_configuration.template
    )

    # web_app.settings['jinja2_env'].filters['sha1'] = sha1_filter
    # web_app.settings['voila_jinja2_env'].filters['sha1'] = sha1_filter
    #
    # print(server_app.web_app.settings['jinja2_env'].filters)
    # env.filters['sha1'] = sha1_filter
    # print(env.filters)
    # web_app.settings['voila_jinja2_env'] = env

    # nbui = gettext.translation('nbui', localedir=os.path.join(ROOT, 'i18n'), fallback=True)
    # env.install_gettext_translations(nbui, newstyle=False)
    # print(env.filters)
    host_pattern = '.*$'
    base_url = url_path_join(web_app.settings['base_url'])

    web_app.add_handlers(host_pattern, [
        (url_path_join(base_url, '/voila/gridstack/(.*)'), VoilaHandler, {
            'config': server_app.config,
            'nbconvert_template_paths': nbconvert_template_paths,
            'voila_configuration': voila_configuration_gridstack
        }),
        (url_path_join(base_url, '/voila/dashboard/(.*)'), VoilaHandler, {
            'config': server_app.config,
            'nbconvert_template_paths': nbconvert_template_paths,
            'voila_configuration': voila_configuration
        }),
        # TODO : find a better way to include gridstack static directory in voila static paths.
        #        Don't know why but extensions are load twice in different order, so if we use the same URL it is
        #        overwritten 3 times (load voila, load gridstack, load gridstack and load voila) ??? At the end, the
        #        static paths kept for "url_path_join(base_url, '/voila/static/(.*)')" are the ones from voila (the last
        #        extension loaded), not including the gridstack ones.
        (url_path_join(base_url, '/gridstack/static/(.*)'), MultiStaticFileHandler, {'paths': static_paths}),
        (url_path_join(base_url, '/notebook/static/(.*)'), MultiStaticFileHandler,
         {'paths': [os.path.join(DEFAULT_STATIC_FILES_PATH)]}),
    ])
    print(DEFAULT_STATIC_FILES_PATH)
    print("### FINAL static_paths for gridstack : {}".format(static_paths))
    print("### gridstack extension loaded")
