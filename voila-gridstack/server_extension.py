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

from jinja2 import Environment, FileSystemLoader

from jupyter_server.utils import url_path_join
from jupyter_server.base.handlers import FileFindHandler

from voila.paths import ROOT, STATIC_ROOT, collect_template_paths, jupyter_path
from voila.handler import VoilaHandler
from voila.configuration import VoilaConfiguration


def load_jupyter_server_extension(server_app):
    web_app = server_app.web_app

    nbconvert_template_paths = []
    static_paths = [STATIC_ROOT]
    template_paths = []

    # common configuration options between the server extension and the application
    voila_configuration = VoilaConfiguration(parent=server_app)
    voila_configuration.template = "gridstack"
    voila_configuration.config.VoilaConfiguration.resources = {"gridstack": {"show_handles": False}}

    voila_configuration_gridstack = VoilaConfiguration(parent=server_app)

    # Dirty hack to prevent sharing the same config between handlers (see traitlets.config.Configurable). We are now
    # able to modify resources of one without modifying the resources of the other one
    voila_configuration_gridstack.config = deepcopy(voila_configuration.config)

    voila_configuration_gridstack.template = "gridstack"
    voila_configuration_gridstack.config.VoilaConfiguration.resources = {"gridstack": {"show_handles": True}}

    collect_template_paths(
        nbconvert_template_paths,
        static_paths,
        template_paths,
        voila_configuration.template
    )

    jenv_opt = {"autoescape": True}
    env = Environment(loader=FileSystemLoader(template_paths), extensions=['jinja2.ext.i18n'], **jenv_opt)
    web_app.settings['voila_jinja2_env'] = env

    nbui = gettext.translation('nbui', localedir=os.path.join(ROOT, 'i18n'), fallback=True)
    env.install_gettext_translations(nbui, newstyle=False)

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
    ])
