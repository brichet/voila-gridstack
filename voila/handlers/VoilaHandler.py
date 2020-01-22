#############################################################################
# Copyright (c) 2018, Voila Contributors                                    #
#                                                                           #
# Distributed under the terms of the BSD 3-Clause License.                  #
#                                                                           #
# The full license is in the file LICENSE, distributed with this software.  #
#############################################################################

import os

import tornado.web

from jupyter_server.base.handlers import JupyterHandler

from ..execute import executenb
from ..exporter import VoilaExporter

import uuid


class VoilaHandler(JupyterHandler):

    URL = r'/'
    PARAM = {'notebook_path': 'os.path.relpath(self.notebook_path, self.root_dir)',
             'nbconvert_template_paths': 'self.nbconvert_template_paths',
             'config': 'self.config',
             'voila_configuration': 'self.voila_configuration',
             'gridstack': 'self.voila_configuration.template == "gridstack"',
             'dashboard': 'self.voila_configuration.template == "dashboard"',
             'token': 'self.token'
             }

    def initialize(self, **kwargs):
        self.notebook_path = kwargs.pop('notebook_path', [])    # should it be []
        self.nbconvert_template_paths = kwargs.pop('nbconvert_template_paths', [])
        self.exporter_config = kwargs.pop('config', None)
        self.voila_configuration = kwargs['voila_configuration']
        self.gridstack = kwargs.pop('gridstack', False)
        self.dashboard = kwargs.pop('dashboard', False)
        self.voila_token = kwargs.pop('token', u'')

    @tornado.web.authenticated
    @tornado.gen.coroutine
    def get(self, path=None):

        # Manage token
        if self.voila_token:
            token = self.get_argument("token", "")
            if not token == self.voila_token:
                raise tornado.web.HTTPError(404, 'you need a token to connect')

        # if the handler got a notebook_path argument, always serve that
        notebook_path = self.notebook_path or path
        if self.voila_configuration.enable_nbextensions:
            # generate a list of nbextensions that are enabled for the classical notebook
            # a template can use that to load classical notebook extensions, but does not have to
            notebook_config = self.config_manager.get('notebook')
            # except for the widget extension itself, since voila has its own
            load_extensions = notebook_config.get('load_extensions', {})
            if 'jupyter-js-widgets/extension' in load_extensions:
                load_extensions['jupyter-js-widgets/extension'] = False
            if 'voila/extension' in load_extensions:
                load_extensions['voila/extension'] = False
            nbextensions = [name for name, enabled in load_extensions.items() if enabled]
        else:
            nbextensions = []

        model = self.contents_manager.get(path=notebook_path)
        if 'content' in model:
            notebook = model['content']
        else:
            raise tornado.web.HTTPError(404, 'file not found')

        if self.gridstack or self.dashboard:
            for cell in notebook.cells:
                if cell.cell_type not in ["code", "markdown"]:
                    continue
                if "voila" not in cell.metadata.keys():
                    cell.metadata["voila"] = {}
                if "id" not in cell.metadata["voila"].keys():
                    cell.metadata["voila"]["id"] = str(uuid.uuid4())
            model['content'] = notebook
            self.contents_manager.save(model, self.notebook_path)
            # self.contents_manager.save(model, "".join([os.path.splitext(notebook_path)[0] + "_voila",
            #                                            os.path.splitext(notebook_path)[1]]))

        # Fetch kernel name from the notebook metadata
        kernel_name = notebook.metadata.get('kernelspec', {}).get('name', self.kernel_manager.default_kernel_name)

        # Launch kernel and execute notebook
        cwd = os.path.dirname(notebook_path)
        kernel_id = yield tornado.gen.maybe_future(self.kernel_manager.start_kernel(kernel_name=kernel_name, path=cwd))
        km = self.kernel_manager.get_kernel(kernel_id)
        result = executenb(notebook, km=km, cwd=cwd)

        # render notebook to html
        resources = {
            'kernel_id': kernel_id,
            'base_url': self.base_url,
            'nbextensions': nbextensions,
            'theme': self.voila_configuration.theme
        }

        exporter = VoilaExporter(
            template_path=self.nbconvert_template_paths,
            config=self.exporter_config,
            contents_manager=self.contents_manager  # for the image inlining
        )

        if self.voila_configuration.strip_sources:
            exporter.exclude_input = True
            exporter.exclude_output_prompt = True
            exporter.exclude_input_prompt = True

        # Filtering out empty cells.
        def filter_empty_code_cells(cell):
            return (
                cell.cell_type != 'code' or                     # keep non-code cells
                (cell.outputs and not exporter.exclude_output)  # keep cell if output not excluded and not empty
                or not exporter.exclude_input                   # keep cell if input not excluded
            )
        result.cells = list(filter(filter_empty_code_cells, result.cells))

        html, resources = exporter.from_notebook_node(result, resources=resources)

        # Compose reply
        self.set_header('Content-Type', 'text/html')
        self.write(html)
