{%- extends 'base.tpl' -%}
{% from 'mathjax.tpl' import mathjax %}

{% block html_head_js %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.5.0/lodash.min.js"></script>
<script src="http://gridstackjs.com/dist/gridstack.js"></script>
<script src="http://gridstackjs.com/dist/gridstack.jQueryUI.js"></script>
<script type="text/javascript">
    // bqplot doesn't resize when resizing the tile, fix: fake a resize event
    var resize_workaround = _.debounce(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100)
    $(function () {
        $('.grid-stack').gridstack({
            width: 12,
            disableDrag: true,
            disableResize: true
        }).on('resizestop', function(event, elem) {
            resize_workaround()
        });
    });
</script>
{{ super() }}
{% endblock html_head_js %}

{% block html_head_css %}
<link rel="stylesheet" type="text/css" href="{{resources.base_url}}voila/static/index.css"></link>

{% if resources.theme == 'dark' %}
    <link rel="stylesheet" type="text/css" href="{{resources.base_url}}voila/static/theme-dark.css"></link>
{% else %}
    <link rel="stylesheet" type="text/css" href="{{resources.base_url}}voila/static/theme-light.css"></link>
{% endif %}

{% for css in resources.inlining.css %}
    <style type="text/css">
    {{ css }}
    </style>
{% endfor %}

<link href="http://gridstackjs.com/dist/gridstack.css" rel="stylesheet">

{{ super() }}

<style>
.cell, .output_wrapper, .output, .output_area, .output_subarea, .widget-subarea {
    display: flex;
    flex: 1;

}

.p-Widget {
    flex: 1;
}

.grid-stack-item-content {
    background: var(--jp-layout-color0);
    color: var(--jp-ui-font-color1);
    display: flex;
    flex-direction: column;
}

.gridhandle {
    cursor: move;
    margin-left: 10px;
}

.voila-gridstack {
    background: white;
    # background: var(--jp-layout-color3);
    color: var(--jp-ui-font-color0);
}

body {
    overflow: scroll;
}
</style>

{{ mathjax() }}
{% endblock html_head_css %}

{% block body %}
{% if resources.theme == 'dark' %}
<body class="theme-dark" data-base-url="{{resources.base_url}}voila/">
{% else %}
<body class="theme-light" data-base-url="{{resources.base_url}}voila/">
{% endif %}
<section id="demo" class="voila-gridstack">
    <div class="container">
        <!-- <div class="row">
            <div class="col-lg-12 text-center">
                <h2>Dashboard composer</h2>
                <hr class="star-light">
            </div>
        </div> -->

        <div class="grid-stack" data-gs-width="12" data-gs-animate="yes">
                {{ super() }}
                <!-- <div class="grid-stack-item" data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2">
                <div class="grid-stack-item-content">
                </div> -->
        </div>
        </div>
    </div>
</section>
</body>
{% endblock body %}

{% block markdowncell scoped %}
{% if cell.metadata.voila.id %}
<div class="grid-stack-item" data-gs-width="{{ cell.metadata.voila.grid_columns if cell.metadata.voila.grid_columns else 12 }}"
                             data-gs-height="{{ cell.metadata.voila.grid_rows if cell.metadata.voila.grid_rows else 2 }}"
                             data-gs-x="{{ cell.metadata.voila.grid_x if cell.metadata.voila.grid_x else 0 }}"
                             data-gs-y="{{ cell.metadata.voila.grid_y if cell.metadata.voila.grid_y else 0 }}"
                             data-gs-id="{{ cell.metadata.voila.id }}"
                             data-gs-auto-position="{{ "false" if cell.metadata.voila.grid_x is defined else "true" }}">
    <!-- custom width/height -->
{% else %}
<div class="grid-stack-item" data-gs-width="12" data-gs-height="2" data-gs-auto-position="false">
{% endif %}
    <div class="grid-stack-item-content">
        {{ super() }}
    </div>
</div>
{% endblock markdowncell %}

{% block codecell %}
{% if cell.metadata.voila.id %}
<div class="grid-stack-item" data-gs-width="{{ cell.metadata.voila.grid_columns if cell.metadata.voila.grid_columns else 4 }}"
                             data-gs-height="{{ cell.metadata.voila.grid_rows if cell.metadata.voila.grid_rows else 4 }}"
                             data-gs-x="{{ cell.metadata.voila.grid_x if cell.metadata.voila.grid_x else 0 }}"
                             data-gs-y="{{ cell.metadata.voila.grid_y if cell.metadata.voila.grid_y else 0 }}"
                             data-gs-id="{{ cell.metadata.voila.id }}"
                             data-gs-auto-position="{{ "false" if cell.metadata.voila.grid_x is defined else "true" }}">
    <!-- custom width/height -->
{% else %}
<div class="grid-stack-item" data-gs-width="4" data-gs-height="4" data-gs-auto-position="false">
{% endif %}
    <div class="grid-stack-item-content">
        {{ super() }}
    </div>
</div>
{% endblock codecell %}

{% block footer_js %}
{{ super() }}
{% endblock footer_js %}
