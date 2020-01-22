#############################################################################
# Copyright (c) 2018, Voila Contributors                                    #
#                                                                           #
# Distributed under the terms of the BSD 3-Clause License.                  #
#                                                                           #
# The full license is in the file LICENSE, distributed with this software.  #
#############################################################################

from tornado import web
import json
import os

from jupyter_server.base.handlers import JupyterHandler
from jupyter_server.utils import url_path_join, url_escape


class VoilaGridstackHandler(JupyterHandler):

    URL = r'/gridstack'
    PARAM = {'notebook_path': 'os.path.relpath(self.notebook_path, self.root_dir)'}

    def initialize(self, **kwargs):
        self.notebook_path = kwargs.pop('notebook_path')

    def get_template(self, name):
        """Return the jinja template object for a given name"""
        return self.settings['voila_jinja2_env'].get_template(name)

    @web.authenticated
    def post(self, path=''):
        model = self.contents_manager.get(path=self.notebook_path)
        # model = self.contents_manager.get(path="".join([os.path.splitext(self.notebook_path)[0] + "_voila",
        #                                            os.path.splitext(self.notebook_path)[1]]))
        if 'content' in model:
            notebook = model['content']
        else:
            raise web.HTTPError(404, 'file not found')

        # print(self.request.body)
        modified_items = json.loads(self.request.body)
        for cell in notebook.cells:
            if cell.cell_type in ["code", "markdown"] and \
                        "voila" in cell.metadata.keys() and \
                        "id" in cell.metadata.voila.keys() and \
                        cell.metadata.voila.id in modified_items.keys():

                for key, value in modified_items[cell.metadata.voila.id].items():
                    cell.metadata.voila[key] = value

        model['content'] = notebook
        self.contents_manager.save(model, self.notebook_path)
        # self.contents_manager.save(model, "".join([os.path.splitext(self.notebook_path)[0] + "_voila",
        #                                            os.path.splitext(self.notebook_path)[1]]))

        # print(self.get_argument("grid_info", "nada"))
        self.write(json.dumps({"blabla": "test_template"}))
        self.finish()
